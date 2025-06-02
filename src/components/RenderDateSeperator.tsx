import { Box, Typography } from "@mui/material";

const RenderDateSeparator = ({ date }: { date: string }) => {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Typography
        variant="caption"
        sx={{
          backgroundColor: "rgba(102, 126, 234, 0.1)",
          color: "rgba(102, 126, 234, 0.8)",
          padding: "4px 12px",
          borderRadius: "12px",
          fontSize: "0.75rem",
          fontWeight: 500,
        }}
      >
        {date}
      </Typography>
    </Box>
  );
};

export default RenderDateSeparator;
