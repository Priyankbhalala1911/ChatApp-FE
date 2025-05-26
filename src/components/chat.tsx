"use client";

import { User } from "@/typed";
import { Send } from "@mui/icons-material";
import MessagesBox from "@/components/messageBox";
import {
  Avatar,
  Badge,
  Box,
  IconButton,
  TextField,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import socket from "@/context/socket";
import { useAuth } from "@/context/AuthContext";

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

const chat = ({ receiver }: { receiver: User }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const { user } = useAuth();

  useEffect(() => {
    socket.emit("join", user.id);

    socket.on("received_message", (payload: Message) => {
      if (
        (payload.sender.id === user.id &&
          payload.receiver.id === receiver.id) ||
        (payload.sender.id === receiver.id && payload.receiver.id === user.id)
      ) {
        setMessages((prev) => [...prev, payload]);
      }
    });

    return () => {
      socket.off("received_message");
    };
  }, [user.id, receiver.id]);

  const handleSend = () => {
    if (!input.trim()) return;

    socket.emit("sent_message", {
      senderId: user.id,
      receiverId: receiver.id,
      text: input.trim(),
    });
    // const newMessage = {
    //   text: input.trim(),
    //   timestamp: new Date()
    //     .toLocaleTimeString([], {
    //       hour: "2-digit",
    //       minute: "2-digit",
    //       hour12: true,
    //     })
    //     .toLowerCase(),
    // };
    // setMessages((prev) => [...prev, newMessage]);
    setInput("");
  };

  return (
    <Box
      sx={{
        width: "calc(100% - 300px)",
        p: 2,
        borderRadius: 2,
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        background: "linear-gradient(135deg, #f5f7fa 0%, #e4e8eb 100%)",
      }}
    >
      <Box
        sx={{
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
          borderRadius: 3,
          display: "flex",
          alignItems: "center",
          p: 2,
          gap: 2,
          color: "white",
          flexShrink: 0,
        }}
      >
        <Avatar
          src={receiver.profileImage}
          alt={receiver.name}
          sx={{
            width: 48,
            height: 48,
            border: "2px solid white",
            boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
          }}
        />
        <Box sx={{ textAlign: "left" }}>
          <Typography variant="h6" sx={{ fontWeight: "600" }}>
            {receiver.name}
          </Typography>
          <Typography variant="body2" sx={{ opacity: 0.9 }}>
            Online
          </Typography>
        </Box>
      </Box>
      <MessagesBox messages={messages} />
      <Box
        sx={{
          display: "flex",
          gap: 1.5,
          mt: 2,
          flexShrink: 0,
        }}
      >
        <TextField
          placeholder="Type your message..."
          variant="outlined"
          size="medium"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          fullWidth
          sx={{
            "& .MuiOutlinedInput-root": {
              backgroundColor: "white",
              borderRadius: 3,
              boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
              "& fieldset": {
                borderColor: "transparent",
              },
              "&:hover fieldset": {
                borderColor: "transparent",
              },
              "&.Mui-focused fieldset": {
                borderColor: "#764ba2",
              },
            },
          }}
        />
        <Box
          sx={{
            background: "linear-gradient(45deg, #667eea, #764ba2)",
            borderRadius: 3,
            transition: "transform 0.2s",
            "&:hover": {
              transform: "scale(1.05)",
            },
          }}
        >
          <IconButton
            onClick={handleSend}
            sx={{
              p: 2,
              "&:hover": {
                background: "rgba(255,255,255,0.1)",
              },
            }}
          >
            <Send sx={{ color: "white" }} />
          </IconButton>
        </Box>
      </Box>
    </Box>
  );
};
export default chat;
