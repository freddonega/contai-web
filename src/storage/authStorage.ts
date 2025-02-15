import { create } from "zustand";
import { User } from "@/types/user";

interface AuthState {
  token: string | null;
  user: User | null;
  setAuth: (token: string, user: User) => void;
  logout: () => void;
}

const localStorageTokenKey = "authToken";
const localStorageUserKey = "authUser";

export const useAuthStore = create<AuthState>((set) => ({
  token: localStorage.getItem(localStorageTokenKey),
  user: JSON.parse(localStorage.getItem(localStorageUserKey) || "null"),
  setAuth: (token: string, user: User) => {
    localStorage.setItem(localStorageTokenKey, token);
    localStorage.setItem(localStorageUserKey, JSON.stringify(user));
    set({ token, user });
  },
  logout: () => {
    localStorage.removeItem(localStorageTokenKey);
    localStorage.removeItem(localStorageUserKey);
    set({ token: null, user: null });
  },
}));
