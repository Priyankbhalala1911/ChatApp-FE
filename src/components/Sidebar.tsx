import {
  Box,
  Typography,
  TextField,
  InputAdornment,
  useTheme,
  useMediaQuery,
  Drawer,
  IconButton,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import SearchIcon from "@mui/icons-material/Search";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import MenuIcon from "@mui/icons-material/Menu";
import { useAuth } from "@/context/AuthContext";
import { getUser, getUserWithConversation } from "@/actions/auth";
import socket from "@/context/socket";
import ListedUser from "./ListedUser";
import UserInfo from "./UserInfo";
import { useUserStatus } from "@/context/UserStatus";

const Sidebar = () => {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [mobileOpen, setMobileOpen] = useState(false);
  const { updateUserStatus, setUsers, users } = useUserStatus();

  useEffect(() => {
    fetchUser();

    if (user.id) {
      socket.emit("user_online", user.id);

      socket.on("user_status_changed", ({ userId, isOnline }) => {
        updateUserStatus(userId, isOnline);
      });
    }

    return () => {
      socket.off("user_status_changed");
    };
  }, [user.id]);

  const fetchUser = async () => {
    try {
      setIsLoading(true);
      const userData = await getUserWithConversation();
      if (userData) {
        setUsers(userData.data);
      }
    } catch (error) {
      console.error("Error fetching user", error);
      setUsers([]);
    } finally {
      setIsLoading(false);
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
        setUsers(data.users);
      } else {
        setUsers([]);
      }
    } catch (error) {
      console.error("Search failed", error);
      setUsers([]);
    } finally {
      setIsLoading(false);
    }
  };

  const sidebarContent = (
    <Box
      width={{ xs: "100%", sm: "400px" }}
      height="100%"
      display="flex"
      flexDirection="column"
      justifyContent="space-between"
      sx={{
        borderTopRightRadius: { xs: 0, sm: "10px" },
        borderBottomRightRadius: { xs: 0, sm: "10px" },
        overflow: "hidden",
        boxShadow: "4px 0 15px rgba(0, 0, 0, 0.08)",
        borderRight: `1px solid rgba(102, 126, 234, 0.6)`,
      }}
    >
      <Box
        sx={{
          p: 2,
          display: "flex",
          flexDirection: "column",
          gap: 2,
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          borderBottom: "1px solid #4a4a8c",
          color: "#fff",
        }}
      >
        <Typography
          variant="h5"
          sx={{
            background: "#fff",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            fontWeight: 700,
            textAlign: "start",
            display: "flex",
            alignItems: "center",
            gap: 1,
          }}
        >
          <ChatBubbleOutlineIcon sx={{ color: "#fff" }} /> Chat App
        </Typography>

        <TextField
          placeholder="Search users..."
          variant="outlined"
          size="small"
          onChange={handleChange}
          fullWidth
          sx={{
            backgroundColor: "#ffffff",
            borderRadius: 2,
            boxShadow: 1,
            "& .MuiOutlinedInput-root": {
              "& fieldset": { border: "none" },
              px: 1,
            },
          }}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <SearchIcon sx={{ color: "#764ba2" }} />
              </InputAdornment>
            ),
          }}
        />
      </Box>

      <Box
        sx={{
          height: "100%",
          pt: 1,
          pb: 1,
          overflow: "auto",
          background: "linear-gradient(135deg, #e0e0e0 0%, #f5f5f5 100%)",
          "&::-webkit-scrollbar": {
            width: "3px",
          },
          "&::-webkit-scrollbar-track": {
            backgroundColor: "#4a4a8c",
            borderRadius: "4px",
          },
          "&::-webkit-scrollbar-thumb": {
            backgroundColor: "#667eea",
            borderRadius: "4px",
          },
          "&::-webkit-scrollbar-thumb:hover": {
            backgroundColor: "#764ba2",
          },
        }}
      >
        <ListedUser
          isLoading={isLoading}
          searchUser={users}
          setMobile={setMobileOpen}
        />
      </Box>

      <Box
        sx={{
          background: "linear-gradient(135deg, #e0e0e0 0%, #f5f5f5 100%)",
          borderTop: "1px solid #4a4a8c",
          p: 2,
          color: "#fff",
        }}
      >
        <UserInfo />
      </Box>
    </Box>
  );

  return (
    <>
      {isMobile && (
        <IconButton
          sx={{
            position: "fixed",
            top: 10,
            left: 10,
            zIndex: 1100,
            color: "#a3b1ff",
          }}
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          <MenuIcon />
        </IconButton>
      )}

      {isMobile ? (
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={() => setMobileOpen(false)}
          ModalProps={{
            keepMounted: true,
          }}
          sx={{
            "& .MuiDrawer-paper": {
              width: "100%",
              maxWidth: "400px",
            },
          }}
        >
          {sidebarContent}
        </Drawer>
      ) : (
        sidebarContent
      )}
    </>
  );
};

export default Sidebar;
