import { User } from "@/typed";
import { Avatar, Badge } from "@mui/material";
import { keyframes } from "@emotion/react";

interface OnlineStatusUser {
  user: User;
}

const pulse = keyframes`
  0% {
    transform: scale(0.8);
    opacity: 0.7;
  }
  50% {
    transform: scale(1.4);
    opacity: 0.4;
  }
  100% {
    transform: scale(0.8);
    opacity: 0.7;
  }
`;

const OnlineStatus = ({ user }: OnlineStatusUser) => {
  return (
    <Badge
      color="success"
      variant="dot"
      overlap="circular"
      invisible={!user?.isOnline}
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "right",
      }}
      sx={{
        "& .MuiBadge-badge": {
          backgroundColor: "#44b700",
          boxShadow: "0 0 0 2px white",
          "&::after": {
            content: '""',
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            borderRadius: "50%",
            animation: `${pulse} 1.2s infinite ease-in-out`,
            border: "2px solid #44b700",
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
          border: user.isOnline ? "2px solid #44b700" : "2px solid #888",
          transition: "border-color 0.3s ease",
        }}
      />
    </Badge>
  );
};

export default OnlineStatus;
