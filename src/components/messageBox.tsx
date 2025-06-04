import { useAuth } from "@/context/AuthContext";
import socket from "@/context/socket";
import { Message } from "@/typed";
import { groupMessagesByDate } from "@/utils/groupMessagesByDate";
import { DoneAll } from "@mui/icons-material";
import { Box, CircularProgress, Typography } from "@mui/material";
import React, { useEffect, useRef, useState } from "react";
import RenderDateSeparator from "./RenderDateSeperator";

export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  profileImage: string;
}

interface MessagesBoxProps {
  messages: Message[];
  loading: boolean;
}

const MessagesBox: React.FC<MessagesBoxProps> = ({
  messages: incomingMessages,
  loading,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const [isAutoScroll, setIsAutoScroll] = useState(true);
  const [messages, setMessages] = useState<Message[]>(incomingMessages);
  const { user: currentUserId } = useAuth();

  useEffect(() => {
    setMessages(incomingMessages);
  }, [incomingMessages]);

  useEffect(() => {
    messages.forEach((msg) => {
      if (msg.receiver.id === currentUserId.id && !msg.seen) {
        socket.emit("message_seen", { messageId: msg.id });
      }
    });
  }, [messages, currentUserId]);

  useEffect(() => {
    const handleSeenUpdate = ({ messageId }: { messageId: string }) => {
      setMessages((prevMessages) =>
        prevMessages.map((msg) =>
          msg.id === messageId ? { ...msg, seen: true } : msg
        )
      );
    };

    socket.on("message_seen_update", handleSeenUpdate);

    return () => {
      socket.off("message_seen_update", handleSeenUpdate);
    };
  }, [incomingMessages]);

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

  const renderMessage = (msg: Message, index: number) => {
    const isCurrentUser = msg.sender.id === currentUserId.id;
    return (
      <Box
        key={index}
        sx={{
          textAlign: isCurrentUser ? "right" : "left",
          mb: { xs: 1, sm: 1.5 },
          animation: "fadeIn 0.3s ease-out",
          "@keyframes fadeIn": {
            from: { opacity: 0, transform: "translateY(10px)" },
            to: { opacity: 1, transform: "translateY(0)" },
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

          {isCurrentUser && (
            <Box
              sx={{
                position: "absolute",
                bottom: "2px",
                right: "5px",
                display: "flex",
                alignItems: "center",
                gap: "2px",
              }}
            >
              <DoneAll
                sx={{
                  fontSize: "15px",
                  color: msg.seen ? "#0096FF" : "gray",
                }}
              />
            </Box>
          )}
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
          {new Date(msg.createdAt).toLocaleTimeString("en-In", {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </Typography>
      </Box>
    );
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
        maxHeight: { xs: "calc(100vh - 200px)", sm: "calc(100vh - 220px)" },
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
          <CircularProgress sx={{ color: "rgba(102, 126, 234, 0.8)" }} />
        </Box>
      ) : messages.length === 0 ? (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100%",
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
        Object.entries(groupMessagesByDate(messages)).map(
          ([date, dateMessages]) => (
            <React.Fragment key={date}>
              <RenderDateSeparator date={date} />
              {dateMessages.map((msg, index) => renderMessage(msg, index))}
            </React.Fragment>
          )
        )
      )}
      <div ref={bottomRef} />
    </Box>
  );
};

export default MessagesBox;
