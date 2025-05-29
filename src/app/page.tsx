"use client";

import Sidebar from "@/components/Sidebar";
import { User } from "@/typed";
import { Box, Container, Typography, useTheme } from "@mui/material";
import React, { useState } from "react";
import Chat from "@/components/chat";

const Home = () => {
  const [selectUser, setSelectUser] = useState<User>();

  return (
    <Box
      sx={{
        width: "100vw",
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Box
        sx={{
          width: "100%",
          height: "100%",
          bgcolor: "white",
          border: { xs: "none", sm: "1px solid #ddd" },
          boxShadow: { xs: 0, sm: 3 },
          borderRadius: { xs: 0, sm: 2 },
          textAlign: "center",
          display: "flex",
          overflow: "hidden",
          position: "relative",
        }}
      >
        <Sidebar onUserSelect={setSelectUser} />
        {selectUser ? (
          <Chat receiver={selectUser} />
        ) : (
          <Box
            sx={{
              width: { xs: "100%", sm: "calc(100% - 400px)" },
              display: "flex",
              flexDirection: "column",
              gap: "8px",
              alignItems: "center",
              justifyContent: "center",
              borderTopRightRadius: { xs: 0, sm: "8px" },
              borderBottomRightRadius: { xs: 0, sm: "8px" },
              p: { xs: 3, sm: 2 },
              background: "linear-gradient(135deg, #e0e0e0 0%, #f5f5f5 100%)",
            }}
          >
            <Typography
              variant="h4"
              sx={{
                fontWeight: 700,
                fontSize: { xs: "1.75rem", sm: "2.125rem" },
              }}
            >
              <Box
                component="span"
                sx={{
                  background:
                    "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  fontWeight: 700,
                }}
              >
                Welcome To ChatApp
              </Box>
            </Typography>
            <Typography
              variant="body1"
              sx={{
                fontSize: { xs: "0.875rem", sm: "1rem" },
                color: "text.secondary",
              }}
            >
              Select a chat to start messaging
            </Typography>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default Home;
