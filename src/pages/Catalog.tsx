import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Search, Plus, Book as BookIcon, Filter, MoreVertical, ExternalLink, X, AlertCircle } from "lucide-react";
import { cn } from "@/src/lib/utils";

interface Book {
  id: number;
  title: string;
  author: string;
  isbn: string;
  publisher: string;
  year: number;
  category: string;
  stock: number;
  available: number;
}

interface FormErrors {
  title?: string;
  author?: string;
  isbn?: string;
  publisher?: string;
  year?: string;
  category?: string;
  stock?: string;
}

export default function Catalog() {
  const [books, setBooks] = useState<Book[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Form State
  const [formData, setFormData] = useState({
    title: "",
    author: "",
    isbn: "",
    publisher: "",
    year: new Date().getFullYear(),
    category: "",
    stock: 1
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchBooks = async (query = "") => {
    setLoading(true);
    const res = await fetch(`/api/books?search=${query}`);
    const data = await res.json();
    setBooks(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    
    if (!formData.title.trim()) newErrors.title = "Judul buku wajib diisi";
    if (!formData.author.trim()) newErrors.author = "Nama pengarang wajib diisi";
    
    // ISBN Validation (Simple check for 10 or 13 digits)
    const isbnClean = formData.isbn.replace(/[-\s]/g, "");
    if (!isbnClean) {
      newErrors.isbn = "ISBN wajib diisi";
    } else if (!/^\d{10}(\d{3})?$/.test(isbnClean)) {
      newErrors.isbn = "ISBN harus 10 atau 13 digit angka";
    }

    if (!formData.publisher.trim()) newErrors.publisher = "Penerbit wajib diisi";
    
    if (!formData.year) {
      newErrors.year = "Tahun terbit wajib diisi";
    } else if (formData.year < 1000 || formData.year > new Date().getFullYear() + 1) {
      newErrors.year = "Tahun terbit tidak valid";
    }

    if (!formData.category.trim()) newErrors.category = "Kategori wajib diisi";
    
    if (formData.stock < 1) {
      newErrors.stock = "Stok minimal 1 eksemplar";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchBooks(search);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/books", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          available: formData.stock // Initially available = stock
        })
      });

      if (res.ok) {
        setIsModalOpen(false);
        setFormData({
          title: "",
          author: "",
          isbn: "",
          publisher: "",
          year: new Date().getFullYear(),
          category: "",
          stock: 1
        });
        fetchBooks();
      } else {
        const errorData = await res.json();
        alert(errorData.error || "Gagal menyimpan buku");
      }
    } catch (err) {
      console.error(err);
      alert("Terjadi kesalahan koneksi");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-6"
    >
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-slate-900">Katalog Buku</h2>
          <p className="text-slate-500">Kelola koleksi buku dan pustaka digital.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-emerald-600 text-white px-6 py-3 rounded-2xl font-bold flex items-center gap-2 shadow-lg shadow-emerald-100 hover:bg-emerald-700 transition-colors"
        >
          <Plus className="w-5 h-5" />
          Tambah Koleksi
        </button>
      </header>

      {/* Search & Filter */}
      <div className="bg-white p-4 rounded-3xl border border-slate-200 shadow-sm flex flex-col md:flex-row gap-4">
        <form onSubmit={handleSearch} className="flex-1 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input
            type="text"
            placeholder="Cari judul, pengarang, atau ISBN..."
            className="w-full pl-12 pr-4 py-3 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-emerald-500 transition-all"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </form>
        <button className="px-6 py-3 bg-slate-50 text-slate-600 rounded-2xl font-bold flex items-center gap-2 hover:bg-slate-100 transition-colors">
          <Filter className="w-5 h-5" />
          Filter
        </button>
      </div>

      {/* Table / Card View */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        {/* Desktop Table */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100">
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Buku</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Kategori</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">ISBN</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Tersedia</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-slate-400">Memuat data...</td>
                </tr>
              ) : books.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-slate-400">Tidak ada koleksi ditemukan.</td>
                </tr>
              ) : (
                books.map((book) => (
                  <tr key={book.id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-16 bg-slate-100 rounded-lg flex items-center justify-center text-slate-400 group-hover:bg-emerald-50 group-hover:text-emerald-500 transition-colors">
                          <BookIcon className="w-6 h-6" />
                        </div>
                        <div>
                          <p className="font-bold text-slate-900 leading-tight">{book.title}</p>
                          <p className="text-sm text-slate-500">{book.author}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-3 py-1 bg-slate-100 text-slate-600 rounded-full text-xs font-bold">
                        {book.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm font-mono text-slate-500">{book.isbn}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className={cn(
                          "w-2 h-2 rounded-full",
                          book.available > 0 ? "bg-emerald-500" : "bg-red-500"
                        )} />
                        <span className="text-sm font-medium text-slate-700">
                          {book.available > 0 ? "Tersedia" : "Dipinjam"}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm font-bold text-slate-900">{book.available} / {book.stock}</p>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button className="p-2 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-xl transition-all">
                          <ExternalLink className="w-4 h-4" />
                        </button>
                        <button className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition-all">
                          <MoreVertical className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile Card View */}
        <div className="md:hidden divide-y divide-slate-100">
          {loading ? (
            <div className="p-8 text-center text-slate-400">Memuat data...</div>
          ) : books.length === 0 ? (
            <div className="p-8 text-center text-slate-400">Tidak ada koleksi ditemukan.</div>
          ) : (
            books.map((book) => (
              <div key={book.id} className="p-4 space-y-4">
                <div className="flex gap-4">
                  <div className="w-16 h-20 bg-slate-100 rounded-xl flex items-center justify-center text-slate-400 shrink-0">
                    <BookIcon className="w-8 h-8" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-slate-900 truncate">{book.title}</h4>
                    <p className="text-sm text-slate-500 truncate">{book.author}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="px-2 py-0.5 bg-slate-100 text-slate-600 rounded-full text-[10px] font-bold">
                        {book.category}
                      </span>
                      <span className="text-[10px] font-mono text-slate-400">{book.isbn}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-between pt-2 border-t border-slate-50">
                  <div className="flex items-center gap-2">
                    <div className={cn(
                      "w-2 h-2 rounded-full",
                      book.available > 0 ? "bg-emerald-500" : "bg-red-500"
                    )} />
                    <span className="text-xs font-medium text-slate-700">
                      {book.available} / {book.stock} Tersedia
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button className="p-2 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-xl transition-all">
                      <ExternalLink className="w-5 h-5" />
                    </button>
                    <button className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition-all">
                      <MoreVertical className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Add Book Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-2xl bg-white rounded-[2.5rem] shadow-2xl overflow-hidden"
            >
              <div className="p-8 border-b border-slate-100 flex items-center justify-between">
                <div>
                  <h3 className="text-2xl font-bold text-slate-900">Tambah Buku Baru</h3>
                  <p className="text-sm text-slate-500">Lengkapi informasi buku untuk katalog.</p>
                </div>
                <button 
                  onClick={() => setIsModalOpen(false)}
                  className="p-2 hover:bg-slate-100 rounded-xl transition-colors"
                >
                  <X className="w-6 h-6 text-slate-400" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-8 space-y-6 max-h-[70vh] overflow-y-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Title */}
                  <div className="md:col-span-2 space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Judul Buku</label>
                    <input
                      type="text"
                      className={cn(
                        "w-full px-4 py-3 bg-slate-50 border-2 rounded-2xl focus:ring-0 outline-none transition-all",
                        errors.title ? "border-red-200 focus:border-red-500" : "border-transparent focus:border-emerald-500"
                      )}
                      placeholder="Masukkan judul lengkap"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    />
                    {errors.title && (
                      <p className="text-[10px] text-red-500 font-bold flex items-center gap-1 ml-1">
                        <AlertCircle className="w-3 h-3" /> {errors.title}
                      </p>
                    )}
                  </div>

                  {/* Author */}
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Pengarang</label>
                    <input
                      type="text"
                      className={cn(
                        "w-full px-4 py-3 bg-slate-50 border-2 rounded-2xl focus:ring-0 outline-none transition-all",
                        errors.author ? "border-red-200 focus:border-red-500" : "border-transparent focus:border-emerald-500"
                      )}
                      placeholder="Nama penulis"
                      value={formData.author}
                      onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                    />
                    {errors.author && (
                      <p className="text-[10px] text-red-500 font-bold flex items-center gap-1 ml-1">
                        <AlertCircle className="w-3 h-3" /> {errors.author}
                      </p>
                    )}
                  </div>

                  {/* ISBN */}
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">ISBN</label>
                    <input
                      type="text"
                      className={cn(
                        "w-full px-4 py-3 bg-slate-50 border-2 rounded-2xl focus:ring-0 outline-none transition-all",
                        errors.isbn ? "border-red-200 focus:border-red-500" : "border-transparent focus:border-emerald-500"
                      )}
                      placeholder="Contoh: 9786020332956"
                      value={formData.isbn}
                      onChange={(e) => setFormData({ ...formData, isbn: e.target.value })}
                    />
                    {errors.isbn && (
                      <p className="text-[10px] text-red-500 font-bold flex items-center gap-1 ml-1">
                        <AlertCircle className="w-3 h-3" /> {errors.isbn}
                      </p>
                    )}
                  </div>

                  {/* Publisher */}
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Penerbit</label>
                    <input
                      type="text"
                      className={cn(
                        "w-full px-4 py-3 bg-slate-50 border-2 rounded-2xl focus:ring-0 outline-none transition-all",
                        errors.publisher ? "border-red-200 focus:border-red-500" : "border-transparent focus:border-emerald-500"
                      )}
                      placeholder="Nama penerbit"
                      value={formData.publisher}
                      onChange={(e) => setFormData({ ...formData, publisher: e.target.value })}
                    />
                    {errors.publisher && (
                      <p className="text-[10px] text-red-500 font-bold flex items-center gap-1 ml-1">
                        <AlertCircle className="w-3 h-3" /> {errors.publisher}
                      </p>
                    )}
                  </div>

                  {/* Year */}
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Tahun Terbit</label>
                    <input
                      type="number"
                      className={cn(
                        "w-full px-4 py-3 bg-slate-50 border-2 rounded-2xl focus:ring-0 outline-none transition-all",
                        errors.year ? "border-red-200 focus:border-red-500" : "border-transparent focus:border-emerald-500"
                      )}
                      value={formData.year}
                      onChange={(e) => setFormData({ ...formData, year: parseInt(e.target.value) })}
                    />
                    {errors.year && (
                      <p className="text-[10px] text-red-500 font-bold flex items-center gap-1 ml-1">
                        <AlertCircle className="w-3 h-3" /> {errors.year}
                      </p>
                    )}
                  </div>

                  {/* Category */}
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Kategori</label>
                    <select
                      className={cn(
                        "w-full px-4 py-3 bg-slate-50 border-2 rounded-2xl focus:ring-0 outline-none transition-all appearance-none",
                        errors.category ? "border-red-200 focus:border-red-500" : "border-transparent focus:border-emerald-500"
                      )}
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    >
                      <option value="">Pilih Kategori</option>
                      <option value="Sains">Sains</option>
                      <option value="Teknologi">Teknologi</option>
                      <option value="Fiksi">Fiksi</option>
                      <option value="Sejarah">Sejarah</option>
                      <option value="Agama">Agama</option>
                      <option value="Sastra">Sastra</option>
                    </select>
                    {errors.category && (
                      <p className="text-[10px] text-red-500 font-bold flex items-center gap-1 ml-1">
                        <AlertCircle className="w-3 h-3" /> {errors.category}
                      </p>
                    )}
                  </div>

                  {/* Stock */}
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Jumlah Stok</label>
                    <input
                      type="number"
                      min="1"
                      className={cn(
                        "w-full px-4 py-3 bg-slate-50 border-2 rounded-2xl focus:ring-0 outline-none transition-all",
                        errors.stock ? "border-red-200 focus:border-red-500" : "border-transparent focus:border-emerald-500"
                      )}
                      value={formData.stock}
                      onChange={(e) => setFormData({ ...formData, stock: parseInt(e.target.value) })}
                    />
                    {errors.stock && (
                      <p className="text-[10px] text-red-500 font-bold flex items-center gap-1 ml-1">
                        <AlertCircle className="w-3 h-3" /> {errors.stock}
                      </p>
                    )}
                  </div>
                </div>

                <div className="pt-4 flex gap-4">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="flex-1 py-4 bg-slate-100 text-slate-600 rounded-2xl font-bold hover:bg-slate-200 transition-all"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-[2] py-4 bg-emerald-600 text-white rounded-2xl font-bold shadow-lg shadow-emerald-100 hover:bg-emerald-700 transition-all disabled:opacity-50"
                  >
                    {isSubmitting ? "Menyimpan..." : "Simpan Koleksi"}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
