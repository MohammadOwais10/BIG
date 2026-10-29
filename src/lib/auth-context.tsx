"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { api, getAccessToken, setTokens, clearTokens, ApiError } from "./api";

export interface SessionUser {
  id: string;
  name: string;
  email: string;
  mobile: string;
  role: "ADMIN" | "USER";
  referralCode: string;
  status: string;
  avatarUrl?: string | null;
  hasWithdrawalPassword?: boolean;
  withdrawalPasswordSetAt?: string | null;
  withdrawalPasswordUnlockAt?: string | null;
}

interface AuthState {
  user: SessionUser | null;
  loading: boolean;
  login: (identifier: string, password: string) => Promise<SessionUser>;
  register: (body: {
    name: string;
    email: string;
    mobile: string;
    password: string;
    referralCode?: string;
  }) => Promise<any>;
  verifyEmail: (email: string, code: string) => Promise<SessionUser>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthState | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<SessionUser | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshUser = useCallback(async () => {
    if (!getAccessToken()) {
      setUser(null);
      setLoading(false);
      return;
    }
    try {
      const res = await api.me();
      setUser(res.data.user);
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshUser();
  }, [refreshUser]);

  const login = useCallback(async (identifier: string, password: string) => {
    const res = await api.login(identifier, password);
    setTokens(res.data.accessToken, res.data.refreshToken);
    const me = await api.me();
    setUser(me.data.user);
    return me.data.user as SessionUser;
  }, []);

  const register = useCallback(
    async (body: Parameters<AuthState["register"]>[0]) => {
      const payload = { ...body };
      if (!payload.referralCode) delete payload.referralCode;
      const res = await api.register(payload);
      // No tokens yet — user must verify the emailed OTP first
      return res.data;
    },
    [],
  );

  const verifyEmail = useCallback(async (email: string, code: string) => {
    const res = await api.verifyEmail(email, code);
    setTokens(res.data.accessToken, res.data.refreshToken);
    const me = await api.me();
    setUser(me.data.user);
    return me.data.user as SessionUser;
  }, []);

  const logout = useCallback(async () => {
    try {
      await api.logout();
    } catch (e) {
      if (!(e instanceof ApiError)) throw e;
    } finally {
      clearTokens();
      setUser(null);
    }
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, login, register, verifyEmail, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
