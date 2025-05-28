import { Box, Typography, TextField, InputAdornment } from "@mui/material";
import React, { useEffect, useState } from "react";
import SearchIcon from "@mui/icons-material/Search";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import { useAuth } from "@/context/AuthContext";
import { getUser, getUserWithConversation } from "@/actions/auth";
import { User } from "@/typed";
import socket from "@/context/socket";
import ListedUser from "./ListedUser";
import UserInfo from "./UserInfo";

const Sidebar = ({ onUserSelect }: { onUserSelect: (user: User) => void }) => {
  const { user } = useAuth();
  const [searchUser, setSearchUser] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Initial fetch of users and setup socket
    fetchUser();

    if (user.id) {
      // Connect socket and emit online status
      socket.connect();
      socket.emit("user_online", user.id);

      // Listen for online status changes
      socket.on("user_status_changed", ({ userId, isOnline }) => {
        setSearchUser((prev) =>
          prev.map((u) => (u.id === userId ? { ...u, isOnline } : u))
        );
      });
    }

    return () => {
      // Cleanup socket listeners
      socket.off("user_status_changed");
    };
  }, [user.id]);

  const fetchUser = async () => {
    try {
      const userData = await getUserWithConversation();
      if (userData) {
        setSearchUser(userData.data);
      }
    } catch (error) {
      console.error("Error fetching user", error);
      setSearchUser([]);
    }
  };

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.trim();

    if (!value) {
      await fetchUser();
      return;
    }
    setIsLoading(true);
    try {
      const response = await getUser(value);
      const data = await response?.json();

      if (Array.isArray(data.users)) {
        setSearchUser(data.users);
      } else {
        setSearchUser([]);
      }
    } catch (error) {
      console.error("Search failed", error);
      setSearchUser([]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box
      width="300px"
      height="100%"
      display="flex"
      flexDirection="column"
      justifyContent="space-between"
      sx={{
        borderTopRightRadius: "10px",
        borderBottomRightRadius: "10px",
        overflow: "hidden",
        background: "white",
        boxShadow: "4px 0 15px rgba(0, 0, 0, 0.08)",
        borderRight: "1px solid rgba(0, 0, 0, 0.1)",
      }}
    >
      <Box
        sx={{
          p: 2,
          display: "flex",
          flexDirection: "column",
          gap: 2,
        }}
      >
        <Typography
          variant="h5"
          sx={{
            background: "linear-gradient(to right,blue,purple,pink)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            fontWeight: 700,
            textAlign: "start",
          }}
        >
          <ChatBubbleOutlineIcon sx={{ color: "purple" }} /> Chat App
        </Typography>

        <TextField
          placeholder="Search"
          variant="outlined"
          size="small"
          onChange={handleChange}
          fullWidth
          sx={{
            backgroundColor: "white",
            borderRadius: 1,
            boxShadow: 3,
            "& .MuiOutlinedInput-root": {
              "& fieldset": {
                border: "none",
              },
            },
          }}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <SearchIcon color="action" />
              </InputAdornment>
            ),
          }}
        />
      </Box>

      <Box
        sx={{
          height: "100%",
          px: 2,
          overflow: "auto",
          "&::-webkit-scrollbar": {
            width: "3px",
          },
          "&::-webkit-scrollbar-track": {
            backgroundColor: "#f0f0f0",
            borderRadius: "4px",
          },
          "&::-webkit-scrollbar-thumb": {
            backgroundColor: "#888",
            borderRadius: "4px",
          },
          "&::-webkit-scrollbar-thumb:hover": {
            backgroundColor: "#555",
          },
        }}
      >
        <ListedUser
          isLoading={isLoading}
          searchUser={searchUser}
          onUserSelect={(user) => onUserSelect(user)}
        />
      </Box>
      <UserInfo />
    </Box>
  );
};

export default Sidebar;
