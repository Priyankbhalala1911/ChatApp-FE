import { useAuth } from "@/context/AuthContext";
import { FormattedDateAndTime } from "@/utils/formattedDateAndTime";
import { DoneAll } from "@mui/icons-material";
import {
  Box,
  CircularProgress,
  Typography,
  useTheme,
  useMediaQuery,
} from "@mui/material";
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
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

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
        p: { xs: 1, sm: 2 },
        mb: { xs: 1, sm: 2 },
        maxHeight: { xs: "calc(100vh - 200px)", sm: "calc(100vh - 300px)" },
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
            minHeight: { xs: "150px", sm: "200px" },
            maxHeight: { xs: "calc(100vh - 150px)", sm: "calc(100vh - 200px)" },
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
            minHeight: { xs: "150px", sm: "200px" },
            maxHeight: { xs: "calc(100vh - 150px)", sm: "calc(100vh - 200px)" },
          }}
        >
          <Typography
            variant="body1"
            sx={{
              color: "text.secondary",
              backgroundColor: "rgba(255,255,255,0.8)",
              padding: { xs: "12px 20px", sm: "16px 24px" },
              borderRadius: 2,
              boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
              fontSize: { xs: "0.875rem", sm: "1rem" },
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
                mb: { xs: 1, sm: 1.5 },
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
                  px: { xs: 2, sm: 2.5 },
                  py: { xs: 1, sm: 1.5 },
                  borderRadius: "20px",
                  borderTopRightRadius: isCurrentUser ? "4px" : "20px",
                  borderTopLeftRadius: isCurrentUser ? "20px" : "4px",
                  maxWidth: { xs: "85%", sm: "70%" },
                  wordBreak: "break-word",
                  boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
                  position: "relative",
                  marginBottom: "4px",
                }}
              >
                <Typography
                  variant="body1"
                  sx={{
                    lineHeight: 1.4,
                    fontSize: { xs: "0.875rem", sm: "1rem" },
                  }}
                >
                  {msg.text}
                </Typography>
                <Box
                  sx={{
                    position: "absolute",
                    bottom: "4px",
                    right: "5px",
                    display: "flex",
                    alignItems: "center",
                    gap: "2px",
                  }}
                >
                  {isCurrentUser && <DoneAll sx={{ fontSize: "15px" }} />}
                </Box>

                {/* <Box
                  sx={{
                    position: "absolute",
                    bottom: "-10px",
                    right: isCurrentUser ? "auto" : "10px",
                    left: isCurrentUser ? "10px" : "auto",
                    display: "flex",
                    gap: "4px",
                    alignItems: "center",
                    bgcolor: "#DEF4FC",
                    borderRadius: "16px",
                    px: 0.3,
                    py: 0.2,
                    boxShadow: "0 1px 4px rgba(0,0,0,0.1)",
                  }}
                >
                  <Typography sx={{ fontSize: "10px" }}>❤️</Typography>
                </Box> */}
              </Box>
              <Typography
                variant="caption"
                sx={{
                  display: "block",
                  textAlign: isCurrentUser ? "right" : "left",
                  color: "rgba(0, 0, 0, 0.6)",
                  fontSize: { xs: "0.45rem", sm: "0.5rem" },
                  padding: isCurrentUser ? "0 8px 0 0" : "0 0 0 8px",
                  marginBottom: { xs: "8px", sm: "12px" },
                }}
              >
                {FormattedDateAndTime(msg.createdAt)}
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
