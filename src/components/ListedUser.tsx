"use client";

import { UserConversation } from "@/typed";
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
import { useAuth } from "@/context/AuthContext";

interface ListedUserProps {
  isLoading: boolean;
  searchUser: UserConversation[];
  setMobile: (mobile: boolean) => void;
}

const ListedUser = ({ isLoading, searchUser, setMobile }: ListedUserProps) => {
  const { setSelectedUser } = useUserStatus();
  const { user } = useAuth();

  const filteredSearchUser = searchUser.filter((u) => u.id !== user.id);

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
      ) : filteredSearchUser.length > 0 ? (
        filteredSearchUser.map((user, index) => (
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
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  width: "100%",
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
                        sx={{ maxWidth: { xs: "170px", sm: "180px" } }}
                      >
                        {user.lastMessage}
                      </Typography>
                    }
                  />
                </Box>

                <Box
                  sx={{ alignSelf: "flex-start", textAlign: "right", py: 0.75 }}
                >
                  <Typography
                    variant="caption"
                    sx={{ fontSize: "0.75rem", color: "gray" }}
                  >
                    {user.lastMessageTime
                      ? new Date(user.lastMessageTime).toLocaleString("en-GB", {
                          day: "2-digit",
                          month: "2-digit",
                          year: "2-digit",
                          hour: "2-digit",
                          minute: "2-digit",
                          hour12: true,
                        })
                      : ""}
                  </Typography>
                </Box>
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
