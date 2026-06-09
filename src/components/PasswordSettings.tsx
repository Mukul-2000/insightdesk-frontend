import React, { useState, useEffect } from 'react';
import { ShieldAlert, KeyRound, Loader2, CheckCircle2 } from 'lucide-react';

export const PasswordSettings: React.FC = () => {
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [isPasswordSet, setIsPasswordSet] = useState<boolean>(true);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<{ type: 'success' | 'error'; msg: string } | null>(null);

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    // Check if the cached account data explicitly lacks password credentials
    const cachedUser = localStorage.getItem('user');
    if (cachedUser) {
      const userObj = JSON.parse(cachedUser);
      // If user logs in via Google and hasn't initialized a password, tag state tracking flag
      if (userObj.isPasswordSet === false) {
        setIsPasswordSet(false);
      }
    }
  }, []);

  const handlePasswordUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setStatus(null);

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/auth/update-password`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ oldPassword, newPassword })
      });

      const result = await response.json();

      if (result.success) {
        setStatus({ type: 'success', msg: result.message });
        setOldPassword('');
        setNewPassword('');
        setIsPasswordSet(true);

        // Update local configuration state maps to remember they have a password now
        const cachedUser = localStorage.getItem('user');
        if (cachedUser) {
          const userObj = JSON.parse(cachedUser);
          userObj.isPasswordSet = true;
          localStorage.setItem('user', JSON.stringify(userObj));
        }
      } else {
        setStatus({ type: 'error', msg: result.message || 'Verification rejected.' });
      }
    } catch (err) {
      setStatus({ type: 'error', msg: 'Network link breakdown completing request mapping parameters.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md bg-white border border-zinc-200 rounded-2xl shadow-sm p-6 space-y-4 font-sans text-xs">
      <div className="flex items-center gap-2.5 border-b border-zinc-100 pb-3">
        <div className="p-1.5 bg-blue-50 text-blue-600 rounded-lg">
          <KeyRound size={16} />
        </div>
        <div>
          <h3 className="font-bold text-zinc-950 text-sm tracking-tight">
            {isPasswordSet ? 'Modify Credentials' : 'Set Account Password'}
          </h3>
          <p className="text-zinc-400 font-medium">
            {isPasswordSet ? 'Change your current app access password parameters.' : 'Establish custom parameters for standard authentication.'}
          </p>
        </div>
      </div>

      {!isPasswordSet && (
        <div className="p-3 bg-amber-50 border border-amber-100 rounded-xl text-amber-800 font-medium leading-relaxed flex gap-2.5">
          <ShieldAlert size={18} className="shrink-0 text-amber-600 mt-0.5" />
          <span><strong>Social Sync Detected:</strong> You are currently authenticated via Google OAuth. Set a custom password below if you wish to unlock standard direct email logins too.</span>
        </div>
      )}

      {status && (
        <div className={`p-3 border rounded-xl font-semibold flex gap-2 items-center ${
          status.type === 'success' ? 'bg-green-50 border-green-100 text-green-700' : 'bg-red-50 border-red-100 text-red-600'
        }`}>
          {status.type === 'success' && <CheckCircle2 size={14} className="text-green-600" />}
          <span>{status.msg}</span>
        </div>
      )}

      <form onSubmit={handlePasswordUpdate} className="space-y-3.5">
        {isPasswordSet && (
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-zinc-600">Current Password</label>
            <input
              type="password"
              required
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-3 py-2 bg-zinc-50 border border-zinc-200 rounded-xl text-zinc-800 placeholder-zinc-400 focus:outline-none focus:border-blue-500 transition-all"
            />
          </div>
        )}

        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-zinc-600">
            {isPasswordSet ? 'New Password' : 'Create Secure Password'}
          </label>
          <input
            type="password"
            required
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="Minimum 8 characters"
            className="w-full px-3 py-2 bg-zinc-50 border border-zinc-200 rounded-xl text-zinc-800 placeholder-zinc-400 focus:outline-none focus:border-blue-500 transition-all"
          />
        </div>

        <button
          type="submit"
          disabled={loading || !newPassword.trim()}
          className="w-full py-2.5 bg-zinc-950 text-white font-bold rounded-xl hover:bg-zinc-800 transition-all disabled:opacity-50 flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
        >
          {loading ? (
            <>
              <Loader2 size={14} className="animate-spin" />
              Updating System Hashes...
            </>
          ) : isPasswordSet ? (
            'Change Password'
          ) : (
            'Enable Hybrid Access'
          )}
        </button>
      </form>
    </div>
  );
};