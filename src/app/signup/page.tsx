"use client";
import AuthRedirect from "@/components/AuthRedirect";
import SignupForm from "@/components/SignupForm";
import { Container, Typography } from "@mui/material";
import Link from "next/link";
import React from "react";

const Signup = () => {
  return (
    <AuthRedirect>
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-l from-blue-500 via-purple-500 to-pink-500">
        <Container maxWidth="sm" className="bg-white p-6 rounded-xl shadow-md">
          <Typography variant="h5" textAlign="center" gutterBottom>
            Sign Up
          </Typography>
          <SignupForm />
          <Typography variant="body2" className="text-center pt-4">
            Already have an account?{" "}
            <Link href="/login" className="text-blue-600 underline">
              Login
            </Link>
          </Typography>
        </Container>
      </div>
    </AuthRedirect>
  );
};

export default Signup;
