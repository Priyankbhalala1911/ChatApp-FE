"use client";

import AuthRedirect from "@/components/AuthRedirect";
import LoginForm from "@/components/LoginForm";
import { Box, Container, Typography } from "@mui/material";
import Link from "next/link";
import React from "react";

const Login = () => {
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
      </Box>
    </AuthRedirect>
  );
};

export default Login;
