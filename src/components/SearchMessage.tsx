import socket from "@/context/socket";
import { User } from "@/typed";
import { Send } from "@mui/icons-material";
import { Box, IconButton, TextField } from "@mui/material";

interface Message {
  input: string;
  setInput: (value: string) => void;
  user: User;
  receiver: User;
}

const SearchMessage = ({ input, setInput, user, receiver }: Message) => {
  const handleSend = () => {
    if (!input.trim()) return;

    socket.emit("join", user.id);
    socket.emit("sent_message", {
      senderId: user.id,
      receiverId: receiver.id,
      text: input.trim(),
    });
    setInput("");
  };
  return (
    <Box
      sx={{
        display: "flex",
        gap: 1.5,
        mt: 2,
        flexShrink: 0,
      }}
    >
      <TextField
        placeholder="Type your message..."
        variant="outlined"
        size="medium"
        value={input}
        onChange={(e) => setInput(e.target.value)}
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
            p: 2,
            "&:hover": {
              background: "rgba(255,255,255,0.1)",
            },
          }}
        >
          <Send sx={{ color: "white" }} />
        </IconButton>
      </Box>
    </Box>
  );
};

export default SearchMessage;
