"use client";

import Sidebar from "@/components/Sidebar";
import { User } from "@/typed";
import {
  Box,
  Container,
  Typography,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import Chat from "@/components/chat";
import socket from "@/context/socket";

const Home = () => {
  const [selectUser, setSelectUser] = useState<User>();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  useEffect(() => {
    if (selectUser?.id) {
      socket.emit("user_online", selectUser.id);
    }

    return () => {
      socket.off("user_status_changed");
    };
  }, [selectUser?.id]);

  return (
    <Container
      maxWidth="lg"
      sx={{
        display: "flex",
        justifyContent: "center",
        mt: { xs: 0, sm: 5 },
        p: { xs: 0, sm: 3 },
      }}
    >
      <Box
        sx={{
          width: "100%",
          height: { xs: "100vh", sm: "calc(100vh - 64px)" },
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
              width: { xs: "100%", sm: "calc(100% - 300px)" },
              display: { xs: selectUser ? "none" : "flex", sm: "flex" },
              flexDirection: "column",
              gap: "8px",
              alignItems: "center",
              justifyContent: "center",
              borderTopRightRadius: { xs: 0, sm: "8px" },
              borderBottomRightRadius: { xs: 0, sm: "8px" },
              p: { xs: 3, sm: 2 },
              background: "linear-gradient(135deg, #f5f7fa 0%, #e4e8eb 100%)",
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
                  background: "linear-gradient(45deg, blue, purple, pink)",
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
    </Container>
  );
};

export default Home;
