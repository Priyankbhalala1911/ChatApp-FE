"use client";

import AuthRedirect from "@/components/AuthRedirect";
import LoginForm from "@/components/LoginForm";
import { Container, Typography } from "@mui/material";
import Link from "next/link";
import React from "react";

const Login = () => {
  return (
    <AuthRedirect>
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-l from-blue-500 via-purple-500 to-pink-500">
        <Container
          maxWidth="xs"
          className="bg-white p-6 rounded-xl shadow-lg border-bootom-2"
        >
          <Typography variant="h5" textAlign="center" gutterBottom>
            Login
          </Typography>
          <LoginForm />
          <Typography variant="body2" className="text-center pt-4">
            Don't have an account?{" "}
            <Link href="/signup" className="text-blue-600 underline">
              Sign up
            </Link>
          </Typography>
        </Container>
      </div>
    </AuthRedirect>
  );
};

export default Login;
