"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { getToken } from "@/actions/auth";
import { useRouter } from "next/navigation";

interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  profileImage: string;
}

type AuthContextType = {
  isAuthenticated: boolean;
  loading: boolean;
  user: User;
  setUser: (user: User) => void;
};

const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  loading: true,
  user: {
    id: "",
    name: "",
    email: "",
    password: "",
    profileImage: "",
  },
  setUser: () => {},
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User>();
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      const token = await getToken();
      if (token?.token) {
        setIsAuthenticated(true);
        if (token?.user) {
          setUser(token.user);
        }
      } else {
        setIsAuthenticated(false);
        router.replace("/login");
      }
      setLoading(false);
    };

    checkAuth();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        loading,
        user: user ?? {
          id: "",
          name: "",
          email: "",
          password: "",
          profileImage: "",
        },
        setUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
