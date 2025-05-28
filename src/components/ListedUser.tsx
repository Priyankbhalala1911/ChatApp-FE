"use client";

import { User } from "@/typed";
import {
  Avatar,
  Badge,
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

interface ListedUser {
  isLoading: boolean;
  searchUser: User[];
  onUserSelect: (user: User) => void;
}

const ListedUser = ({ isLoading, searchUser, onUserSelect }: ListedUser) => {
  return (
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
                <OnlineStatus user={user} />
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
  );
};
export default ListedUser;
