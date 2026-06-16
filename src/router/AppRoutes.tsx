import { Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { AuthScreen } from '../components/AuthScreen';
import { ResetPassword } from '../components/ResetPassword';
import { ChatWindow } from '../components/ChatWindow';
import DashboardLayout from '../layouts/DashboardLayout';
import { StudioWorkspace } from '../components/StudioWorkspace';

/**
 * 🔒 Security Guard: Blocks unauthenticated sessions from entering the studio/chat
 */
const ProtectedRoute = () => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-zinc-100 text-zinc-500 font-medium text-sm">
        Verifying secure cloud session...
      </div>
    );
  }

  return isAuthenticated ? <Outlet /> : <Navigate to="/auth" replace />;
};

/**
 * 🔓 Public Guard: Diverts logged-in users away from auth login views back to the app
 */
const PublicOnlyRoute = () => {
  const { isAuthenticated } = useAuth();
  return !isAuthenticated ? <Outlet /> : <Navigate to="/" replace />;
};

export const AppRoutes = () => {
  const { user } = useAuth();

  return (
    <Routes>
      {/* 🛠️ 1. Free/Open Recovery Endpoint */}
      <Route path="/reset-password" element={<ResetPassword />} />

      {/* 🚪 2. Public Auth Gateway Check */}
      <Route element={<PublicOnlyRoute />}>
        <Route path="/auth" element={<AuthScreen />} />
      </Route>

      {/* 🛡️ 3. Private Multi-Engine Workspace Routes */}
      <Route element={<ProtectedRoute />}>
        <Route element={<DashboardLayout />}>
          {/* Base Workspace route defaults to standard Chat */}
          <Route path="/" element={<ChatWindow userId={user?.id || ''} />} />
          
          {/* ✨ New Studio workspace route mapping */}
          <Route path="/studio" element={<StudioWorkspace />} />
        </Route>
      </Route>

      {/* 🌐 4. Catch-all fallback navigation redirection */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
};