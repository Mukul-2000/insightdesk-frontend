import { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { PasswordSettings } from '../components/PasswordSettings';
import { LogOut, Settings, ShieldCheck, MessageSquare, Sparkles } from 'lucide-react';

const BrandLogo = () => (
  <svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 512 512" xmlSpace="preserve" className="w-5 h-5">
    <rect y="13.815" fill="#E21B1B" width="128.191" height="493.69" />
    <rect y="150.016" fill="#1A1718" width="128.181" height="16" />
    <rect x="172.235" y="13.815" fill="#E21B1B" width="128.191" height="493.69" />
    <rect x="172.225" y="150.016" fill="#1A1718" width="128.181" height="16" />
    <polygon points="512,496.24 384.32,507.503 340.168,15.759 467.849,4.495 " />
    <rect x="352.825" y="145.778" transform="matrix(0.9961 -0.0879 0.0879 0.9961 -11.9036 37.2426)" fill="#E81241" width="128.167" height="16" />
  </svg>
);

export default function DashboardLayout() {
  const { user, logout } = useAuth();
  const [showSettings, setShowSettings] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <div className="min-h-screen w-full bg-zinc-50 flex flex-col justify-between font-sans text-zinc-900 antialiased">
      <nav className="w-full bg-white border-b border-zinc-200/80 px-6 py-3.5 flex flex-col sm:flex-row justify-between items-center gap-4 sticky top-0 z-40 shadow-xs">
        
        {/* Brand/Identity Segment */}
        <div className="flex items-center gap-3 cursor-pointer select-none shrink-0" onClick={() => navigate('/')}>
          <div className="p-1.5 bg-zinc-50 border border-zinc-200/60 rounded-xl shadow-2xs flex items-center justify-center">
            <BrandLogo />
          </div>
          <div>
            <span className="font-bold text-sm text-zinc-950 tracking-tight block">InsightDesk</span>
            <span className="text-[10px] text-zinc-400 font-medium font-mono uppercase tracking-wider">Workspace Engine</span>
          </div>
        </div>

        {/* ✨ ACTIVE NAVIGATION ENGINE: Swaps active routes with style */}
        <div className="flex items-center gap-1 bg-zinc-100 p-1 rounded-xl border border-zinc-200/40">
          <button 
            onClick={() => navigate('/')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
              location.pathname === '/' 
                ? 'bg-white text-zinc-950 shadow-2xs font-bold' 
                : 'text-zinc-500 hover:text-zinc-800'
            }`}
          >
            <MessageSquare size={13} /> AI Assistant
          </button>
          <button 
            onClick={() => navigate('/studio')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
              location.pathname === '/studio' 
                ? 'bg-white text-zinc-950 shadow-2xs font-bold' 
                : 'text-zinc-500 hover:text-zinc-800'
            }`}
          >
            <Sparkles size={13} className="text-indigo-500" /> Content Studio
          </button>
        </div>

        {/* Security & Action Items Segment */}
        <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
          <div className="hidden md:flex items-center gap-1.5 px-2.5 py-1.5 bg-zinc-100 rounded-xl text-[11px] font-medium text-zinc-600">
            <ShieldCheck size={13} className="text-emerald-600" />
            <span className="truncate max-w-[150px]">{user?.name || user?.email}</span>
          </div>
          <button onClick={() => setShowSettings(true)} className="px-3 py-1.5 bg-white border border-zinc-200 hover:bg-zinc-50 text-zinc-600 text-xs font-semibold rounded-xl flex items-center gap-1.5 cursor-pointer shadow-2xs transition-all"><Settings size={14} />Security</button>
          <button onClick={logout} className="px-3 py-1.5 bg-red-50 border border-red-100 hover:bg-red-100 text-red-600 text-xs font-bold rounded-xl flex items-center gap-1.5 cursor-pointer transition-all"><LogOut size={14} />Exit Session</button>
        </div>
      </nav>

      {/* 🚀 THE RUNTIME INJECTION WORKSPACE WINDOW */}
      <main className="flex-1 w-full max-w-7xl mx-auto p-4 md:p-6 flex items-center justify-center">
        <Outlet /> 
      </main>

      <footer className="w-full bg-white border-t border-zinc-200/60 px-6 py-3.5 text-[11px] font-medium text-zinc-400 flex flex-col sm:flex-row justify-between items-center gap-2">
        <div className="flex items-center gap-2 flex-wrap justify-center sm:justify-start">
          <span>&copy; {new Date().getFullYear()} InsightDesk Core Node.</span>
          <span className="text-zinc-200">|</span>
          <span className="text-zinc-500">Developed by <a href="https://mukulsindhu.netlify.app/" target="_blank" rel="noopener noreferrer" className="text-zinc-700 font-bold hover:text-blue-600 transition-colors underline decoration-zinc-300 decoration-dashed underline-offset-4 cursor-pointer">Mukul Sindhu</a></span>
        </div>
        <div className="flex items-center gap-4 font-mono text-[10px] text-zinc-400 font-bold">
          <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span> AWS S3 Pipeline Connected</span>
          <span>SYSTEM RUNTIME: V1.1.0</span>
        </div>
      </footer>

      {showSettings && (
        <div className="fixed inset-0 bg-zinc-950/40 backdrop-blur-xs flex items-center justify-center z-50 p-4 animate-in fade-in duration-150">
          <div className="absolute inset-0" onClick={() => setShowSettings(false)}></div>
          <div className="relative w-full max-w-md z-10 animate-in zoom-in-95 duration-150">
            <button onClick={() => setShowSettings(false)} className="absolute top-5 right-5 text-zinc-400 hover:text-zinc-600 font-bold transition-colors cursor-pointer text-xs z-20">✕</button>
            <PasswordSettings />
          </div>
        </div>
      )}
    </div>
  );
}