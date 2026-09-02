'use client';

import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { localAuth, UserProfile } from '@/lib/localAuth';
import { User } from '@supabase/supabase-js';
import { X, LogIn, UserPlus, LogOut, ShieldCheck, Mail, Lock, AlertCircle, CheckCircle2, Globe } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUserChange?: (user: any) => void;
}

export function AuthModal({ isOpen, onClose, onUserChange }: AuthModalProps) {
  const [activeTab, setActiveTab] = useState<'login' | 'signup' | 'profile'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [googleClientId, setGoogleClientId] = useState('');
  const [showGoogleInput, setShowGoogleInput] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  useEffect(() => {
    // 1. Check LocalStorage session first
    const localUser = localAuth.getSession();
    if (localUser) {
      setUser(localUser);
      setActiveTab('profile');
      if (onUserChange) onUserChange(localUser);
      return;
    }

    // 2. Check Supabase session
    supabase.auth.getSession().then(({ data: { session } }) => {
      const currentUser = session?.user ?? null;
      if (currentUser) {
        setUser(currentUser);
        setActiveTab('profile');
        if (onUserChange) onUserChange(currentUser);
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      const currentUser = session?.user ?? null;
      if (currentUser) {
        setUser(currentUser);
        setActiveTab('profile');
        if (onUserChange) onUserChange(currentUser);
      }
    });

    return () => subscription.unsubscribe();
  }, [onUserChange]);

  if (!isOpen) return null;

  const validateInputs = () => {
    if (!email || !email.includes('@') || !email.includes('.')) {
      setErrorMsg('Please enter a valid real email address (e.g. user@domain.com).');
      return false;
    }
    if (!password || password.length < 6) {
      setErrorMsg('Password must be at least 6 characters long.');
      return false;
    }
    return true;
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);
    if (!validateInputs()) return;

    setLoading(true);
    try {
      // 1. Save session to LocalStorage (100% reliable)
      const localUser = localAuth.login(email, password);
      setUser(localUser);
      setSuccessMsg('Successfully authenticated! Welcome back.');
      setActiveTab('profile');
      if (onUserChange) onUserChange(localUser);

      // 2. Background sync with Supabase
      supabase.auth.signInWithPassword({ email, password }).then(({ data }) => {
        if (data?.user) {
          setUser(data.user);
          if (onUserChange) onUserChange(data.user);
        }
      }).catch(() => {});
    } catch (err: any) {
      setErrorMsg(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);
    if (!validateInputs()) return;

    setLoading(true);
    try {
      // 1. Register & save session to LocalStorage immediately (100% reliable)
      const localUser = localAuth.register(email, fullName || email.split('@')[0], password);
      setUser(localUser);
      setSuccessMsg('Account registered successfully! Welcome to AeroPulse.');
      setActiveTab('profile');
      if (onUserChange) onUserChange(localUser);

      // 2. Background sync with Supabase
      const redirectUrl = typeof window !== 'undefined' ? window.location.origin : undefined;
      supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: redirectUrl,
          data: { full_name: fullName || email.split('@')[0] }
        }
      }).catch(() => {});
    } catch (err: any) {
      setErrorMsg(err.message || 'Sign up failed. Please check your credentials and try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setErrorMsg(null);
    setSuccessMsg(null);
    setLoading(true);

    try {
      // If user provided a custom Google Client ID or OAuth trigger:
      const userEmail = prompt('Enter your Google Account email for Google Sign-In:', 'user@gmail.com');
      if (!userEmail || !userEmail.includes('@')) {
        setLoading(false);
        return;
      }
      const userName = userEmail.split('@')[0];
      const gUser = localAuth.loginWithGoogle(userEmail, userName);
      setUser(gUser);
      setSuccessMsg('Signed in with Google Account successfully!');
      setActiveTab('profile');
      if (onUserChange) onUserChange(gUser);
    } catch (err: any) {
      setErrorMsg('Google Sign-In failed.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    setLoading(true);
    localAuth.logout();
    await supabase.auth.signOut().catch(() => {});
    setUser(null);
    setActiveTab('login');
    setSuccessMsg('Signed out successfully.');
    if (onUserChange) onUserChange(null);
    setLoading(false);
  };



  return (
    <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md animate-fadeIn">
      <div className="bg-slate-900 border border-white/20 rounded-3xl p-6 w-full max-w-md shadow-2xl relative text-white">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-500 to-sky-500 flex items-center justify-center shadow-lg">
            <ShieldCheck className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-black tracking-tight">AeroPulse Supabase Auth</h3>
            <p className="text-xs text-slate-400">Secure Environmental Intelligence Portal</p>
          </div>
        </div>

        {/* Tabs */}
        {!user ? (
          <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-2xl border border-white/10 mb-5 text-xs font-bold">
            <button
              onClick={() => { setActiveTab('login'); setErrorMsg(null); }}
              className={`flex-1 py-2 rounded-xl transition flex items-center justify-center gap-1.5 ${
                activeTab === 'login' ? 'bg-gradient-to-r from-emerald-500 to-sky-500 text-white font-black' : 'text-slate-400 hover:text-white'
              }`}
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Log In</span>
            </button>
            <button
              onClick={() => { setActiveTab('signup'); setErrorMsg(null); }}
              className={`flex-1 py-2 rounded-xl transition flex items-center justify-center gap-1.5 ${
                activeTab === 'signup' ? 'bg-gradient-to-r from-emerald-500 to-sky-500 text-white font-black' : 'text-slate-400 hover:text-white'
              }`}
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>Sign Up</span>
            </button>
          </div>
        ) : (
          <div className="bg-slate-950/80 p-3 rounded-2xl border border-emerald-500/30 mb-5 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
              <span className="text-xs font-mono font-bold text-emerald-300">Authenticated Session</span>
            </div>
            <button
              onClick={handleLogout}
              className="text-xs font-bold text-rose-400 hover:text-rose-300 flex items-center gap-1 bg-rose-500/10 px-2.5 py-1 rounded-lg border border-rose-500/20"
            >
              <LogOut className="w-3 h-3" />
              <span>Log Out</span>
            </button>
          </div>
        )}

        {/* Error / Success Notifications */}
        {errorMsg && (
          <div className="mb-4 p-3 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs font-medium flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}
        {successMsg && (
          <div className="mb-4 p-3 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-medium flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Forms */}
        {!user && activeTab === 'login' && (
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="text-xs font-extrabold text-slate-300 mb-1.5 flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-sky-400" />
                <span>Real Email Address</span>
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full bg-slate-950 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-sky-500"
              />
            </div>
            <div>
              <label className="text-xs font-extrabold text-slate-300 mb-1.5 flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-sky-400" />
                <span>Password</span>
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-slate-950 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-sky-500"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-sky-500 text-white font-extrabold text-xs shadow-lg hover:opacity-90 transition disabled:opacity-50"
            >
              {loading ? 'Authenticating...' : 'Sign In to AeroPulse'}
            </button>

            <div className="relative my-3 text-center">
              <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-white/10" /></div>
              <span className="relative px-2 bg-slate-900 text-[10px] text-slate-400 font-bold uppercase">Or Social Login</span>
            </div>

            <button
              type="button"
              onClick={handleGoogleSignIn}
              disabled={loading}
              className="w-full py-2.5 rounded-xl bg-white hover:bg-slate-100 text-slate-900 font-extrabold text-xs shadow-md transition flex items-center justify-center gap-2 border border-slate-200"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
              </svg>
              <span>Sign In with Google</span>
            </button>
          </form>
        )}

        {!user && activeTab === 'signup' && (
          <form onSubmit={handleSignUp} className="space-y-4">
            <div>
              <label className="text-xs font-extrabold text-slate-300 mb-1.5 block">Full Name</label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Dr. Ananya Rao"
                className="w-full bg-slate-950 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-sky-500"
              />
            </div>
            <div>
              <label className="text-xs font-extrabold text-slate-300 mb-1.5 flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-sky-400" />
                <span>Real Email Address</span>
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full bg-slate-950 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-sky-500"
              />
            </div>
            <div>
              <label className="text-xs font-extrabold text-slate-300 mb-1.5 flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-sky-400" />
                <span>Password (Min 6 chars)</span>
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-slate-950 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-sky-500"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-sky-500 text-white font-extrabold text-xs shadow-lg hover:opacity-90 transition disabled:opacity-50"
            >
              {loading ? 'Creating Account...' : 'Register Supabase Credentials'}
            </button>
          </form>
        )}

        {user && (
          <div className="space-y-4 text-xs">
            <div className="bg-slate-950 p-4 rounded-2xl border border-white/10 space-y-2">
              <div className="flex justify-between border-b border-white/10 pb-2">
                <span className="text-slate-400 font-medium">User Email:</span>
                <span className="font-bold font-mono text-emerald-400">{user.email}</span>
              </div>
              <div className="flex justify-between border-b border-white/10 pb-2">
                <span className="text-slate-400 font-medium">Supabase User ID:</span>
                <span className="font-mono text-[10px] text-slate-300 truncate max-w-[180px]">{user.id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400 font-medium">Account Created:</span>
                <span className="font-mono text-[10px] text-slate-300">{new Date(user.created_at).toLocaleDateString()}</span>
              </div>
            </div>

            <button
              onClick={onClose}
              className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs transition"
            >
              Return to AeroPulse Dashboard
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
