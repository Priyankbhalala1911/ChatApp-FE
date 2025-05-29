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
      socket.disconnect();
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
      bgcolor="transparent"
      sx={{
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        borderRadius: 2,
        p: 2,
        boxShadow: "0px -1px 5px rgba(102, 126, 234, 0.6)",
        color: "#E0E7FF",
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
        <OnlineStatus user={{ ...user, isOnline: true }} />
        <Box>
          <Typography variant="body1" fontWeight="bold" sx={{ color: "#fff" }}>
            {user.name}
          </Typography>
          <Typography
            variant="caption"
            sx={{
              color: "#44b700",
              fontWeight: 600,
              display: user.name ? "flex" : "none",
              alignItems: "center",
              gap: 0.5,
            }}
          >
            Active Now
          </Typography>
        </Box>
      </Box>

      <IconButton
        size="small"
        onClick={handlelogout}
        sx={{
          backgroundColor: "rgba(118, 75, 162, 0.1)",
          "&:hover": {
            backgroundColor: "rgba(102, 126, 234, 0.2)",
          },
          borderRadius: 2,
          color: "#E0E7FF",
        }}
      >
        <LogoutIcon />
      </IconButton>
    </Box>
  );
};

export default UserInfo;
