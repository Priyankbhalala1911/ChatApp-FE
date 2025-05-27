import { useAuth } from "@/context/AuthContext";
import { Box, CircularProgress, Typography } from "@mui/material";
import React, { useEffect, useRef, useState } from "react";

export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  profileImage: string;
}

export interface Conversation {
  id: string;
  isGroup: boolean;
}

export interface Message {
  id: string;
  text: string;
  createdAt: string;
  sender: User;
  receiver: User;
  conversation: Conversation;
}

interface MessagesBoxProps {
  messages: Message[];
  loading: boolean;
}

const MessagesBox: React.FC<MessagesBoxProps> = ({ messages, loading }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const [isAutoScroll, setIsAutoScroll] = useState(true);
  const { user: currentUserId } = useAuth();

  useEffect(() => {
    if (isAutoScroll && bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isAutoScroll]);

  const handleScroll = () => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    const nearBottom =
      container.scrollHeight - container.scrollTop - container.clientHeight <
      50;

    setIsAutoScroll(nearBottom);
  };

  return (
    <Box
      ref={containerRef}
      onScroll={handleScroll}
      sx={{
        flexGrow: 1,
        overflowY: "auto",
        borderRadius: 2,
        p: 2,
        mb: 2,
        maxHeight: "calc(100vh - 300px)",
        height: "100%",
        "&::-webkit-scrollbar": {
          width: "0px",
        },
      }}
    >
      {loading ? (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            height: "100%",
            minHeight: "200px",
            maxHeight: "calc(100vh - 200px)",
          }}
        >
          <CircularProgress />
        </Box>
      ) : messages.length === 0 ? (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100%",
            minHeight: "200px",
            maxHeight: "calc(100vh - 200px)",
          }}
        >
          <Typography
            variant="body1"
            sx={{
              color: "text.secondary",
              backgroundColor: "rgba(255,255,255,0.8)",
              padding: "16px 24px",
              borderRadius: 2,
              boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
            }}
          >
            Start a conversation...
          </Typography>
        </Box>
      ) : (
        messages.map((msg, index) => {
          const isCurrentUser = msg.sender.id === currentUserId.id;

          return (
            <Box
              key={index}
              sx={{
                textAlign: isCurrentUser ? "right" : "left",
                mb: 1.5,
                animation: "fadeIn 0.3s ease-out",
                "@keyframes fadeIn": {
                  from: {
                    opacity: 0,
                    transform: "translateY(10px)",
                  },
                  to: {
                    opacity: 1,
                    transform: "translateY(0)",
                  },
                },
              }}
            >
              <Box
                sx={{
                  display: "inline-block",
                  background: isCurrentUser
                    ? "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
                    : "linear-gradient(135deg, #e0e0e0 0%, #f5f5f5 100%)",
                  color: isCurrentUser ? "white" : "black",
                  textAlign: "start",
                  px: 2.5,
                  py: 1.5,
                  borderRadius: "20px",
                  borderTopRightRadius: isCurrentUser ? "4px" : "20px",
                  borderTopLeftRadius: isCurrentUser ? "20px" : "4px",
                  maxWidth: "70%",
                  wordBreak: "break-word",
                  boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
                  position: "relative",
                  marginBottom: "4px",
                }}
              >
                <Typography variant="body1" sx={{ lineHeight: 1.4 }}>
                  {msg.text}
                </Typography>
              </Box>
              <Typography
                variant="caption"
                sx={{
                  display: "block",
                  textAlign: isCurrentUser ? "right" : "left",
                  color: "rgba(0, 0, 0, 0.6)",
                  fontSize: "0.5rem",
                  padding: isCurrentUser ? "0 8px 0 0" : "0 0 0 8px",
                  marginBottom: "12px",
                }}
              >
                {new Date(msg.createdAt)
                  .toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                    hour12: true,
                  })
                  .toLowerCase()}
              </Typography>
            </Box>
          );
        })
      )}
      <div ref={bottomRef} />
    </Box>
  );
};

export default MessagesBox;
