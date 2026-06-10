import React, { useState, useEffect } from 'react';
import { Lock, Loader2, CheckCircle2, ShieldAlert } from 'lucide-react';

export const ResetPassword: React.FC = () => {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [token, setToken] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    // Native browser search parameter extraction loops
    const queryParams = new URLSearchParams(window.location.search);
    const urlToken = queryParams.get('token');
    setToken(urlToken);
  }, []);

  const handlePasswordResetSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!token) {
      setError('Verification token key missing. Re-open link directly from your email.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    if (newPassword.length < 8) {
      setError('Password must contain at least 8 alphanumeric characters.');
      return;
    }

    setSubmitting(true);

    try {
      const response = await fetch(`${API_BASE_URL}/auth/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, newPassword })
      });

      const result = await response.json();

      if (result.success) {
        setSuccess(true);
      } else {
        setError(result.message || 'Token verification lifecycle has expired.');
      }
    } catch (err) {
      setError('Failed to reach password modification gateway clusters.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-zinc-100 flex items-center justify-center p-4 font-sans">
      <div className="w-full max-w-md bg-white border border-zinc-200 rounded-2xl shadow-xl p-8 space-y-6 text-xs">
        
        <div className="text-center space-y-2">
          <h1 className="text-xl font-bold text-zinc-950 tracking-tight">Establish New Password</h1>
          <p className="text-zinc-400 font-medium text-[11px]">Update your credentials to restore normal account access.</p>
        </div>

        {error && <div className="p-3 bg-red-50 border border-red-100 text-red-600 font-medium rounded-xl">{error}</div>}

        {success ? (
          <div className="text-center p-4 space-y-4">
            <div className="flex justify-center text-green-600"><CheckCircle2 size={44} /></div>
            <div className="space-y-1">
              <p className="font-bold text-zinc-900 text-sm">Security Handshake Complete!</p>
              <p className="text-zinc-400 font-medium">Your new password configuration is live across database clusters.</p>
            </div>
            <button onClick={() => window.location.href = window.location.origin} className="mt-2 w-full py-2 bg-zinc-950 text-white font-bold rounded-xl hover:bg-zinc-800 transition-colors cursor-pointer">
              Return to Login Panel
            </button>
          </div>
        ) : !token ? (
          <div className="p-4 bg-amber-50 border border-amber-100 rounded-xl text-amber-800 font-medium leading-relaxed flex gap-2">
            <ShieldAlert size={16} className="shrink-0 mt-0.5" />
            <span>Invalid navigation path. Security tokens require explicit link configurations to load profile states.</span>
          </div>
        ) : (
          <form onSubmit={handlePasswordResetSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-zinc-600">Choose New Password</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-zinc-400"><Lock size={15} /></span>
                <input type="password" required value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder="Minimum 8 characters" className="w-full pl-9 pr-4 py-2 bg-zinc-50 border border-zinc-200 rounded-xl text-sm text-zinc-800 focus:outline-none focus:border-blue-500 transition-all" />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-zinc-600">Confirm Your Password</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-zinc-400"><Lock size={15} /></span>
                <input type="password" required value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="••••••••" className="w-full pl-9 pr-4 py-2 bg-zinc-50 border border-zinc-200 rounded-xl text-sm text-zinc-800 focus:outline-none focus:border-blue-500 transition-all" />
              </div>
            </div>

            <button type="submit" disabled={submitting} className="w-full py-2.5 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-md shadow-blue-500/10">
              {submitting ? <><Loader2 size={14} className="animate-spin" /> Syncing System Registry...</> : 'Update Credentials'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};