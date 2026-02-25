import React, { useState } from "react";
import { motion } from "motion/react";
import { GraduationCap, Lock, Hash, ArrowRight, Info } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";

export default function StudentLogin({ onLogin }: { onLogin: () => void }) {
  const [nisn, setNisn] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const from = (location.state as any)?.from?.pathname || "/";

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Simulate student login
    setTimeout(() => {
      onLogin();
      navigate(from, { replace: true });
      setLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 font-sans">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="bg-white rounded-[2.5rem] shadow-2xl shadow-slate-200 border border-slate-100 overflow-hidden">
          <div className="bg-blue-600 p-8 text-white text-center relative">
            <div className="relative z-10 flex flex-col items-center">
              <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center mb-4 shadow-xl">
                <GraduationCap className="w-10 h-10 text-white" />
              </div>
              <h1 className="text-2xl font-bold">Login Siswa</h1>
              <p className="text-blue-100 text-sm mt-1">Gunakan NISN untuk mengakses koleksi digital</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="p-8 space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">NISN / ID Anggota</label>
                <div className="relative">
                  <Hash className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    type="text"
                    required
                    className="w-full pl-12 pr-4 py-3 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 transition-all outline-none text-slate-700"
                    placeholder="Contoh: 0012345678"
                    value={nisn}
                    onChange={(e) => setNisn(e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Password</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    type="password"
                    required
                    className="w-full pl-12 pr-4 py-3 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 transition-all outline-none text-slate-700"
                    placeholder="Masukkan password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-blue-600 text-white rounded-2xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-blue-100 hover:bg-blue-700 active:scale-[0.98] transition-all disabled:opacity-50"
            >
              {loading ? "Memverifikasi..." : "Masuk & Baca Buku"}
              {!loading && <ArrowRight className="w-5 h-5" />}
            </button>

            <div className="bg-blue-50 p-4 rounded-2xl flex gap-3 items-start">
              <Info className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
              <p className="text-[10px] text-blue-700 leading-relaxed">
                Belum punya akun? Silakan hubungi pustakawan di perpustakaan MAN Kutai Barat untuk pendaftaran anggota baru.
              </p>
            </div>
          </form>
        </div>
        
        <div className="mt-8 flex justify-center gap-6">
          <button onClick={() => navigate("/")} className="text-slate-400 hover:text-slate-600 text-sm font-medium transition-colors">Kembali ke Beranda</button>
          <button onClick={() => navigate("/login")} className="text-slate-400 hover:text-slate-600 text-sm font-medium transition-colors">Login Pustakawan</button>
        </div>
      </motion.div>
    </div>
  );
}
