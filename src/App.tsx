import { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { AuthScreen } from './components/AuthScreen';
import { ChatWindow } from './components/ChatWindow';
import { PasswordSettings } from './components/PasswordSettings';
import { LogOut, Settings, ShieldCheck } from 'lucide-react'; // Removed Terminal since we're using your SVG
import { GoogleOAuthProvider } from '@react-oauth/google';

// ➕ Clean Reusable Logo Component made from your custom SVG
const BrandLogo = () => (
  <svg 
    version="1.1" 
    id="Layer_1" 
    xmlns="http://www.w3.org/2000/svg" 
    xmlnsXlink="http://www.w3.org/1999/xlink" 
    x="0px" 
    y="0px"
    viewBox="0 0 512 512" 
    xmlSpace="preserve"
    className="w-5 h-5" // Clean sizing control via Tailwind
  >
    <rect y="13.815" fill="#E21B1B" width="128.191" height="493.69" />
    <rect y="150.016" fill="#1A1718" width="128.181" height="16" />
    <rect x="172.235" y="13.815" fill="#E21B1B" width="128.191" height="493.69" />
    <rect x="172.225" y="150.016" fill="#1A1718" width="128.181" height="16" />
    <polygon points="512,496.24 384.32,507.503 340.168,15.759 467.849,4.495 " />
    <rect 
      x="352.825" 
      y="145.778" 
      transform="matrix(0.9961 -0.0879 0.0879 0.9961 -11.9036 37.2426)" 
      fill="#E81241" 
      width="128.167" 
      height="16" 
    />
  </svg>
);

function Dashboard() {
  const { user, logout } = useAuth();
  const [showSettings, setShowSettings] = useState(false);

  return (
    <div className="min-h-screen w-full bg-zinc-50 flex flex-col justify-between font-sans text-zinc-900 antialiased">
      
      {/* 🧭 1. APPLICATION TOP NAVIGATION HEADER BAR */}
      <nav className="w-full bg-white border-b border-zinc-200/80 px-6 py-3.5 flex flex-col sm:flex-row justify-between items-center gap-4 sticky top-0 z-40 shadow-xs">
        {/* Brand Logo & State Indicator Group */}
        <div className="flex items-center gap-3">
          {/* ✨ Replaced Terminal block container with your customized corporate logo vector tag */}
          <div className="p-1.5 bg-zinc-50 border border-zinc-200/60 rounded-xl shadow-2xs shrink-0 flex items-center justify-center">
            <BrandLogo />
          </div>
          <div>
            <span className="font-bold text-sm text-zinc-950 tracking-tight block">InsightDesk</span>
            <span className="text-[10px] text-zinc-400 font-medium font-mono uppercase tracking-wider">
              Workspace Engine
            </span>
          </div>
        </div>

        {/* User Workspace Actions & Controls Area */}
        <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
          {/* Active Session Identity Metadata Tag */}
          <div className="hidden md:flex items-center gap-1.5 px-2.5 py-1.5 bg-zinc-100 rounded-xl text-[11px] font-medium text-zinc-600">
            <ShieldCheck size={13} className="text-emerald-600" />
            <span className="truncate max-w-[150px]">{user?.name || user?.email}</span>
          </div>

          {/* Security Action Toggle */}
          <button 
            onClick={() => setShowSettings(true)}
            className="px-3 py-1.5 bg-white border border-zinc-200 hover:bg-zinc-50 text-zinc-600 text-xs font-semibold rounded-xl flex items-center gap-1.5 cursor-pointer shadow-2xs transition-all"
          >
            <Settings size={14} />
            Security
          </button>

          {/* Session Destruction Trigger */}
          <button 
            onClick={logout}
            className="px-3 py-1.5 bg-red-50 border border-red-100 hover:bg-red-100 text-red-600 text-xs font-bold rounded-xl flex items-center gap-1.5 cursor-pointer transition-all"
          >
            <LogOut size={14} />
            Exit Session
          </button>
        </div>
      </nav>

      {/* 💬 2. MAIN CENTER CONTEXT WORKSPACE PLAYGROUND */}
      <main className="flex-1 w-full max-w-4xl mx-auto p-4 md:p-6 flex items-center justify-center">
        <ChatWindow userId={user?.id || ''} />
      </main>

      {/* 📊 3. CENTRALIZED APPLICATION BASE FOOTER LEDGER */}
      <footer className="w-full bg-white border-t border-zinc-200/60 px-6 py-3.5 text-[11px] font-medium text-zinc-400 flex flex-col sm:flex-row justify-between items-center gap-2">
        <div className="flex items-center gap-2">
          <span>&copy; {new Date().getFullYear()} InsightDesk Core Node.</span>
          <span className="text-zinc-200">|</span>
          <span className="text-zinc-500 font-semibold">Vercel &times; Render Continuous Delivery Bundle</span>
        </div>
        <div className="flex items-center gap-4 font-mono text-[10px] text-zinc-400 font-bold">
          <span className="flex items-center gap-1">
            <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></span> AWS S3 Pipeline Connected
          </span>
          <span>SYSTEM RUNTIME: V1.1.0</span>
        </div>
      </footer>

      {/* SECURITY CONTROLS DIALOG MODAL FRAME */}
      {showSettings && (
        <div className="fixed inset-0 bg-zinc-950/40 backdrop-blur-xs flex items-center justify-center z-50 p-4 animate-in fade-in duration-150">
          <div className="absolute inset-0" onClick={() => setShowSettings(false)}></div>
          <div className="relative w-full max-w-md z-10 animate-in zoom-in-95 duration-150">
            <button 
              onClick={() => setShowSettings(false)}
              className="absolute top-5 right-5 text-zinc-400 hover:text-zinc-600 font-bold transition-colors cursor-pointer text-xs z-20"
            >
              ✕
            </button>
            <PasswordSettings />
          </div>
        </div>
      )}

    </div>
  );
}

function MainAppContent() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-zinc-100 text-zinc-500 font-medium text-sm">
        Verifying session...
      </div>
    );
  }

  return isAuthenticated ? <Dashboard /> : <AuthScreen />;
}

function App() {
  const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID || '';

  return (
    <GoogleOAuthProvider clientId={googleClientId}>
      <AuthProvider>
        <MainAppContent />
      </AuthProvider>
    </GoogleOAuthProvider>
  );
}

export default App;