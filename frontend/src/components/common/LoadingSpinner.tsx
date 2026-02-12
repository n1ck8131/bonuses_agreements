import React from "react";
import { Box, CircularProgress } from "@mui/material";

interface LoadingSpinnerProps {
  minHeight?: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ minHeight = "60vh" }) => {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight,
      }}
    >
      <CircularProgress size={48} />
    </Box>
  );
};
