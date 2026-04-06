"use client";

import React, {
  createContext,
  useState,
  useContext,
  useEffect,
  useCallback,
} from "react";

const AuthContext = createContext();

function emitAuthChanged() {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event("hs-auth-changed"));
  }
}

async function readJsonResponse(res) {
  const text = await res.text();
  if (!text) return null;
  try {
    return JSON.parse(text);
  } catch {
    return null;
  }
}

export const AuthProvider = ({ children, initialUser = null }) => {
  const [user, setUser] = useState(initialUser);
  const [isAuthenticated, setIsAuthenticated] = useState(Boolean(initialUser));
  const [isLoadingAuth, setIsLoadingAuth] = useState(!initialUser);

  const isAdmin = user?.role === "ADMIN";
  const isCustomer = user?.role === "CUSTOMER";

  const refreshUser = useCallback(async ({ silent = false } = {}) => {
    if (!silent) {
      setIsLoadingAuth(true);
    }
    try {
      const res = await fetch("/api/auth/me", { cache: "no-store" });
      if (!res.ok) throw new Error("Not authenticated");
      const data = await readJsonResponse(res);
      if (!data?.user) throw new Error("Not authenticated");
      setUser(data.user);
      setIsAuthenticated(true);
    } catch {
      setUser(null);
      setIsAuthenticated(false);
    } finally {
      if (!silent) {
        setIsLoadingAuth(false);
      }
    }
  }, []);

  // Check session on mount and keep auth state fresh.
  useEffect(() => {
    refreshUser();
  }, [refreshUser]);

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        refreshUser({ silent: true });
      }
    };

    const handleWindowFocus = () => {
      refreshUser({ silent: true });
    };

    const handleAuthChanged = () => {
      refreshUser({ silent: true });
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("focus", handleWindowFocus);
    window.addEventListener("hs-auth-changed", handleAuthChanged);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("focus", handleWindowFocus);
      window.removeEventListener("hs-auth-changed", handleAuthChanged);
    };
  }, [refreshUser]);

  const login = useCallback(async (email, password) => {
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const data = await readJsonResponse(res);
    if (!res.ok) throw new Error(data?.error || "Login failed");
    if (!data?.user) throw new Error("Login failed");
    setUser(data.user);
    setIsAuthenticated(true);
    emitAuthChanged();
    return data.user;
  }, []);

  const register = useCallback(
    async (email, password, name, phone, dateOfBirth) => {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          password,
          name: name || undefined,
          phone: phone || undefined,
          dateOfBirth: dateOfBirth || undefined,
        }),
      });
      const data = await readJsonResponse(res);
      if (!res.ok) throw new Error(data?.error || "Registration failed");
      if (!data?.user) throw new Error("Registration failed");
      setUser(data.user);
      setIsAuthenticated(true);
      emitAuthChanged();
      return data.user;
    },
    [],
  );

  const logout = useCallback(async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    setUser(null);
    setIsAuthenticated(false);
    emitAuthChanged();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        isLoadingAuth,
        isAdmin,
        isCustomer,
        login,
        register,
        logout,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
