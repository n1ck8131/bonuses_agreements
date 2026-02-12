import React, { useState } from "react";
import { Box, Container, Typography, Paper, Snackbar, Alert } from "@mui/material";
import HandshakeOutlinedIcon from "@mui/icons-material/HandshakeOutlined";
import AccountBalanceOutlinedIcon from "@mui/icons-material/AccountBalanceOutlined";
import TrendingUpOutlinedIcon from "@mui/icons-material/TrendingUpOutlined";
import { useNavigate } from "react-router-dom";

interface TileConfig {
  title: string;
  icon: React.ReactNode;
  path: string | null;
}

const tiles: TileConfig[] = [
  {
    title: "Ведение бонусных соглашений",
    icon: <HandshakeOutlinedIcon sx={{ fontSize: 48, color: "#5C6370" }} />,
    path: "/agreements",
  },
  {
    title: "Планирование и бюджетирование бонусной массы",
    icon: <AccountBalanceOutlinedIcon sx={{ fontSize: 48, color: "#5C6370" }} />,
    path: null,
  },
  {
    title: "Планирование продаж и закупок",
    icon: <TrendingUpOutlinedIcon sx={{ fontSize: 48, color: "#5C6370" }} />,
    path: null,
  },
];

export const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [stubOpen, setStubOpen] = useState(false);

  const handleTileClick = (tile: TileConfig) => {
    if (tile.path) {
      navigate(tile.path);
    } else {
      setStubOpen(true);
    }
  };

  return (
    <Box sx={{ backgroundColor: "#F7F8FA", minHeight: "calc(100vh - 89px)" }}>
      <Container maxWidth="lg" sx={{ py: 6 }}>
        <Typography
          variant="h3"
          sx={{
            mb: 4,
            fontFamily: '"Montserrat", sans-serif',
            fontWeight: 700,
            fontSize: "1.5rem",
            color: "#2C3140",
          }}
        >
          Модули системы
        </Typography>

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
            gap: 3,
          }}
        >
          {tiles.map((tile) => (
            <Paper
              key={tile.title}
              onClick={() => handleTileClick(tile)}
              sx={{
                p: 4,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: 2,
                minHeight: 200,
                cursor: tile.path ? "pointer" : "default",
                border: "1px solid #EBEDF0",
                opacity: tile.path ? 1 : 0.55,
                transition: "all 0.2s",
                "&:hover": tile.path
                  ? {
                      boxShadow: "0 8px 24px rgba(0,0,0,0.1)",
                      borderColor: "#2C3140",
                    }
                  : {},
              }}
            >
              {tile.icon}
              <Typography
                sx={{
                  fontFamily: '"Montserrat", sans-serif',
                  fontWeight: 600,
                  fontSize: "0.9375rem",
                  color: "#2C3140",
                  textAlign: "center",
                  lineHeight: 1.4,
                }}
              >
                {tile.title}
              </Typography>
              {!tile.path && (
                <Typography
                  sx={{
                    fontSize: "0.75rem",
                    color: "#A0A8B8",
                  }}
                >
                  В разработке
                </Typography>
              )}
            </Paper>
          ))}
        </Box>
      </Container>

      <Snackbar
        open={stubOpen}
        autoHideDuration={2500}
        onClose={() => setStubOpen(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={() => setStubOpen(false)}
          severity="info"
          sx={{ width: "100%" }}
        >
          Раздел находится в разработке
        </Alert>
      </Snackbar>
    </Box>
  );
};
