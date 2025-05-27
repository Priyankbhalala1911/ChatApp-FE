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

const Sidebar = ({ onUserSelect }: { onUserSelect: (user: User) => void }) => {
  const { user } = useAuth();
  const router = useRouter();
  const [searchUser, setSearchUser] = useState<User[]>([]);

  useEffect(() => {
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
    fetchUser();
  }, []);

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.trim();

    if (!value) {
      setSearchUser([]);
      return;
    }

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
    }
  };

  const handlelogout = async () => {
    router.replace("/login");
    const response = await logout();
    const data = await response?.json();
    if (response) {
      toast.success(data?.message);
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
          {searchUser.length > 0 ? (
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
                    {/* <Badge
                    color="success"
                    variant="dot"
                    overlap="circular"
                    invisible={!user.isOnline}
                    anchorOrigin={{
                      vertical: "bottom",
                      horizontal: "right",
                    }}
                  > */}
                    <Avatar
                      src={user.profileImage}
                      alt={user.name}
                      sx={{ border: "1px solid black", p: "5px" }}
                    />
                    {/* </Badge> */}
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
                height: "100%",
                minHeight: "200px",
                maxHeight: "calc(100vh - 200px)",
              }}
            >
              <CircularProgress />
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
        <Avatar
          src={user.profileImage}
          alt={user.name}
          sx={{ border: "1px solid black", p: "5px" }}
        />
        <Typography variant="body1" fontWeight="bold">
          {user.name.toUpperCase()}
        </Typography>
        <IconButton color="error" size="small" onClick={handlelogout}>
          <LogoutIcon />
        </IconButton>
      </Box>
    </Box>
  );
};

export default Sidebar;
