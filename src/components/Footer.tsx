import React from 'react';
import { Heart, Sparkles, School, Phone, ShieldCheck } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-white border-t border-amber-100/80 mt-16 text-slate-600">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
          
          {/* Identity & Tagline */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-amber-400 flex items-center justify-center text-amber-950 font-bold">
                <Sparkles className="w-4 h-4 fill-amber-900/20" />
              </div>
              <span className="font-display font-bold text-lg text-amber-950">
                CERIA CLASS
              </span>
            </div>
            <p className="text-xs text-amber-800 font-semibold">
              Cerdas, Interaktif, dan Asyik Belajar
            </p>
            <p className="text-xs text-slate-500 italic">
              "Belajar Seru, Guru Terbantu, Anak Ceria."
            </p>
          </div>

          {/* Pengembang & Instansi */}
          <div className="space-y-2 text-xs">
            <h4 className="font-bold text-slate-900 flex items-center gap-1.5">
              <School className="w-4 h-4 text-sky-600" />
              Sasaran & Pengembang
            </h4>
            <p className="text-slate-600">
              <strong className="text-slate-800">Pengembang:</strong> Dinda Noer Alita, S.Pd.
            </p>
            <p className="text-slate-600 flex items-center gap-1">
              <Phone className="w-3.5 h-3.5 text-emerald-600" />
              <strong className="text-slate-800">Kontak Guru/Pengembang:</strong> 085709770470
            </p>
            <p className="text-slate-600">
              <strong className="text-slate-800">Instansi Sasaran:</strong> SDN 32 Rantau Bayur, Banyuasin
            </p>
          </div>

          {/* Keamanan & Privasi Anak */}
          <div className="space-y-2 text-xs">
            <h4 className="font-bold text-slate-900 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              Privasi & Ramah Anak
            </h4>
            <p className="text-slate-500 leading-relaxed">
              Data aktivitas belajar disimpan langsung pada peramban perangkat sekolah (offline-ready). Tidak ada iklan, tidak ada pelacak, dan tidak mengumpulkan informasi pribadi sensitif anak.
            </p>
          </div>

        </div>

        <div className="border-t border-slate-100 mt-8 pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-2">
          <p>© 2026 CERIA CLASS — SDN 32 Rantau Bayur. Dibuat dengan penuh dedikasi untuk pendidikan dasar Indonesia.</p>
          <div className="flex items-center gap-1 text-rose-500">
            <span>Dirancang dengan</span>
            <Heart className="w-3.5 h-3.5 fill-rose-500" />
            <span>untuk anak Indonesia</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
