import { Avatar, Badge, Box, IconButton, Typography } from "@mui/material";
import LogoutIcon from "@mui/icons-material/Logout";
import socket from "@/context/socket";
import { logout } from "@/actions/auth";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { useAuth } from "@/context/AuthContext";
import OnlineStatus from "./OnlineStatus";

const UserInfo = () => {
  const router = useRouter();
  const { user } = useAuth();
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
        <OnlineStatus user={{ ...user, isOnline: true }} />
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
  );
};
export default UserInfo;
