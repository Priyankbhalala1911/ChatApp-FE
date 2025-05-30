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

interface ListedUser {
  isLoading: boolean;
  searchUser: User[];
  setMobile: (mobile: boolean) => void;
}

const ListedUser = ({ isLoading, searchUser, setMobile }: ListedUser) => {
  const { setSelectedUser } = useUserStatus();
  return (
    <List>
      {isLoading ? (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100%",
            minHeight: "200px",
            maxHeight: "calc(100vh - 200px)",
          }}
        >
          <CircularProgress sx={{ color: "rgba(102, 126, 234, 0.8)" }} />
        </Box>
      ) : searchUser.length > 0 ? (
        searchUser.map((user, index) => (
          <Box key={user.id}>
            <ListItem
              sx={{
                py: 1,
                px: 0,
                cursor: "pointer",
                borderRadius: 2,
                "&:hover": {
                  background:
                    "linear-gradient(135deg, #babcf6 0%, #d2c0e0 100%)",
                },
              }}
              onClick={() => {
                setSelectedUser(user);
                setMobile(false);
              }}
            >
              <ListItemAvatar>
                <OnlineStatus user={user} />
              </ListItemAvatar>
              <ListItemText
                primary={
                  <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                    {user.name}
                  </Typography>
                }
              />
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
