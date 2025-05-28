import { User } from "@/typed";
import { Avatar, Badge } from "@mui/material";

interface OnlineStatusUser {
  user: User;
}

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
          border: user.isOnline ? "2px solid #44b700" : "2px solid #888",
          transition: "border-color 0.3s ease",
        }}
      />
    </Badge>
  );
};
export default OnlineStatus;
