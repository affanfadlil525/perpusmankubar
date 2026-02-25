import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import { ArrowLeft, ChevronLeft, ChevronRight, ZoomIn, ZoomOut, Maximize, Settings, List } from "lucide-react";

export default function Reader() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const [totalPages] = useState(24);
  const [bookTitle, setBookTitle] = useState("Memuat...");

  useEffect(() => {
    fetch("/api/books")
      .then(res => res.json())
      .then(data => {
        const found = data.find((b: any) => b.id === Number(id));
        if (found) setBookTitle(found.title);
      });
  }, [id]);

  return (
    <div className="min-h-screen bg-slate-900 text-white flex flex-col font-sans overflow-hidden">
      {/* Top Bar */}
      <header className="h-16 bg-slate-800/50 backdrop-blur-md border-b border-white/10 flex items-center justify-between px-6 z-50">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate(-1)}
            className="p-2 hover:bg-white/10 rounded-xl transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-sm font-bold truncate max-w-[200px] md:max-w-md">{bookTitle}</h1>
            <p className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">E-Reader MAN Kubar</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button className="p-2 hover:bg-white/10 rounded-xl transition-colors hidden md:block">
            <ZoomOut className="w-5 h-5" />
          </button>
          <button className="p-2 hover:bg-white/10 rounded-xl transition-colors hidden md:block">
            <ZoomIn className="w-5 h-5" />
          </button>
          <div className="w-px h-6 bg-white/10 mx-2 hidden md:block"></div>
          <button className="p-2 hover:bg-white/10 rounded-xl transition-colors">
            <List className="w-5 h-5" />
          </button>
          <button className="p-2 hover:bg-white/10 rounded-xl transition-colors">
            <Settings className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* Content Area */}
      <main className="flex-1 relative flex items-center justify-center p-4 md:p-8 overflow-auto">
        <div className="absolute inset-0 flex items-center justify-between px-4 pointer-events-none z-10">
          <button 
            onClick={() => setPage(p => Math.max(1, p - 1))}
            className="w-12 h-12 bg-white/5 hover:bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center pointer-events-auto transition-all disabled:opacity-20"
            disabled={page === 1}
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button 
            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
            className="w-12 h-12 bg-white/5 hover:bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center pointer-events-auto transition-all disabled:opacity-20"
            disabled={page === totalPages}
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>

        <motion.div 
          key={page}
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-3xl aspect-[1/1.414] bg-white shadow-2xl rounded-lg overflow-hidden relative"
        >
          {/* Simulated Page Content */}
          <div className="absolute inset-0 p-12 md:p-20 text-slate-800 flex flex-col">
            <div className="flex justify-between items-center mb-12 border-b border-slate-100 pb-4">
              <span className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">{bookTitle}</span>
              <span className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">Halaman {page}</span>
            </div>
            
            <div className="space-y-6 flex-1">
              <div className="h-8 bg-slate-100 rounded-lg w-3/4 mb-8"></div>
              <div className="space-y-3">
                {Array(12).fill(0).map((_, i) => (
                  <div key={i} className="h-3 bg-slate-50 rounded-full w-full"></div>
                ))}
                <div className="h-3 bg-slate-50 rounded-full w-2/3"></div>
              </div>
              
              <div className="pt-12 space-y-3">
                {Array(8).fill(0).map((_, i) => (
                  <div key={i} className="h-3 bg-slate-50 rounded-full w-full"></div>
                ))}
              </div>
            </div>

            <div className="mt-auto text-center pt-8 border-t border-slate-100">
              <p className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">Perpustakaan Digital MAN Kutai Barat</p>
            </div>
          </div>
        </motion.div>
      </main>

      {/* Bottom Bar */}
      <footer className="h-16 bg-slate-800/50 backdrop-blur-md border-t border-white/10 flex items-center justify-center px-6 z-50">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-4">
            <input 
              type="range" 
              min="1" 
              max={totalPages} 
              value={page}
              onChange={(e) => setPage(Number(e.target.value))}
              className="w-32 md:w-64 accent-emerald-500"
            />
            <span className="text-xs font-bold font-mono min-w-[60px] text-center">
              {page} / {totalPages}
            </span>
          </div>
          <button className="p-2 hover:bg-white/10 rounded-xl transition-colors">
            <Maximize className="w-5 h-5" />
          </button>
        </div>
      </footer>
    </div>
  );
}
