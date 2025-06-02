"use client";

import { User } from "@/typed";
import {
  Box,
  CircularProgress,
  Divider,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Typography,
} from "@mui/material";
import OnlineStatus from "./OnlineStatus";
import { useUserStatus } from "@/context/UserStatus";

interface ListedUserProps {
  isLoading: boolean;
  searchUser: User[];
  setMobile: (mobile: boolean) => void;
}

const ListedUser = ({ isLoading, searchUser, setMobile }: ListedUserProps) => {
  const { setSelectedUser } = useUserStatus();

  return (
    <List sx={{ p: 0 }}>
      {isLoading ? (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100%",
            minHeight: "200px",
          }}
        >
          <CircularProgress sx={{ color: "rgba(102, 126, 234, 0.8)" }} />
        </Box>
      ) : searchUser.length > 0 ? (
        searchUser.map((user, index) => (
          <Box key={user.id}>
            <ListItem
              onClick={() => {
                setSelectedUser(user);
                setMobile(false);
              }}
              sx={{
                py: 1.5,
                px: 2,
                cursor: "pointer",
                borderRadius: 2,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                "&:hover": {
                  background:
                    "linear-gradient(135deg, #babcf6 0%, #d2c0e0 100%)",
                },
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <ListItemAvatar>
                  <OnlineStatus user={user} />
                </ListItemAvatar>
                <ListItemText
                  primary={
                    <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                      {user.name}
                    </Typography>
                  }
                  secondary={
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      noWrap
                      sx={{ maxWidth: { xs: "130px", sm: "240px" } }}
                    >
                      Last message preview goes here...
                    </Typography>
                  }
                />
              </Box>

              <Box sx={{ textAlign: "right" }}>
                <Typography
                  variant="caption"
                  sx={{ fontSize: "0.75rem", color: "gray" }}
                >
                  {new Date().toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </Typography>

                {/* <Box
                  sx={{
                    mt: 0.5,
                    backgroundColor: "#4caf50",
                    color: "white",
                    borderRadius: "50%",
                    width: 20,
                    height: 20,
                    fontSize: 12,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    ml: "auto",
                  }}
                >
                  1
                </Box> */}
              </Box>
            </ListItem>

            {index < searchUser.length - 1 && (
              <Divider sx={{ borderColor: "#764ba2" }} />
            )}
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
          <Typography variant="body1" sx={{ color: "#764ba2" }}>
            No users found
          </Typography>
        </Box>
      )}
    </List>
  );
};

export default ListedUser;
