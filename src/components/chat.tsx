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
import { Conversation, Message } from "@/actions/message";

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
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  // useEffect(() => {
  //   setIsReceiverOnline(receiver.isOnline);

  //   const handleStatusChange = ({
  //     userId,
  //     isOnline,
  //   }: {
  //     userId: string;
  //     isOnline: boolean;
  //   }) => {
  //     if (userId === receiver.id) {
  //       setIsReceiverOnline(isOnline);
  //     }
  //   };

  //   socket.on("user_status_changed", handleStatusChange);

  //   return () => {
  //     socket.off("user_status_changed", handleStatusChange);
  //   };
  // }, [receiver.id, receiver.isOnline]);

  useEffect(() => {
    const fetchConversation = async () => {
      try {
        const conversation = await Conversation(receiver.id);

        if (conversation?.data?.id) {
          setConversationId(conversation.data.id);
        } else {
          setConversationId(null);
          setMessages([]);
        }
      } catch (error) {
        console.error("Error fetching conversation:", error);
        setConversationId(null);
        setMessages([]);
      }
    };

    fetchConversation();
  }, [receiver.id]);

  useEffect(() => {
    const fetchMessage = async () => {
      if (!conversationId) {
        setMessages([]);
        return;
      }
      setLoading(true);
      try {
        const message = await Message(conversationId);

        if (message?.data?.length > 0) {
          setMessages(message.data);
        } else {
          setMessages([]);
        }
      } catch (error) {
        console.error("Error fetching messages:", error);
        setMessages([]);
      } finally {
        setLoading(false);
      }
    };
    fetchMessage();
  }, [conversationId]);

  useEffect(() => {
    socket.emit("join", user.id);

    const handleReceivedMessage = (payload: Message) => {
      if (
        (payload.sender.id === user.id &&
          payload.receiver.id === receiver.id) ||
        (payload.sender.id === receiver.id && payload.receiver.id === user.id)
      ) {
        setMessages((prev) => [...prev, payload]);
      }
    };

    socket.on("received_message", handleReceivedMessage);

    return () => {
      socket.off("received_message", handleReceivedMessage);
    };
  }, [user.id, receiver.id]);

  const handleSend = () => {
    if (!input.trim()) return;

    socket.emit("sent_message", {
      senderId: user.id,
      receiverId: receiver.id,
      text: input.trim(),
    });
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
        <Badge
          color="success"
          variant="dot"
          overlap="circular"
          invisible={!receiver.isOnline}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "right",
          }}
          sx={{
            "& .MuiBadge-badge": {
              backgroundColor: "#44b700",
              "&::after": {
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                borderRadius: "50%",
                animation: "ripple 1.2s infinite ease-in-out",
                border: "1px solid #44b700",
                content: '""',
              },
            },
            "@keyframes ripple": {
              "0%": {
                transform: "scale(.8)",
                opacity: 1,
              },
              "100%": {
                transform: "scale(2.4)",
                opacity: 0,
              },
            },
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
        </Badge>
        <Box sx={{ textAlign: "left" }}>
          <Typography variant="h6" sx={{ fontWeight: "600" }}>
            {receiver.name}
          </Typography>
          <Typography variant="body2" sx={{ opacity: 0.9 }}>
            {receiver.isOnline ? "Online" : "Offline"}
          </Typography>
        </Box>
      </Box>
      <MessagesBox messages={messages} loading={loading} />
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
