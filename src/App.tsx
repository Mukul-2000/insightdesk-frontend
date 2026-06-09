import { useState } from 'react'; // ➕ Import useState to manage the modal toggle state
import { AuthProvider, useAuth } from './context/AuthContext';
import { AuthScreen } from './components/AuthScreen';
import { ChatWindow } from './components/ChatWindow';
import { PasswordSettings } from './components/PasswordSettings'; // ➕ Import your new component
import { LogOut, Settings } from 'lucide-react'; // ➕ Import the Settings icon
import { GoogleOAuthProvider } from '@react-oauth/google';

function Dashboard() {
  const { user, logout } = useAuth();
  const [showSettings, setShowSettings] = useState(false); // ➕ State to track settings visibility

  return (
    <div className="min-h-screen w-full bg-zinc-100 p-4 flex flex-col items-center justify-center relative">
      
      {/* Top Right Actions Panel Bar */}
      <div className="absolute top-4 right-4 flex items-center gap-2">
        
        {/* ➕ Security Settings Modal Trigger Button */}
        <button 
          onClick={() => setShowSettings(true)}
          className="px-3 py-1.5 bg-white border border-zinc-200 text-zinc-600 text-xs font-medium rounded-xl hover:bg-zinc-50 flex items-center gap-1.5 cursor-pointer shadow-xs transition-colors"
        >
          <Settings size={14} />
          Account Security
        </button>

        <button 
          onClick={logout}
          className="px-3 py-1.5 bg-white border border-zinc-200 text-zinc-600 text-xs font-medium rounded-xl hover:bg-zinc-50 flex items-center gap-1.5 cursor-pointer shadow-xs"
        >
          <LogOut size={14} />
          Log out ({user?.name || user?.email})
        </button>
      </div>

      {/* ➕ CONTROL MODAL OVERLAY BACKDROP */}
      {showSettings && (
        <div className="fixed inset-0 bg-zinc-950/30 backdrop-blur-xs flex items-center justify-center z-50 p-4 animate-in fade-in duration-150">
          
          {/* Clickable dim background area to close out modal frames */}
          <div className="absolute inset-0" onClick={() => setShowSettings(false)}></div>
          
          {/* Modal Container Positioning Grid */}
          <div className="relative w-full max-w-md z-10 animate-in zoom-in-95 duration-150">
            {/* Quick X dismiss action button positioned over internal subcards */}
            <button 
              onClick={() => setShowSettings(false)}
              className="absolute top-5 right-5 text-zinc-400 hover:text-zinc-600 font-bold transition-colors cursor-pointer text-[10px] mono z-20"
              title="Close Panel"
            >
              ✕
            </button>
            
            {/* Renders your dynamically shifting password card form inside modal view limits */}
            <PasswordSettings />
          </div>
        </div>
      )}

      {/* Main Chat component powered by the active user's database ID */}
      <ChatWindow userId={user?.id || ''} />
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