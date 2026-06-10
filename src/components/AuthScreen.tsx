import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Lock, Mail, User as UserIcon, Loader2, ArrowLeft } from 'lucide-react';
import { GoogleLogin } from '@react-oauth/google'; // ➕ Re-imported Google Login Button

export const AuthScreen: React.FC = () => {
  const { login, register } = useAuth();
  const [authMode, setAuthMode] = useState<'login' | 'register' | 'forgot'>('login');
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Form State
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api/v1';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);
    setSubmitting(true);

    try {
      if (authMode === 'login') {
        await login({ email, password });
      } else if (authMode === 'register') {
        await register({ name, email, password });
      } else {
        // 🔥 FORGOT PASSWORD API DISPATCH TO BREVO MAIL ENGINE
        const response = await fetch(`${API_BASE_URL}/auth/forgot-password`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email })
        });
        const result = await response.json();
        
        if (result.success) {
          setSuccessMsg('Recovery link dispatched! Check your Brevo connected inbox.');
          setEmail('');
        } else {
          setError(result.message || 'Failed to dispatch password recovery link.');
        }
      }
    } catch (err: any) {
      setError(err.message || 'Something went wrong. Please check your inputs.');
    } finally {
      setSubmitting(false);
    }
  };

  // ➕ Google Identity Token Handshake Callback Re-added
  const handleGoogleSuccess = async (credentialResponse: any) => {
    setError(null);
    setSuccessMsg(null);
    setSubmitting(true);

    try {
      const googleToken = credentialResponse.credential;

      const response = await fetch(`${API_BASE_URL}/auth/google`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: googleToken })
      });

      const result = await response.json();

      if (result.success) {
        localStorage.setItem('token', result.token);
        localStorage.setItem('user', JSON.stringify(result.user));
        
        // Reload page to let AuthContext capture the newly cached token safely
        window.location.reload();
      } else {
        setError(result.message || 'Google authorization handshake was rejected.');
      }
    } catch (err) {
      setError('Connection failure reaching verification infrastructure routes.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-100 px-4">
      <div className="w-full max-w-md bg-white border border-zinc-200 rounded-2xl shadow-xl p-8 space-y-6">
        
        {/* Header Content Blocks */}
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-bold text-zinc-900 tracking-tight">
            {authMode === 'login' && 'Welcome back'}
            {authMode === 'register' && 'Create an account'}
            {authMode === 'forgot' && 'Recover Credential Matrix'}
          </h1>
          <p className="text-sm text-zinc-500">
            {authMode === 'login' && 'Sign in to access your RAG dashboard'}
            {authMode === 'register' && 'Get started parsing documentation with AI'}
            {authMode === 'forgot' && 'Enter your email to receive an encryption security reset key link'}
          </p>
        </div>

        {error && <div className="p-3 bg-red-50 border border-red-100 text-red-600 text-xs rounded-lg font-medium">{error}</div>}
        {successMsg && <div className="p-3 bg-green-50 border border-green-100 text-green-700 text-xs rounded-lg font-medium">{successMsg}</div>}

        {/* Dynamic Form Controller */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {authMode === 'register' && (
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-zinc-600">Full Name</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-zinc-400"><UserIcon size={16} /></span>
                <input type="text" required value={name} onChange={(e) => setName(e.target.value)} placeholder="John Doe" className="w-full pl-10 pr-4 py-2 bg-zinc-50 border border-zinc-200 rounded-xl text-sm text-zinc-800 focus:outline-none focus:border-blue-500 transition-all" />
              </div>
            </div>
          )}

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-zinc-600">Email Address</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-zinc-400"><Mail size={16} /></span>
              <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" className="w-full pl-10 pr-4 py-2 bg-zinc-50 border border-zinc-200 rounded-xl text-sm text-zinc-800 focus:outline-none focus:border-blue-500 transition-all" />
            </div>
          </div>

          {authMode !== 'forgot' && (
            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <label className="text-xs font-semibold text-zinc-600">Password</label>
                {authMode === 'login' && (
                  <button type="button" onClick={() => { setAuthMode('forgot'); setError(null); setSuccessMsg(null); }} className="text-[11px] text-blue-600 hover:underline font-medium cursor-pointer">
                    Forgot Password?
                  </button>
                )}
              </div>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-zinc-400"><Lock size={16} /></span>
                <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" className="w-full pl-10 pr-4 py-2 bg-zinc-50 border border-zinc-200 rounded-xl text-sm text-zinc-800 focus:outline-none focus:border-blue-500 transition-all" />
              </div>
            </div>
          )}

          <button type="submit" disabled={submitting} className="w-full py-2.5 bg-blue-600 text-white font-medium text-sm rounded-xl hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 shadow-md disabled:opacity-70">
            {submitting ? <><Loader2 size={16} className="animate-spin" /> Processing...</> : authMode === 'login' ? 'Sign In' : authMode === 'register' ? 'Create Account' : 'Send Recovery Email'}
          </button>
        </form>

        {/* ➕ Re-added Premium Visual Divider & Google Sign-In Button Block */}
        {authMode !== 'forgot' && (
          <>
            <div className="relative flex py-2 items-center text-zinc-300">
              <div className="flex-grow border-t border-zinc-200"></div>
              <span className="flex-shrink mx-4 text-[10px] font-bold text-zinc-400 tracking-widest uppercase font-mono">Or continue with</span>
              <div className="flex-grow border-t border-zinc-200"></div>
            </div>

            <div className="w-full flex justify-center pb-2">
              <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={() => setError('Google popup sequence tracking closed or verification rejected.')}
                theme="outline"
                shape="circle"
                width="100%"
              />
            </div>
          </>
        )}

        {/* Footer Navigation Switches */}
        <div className="text-center pt-2">
          {authMode === 'forgot' ? (
            <button type="button" onClick={() => setAuthMode('login')} className="text-xs text-zinc-500 hover:text-zinc-800 font-semibold flex items-center justify-center gap-1.5 mx-auto cursor-pointer">
              <ArrowLeft size={13} /> Back to Sign In
            </button>
          ) : (
            <button type="button" onClick={() => { setAuthMode(authMode === 'login' ? 'register' : 'login'); setError(null); setSuccessMsg(null); }} className="text-xs text-blue-600 hover:underline font-medium cursor-pointer">
              {authMode === 'login' ? "Don't have an account? Sign up" : 'Already have an account? Sign in'}
            </button>
          )}
        </div>

      </div>
    </div>
  );
};