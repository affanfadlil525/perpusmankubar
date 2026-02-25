import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { Users, UserPlus, Search, Mail, Phone, MapPin, Calendar } from "lucide-react";

interface Member {
  id: number;
  member_id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  join_date: string;
}

export default function Members() {
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/members")
      .then(res => res.json())
      .then(data => {
        setMembers(data);
        setLoading(false);
      });
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-6"
    >
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-slate-900">Keanggotaan</h2>
          <p className="text-slate-500">Manajemen data anggota perpustakaan.</p>
        </div>
        <button className="bg-blue-600 text-white px-6 py-3 rounded-2xl font-bold flex items-center gap-2 shadow-lg shadow-blue-100 hover:bg-blue-700 transition-colors">
          <UserPlus className="w-5 h-5" />
          Registrasi Anggota
        </button>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <div className="col-span-full text-center py-12 text-slate-400">Memuat data anggota...</div>
        ) : members.length === 0 ? (
          <div className="col-span-full text-center py-12 text-slate-400">Belum ada anggota terdaftar.</div>
        ) : (
          members.map((member) => (
            <div key={member.id} className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm hover:shadow-md transition-all group">
              <div className="flex items-start justify-between mb-6">
                <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                  <Users className="w-8 h-8" />
                </div>
                <span className="px-3 py-1 bg-slate-100 text-slate-600 rounded-full text-[10px] font-bold uppercase tracking-wider">
                  {member.member_id}
                </span>
              </div>
              
              <div className="space-y-4">
                <div>
                  <h4 className="font-bold text-slate-900 text-lg">{member.name}</h4>
                  <div className="flex items-center gap-2 text-slate-400 text-xs mt-1">
                    <Calendar className="w-3 h-3" />
                    Bergabung {new Date(member.join_date).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-3 text-sm text-slate-600">
                    <Mail className="w-4 h-4 text-slate-400" />
                    {member.email}
                  </div>
                  <div className="flex items-center gap-3 text-sm text-slate-600">
                    <Phone className="w-4 h-4 text-slate-400" />
                    {member.phone}
                  </div>
                  {member.address && (
                    <div className="flex items-center gap-3 text-sm text-slate-600">
                      <MapPin className="w-4 h-4 text-slate-400" />
                      <span className="truncate">{member.address}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-slate-100 flex gap-2">
                <button className="flex-1 py-2 bg-slate-50 text-slate-600 rounded-xl text-xs font-bold hover:bg-slate-100 transition-colors">
                  Detail Profil
                </button>
                <button className="flex-1 py-2 bg-slate-50 text-slate-600 rounded-xl text-xs font-bold hover:bg-slate-100 transition-colors">
                  Riwayat Pinjam
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </motion.div>
  );
}
