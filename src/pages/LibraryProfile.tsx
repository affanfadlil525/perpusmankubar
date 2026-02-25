import React from "react";
import { motion } from "motion/react";
import { MapPin, Phone, Mail, Globe, Info, Award, BookOpen, Users } from "lucide-react";

export default function LibraryProfile() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-8 max-w-5xl mx-auto"
    >
      <header className="relative h-48 md:h-64 rounded-[2rem] md:rounded-[2.5rem] overflow-hidden shadow-2xl shadow-slate-200">
        <img 
          src="https://picsum.photos/seed/library/1200/400" 
          alt="Library Header" 
          className="w-full h-full object-cover"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/20 to-transparent flex items-end p-6 md:p-10">
          <div className="flex items-center gap-4 md:gap-6">
            <div className="w-16 h-16 md:w-24 md:h-24 bg-white rounded-2xl md:rounded-3xl flex items-center justify-center shadow-xl border-2 md:border-4 border-white/20 backdrop-blur-sm shrink-0">
              <img 
                src="https://upload.wikimedia.org/wikipedia/commons/thumb/a/a2/Logo_Kementerian_Agama.png/600px-Logo_Kementerian_Agama.png" 
                alt="Logo Kemenag" 
                className="w-10 h-10 md:w-16 md:h-16 object-contain"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="text-white">
              <h2 className="text-xl md:text-4xl font-black tracking-tight leading-tight">Perpustakaan MAN Kutai Barat</h2>
              <p className="text-emerald-300 text-[10px] md:text-sm font-medium flex items-center gap-2 mt-1">
                <MapPin className="w-3 h-3 md:w-4 md:h-4" />
                Kabupaten Kutai Barat, Kalimantan Timur
              </p>
            </div>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <section className="bg-white p-8 rounded-[2rem] border border-slate-200 shadow-sm">
            <h3 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
              <Info className="w-6 h-6 text-emerald-600" />
              Profil Singkat
            </h3>
            <p className="text-slate-600 leading-relaxed">
              Perpustakaan Madrasah Aliyah Negeri (MAN) Kutai Barat merupakan pusat sumber belajar bagi seluruh civitas akademika. 
              Kami berkomitmen untuk menyediakan koleksi literatur yang berkualitas, baik dalam bentuk cetak maupun digital, 
              guna mendukung proses belajar mengajar dan menumbuhkan minat baca siswa.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                <h4 className="font-bold text-slate-800 text-sm mb-1">Visi</h4>
                <p className="text-xs text-slate-500 italic">"Menjadi pusat literasi unggul berbasis teknologi dan nilai-nilai keislaman."</p>
              </div>
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                <h4 className="font-bold text-slate-800 text-sm mb-1">Akreditasi</h4>
                <div className="flex items-center gap-2 text-emerald-600 font-bold text-sm">
                  <Award className="w-4 h-4" />
                  Terakreditasi A
                </div>
              </div>
            </div>
          </section>

          <section className="bg-white p-8 rounded-[2rem] border border-slate-200 shadow-sm">
            <h3 className="text-xl font-bold text-slate-900 mb-6">Layanan Unggulan</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <ServiceCard 
                icon={BookOpen} 
                title="Peminjaman" 
                desc="Akses ke ribuan koleksi buku teks dan referensi."
              />
              <ServiceCard 
                icon={Globe} 
                title="E-Library" 
                desc="Akses jurnal dan buku digital secara daring."
              />
              <ServiceCard 
                icon={Users} 
                title="Ruang Diskusi" 
                desc="Area nyaman untuk kerja kelompok dan diskusi."
              />
            </div>
          </section>
        </div>

        <div className="space-y-8">
          <section className="bg-white p-8 rounded-[2rem] border border-slate-200 shadow-sm">
            <h3 className="text-xl font-bold text-slate-900 mb-6">Kontak & Lokasi</h3>
            <div className="space-y-4">
              <ContactItem icon={MapPin} label="Alamat" value="Jl. Sendawar No. 12, Melak, Kutai Barat" />
              <ContactItem icon={Phone} label="Telepon" value="(0545) 123456" />
              <ContactItem icon={Mail} label="Email" value="perpus@mankubar.sch.id" />
              <ContactItem icon={Globe} label="Website" value="www.mankubar.sch.id" />
            </div>
          </section>

          <section className="bg-emerald-600 p-8 rounded-[2rem] text-white shadow-xl shadow-emerald-100">
            <h3 className="text-lg font-bold mb-4">Jam Operasional</h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between border-b border-white/20 pb-2">
                <span>Senin - Kamis</span>
                <span className="font-bold">07:30 - 15:30</span>
              </div>
              <div className="flex justify-between border-b border-white/20 pb-2">
                <span>Jumat</span>
                <span className="font-bold">07:30 - 11:30</span>
              </div>
              <div className="flex justify-between text-white/60">
                <span>Sabtu - Minggu</span>
                <span className="font-bold">Tutup</span>
              </div>
            </div>
          </section>
        </div>
      </div>
    </motion.div>
  );
}

function ServiceCard({ icon: Icon, title, desc }: any) {
  return (
    <div className="text-center p-4">
      <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
        <Icon className="w-6 h-6" />
      </div>
      <h4 className="font-bold text-slate-900 text-sm mb-2">{title}</h4>
      <p className="text-xs text-slate-500 leading-relaxed">{desc}</p>
    </div>
  );
}

function ContactItem({ icon: Icon, label, value }: any) {
  return (
    <div className="flex gap-4">
      <div className="w-10 h-10 bg-slate-50 text-slate-400 rounded-xl flex items-center justify-center shrink-0">
        <Icon className="w-5 h-5" />
      </div>
      <div>
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{label}</p>
        <p className="text-sm text-slate-700 font-medium">{value}</p>
      </div>
    </div>
  );
}
