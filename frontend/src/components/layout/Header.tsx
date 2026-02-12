import React from "react";
import { AppBar, Toolbar, Box, Typography, Button } from "@mui/material";
import LogoutIcon from "@mui/icons-material/Logout";
import { useAuth } from "../../contexts/AuthContext";

export const Header: React.FC = () => {
  const { user, logout, isAuthenticated } = useAuth();

  return (
    <AppBar
      position="static"
      sx={{
        backgroundColor: "#FFFFFF",
        boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
        borderBottom: "1px solid #EBEDF0"
      }}
    >
      <Toolbar sx={{ justifyContent: "space-between", py: 2 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 2.5 }}>
          <Box
            component="img"
            src="/image001.png"
            alt="М.Видео-Эльдорадо"
            sx={{
              height: 40,
              objectFit: "contain"
            }}
          />
          <Box
            sx={{
              width: "1px",
              height: 28,
              backgroundColor: "#EBEDF0"
            }}
          />
          <Typography
            sx={{
              fontFamily: '"Montserrat", sans-serif',
              fontWeight: 600,
              fontSize: "1rem",
              color: "#2C3140",
              letterSpacing: "-0.3px"
            }}
          >
            Финансовое планирование и анализ
          </Typography>
        </Box>
        {isAuthenticated && user && (
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.75 }}>
            <Typography variant="body2" sx={{ fontSize: "0.8125rem", color: "#5C6370" }}>
              {user.username}
            </Typography>
            <Button
              variant="text"
              size="small"
              startIcon={<LogoutIcon />}
              onClick={logout}
              sx={{
                fontSize: "0.75rem",
                color: "#A0A8B8",
                border: "1px solid #E0E3E8",
                borderRadius: 2,
                px: 2,
                py: 0.875,
                textTransform: "none",
                "&:hover": {
                  backgroundColor: "#F7F8FA",
                  border: "1px solid #E0E3E8",
                }
              }}
            >
              Выйти
            </Button>
          </Box>
        )}
      </Toolbar>
    </AppBar>
  );
};
