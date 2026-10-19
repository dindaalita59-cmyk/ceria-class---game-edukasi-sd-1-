import React, { useState } from 'react';
import { 
  Gamepad2, 
  LayoutDashboard, 
  PlusCircle, 
  Users, 
  BookOpen, 
  BarChart3, 
  Info, 
  Projector, 
  Volume2, 
  VolumeX, 
  Menu, 
  X,
  Sparkles
} from 'lucide-react';
import { NavigationTab, AppSettings } from '../types';

interface NavbarProps {
  activeTab: NavigationTab;
  onTabChange: (tab: NavigationTab) => void;
  settings: AppSettings;
  onUpdateSettings: (newSettings: Partial<AppSettings>) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  onTabChange,
  settings,
  onUpdateSettings,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { 
      id: 'dashboard' as NavigationTab, 
      label: 'Dashboard', 
      icon: LayoutDashboard, 
      activeClass: 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-md shadow-amber-200', 
      color: 'text-amber-500' 
    },
    { 
      id: 'play' as NavigationTab, 
      label: 'Play Games', 
      icon: Gamepad2, 
      activeClass: 'bg-gradient-to-r from-sky-500 to-blue-600 text-white shadow-md shadow-sky-200', 
      color: 'text-sky-500' 
    },
    { 
      id: 'game-maker' as NavigationTab, 
      label: 'Game Maker', 
      icon: PlusCircle, 
      activeClass: 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-md shadow-emerald-200', 
      color: 'text-emerald-500' 
    },
    { 
      id: 'students' as NavigationTab, 
      label: 'Kelas & Siswa', 
      icon: Users, 
      activeClass: 'bg-gradient-to-r from-purple-500 to-violet-600 text-white shadow-md shadow-purple-200', 
      color: 'text-purple-500' 
    },
    { 
      id: 'bank-materi' as NavigationTab, 
      label: 'Bank Materi', 
      icon: BookOpen, 
      activeClass: 'bg-gradient-to-r from-indigo-500 to-blue-600 text-white shadow-md shadow-indigo-200', 
      color: 'text-indigo-500' 
    },
    { 
      id: 'reports' as NavigationTab, 
      label: 'Laporan Hasil', 
      icon: BarChart3, 
      activeClass: 'bg-gradient-to-r from-rose-500 to-pink-600 text-white shadow-md shadow-rose-200', 
      color: 'text-rose-500' 
    },
    { 
      id: 'about' as NavigationTab, 
      label: 'Tentang Aplikasi', 
      icon: Info, 
      activeClass: 'bg-gradient-to-r from-teal-500 to-cyan-600 text-white shadow-md shadow-teal-200', 
      color: 'text-teal-500' 
    },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          
          {/* Logo & Identity with joyful rainbow letters */}
          <div 
            onClick={() => onTabChange('dashboard')}
            className="flex items-center gap-3 cursor-pointer group select-none"
          >
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-gradient-to-tr from-amber-400 via-rose-400 to-sky-400 flex items-center justify-center text-white shadow-md shadow-rose-200 group-hover:scale-105 transition-transform">
              <Sparkles className="w-6 h-6 text-white fill-white/30" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-display font-black text-xl sm:text-2xl tracking-tight">
                  <span className="text-rose-500">C</span>
                  <span className="text-amber-500">E</span>
                  <span className="text-emerald-500">R</span>
                  <span className="text-sky-500">I</span>
                  <span className="text-purple-600">A</span>
                  {' '}
                  <span className="bg-gradient-to-r from-sky-600 to-indigo-600 bg-clip-text text-transparent">CLASS</span>
                </span>
                <span className="hidden md:inline-flex text-[11px] font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-full border border-indigo-200">
                  SDN 32 Rantau Bayur
                </span>
              </div>
              <p className="text-[11px] sm:text-xs text-slate-500 font-medium line-clamp-1">
                Cerdas, Interaktif, dan Asyik Belajar
              </p>
            </div>
          </div>

          {/* Desktop Navigation with distinct vibrant active tabs */}
          <nav className="hidden xl:flex items-center gap-1.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onTabChange(item.id)}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-bold transition-all duration-150 ${
                    isActive
                      ? item.activeClass
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-white' : item.color}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Quick Settings & Mode Toggles */}
          <div className="flex items-center gap-2">
            
            {/* Mode Proyektor with vibrant Sky/Indigo styling */}
            <button
              onClick={() => onUpdateSettings({ projectorMode: !settings.projectorMode })}
              title="Toggle Mode Proyektor (Layar Besar di Kelas)"
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs sm:text-sm font-bold border transition-all ${
                settings.projectorMode
                  ? 'bg-gradient-to-r from-sky-600 to-indigo-600 text-white border-transparent shadow-md shadow-sky-200'
                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
              }`}
            >
              <Projector className="w-4 h-4" />
              <span className="hidden sm:inline">
                {settings.projectorMode ? 'Proyektor: ON' : 'Proyektor'}
              </span>
            </button>

            {/* Sound Toggle */}
            <button
              onClick={() => onUpdateSettings({ soundEnabled: !settings.soundEnabled })}
              title={settings.soundEnabled ? 'Matikan Suara Audio' : 'Nyalakan Suara Audio'}
              className={`p-2 rounded-xl border text-sm font-bold transition-all ${
                settings.soundEnabled 
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                  : 'bg-slate-100 text-slate-500 border-slate-200'
              }`}
            >
              {settings.soundEnabled ? <Volume2 className="w-4 h-4 text-emerald-600" /> : <VolumeX className="w-4 h-4 text-slate-400" />}
            </button>

            {/* Mobile Menu Trigger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="xl:hidden p-2 rounded-xl text-slate-700 hover:bg-slate-100 border border-slate-200"
              aria-label="Buka Menu Navigasi"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

          </div>

        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="xl:hidden bg-white border-b border-slate-200 px-4 pt-2 pb-6 shadow-xl animate-in fade-in slide-in-from-top-2 duration-150">
          <div className="grid grid-cols-2 gap-2 pt-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    onTabChange(item.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`flex items-center gap-2.5 px-3.5 py-3 rounded-xl text-xs sm:text-sm font-bold text-left transition-all ${
                    isActive
                      ? item.activeClass
                      : 'bg-slate-50 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-white' : item.color}`} />
                  <span className="truncate">{item.label}</span>
                </button>
              );
            })}
          </div>
          <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>SDN 32 Rantau Bayur</span>
            <span>Oleh: Dinda Noer Alita, S.Pd.</span>
          </div>
        </div>
      )}
    </header>
  );
};
