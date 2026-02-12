import React from "react";
import { Box, Typography, Button } from "@mui/material";

interface ErrorBoundaryState {
  hasError: boolean;
}

export class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  ErrorBoundaryState
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return (
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            minHeight: "100vh",
            gap: 2,
          }}
        >
          <Typography variant="h5">Произошла ошибка</Typography>
          <Typography variant="body1" color="text.secondary">
            Попробуйте обновить страницу
          </Typography>
          <Button variant="contained" onClick={() => window.location.reload()}>
            Обновить
          </Button>
        </Box>
      );
    }

    return this.props.children;
  }
}
