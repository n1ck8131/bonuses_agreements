import React, { useState } from "react";
import { Box, Button, Snackbar, Alert } from "@mui/material";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import { useNavigate, useLocation } from "react-router-dom";

export interface SubNavItem {
  label: string;
  path: string | null;
  icon?: React.ReactNode;
}

interface SubNavProps {
  items: SubNavItem[];
}

export const SubNav: React.FC<SubNavProps> = ({ items }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [stubOpen, setStubOpen] = useState(false);

  const handleClick = (item: SubNavItem) => {
    if (item.path) {
      navigate(item.path);
    } else {
      setStubOpen(true);
    }
  };

  return (
    <>
      <Box
        sx={{
          backgroundColor: "#FFFFFF",
          borderBottom: "1px solid #EBEDF0",
          px: 3,
          display: "flex",
          alignItems: "center",
          gap: 0.5,
          overflowX: "auto",
        }}
      >
        {items.map((item) => {
          const isActive = item.path !== null && location.pathname === item.path;
          const isStub = item.path === null;

          return (
            <Button
              key={item.label}
              onClick={() => handleClick(item)}
              startIcon={item.icon}
              sx={{
                textTransform: "none",
                fontSize: "0.8125rem",
                fontWeight: isActive ? 600 : 400,
                color: isActive ? "#2C3140" : isStub ? "#A0A8B8" : "#5C6370",
                borderRadius: 0,
                px: 2,
                py: 1.5,
                minWidth: "auto",
                whiteSpace: "nowrap",
                borderBottom: isActive ? "2px solid #E30613" : "2px solid transparent",
                "&:hover": {
                  backgroundColor: "#F7F8FA",
                },
              }}
            >
              {item.label}
            </Button>
          );
        })}
      </Box>

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
    </>
  );
};

export const AgreementsSubNav: React.FC = () => {
  const items: SubNavItem[] = [
    {
      label: "На главную",
      path: "/",
      icon: <HomeOutlinedIcon sx={{ fontSize: 18 }} />,
    },
    { label: "Создание соглашений", path: "/agreements" },
    { label: "Настройки поставщиков", path: null },
    { label: "Отчётность", path: null },
  ];

  return <SubNav items={items} />;
};
