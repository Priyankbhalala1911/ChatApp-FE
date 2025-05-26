"use client";

import { loginUser } from "@/actions/auth";
import { useAuth } from "@/context/AuthContext";
import { Button, TextField, CircularProgress } from "@mui/material";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import toast from "react-hot-toast";

const LoginForm = () => {
  const router = useRouter();
  const { setUser } = useAuth();
  const [userData, setUserData] = useState<{ email: string; password: string }>(
    {
      email: "",
      password: "",
    }
  );
  const [loading, setLoading] = useState(false);

  const handleChnage = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setUserData({ ...userData, [name]: value });
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);

    try {
      const result = await loginUser(userData);
      const data = await result?.json();

      if (!result?.ok) {
        toast.error(data?.message);
      } else {
        setUser(data.user);
        toast.success(data?.message);
        router.push("/");
      }
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 mt-4">
      <TextField
        label="Email"
        type="email"
        name="email"
        onChange={handleChnage}
        fullWidth
      />
      <TextField
        label="Password"
        type="password"
        name="password"
        onChange={handleChnage}
        fullWidth
      />
      <Button
        type="submit"
        variant="contained"
        color="primary"
        fullWidth
        disabled={loading}
        startIcon={
          loading ? <CircularProgress size={20} color="inherit" /> : null
        }
      >
        {loading ? "Logging in..." : "Login"}
      </Button>
    </form>
  );
};

export default LoginForm;
