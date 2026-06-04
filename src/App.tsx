import { AuthProvider, useAuth } from './context/AuthContext';
import { AuthScreen } from './components/AuthScreen';
import { ChatWindow } from './components/ChatWindow';
import { LogOut } from 'lucide-react';

function Dashboard() {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen w-full bg-zinc-100 p-4 flex flex-col items-center justify-center relative">
      {/* Logout button at top right */}
      <button 
        onClick={logout}
        className="absolute top-4 right-4 px-3 py-1.5 bg-white border border-zinc-200 text-zinc-600 text-xs font-medium rounded-xl hover:bg-zinc-50 flex items-center gap-1.5 cursor-pointer shadow-xs"
      >
        <LogOut size={14} />
        Log out ({user?.name || user?.email})
      </button>

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
  return (
    <AuthProvider>
      <MainAppContent />
    </AuthProvider>
  );
}

export default App;