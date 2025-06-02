import { Box, keyframes, Typography } from "@mui/material";

const bounce = keyframes`
  0% { transform: translateY(0); opacity: 0.3; }
  50% { transform: translateY(-4px); opacity: 1; }
  100% { transform: translateY(0); opacity: 0.3; }
`;

const Typing = () => {
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        gap: 1,
        marginLeft: 2,
        mt: 1,
      }}
    >
      <Typography
        variant="body2"
        sx={{ fontStyle: "italic", color: "gray", fontWeight: 400 }}
      >
        typing
      </Typography>
      <Box sx={{ display: "flex", gap: 0.5 }}>
        {[0, 1, 2].map((i) => (
          <Box
            key={i}
            sx={{
              width: 6,
              height: 6,
              borderRadius: "50%",
              backgroundColor: "gray",
              animation: `${bounce} 1.2s infinite`,
              animationDelay: `${i * 0.2}s`,
            }}
          />
        ))}
      </Box>
    </Box>
  );
};
export default Typing;
