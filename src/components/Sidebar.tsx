import {
  Box,
  Typography,
  IconButton,
  Avatar,
  TextField,
  InputAdornment,
  List,
  ListItem,
  ListItemAvatar,
  Badge,
  ListItemText,
  Divider,
  CircularProgress,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import LogoutIcon from "@mui/icons-material/Logout";
import SearchIcon from "@mui/icons-material/Search";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import { useAuth } from "@/context/AuthContext";
import { getUser, getUserWithConversation, logout } from "@/actions/auth";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { User } from "@/typed";
import socket from "@/context/socket";

const Sidebar = ({ onUserSelect }: { onUserSelect: (user: User) => void }) => {
  const { user } = useAuth();
  const router = useRouter();
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

  const handlelogout = async () => {
    try {
      // Disconnect socket first
      socket.disconnect();

      // Navigate to login and call logout API
      router.replace("/login");
      const response = await logout();
      const data = await response?.json();
      if (response) {
        toast.success(data?.message);
      }
    } catch (error) {
      console.error("Error during logout:", error);
      toast.error("Error during logout");
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
        <List>
          {isLoading ? (
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
          ) : searchUser.length > 0 ? (
            searchUser.map((user, index) => (
              <Box key={user.id}>
                <ListItem
                  sx={{
                    py: 1,
                    px: 0,
                    cursor: "pointer",
                    "&:hover": { bgcolor: "lightgray", borderRadius: 2 },
                  }}
                  onClick={() => onUserSelect(user)}
                >
                  <ListItemAvatar>
                    <Badge
                      color="success"
                      variant="dot"
                      overlap="circular"
                      invisible={!user.isOnline}
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
                            border: "2px solid #44b700",
                            content: '""',
                          },
                        },
                      }}
                    >
                      <Avatar
                        src={user.profileImage}
                        alt={user.name}
                        sx={{
                          width: 45,
                          height: 45,
                          border: user.isOnline
                            ? "2px solid #44b700"
                            : "2px solid #888",
                          transition: "border-color 0.3s ease",
                        }}
                      />
                    </Badge>
                  </ListItemAvatar>
                  <ListItemText
                    primary={
                      <Typography variant="subtitle1">{user.name}</Typography>
                    }
                  />
                </ListItem>
                {index < searchUser.length - 1 && <Divider />}
              </Box>
            ))
          ) : (
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "100%",
                minHeight: "200px",
              }}
            >
              <Typography variant="body1" color="textSecondary">
                No users found
              </Typography>
            </Box>
          )}
        </List>
      </Box>

      <Box
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        bgcolor="rgba(255,255,255,0.9)"
        color="black"
        borderRadius={1}
        p={2}
        boxShadow={3}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Badge
            color="success"
            variant="dot"
            overlap="circular"
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
                  border: "2px solid #44b700",
                  content: '""',
                },
              },
            }}
          >
            <Avatar
              src={user.profileImage}
              alt={user.name}
              sx={{
                width: 45,
                height: 45,
                border: "2px solid #44b700",
                transition: "border-color 0.3s ease",
              }}
            />
          </Badge>
          <Box>
            <Typography variant="body1" fontWeight="bold">
              {user.name}
            </Typography>
            <Typography
              variant="caption"
              sx={{
                color: "#44b700",
                fontWeight: 600,
                display: "flex",
                alignItems: "center",
                gap: 0.5,
              }}
            >
              Active Now
            </Typography>
          </Box>
        </Box>
        <IconButton
          color="error"
          size="small"
          onClick={handlelogout}
          sx={{
            backgroundColor: "rgba(211, 47, 47, 0.04)",
            "&:hover": {
              backgroundColor: "rgba(211, 47, 47, 0.1)",
            },
          }}
        >
          <LogoutIcon />
        </IconButton>
      </Box>
    </Box>
  );
};

export default Sidebar;
