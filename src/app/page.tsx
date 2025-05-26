"use client";

import Sidebar from "@/components/Sidebar";
import { User } from "@/typed";
import { Box, Container, Typography } from "@mui/material";
import React, { useState } from "react";
import Chat from "@/components/chat";

const Home = () => {
  const [selectUser, setSelectUser] = useState<User>();
  return (
    <Container
      maxWidth="lg"
      sx={{ display: "flex", justifyContent: "center", mt: 5 }}
    >
      <Box
        sx={{
          width: "100%",
          height: "calc(100vh - 64px)",
          bgcolor: "white",
          border: "1px solid #ddd",
          boxShadow: 3,
          borderRadius: 2,
          textAlign: "center",
          display: "flex",
        }}
      >
        <Sidebar onUserSelect={setSelectUser} />
        {selectUser ? (
          <>
            <Chat receiver={selectUser} />
          </>
        ) : (
          <Box
            sx={{
              width: "calc(100% - 300px)",
              display: "flex",
              flexDirection: "column",
              gap: "8px",
              alignItems: "center",
              justifyContent: "center",
              borderTopRightRadius: "8px",
              borderBottomRightRadius: "8px",
              p: 2,
            }}
          >
            <Typography variant="h4" sx={{ fontWeight: 700 }}>
              <Box
                component="span"
                sx={{
                  background: "linear-gradient(45deg, blue, purple, pink)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  fontWeight: 700,
                }}
              >
                Welcome To ChatApp
              </Box>
            </Typography>
            <Typography variant="body1">
              Select a chat to start messaging
            </Typography>
          </Box>
        )}
      </Box>
    </Container>
  );
};

export default Home;
