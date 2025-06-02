import socket from "@/context/socket";
import { User } from "@/typed";
import { Send } from "@mui/icons-material";
import {
  Box,
  IconButton,
  TextField,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import { useRef } from "react";

interface Message {
  input: string;
  setInput: (value: string) => void;
  user: User;
  receiver: User;
}

const SearchMessage = ({ input, setInput, user, receiver }: Message) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const typingTimeout = useRef<NodeJS.Timeout | null>(null);

  const handleSend = () => {
    if (!input.trim()) return;

    socket.emit("join", user.id);
    socket.emit("sent_message", {
      senderId: user.id,
      receiverId: receiver.id,
      text: input.trim(),
    });

    socket.emit("stoptyping", { userId: user.id, receiverId: receiver.id });
    setInput("");
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInput(value);

    socket.emit("typing", { userId: user.id, receiverId: receiver.id });

    if (typingTimeout.current) clearTimeout(typingTimeout.current);
    typingTimeout.current = setTimeout(() => {
      socket.emit("stoptyping", { userId: user.id, receiverId: receiver.id });
    }, 2000);
  };

  return (
    <Box
      sx={{
        display: "flex",
        gap: { xs: 1, sm: 1.5 },
        mt: { xs: 1, sm: 2 },
        flexShrink: 0,
        px: { xs: 1, sm: 0 },
      }}
    >
      <TextField
        placeholder="Type your message..."
        variant="outlined"
        size={isMobile ? "small" : "medium"}
        value={input}
        onChange={handleChange}
        onKeyDown={(e) => e.key === "Enter" && handleSend()}
        fullWidth
        sx={{
          "& .MuiOutlinedInput-root": {
            backgroundColor: "white",
            borderRadius: 3,
            boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
            "& fieldset": {
              borderColor: "transparent",
            },
            "&:hover fieldset": {
              borderColor: "transparent",
            },
            "&.Mui-focused fieldset": {
              borderColor: "#764ba2",
            },
            "& input": {
              fontSize: { xs: "0.875rem", sm: "1rem" },
              padding: { xs: "10px 14px", sm: "14px" },
            },
          },
        }}
      />
      <Box
        sx={{
          background: "linear-gradient(45deg, #667eea, #764ba2)",
          borderRadius: 3,
          transition: "transform 0.2s",
          "&:hover": {
            transform: "scale(1.05)",
          },
        }}
      >
        <IconButton
          onClick={handleSend}
          sx={{
            p: { xs: 1.5, sm: 2 },
            "&:hover": {
              background: "rgba(255,255,255,0.1)",
            },
          }}
        >
          <Send
            sx={{ color: "white", fontSize: { xs: "1.25rem", sm: "1.5rem" } }}
          />
        </IconButton>
      </Box>
    </Box>
  );
};

export default SearchMessage;
