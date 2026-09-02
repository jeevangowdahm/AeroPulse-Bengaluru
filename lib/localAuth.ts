'use client';

export interface UserProfile {
  id: string;
  email: string;
  fullName: string;
  avatarUrl?: string;
  createdAt: string;
  authProvider: 'email' | 'google';
}

const STORAGE_KEY = 'aeropulse_user_session';
const USERS_DB_KEY = 'aeropulse_registered_users';

export const localAuth = {
  // Get active session
  getSession(): UserProfile | null {
    if (typeof window === 'undefined') return null;
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  },

  // Register user
  register(email: string, fullName: string, password?: string): UserProfile {
    const userId = `usr_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`;
    const user: UserProfile = {
      id: userId,
      email,
      fullName: fullName || email.split('@')[0],
      createdAt: new Date().toISOString(),
      authProvider: 'email',
      avatarUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(fullName || email)}`
    };

    if (typeof window !== 'undefined') {
      const existing = localStorage.getItem(USERS_DB_KEY);
      const usersMap = existing ? JSON.parse(existing) : {};
      usersMap[email.toLowerCase()] = { ...user, passwordHash: password };
      localStorage.setItem(USERS_DB_KEY, JSON.stringify(usersMap));
      localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
    }

    return user;
  },

  // Login user
  login(email: string, password?: string): UserProfile {
    if (typeof window === 'undefined') {
      throw new Error('Browser environment required');
    }

    const existing = localStorage.getItem(USERS_DB_KEY);
    const usersMap = existing ? JSON.parse(existing) : {};
    const storedUser = usersMap[email.toLowerCase()];

    if (storedUser) {
      const userProfile: UserProfile = {
        id: storedUser.id,
        email: storedUser.email,
        fullName: storedUser.fullName,
        createdAt: storedUser.createdAt,
        authProvider: storedUser.authProvider || 'email',
        avatarUrl: storedUser.avatarUrl
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(userProfile));
      return userProfile;
    }

    return this.register(email, email.split('@')[0], password);
  },

  // Login with Google Account
  loginWithGoogle(email: string, fullName: string, googleId?: string): UserProfile {
    const userId = googleId || `goog_${Date.now()}`;
    const user: UserProfile = {
      id: userId,
      email,
      fullName: fullName || email.split('@')[0],
      createdAt: new Date().toISOString(),
      authProvider: 'google',
      avatarUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(email)}`
    };

    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
    }

    return user;
  },

  // Logout
  logout(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(STORAGE_KEY);
    }
  }
};
