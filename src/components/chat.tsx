"use client";

import { Message, User } from "@/typed";
import MessagesBox from "@/components/messageBox";
import { Box, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import socket from "@/context/socket";
import { useAuth } from "@/context/AuthContext";
import {
  getConversationByUserId,
  getMessagesByConversationId,
} from "@/actions/message";
import OnlineStatus from "./OnlineStatus";
import SearchMessage from "./SearchMessage";
import Typing from "./Typing";
import { useUserStatus } from "@/context/UserStatus";

const Chat = ({ receiver }: { receiver: User }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const { updateLastMessageForUser } = useUserStatus();

  useEffect(() => {
    const fetchConversation = async () => {
      try {
        setLoading(true);
        const conversation = await getConversationByUserId(receiver.id);
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
      } finally {
        setLoading(false);
      }
    };

    fetchConversation();
  }, [receiver.id]);

  useEffect(() => {
    socket.on("typing", ({ receiverId, userId }) => {
      if (receiverId === user.id && userId === receiver.id) {
        setTyping(true);
      }
    });

    socket.on("stoptyping", ({ receiverId, userId }) => {
      if (receiverId === user.id && userId === receiver.id) {
        setTyping(false);
      }
    });

    return () => {
      socket.off("typing");
      socket.off("stoptyping");
    };
  }, [receiver.id, user.id]);

  useEffect(() => {
    const fetchMessage = async () => {
      if (!conversationId) {
        setMessages([]);
        return;
      }
      try {
        const message = await getMessagesByConversationId(conversationId);
        if (message?.data?.length > 0) {
          setMessages(message.data);
        } else {
          setMessages([]);
        }
      } catch (error) {
        console.error("Error fetching messages:", error);
        setMessages([]);
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
        if (payload.conversation?.id) {
          setConversationId(payload.conversation.id);
        }
      }

      updateLastMessageForUser(
        receiver.id,
        payload.text,
        new Date().toISOString()
      );
    };

    socket.on("received_message", handleReceivedMessage);

    return () => {
      socket.off("received_message", handleReceivedMessage);
    };
  }, [user.id, receiver.id, updateLastMessageForUser]);

  return (
    <Box
      sx={{
        width: { xs: "100%", sm: "calc(100% - 399px)" },
        p: { xs: 1, sm: 2 },
        borderRadius: 2,
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        background: "linear-gradient(135deg, #f5f7fa 0%, #e4e8eb 100%)",
        height: "100%",
        position: { xs: "fixed", sm: "relative" },
        top: 0,
        right: 0,
        zIndex: { xs: 1000, sm: "auto" },
      }}
    >
      <Box
        sx={{
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
          borderRadius: 3,
          display: "flex",
          alignItems: "center",
          p: { xs: 1.5, sm: 2 },
          gap: 2,
          color: "white",
          flexShrink: 0,
          mt: { xs: 5, sm: 0 },
        }}
      >
        <OnlineStatus user={receiver} />
        <Box sx={{ textAlign: "left" }}>
          <Typography
            variant="h6"
            sx={{ fontWeight: "600", fontSize: { xs: "1rem", sm: "1.25rem" } }}
          >
            {receiver.name}
          </Typography>
          <Typography variant="body2" sx={{ opacity: 0.9 }}>
            {receiver.isOnline ? "Online" : "Offline"}
          </Typography>
        </Box>
      </Box>

      <MessagesBox messages={messages} loading={loading} />
      {typing && <Typing />}

      <SearchMessage
        input={input}
        setInput={setInput}
        user={{
          ...user,
          isOnline: true,
          lastMessage: "",
          lastMessageTime: "",
        }}
        receiver={{
          ...receiver,
          lastMessage: "",
          lastMessageTime: "",
        }}
      />
    </Box>
  );
};

export default Chat;
