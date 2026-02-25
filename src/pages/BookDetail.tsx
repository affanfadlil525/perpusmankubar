import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { motion } from "motion/react";
import { ArrowLeft, BookOpen, Download, Share2, Bookmark, Calendar, User, Hash, Building2, CheckCircle2, AlertCircle } from "lucide-react";
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
  description?: string;
}

export default function BookDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [book, setBook] = useState<Book | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/books")
      .then(res => res.json())
      .then(data => {
        const found = data.find((b: any) => b.id === Number(id));
        setBook(found || null);
        setLoading(false);
      });
  }, [id]);

  if (loading) return <div className="min-h-screen flex items-center justify-center">Memuat...</div>;
  if (!book) return <div className="min-h-screen flex items-center justify-center">Buku tidak ditemukan.</div>;

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 pb-20">
      {/* Header */}
      <nav className="bg-white border-b border-slate-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <button 
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-slate-500 hover:text-slate-900 transition-colors font-semibold text-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            Kembali
          </button>
          <div className="flex items-center gap-4">
            <button className="p-2 text-slate-400 hover:text-slate-900 transition-colors">
              <Share2 className="w-5 h-5" />
            </button>
            <button className="p-2 text-slate-400 hover:text-slate-900 transition-colors">
              <Bookmark className="w-5 h-5" />
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 md:px-6 pt-8 md:pt-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-12">
          {/* Left: Cover */}
          <div className="lg:col-span-4">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="lg:sticky lg:top-28"
            >
              <div className="aspect-[3/4] max-w-sm mx-auto lg:max-w-none bg-white rounded-[2rem] md:rounded-[2.5rem] overflow-hidden shadow-2xl shadow-slate-200 border border-slate-100 relative group">
                <img 
                  src={`https://picsum.photos/seed/${book.id}/600/800`} 
                  alt={book.title} 
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity hidden md:flex items-center justify-center">
                  <Link 
                    to={`/read/${book.id}`}
                    className="bg-white text-slate-900 px-6 py-3 rounded-2xl font-bold flex items-center gap-2 transform translate-y-4 group-hover:translate-y-0 transition-all"
                  >
                    <BookOpen className="w-5 h-5" />
                    Baca Digital
                  </Link>
                </div>
              </div>
              
              <div className="mt-6 md:mt-8 grid grid-cols-2 gap-4">
                <Link 
                  to={`/read/${book.id}`}
                  className="bg-emerald-600 text-white p-4 rounded-2xl font-bold flex flex-col items-center justify-center gap-2 shadow-lg shadow-emerald-100 hover:bg-emerald-700 transition-all"
                >
                  <BookOpen className="w-6 h-6" />
                  <span className="text-[10px] md:text-xs">Baca Online</span>
                </Link>
                <button className="bg-white text-slate-600 p-4 rounded-2xl font-bold border border-slate-200 flex flex-col items-center justify-center gap-2 hover:bg-slate-50 transition-all">
                  <Download className="w-6 h-6" />
                  <span className="text-[10px] md:text-xs">Unduh PDF</span>
                </button>
              </div>
            </motion.div>
          </div>

          {/* Right: Info */}
          <div className="lg:col-span-8 space-y-8 md:space-y-10">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-4 md:space-y-6"
            >
              <div className="flex flex-wrap gap-2">
                <span className="px-3 py-1 bg-emerald-50 text-emerald-700 rounded-full text-[10px] font-bold uppercase tracking-wider">
                  {book.category}
                </span>
                <span className={cn(
                  "px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5",
                  book.available > 0 ? "bg-blue-50 text-blue-700" : "bg-red-50 text-red-700"
                )}>
                  {book.available > 0 ? <CheckCircle2 className="w-3 h-3" /> : <AlertCircle className="w-3 h-3" />}
                  {book.available > 0 ? "Tersedia" : "Dipinjam"}
                </span>
              </div>

              <h1 className="text-3xl md:text-4xl lg:text-5xl font-black text-slate-900 leading-tight">
                {book.title}
              </h1>

              <div className="flex flex-wrap items-center gap-4 text-slate-500">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-slate-200 rounded-full flex items-center justify-center">
                    <User className="w-4 h-4" />
                  </div>
                  <span className="font-semibold text-slate-700 text-sm md:text-base">{book.author}</span>
                </div>
                <span className="hidden md:inline text-slate-300">|</span>
                <div className="flex items-center gap-2 text-sm md:text-base">
                  <Calendar className="w-4 h-4" />
                  <span>Tahun {book.year}</span>
                </div>
              </div>

              <p className="text-slate-500 leading-relaxed text-base md:text-lg">
                {book.description || "Buku ini merupakan salah satu koleksi unggulan di Perpustakaan MAN Kutai Barat. Berisi materi yang sangat relevan untuk menunjang proses pembelajaran dan pengembangan diri siswa. Silakan baca versi digital atau kunjungi perpustakaan untuk meminjam versi cetaknya."}
              </p>
            </motion.div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
              <InfoCard icon={Hash} label="ISBN" value={book.isbn} />
              <InfoCard icon={Building2} label="Penerbit" value={book.publisher} />
              <InfoCard icon={BookOpen} label="Jumlah Stok" value={`${book.stock} Eksemplar`} />
              <InfoCard icon={CheckCircle2} label="Status Fisik" value={book.available > 0 ? "Tersedia" : "Kosong"} />
            </div>

            <section className="bg-white p-8 rounded-[2rem] border border-slate-200 shadow-sm">
              <h3 className="text-xl font-bold text-slate-900 mb-6">Ulasan Pembaca</h3>
              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600 shrink-0">
                    <User className="w-5 h-5" />
                  </div>
                  <div className="space-y-1">
                    <p className="font-bold text-slate-900 text-sm">Siswa MAN Kubar</p>
                    <p className="text-xs text-slate-400">2 hari yang lalu</p>
                    <p className="text-sm text-slate-600 leading-relaxed">Buku yang sangat inspiratif! Sangat membantu saya dalam memahami materi pelajaran di kelas.</p>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}

function InfoCard({ icon: Icon, label, value }: any) {
  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-200 flex items-center gap-4 shadow-sm">
      <div className="w-12 h-12 bg-slate-50 text-slate-400 rounded-xl flex items-center justify-center shrink-0">
        <Icon className="w-6 h-6" />
      </div>
      <div>
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{label}</p>
        <p className="text-sm text-slate-700 font-bold">{value}</p>
      </div>
    </div>
  );
}
