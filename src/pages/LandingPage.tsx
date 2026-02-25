import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Search, Book as BookIcon, MapPin, Clock, ArrowRight, Library, ShieldCheck, Star, Menu, X } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { cn } from "@/src/lib/utils";

interface Book {
  id: number;
  title: string;
  author: string;
  isbn: string;
  category: string;
  available: number;
  cover_url?: string;
}

export default function LandingPage() {
  const [books, setBooks] = useState<Book[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetch("/api/books")
      .then(res => res.json())
      .then(data => {
        setBooks(data.slice(0, 8)); // Show top 8 books
        setLoading(false);
      });
  }, []);

  return (
    <div className="min-h-screen bg-white font-sans text-slate-900">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-[100] bg-white/80 backdrop-blur-md border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 md:px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-emerald-100">
              <Library className="w-6 h-6" />
            </div>
            <div>
              <h1 className="font-bold text-slate-900 leading-tight">Libraria</h1>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">MAN Kutai Barat</p>
            </div>
          </div>
          
          {/* Desktop Menu */}
          <div className="hidden lg:flex items-center gap-8">
            <a href="#koleksi" className="text-sm font-semibold text-slate-600 hover:text-emerald-600 transition-colors">Koleksi</a>
            <a href="#profil" className="text-sm font-semibold text-slate-600 hover:text-emerald-600 transition-colors">Profil</a>
            <a href="#layanan" className="text-sm font-semibold text-slate-600 hover:text-emerald-600 transition-colors">Layanan</a>
            
            {localStorage.getItem("is_student_auth") === "true" ? (
              <button 
                onClick={() => {
                  localStorage.removeItem("is_student_auth");
                  window.location.reload();
                }}
                className="text-sm font-bold text-red-500 hover:text-red-600 transition-colors"
              >
                Logout Siswa
              </button>
            ) : (
              <Link to="/student-login" className="text-sm font-semibold text-slate-600 hover:text-emerald-600 transition-colors">Login Siswa</Link>
            )}

            <Link to="/login" className="flex items-center gap-2 px-5 py-2.5 bg-slate-900 text-white rounded-xl text-sm font-bold hover:bg-slate-800 transition-all shadow-lg shadow-slate-200">
              <ShieldCheck className="w-4 h-4" />
              Pustakawan
            </Link>
          </div>

          {/* Mobile Menu Toggle */}
          <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="lg:hidden p-2 text-slate-500">
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu Overlay */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="lg:hidden bg-white border-b border-slate-100 p-6 space-y-6 shadow-xl"
            >
              <nav className="flex flex-col gap-4">
                <a href="#koleksi" onClick={() => setIsMenuOpen(false)} className="text-lg font-bold text-slate-700">Koleksi</a>
                <a href="#profil" onClick={() => setIsMenuOpen(false)} className="text-lg font-bold text-slate-700">Profil</a>
                <a href="#layanan" onClick={() => setIsMenuOpen(false)} className="text-lg font-bold text-slate-700">Layanan</a>
                <div className="h-px bg-slate-100 my-2" />
                {localStorage.getItem("is_student_auth") === "true" ? (
                  <button 
                    onClick={() => {
                      localStorage.removeItem("is_student_auth");
                      window.location.reload();
                    }}
                    className="text-lg font-bold text-red-500 text-left"
                  >
                    Logout Siswa
                  </button>
                ) : (
                  <Link to="/student-login" className="text-lg font-bold text-slate-700">Login Siswa</Link>
                )}
                <Link to="/login" className="flex items-center gap-2 px-6 py-4 bg-slate-900 text-white rounded-2xl text-lg font-bold justify-center">
                  <ShieldCheck className="w-5 h-5" />
                  Pustakawan
                </Link>
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 md:pt-40 pb-12 md:pb-20 px-4 md:px-6 overflow-hidden">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6 md:space-y-8 text-center lg:text-left"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-700 rounded-full text-[10px] md:text-xs font-bold uppercase tracking-wider">
              <Star className="w-3 h-3 fill-emerald-700" />
              Pusat Literasi Digital MAN Kubar
            </div>
            <h2 className="text-4xl md:text-6xl lg:text-7xl font-black text-slate-900 leading-[1.1] tracking-tight">
              Jendela Dunia di <span className="text-emerald-600">Ujung Jari</span> Anda.
            </h2>
            <p className="text-base md:text-lg text-slate-500 max-w-lg mx-auto lg:mx-0 leading-relaxed">
              Temukan ribuan koleksi buku, jurnal, dan referensi digital terbaik untuk mendukung prestasi akademik siswa MAN Kutai Barat.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 max-w-xl mx-auto lg:mx-0">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input 
                  type="text" 
                  placeholder="Cari judul buku..."
                  className="w-full pl-12 pr-4 py-4 bg-slate-50 border-2 border-transparent rounded-2xl focus:border-emerald-500 focus:bg-white transition-all outline-none text-sm md:text-base"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
              <button className="px-8 py-4 bg-emerald-600 text-white rounded-2xl font-bold shadow-xl shadow-emerald-100 hover:bg-emerald-700 transition-all flex items-center justify-center gap-2 whitespace-nowrap">
                Cari Buku
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative px-4 md:px-0"
          >
            <div className="aspect-[4/3] rounded-[2rem] md:rounded-[3rem] overflow-hidden shadow-2xl shadow-slate-200 border-4 md:border-8 border-white">
              <img 
                src="https://picsum.photos/seed/man-kubar/800/600" 
                alt="Library Interior" 
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="absolute -bottom-4 md:-bottom-6 -left-2 md:-left-6 bg-white p-4 md:p-6 rounded-2xl md:rounded-3xl shadow-xl border border-slate-100 flex items-center gap-3 md:gap-4">
              <div className="w-10 h-10 md:w-12 md:h-12 bg-blue-500 rounded-xl md:rounded-2xl flex items-center justify-center text-white">
                <BookIcon className="w-5 h-5 md:w-6 md:h-6" />
              </div>
              <div>
                <p className="text-xl md:text-2xl font-black text-slate-900 leading-none">1,200+</p>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Koleksi Buku</p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Featured Books */}
      <section id="koleksi" className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-end justify-between mb-12">
            <div>
              <h3 className="text-3xl font-bold text-slate-900">Koleksi Terbaru</h3>
              <p className="text-slate-500 mt-2">Buku-buku pilihan yang baru saja tiba di perpustakaan.</p>
            </div>
            <button className="text-emerald-600 font-bold flex items-center gap-2 hover:gap-3 transition-all">
              Lihat Semua
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {loading ? (
              Array(4).fill(0).map((_, i) => (
                <div key={i} className="animate-pulse space-y-4">
                  <div className="aspect-[3/4] bg-slate-200 rounded-3xl"></div>
                  <div className="h-4 bg-slate-200 rounded w-3/4"></div>
                  <div className="h-3 bg-slate-200 rounded w-1/2"></div>
                </div>
              ))
            ) : (
              books.map((book) => (
                <motion.div
                  key={book.id}
                  whileHover={{ y: -10 }}
                  className="group cursor-pointer"
                  onClick={() => navigate(`/book/${book.id}`)}
                >
                  <div className="aspect-[3/4] bg-white rounded-[2rem] overflow-hidden shadow-lg shadow-slate-200 border border-slate-100 mb-4 relative">
                    <img 
                      src={`https://picsum.photos/seed/${book.id}/300/400`} 
                      alt={book.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute top-4 right-4">
                      <span className={cn(
                        "px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider shadow-sm",
                        book.available > 0 ? "bg-emerald-500 text-white" : "bg-red-500 text-white"
                      )}>
                        {book.available > 0 ? "Tersedia" : "Dipinjam"}
                      </span>
                    </div>
                  </div>
                  <h4 className="font-bold text-slate-900 leading-tight group-hover:text-emerald-600 transition-colors">{book.title}</h4>
                  <p className="text-sm text-slate-400 mt-1">{book.author}</p>
                </motion.div>
              ))
            )}
          </div>
        </div>
      </section>

      {/* Info Section */}
      <section id="profil" className="py-24 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <div className="order-2 lg:order-1">
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-6">
                <div className="aspect-square bg-emerald-600 rounded-[2.5rem] flex flex-col items-center justify-center text-white p-8 text-center shadow-2xl shadow-emerald-100">
                  <Award className="w-12 h-12 mb-4" />
                  <p className="text-3xl font-black">A</p>
                  <p className="text-xs font-bold uppercase tracking-widest opacity-80">Akreditasi</p>
                </div>
                <div className="aspect-square bg-slate-100 rounded-[2.5rem] overflow-hidden">
                  <img src="https://picsum.photos/seed/students/400/400" alt="Students" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                </div>
              </div>
              <div className="space-y-6 pt-12">
                <div className="aspect-square bg-slate-100 rounded-[2.5rem] overflow-hidden">
                  <img src="https://picsum.photos/seed/reading/400/400" alt="Reading" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                </div>
                <div className="aspect-square bg-blue-600 rounded-[2.5rem] flex flex-col items-center justify-center text-white p-8 text-center shadow-2xl shadow-blue-100">
                  <Users className="w-12 h-12 mb-4" />
                  <p className="text-3xl font-black">800+</p>
                  <p className="text-xs font-bold uppercase tracking-widest opacity-80">Anggota Aktif</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="order-1 lg:order-2 space-y-8">
            <h3 className="text-4xl font-black text-slate-900 leading-tight">Membangun Generasi <span className="text-emerald-600">Cerdas & Berakhlak</span>.</h3>
            <p className="text-slate-500 leading-relaxed text-lg">
              Perpustakaan MAN Kutai Barat bukan sekadar tempat menyimpan buku, melainkan laboratorium peradaban tempat siswa mengasah intelektualitas dan spiritualitas.
            </p>
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600 shrink-0">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <h5 className="font-bold text-slate-900">Layanan Cepat</h5>
                  <p className="text-sm text-slate-500">Sistem sirkulasi digital yang memudahkan peminjaman buku.</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600 shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <h5 className="font-bold text-slate-900">Lokasi Strategis</h5>
                  <p className="text-sm text-slate-500">Terletak di jantung sekolah, mudah diakses oleh seluruh siswa.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-20 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="col-span-2 space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-emerald-600 rounded-2xl flex items-center justify-center text-white">
                <Library className="w-7 h-7" />
              </div>
              <div>
                <h1 className="font-bold text-2xl leading-tight">Libraria</h1>
                <p className="text-xs text-emerald-500 font-bold uppercase tracking-widest">MAN Kutai Barat</p>
              </div>
            </div>
            <p className="text-slate-400 max-w-sm leading-relaxed">
              Jl. Sendawar No. 12, Melak, Kabupaten Kutai Barat, Kalimantan Timur. 
              Mencerdaskan kehidupan bangsa melalui literasi.
            </p>
          </div>
          
          <div>
            <h5 className="font-bold mb-6 text-emerald-500 uppercase tracking-widest text-xs">Tautan Cepat</h5>
            <ul className="space-y-4 text-slate-400 text-sm">
              <li><a href="#" className="hover:text-white transition-colors">Beranda</a></li>
              <li><a href="#koleksi" className="hover:text-white transition-colors">Koleksi</a></li>
              <li><a href="#profil" className="hover:text-white transition-colors">Profil Sekolah</a></li>
              <li><a href="#layanan" className="hover:text-white transition-colors">Layanan Digital</a></li>
            </ul>
          </div>

          <div>
            <h5 className="font-bold mb-6 text-emerald-500 uppercase tracking-widest text-xs">Kontak</h5>
            <ul className="space-y-4 text-slate-400 text-sm">
              <li>perpus@mankubar.sch.id</li>
              <li>(0545) 123456</li>
              <li>@perpusmankubar</li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto mt-20 pt-8 border-t border-white/10 text-center text-slate-500 text-xs">
          <p>&copy; 2026 MAN Kutai Barat. Dibuat dengan dedikasi untuk pendidikan Indonesia.</p>
        </div>
      </footer>
    </div>
  );
}

function Award(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m15.477 12.89 1.515 8.526a.5.5 0 0 1-.81.47l-3.58-2.687a1 1 0 0 0-1.197 0l-3.586 2.686a.5.5 0 0 1-.81-.469l1.514-8.526" />
      <circle cx="12" cy="8" r="6" />
    </svg>
  )
}

function Users(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  )
}
