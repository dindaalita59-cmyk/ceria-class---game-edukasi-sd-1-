import React from 'react';
import { 
  Sparkles, 
  School, 
  Phone, 
  UserCheck, 
  ShieldCheck, 
  Heart, 
  BookOpen, 
  Projector, 
  Layers, 
  Award 
} from 'lucide-react';

export const AboutApp: React.FC = () => {
  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      
      {/* Hero Banner */}
      <div className="bg-gradient-to-r from-amber-400 via-amber-300 to-yellow-200 rounded-3xl p-6 sm:p-10 text-amber-950 shadow-md space-y-4">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-2xl bg-amber-950 text-amber-300 flex items-center justify-center font-bold">
            <Sparkles className="w-6 h-6" />
          </div>
          <span className="font-display font-extrabold text-xl sm:text-2xl tracking-tight">
            CERIA CLASS
          </span>
        </div>

        <div className="space-y-1">
          <h1 className="font-display font-black text-2xl sm:text-4xl text-amber-950">
            Cerdas, Interaktif, dan Asyik Belajar
          </h1>
          <p className="text-base sm:text-lg font-extrabold text-amber-900">
            "Belajar Seru, Guru Terbantu, Anak Ceria."
          </p>
        </div>

        <p className="text-xs sm:text-sm text-amber-950/80 leading-relaxed font-medium max-w-3xl">
          Aplikasi web edukatif yang dirancang khusus untuk memfasilitasi pembelajaran bermakna, interaktif, dan berdiferensiasi bagi peserta didik fase awal (kelas 1–3 SD) serta meringankan beban kerja guru dalam menyusun media permainan dan merekapitulasi asesmen formatif.
        </p>
      </div>

      {/* Developer & Institution Profile Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-amber-200/80 shadow-xs space-y-5">
        <h2 className="font-display font-extrabold text-xl text-slate-900 flex items-center gap-2">
          <School className="w-5 h-5 text-sky-600" />
          <span>Profil Pengembang & Instansi Sasaran</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
          <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-3">
            <div className="space-y-1">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wide">Pengembang Aplikasi</span>
              <p className="font-display font-black text-lg text-slate-900">Dinda Noer Alita, S.Pd.</p>
              <p className="text-xs text-slate-500 font-semibold">Pendidik & Pengembang Media Pembelajaran Digital</p>
            </div>

            <div className="flex items-center gap-2 pt-2 border-t border-slate-200 text-xs">
              <Phone className="w-4 h-4 text-emerald-600 shrink-0" />
              <span className="font-bold text-slate-700">Kontak Pengembang:</span>
              <span className="font-mono font-bold text-slate-900 bg-emerald-50 px-2 py-0.5 rounded-lg border border-emerald-200">
                085709770470
              </span>
            </div>
          </div>

          <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-3">
            <div className="space-y-1">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wide">Instansi Sasaran</span>
              <p className="font-display font-black text-lg text-slate-900">SDN 32 Rantau Bayur</p>
              <p className="text-xs text-slate-500 font-semibold">Kecamatan Rantau Bayur, Kabupaten Banyuasin, Sumatera Selatan</p>
            </div>

            <div className="pt-2 border-t border-slate-200 text-xs text-slate-600 leading-relaxed">
              Memadukan kurikulum nasional dan kearifan lokal Banyuasin (ikan patin, hamparan padi, perairan Sungai Musi, dan gotong royong warga).
            </div>
          </div>
        </div>
      </div>

      {/* Pedagogical Guide: Pembelajaran Berdiferensiasi */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-amber-200/80 shadow-xs space-y-5">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-indigo-700 font-bold text-xs uppercase tracking-wider">
            <Layers className="w-4 h-4 text-indigo-600" />
            <span>Pendekatan Pedagogis Guru</span>
          </div>
          <h2 className="font-display font-extrabold text-xl text-slate-900">
            Panduan Pembelajaran Berdiferensiasi di Kelas Rendah
          </h2>
          <p className="text-xs text-slate-500">
            CERIA CLASS menyediakan tiga tingkat kesiapan belajar agar setiap siswa dapat bertumbuh sesuai kecepatannya tanpa pelabelan negatif:
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          
          <div className="bg-amber-50/70 p-5 rounded-2xl border border-amber-200 space-y-2">
            <div className="font-display font-black text-sm text-amber-950 flex items-center gap-1.5">
              <span className="w-6 h-6 rounded-lg bg-amber-400 text-amber-950 flex items-center justify-center font-bold text-xs">1</span>
              <span>Mulai Belajar (Tier 1)</span>
            </div>
            <p className="text-slate-700 leading-relaxed">
              Ditujukan bagi siswa yang memerlukan perancah (scaffolding) visual kuat. Menampilkan huruf, lambang angka, gambar/emoji konkret, dan petunjuk eksplisit ramah.
            </p>
          </div>

          <div className="bg-sky-50/70 p-5 rounded-2xl border border-sky-200 space-y-2">
            <div className="font-display font-black text-sm text-sky-950 flex items-center gap-1.5">
              <span className="w-6 h-6 rounded-lg bg-sky-500 text-white flex items-center justify-center font-bold text-xs">2</span>
              <span>Sedang Berkembang (Tier 2)</span>
            </div>
            <p className="text-slate-700 leading-relaxed">
              Untuk siswa yang mulai lancar merangkai suku kata (ma-mi-mu, ka-ki-ku), membaca kata sederhana dua suku kata, dan berhitung operasi dasar sampai 20.
            </p>
          </div>

          <div className="bg-emerald-50/70 p-5 rounded-2xl border border-emerald-200 space-y-2">
            <div className="font-display font-black text-sm text-emerald-950 flex items-center gap-1.5">
              <span className="w-6 h-6 rounded-lg bg-emerald-500 text-white flex items-center justify-center font-bold text-xs">3</span>
              <span>Tantangan (Tier 3)</span>
            </div>
            <p className="text-slate-700 leading-relaxed">
              Tantangan pengayaan dengan kalimat sederhana terstruktur (SPO) dan pemecahan masalah soal cerita kontekstual lingkungan Banyuasin.
            </p>
          </div>

        </div>
      </div>

      {/* Classroom Setup Guide: Mode Proyektor & Mode Kelompok */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-amber-200/80 shadow-xs space-y-5">
        <h2 className="font-display font-extrabold text-xl text-slate-900 flex items-center gap-2">
          <Projector className="w-5 h-5 text-sky-600" />
          <span>Panduan Penggunaan Proyektor & Mode Kelompok di Kelas</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-slate-700 leading-relaxed">
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
            <strong className="font-bold text-slate-900 block text-sm">Mode Proyektor (Layar Besar):</strong>
            <p>
              Cukup hubungkan laptop guru ke proyektor infokus di depan kelas dan tekan tombol <strong>Proyektor: ON</strong> di bilah atas. Antarmuka akan secara otomatis memperbesar elemen visual, font soal, dan tombol pilihan agar terlihat jelas oleh seluruh siswa di barisan belakang sekalipun.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
            <strong className="font-bold text-slate-900 block text-sm">Mode Kelompok (Kerja Sama Tim):</strong>
            <p>
              Tidak semua siswa memerlukan gawai sendiri. Guru dapat membagi kelas menjadi 2-4 tim (Kelompok Patin, Padi, Rajawali, Harimau). Sistem akan mengatur giliran menjawab dan menghitung poin secara adil dengan suasana yang sportif dan saling menyemangati.
            </p>
          </div>
        </div>
      </div>

      {/* Privacy & Offline Guarantee */}
      <div className="bg-emerald-50 border-2 border-emerald-200 p-6 rounded-3xl flex items-start gap-4 text-xs text-emerald-950">
        <ShieldCheck className="w-7 h-7 text-emerald-600 shrink-0 mt-1" />
        <div className="space-y-1.5">
          <h3 className="font-display font-black text-base text-emerald-900">
            Jaminan Privasi & Operasional 100% Offline
          </h3>
          <p className="leading-relaxed text-emerald-800">
            Aplikasi CERIA CLASS beroperasi secara penuh di peramban tanpa kewajiban koneksi internet untuk fitur inti permainan dan pembuat game. Seluruh data nama siswa dan riwayat hasil belajar tersimpan aman di penyimpanan lokal (localStorage) laptop/komputer sekolah. Tidak ada iklan, tidak ada pelacak, dan tidak ada data pribadi anak yang diunggah ke server pihak ketiga.
          </p>
        </div>
      </div>

    </div>
  );
};
