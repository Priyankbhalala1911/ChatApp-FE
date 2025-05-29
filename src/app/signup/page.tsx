"use client";
import AuthRedirect from "@/components/AuthRedirect";
import SignupForm from "@/components/SignupForm";
import { Box, Container, Typography } from "@mui/material";
import Link from "next/link";
import React from "react";

const Signup = () => {
  return (
    <AuthRedirect>
      <Box
        sx={{
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          height: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
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
      </Box>
    </AuthRedirect>
  );
};

export default Signup;
