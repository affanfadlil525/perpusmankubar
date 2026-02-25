import React, { useEffect, useState } from "react";
import { motion } from "motion/react";
import { RefreshCw, ArrowUpRight, ArrowDownLeft, Clock, CheckCircle2, AlertCircle, Search } from "lucide-react";
import { cn } from "@/src/lib/utils";

interface Loan {
  id: number;
  book_title: string;
  member_name: string;
  member_code: string;
  loan_date: string;
  due_date: string;
  return_date: string | null;
  status: 'borrowed' | 'returned';
}

export default function Circulation() {
  const [loans, setLoans] = useState<Loan[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'all' | 'borrowed' | 'returned'>('all');

  const fetchLoans = async () => {
    setLoading(true);
    const res = await fetch("/api/loans");
    const data = await res.json();
    setLoans(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchLoans();
  }, []);

  const handleReturn = async (id: number) => {
    const res = await fetch(`/api/loans/return/${id}`, { method: 'POST' });
    if (res.ok) {
      fetchLoans();
    }
  };

  const filteredLoans = loans.filter(loan => {
    if (activeTab === 'all') return true;
    return loan.status === activeTab;
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-6"
    >
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-slate-900">Sirkulasi</h2>
          <p className="text-slate-500">Layanan peminjaman dan pengembalian buku.</p>
        </div>
        <div className="flex gap-2">
          <button className="bg-amber-600 text-white px-6 py-3 rounded-2xl font-bold flex items-center gap-2 shadow-lg shadow-amber-100 hover:bg-amber-700 transition-colors">
            <ArrowUpRight className="w-5 h-5" />
            Peminjaman Baru
          </button>
        </div>
      </header>

      <div className="flex gap-1 p-1 bg-slate-200/50 rounded-2xl w-fit">
        <TabButton active={activeTab === 'all'} onClick={() => setActiveTab('all')}>Semua</TabButton>
        <TabButton active={activeTab === 'borrowed'} onClick={() => setActiveTab('borrowed')}>Dipinjam</TabButton>
        <TabButton active={activeTab === 'returned'} onClick={() => setActiveTab('returned')}>Kembali</TabButton>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {loading ? (
          <div className="text-center py-12 text-slate-400">Memuat data transaksi...</div>
        ) : filteredLoans.length === 0 ? (
          <div className="text-center py-12 text-slate-400">Tidak ada transaksi ditemukan.</div>
        ) : (
          filteredLoans.map((loan) => (
            <div key={loan.id} className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6 group hover:border-emerald-200 transition-all">
              <div className="flex items-center gap-4">
                <div className={cn(
                  "w-12 h-12 rounded-2xl flex items-center justify-center shadow-sm",
                  loan.status === 'borrowed' ? "bg-amber-50 text-amber-600" : "bg-emerald-50 text-emerald-600"
                )}>
                  {loan.status === 'borrowed' ? <ArrowUpRight className="w-6 h-6" /> : <ArrowDownLeft className="w-6 h-6" />}
                </div>
                <div>
                  <h4 className="font-bold text-slate-900">{loan.book_title}</h4>
                  <p className="text-sm text-slate-500 flex items-center gap-2">
                    <span className="font-bold text-slate-700">{loan.member_name}</span>
                    <span className="text-slate-300">•</span>
                    <span>{loan.member_code}</span>
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap gap-8">
                <div className="space-y-1">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Tanggal Pinjam</p>
                  <p className="text-sm font-medium text-slate-700">{new Date(loan.loan_date).toLocaleDateString('id-ID')}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Jatuh Tempo</p>
                  <p className="text-sm font-medium text-slate-700">{loan.due_date ? new Date(loan.due_date).toLocaleDateString('id-ID') : '-'}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Status</p>
                  <div className={cn(
                    "flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-full",
                    loan.status === 'borrowed' ? "bg-amber-100 text-amber-700" : "bg-emerald-100 text-emerald-700"
                  )}>
                    {loan.status === 'borrowed' ? <Clock className="w-3 h-3" /> : <CheckCircle2 className="w-3 h-3" />}
                    {loan.status === 'borrowed' ? 'Dipinjam' : 'Kembali'}
                  </div>
                </div>
              </div>

              <div>
                {loan.status === 'borrowed' ? (
                  <button 
                    onClick={() => handleReturn(loan.id)}
                    className="w-full md:w-auto px-6 py-2.5 bg-emerald-600 text-white rounded-xl text-sm font-bold hover:bg-emerald-700 transition-colors shadow-lg shadow-emerald-100"
                  >
                    Kembalikan
                  </button>
                ) : (
                  <div className="text-right">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Dikembalikan</p>
                    <p className="text-sm font-medium text-emerald-600">{new Date(loan.return_date!).toLocaleDateString('id-ID')}</p>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </motion.div>
  );
}

function TabButton({ children, active, onClick }: { children: React.ReactNode; active: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "px-6 py-2 rounded-xl text-sm font-bold transition-all",
        active ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700"
      )}
    >
      {children}
    </button>
  );
}
