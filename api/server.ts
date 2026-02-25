import express from "express";
import { createServer as createViteServer } from "vite";
import Database from "better-sqlite3";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Database Initialization
  const dbPath = path.join(process.cwd(), "library.db");
  const db = new Database(dbPath);
  db.pragma("journal_mode = WAL");

  // Create tables
  db.exec(`
    CREATE TABLE IF NOT EXISTS books (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      author TEXT,
      isbn TEXT,
      publisher TEXT,
      year INTEGER,
      category TEXT,
      stock INTEGER DEFAULT 1,
      available INTEGER DEFAULT 1,
      cover_url TEXT
    );

    CREATE TABLE IF NOT EXISTS members (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      member_id TEXT UNIQUE NOT NULL,
      name TEXT NOT NULL,
      email TEXT,
      phone TEXT,
      address TEXT,
      join_date DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS loans (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      book_id INTEGER,
      member_id INTEGER,
      loan_date DATETIME DEFAULT CURRENT_TIMESTAMP,
      due_date DATETIME,
      return_date DATETIME,
      status TEXT DEFAULT 'borrowed',
      FOREIGN KEY (book_id) REFERENCES books(id),
      FOREIGN KEY (member_id) REFERENCES members(id)
    );
  `);

  // Seed data if empty
  const bookCount = db.prepare("SELECT COUNT(*) as count FROM books").get() as { count: number };
  if (bookCount.count === 0) {
    const insertBook = db.prepare("INSERT INTO books (title, author, isbn, publisher, year, category, stock, available) VALUES (?, ?, ?, ?, ?, ?, ?, ?)");
    insertBook.run("Laskar Pelangi", "Andrea Hirata", "9789793062791", "Bentang Pustaka", 2005, "Fiction", 5, 5);
    insertBook.run("Bumi", "Tere Liye", "9786020303017", "Gramedia", 2014, "Fantasy", 3, 3);
    insertBook.run("Filosofi Teras", "Henry Manampiring", "9786024125189", "Kompas", 2018, "Self-Help", 4, 4);
    insertBook.run("Atomic Habits", "James Clear", "9781847941831", "Penguin", 2018, "Self-Help", 10, 10);
  }

  const memberCount = db.prepare("SELECT COUNT(*) as count FROM members").get() as { count: number };
  if (memberCount.count === 0) {
    const insertMember = db.prepare("INSERT INTO members (member_id, name, email, phone) VALUES (?, ?, ?, ?)");
    insertMember.run("LIB001", "Budi Santoso", "budi@example.com", "08123456789");
    insertMember.run("LIB002", "Siti Aminah", "siti@example.com", "08129876543");
  }

  app.use(express.json());

  // API Routes
  
  // Books API
  app.get("/api/books", (req, res) => {
    const { search } = req.query;
    if (search) {
      const books = db.prepare("SELECT * FROM books WHERE title LIKE ? OR author LIKE ? OR isbn LIKE ?").all(`%${search}%`, `%${search}%`, `%${search}%`);
      res.json(books);
    } else {
      const books = db.prepare("SELECT * FROM books").all();
      res.json(books);
    }
  });

  app.post("/api/books", (req, res) => {
    const { title, author, isbn, publisher, year, category, stock } = req.body;
    const result = db.prepare("INSERT INTO books (title, author, isbn, publisher, year, category, stock, available) VALUES (?, ?, ?, ?, ?, ?, ?, ?)")
      .run(title, author, isbn, publisher, year, category, stock, stock);
    res.json({ id: result.lastInsertRowid });
  });

  // Members API
  app.get("/api/members", (req, res) => {
    const members = db.prepare("SELECT * FROM members").all();
    res.json(members);
  });

  app.post("/api/members", (req, res) => {
    const { member_id, name, email, phone, address } = req.body;
    try {
      const result = db.prepare("INSERT INTO members (member_id, name, email, phone, address) VALUES (?, ?, ?, ?, ?)")
        .run(member_id, name, email, phone, address);
      res.json({ id: result.lastInsertRowid });
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  });

  // Circulation API
  app.get("/api/loans", (req, res) => {
    const loans = db.prepare(`
      SELECT l.*, b.title as book_title, m.name as member_name, m.member_id as member_code
      FROM loans l
      JOIN books b ON l.book_id = b.id
      JOIN members m ON l.member_id = m.id
      ORDER BY l.loan_date DESC
    `).all();
    res.json(loans);
  });

  app.post("/api/loans/borrow", (req, res) => {
    const { book_id, member_id, due_date } = req.body;
    
    const book = db.prepare("SELECT available FROM books WHERE id = ?").get(book_id) as { available: number };
    if (!book || book.available <= 0) {
      return res.status(400).json({ error: "Book not available" });
    }

    const transaction = db.transaction(() => {
      db.prepare("INSERT INTO loans (book_id, member_id, due_date) VALUES (?, ?, ?)").run(book_id, member_id, due_date);
      db.prepare("UPDATE books SET available = available - 1 WHERE id = ?").run(book_id);
    });

    transaction();
    res.json({ success: true });
  });

  app.post("/api/loans/return/:id", (req, res) => {
    const { id } = req.params;
    const loan = db.prepare("SELECT book_id, status FROM loans WHERE id = ?").get(id) as { book_id: number, status: string };
    
    if (!loan || loan.status === 'returned') {
      return res.status(400).json({ error: "Invalid loan or already returned" });
    }

    const transaction = db.transaction(() => {
      db.prepare("UPDATE loans SET return_date = CURRENT_TIMESTAMP, status = 'returned' WHERE id = ?").run(id);
      db.prepare("UPDATE books SET available = available + 1 WHERE id = ?").run(loan.book_id);
    });

    transaction();
    res.json({ success: true });
  });

  // Stats API
  app.get("/api/stats", (req, res) => {
    const totalBooks = db.prepare("SELECT SUM(stock) as count FROM books").get() as { count: number };
    const totalMembers = db.prepare("SELECT COUNT(*) as count FROM members").get() as { count: number };
    const activeLoans = db.prepare("SELECT COUNT(*) as count FROM loans WHERE status = 'borrowed'").get() as { count: number };
    const categories = db.prepare("SELECT category, COUNT(*) as count FROM books GROUP BY category").all();

    res.json({
      totalBooks: totalBooks.count || 0,
      totalMembers: totalMembers.count || 0,
      activeLoans: activeLoans.count || 0,
      categories
    });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production" && !process.env.VERCEL) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    // In Vercel or Production, serve static files from dist
    const distPath = path.join(__dirname, "..", "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      // If it's an API route that wasn't caught, return 404
      if (req.path.startsWith("/api")) {
        return res.status(404).json({ error: "API route not found" });
      }
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  // Only listen if not running as a Vercel function
  if (!process.env.VERCEL) {
    app.listen(PORT, "0.0.0.0", () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  }

  return app;
}

export default startServer();
