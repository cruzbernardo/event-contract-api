import { create } from 'zustand';

type UserData = { id: string; name: string; role?: 'planner' | 'client' | 'admin' };

type AuthState = {
  token: string | null;
  user: UserData | null;
  setAuth: (token: string, user: UserData) => void;
  clear: () => void;
};

const persisted = (() => {
  try {
    const data = JSON.parse(localStorage.getItem('auth') || 'null');
    return data as { token: string; user: UserData } | null;
  } catch {
    return null;
  }
})();

export const useAuthStore = create<AuthState>((set) => ({
  token: persisted?.token ?? null,
  user: persisted?.user ?? null,
  setAuth: (token, user) => {
    localStorage.setItem('auth', JSON.stringify({ token, user }));
    set({ token, user });
  },
  clear: () => {
    localStorage.removeItem('auth');
    set({ token: null, user: null });
  },
}));


