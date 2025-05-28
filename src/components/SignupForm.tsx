"use client";

import { registerUser } from "@/actions/auth";
import { User } from "@/typed";
import { Button, CircularProgress, TextField } from "@mui/material";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import toast from "react-hot-toast";

const SignupForm = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [userData, setUserData] = useState<{
    name: string;
    email: string;
    password: string;
  }>({
    name: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState<{ field: string; message: string }[]>([]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setUserData({ ...userData, [name]: value });
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError([]);
    try {
      const result = await registerUser({
        ...userData,
        id: "",
        profileImage: "",
        isOnline: false,
      });
      const data = await result?.json();

      if (!result?.ok) {
        if (data?.errors) {
          setError(data.errors);
        } else {
          toast.error(data.message || "Something went wrong!");
        }
      } else {
        router.push("/login");
        toast.success(data.message);
      }
    } catch (err) {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 mt-4">
      <TextField
        label="Name"
        name="name"
        value={userData.name}
        onChange={handleChange}
        error={!!error?.find((err) => err.field === "name")}
        helperText={error?.find((err) => err.field === "name")?.message || ""}
        fullWidth
      />
      <TextField
        label="Email"
        type="email"
        name="email"
        value={userData.email}
        onChange={handleChange}
        error={!!error?.find((err) => err.field === "email")}
        helperText={error?.find((err) => err.field === "email")?.message || ""}
        fullWidth
      />
      <TextField
        label="Password"
        type="password"
        name="password"
        value={userData.password}
        onChange={handleChange}
        error={!!error?.find((err) => err.field === "password")}
        helperText={
          error?.find((err) => err.field === "password")?.message || ""
        }
        fullWidth
      />
      <Button
        variant="contained"
        color="primary"
        fullWidth
        type="submit"
        disabled={loading}
        startIcon={
          loading ? <CircularProgress size={20} color="inherit" /> : null
        }
      >
        {loading ? "Signing up..." : "Sign Up"}
      </Button>
    </form>
  );
};

export default SignupForm;
