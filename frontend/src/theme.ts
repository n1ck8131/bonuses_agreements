import { createTheme } from "@mui/material/styles";

export const theme = createTheme({
  palette: {
    primary: {
      main: "#2C3140", // Corporate Dark (заменяет синий)
      light: "#3D4456",
      dark: "#1A1D23",
    },
    secondary: {
      main: "#E30613", // M.Video Red
    },
    background: {
      default: "#F7F8FA", // Snow
      paper: "#FFFFFF",
    },
    text: {
      primary: "#2C3140",
      secondary: "#5C6370", // Slate Gray
    },
    success: {
      main: "#1B8F5A",
    },
  },
  typography: {
    fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    h1: {
      fontFamily: '"Montserrat", sans-serif',
      fontWeight: 800,
      fontSize: "2.625rem", // 42px
      letterSpacing: "-1.5px",
      color: "#FFFFFF",
      lineHeight: 1.2,
    },
    h2: {
      fontFamily: '"Montserrat", sans-serif',
      fontWeight: 700,
      fontSize: "2rem", // 32px
      letterSpacing: "-1px",
      color: "#2C3140",
      lineHeight: 1.2,
    },
    h3: {
      fontFamily: '"Montserrat", sans-serif',
      fontWeight: 700,
      fontSize: "1.5rem", // 24px
      letterSpacing: "-0.5px",
      color: "#2C3140",
      lineHeight: 1.3,
    },
    h4: {
      fontFamily: '"Montserrat", sans-serif',
      fontWeight: 600,
      fontSize: "1.25rem", // 20px
      letterSpacing: "-0.3px",
      color: "#2C3140",
      lineHeight: 1.3,
    },
    h5: {
      fontFamily: '"Montserrat", sans-serif',
      fontWeight: 600,
      fontSize: "1.125rem", // 18px
      letterSpacing: "-0.2px",
      color: "#2C3140",
      lineHeight: 1.4,
    },
    h6: {
      fontFamily: '"Montserrat", sans-serif',
      fontWeight: 600,
      fontSize: "1rem", // 16px
      letterSpacing: "-0.1px",
      color: "#2C3140",
      lineHeight: 1.4,
    },
    body1: {
      fontFamily: '"Inter", sans-serif',
      fontSize: "0.9375rem", // 15px
      fontWeight: 400,
      lineHeight: 1.7,
      color: "#A0A8B8",
    },
    body2: {
      fontFamily: '"Inter", sans-serif',
      fontSize: "0.875rem", // 14px
      fontWeight: 400,
      lineHeight: 1.6,
      color: "#7A8599",
    },
    caption: {
      fontFamily: '"Inter", sans-serif',
      fontSize: "0.75rem", // 12px
      fontWeight: 400,
      color: "#5C6370",
    },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none",
          fontWeight: 500,
          fontSize: "0.875rem",
          borderRadius: 10,
          padding: "12px 28px",
          letterSpacing: "0.2px",
          transition: "all 0.2s",
        },
        contained: {
          boxShadow: "0 2px 8px rgba(44, 49, 64, 0.4)",
          "&:hover": {
            boxShadow: "0 4px 16px rgba(44, 49, 64, 0.5)",
          },
        },
        outlined: {
          borderWidth: "1.5px",
          borderColor: "#3D4456",
          color: "#A0A8B8",
          "&:hover": {
            borderWidth: "1.5px",
            borderColor: "#5C6370",
            color: "#E8EAED",
            backgroundColor: "rgba(61, 68, 86, 0.2)",
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        head: {
          fontWeight: 600,
          fontSize: "0.75rem", // 12px
          textTransform: "uppercase",
          letterSpacing: "0.5px",
          backgroundColor: "#F7F8FA",
          color: "#5C6370",
          borderBottom: "1px solid #EBEDF0",
          padding: "12px 16px",
        },
        body: {
          fontSize: "0.8125rem", // 13px
          color: "#2C3140",
          borderBottom: "1px solid #F2F3F5",
          padding: "14px 16px",
        },
      },
    },
    MuiTableRow: {
      styleOverrides: {
        root: {
          "&:hover": {
            backgroundColor: "#FAFBFC",
          },
          "&:last-child td": {
            borderBottom: "none",
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          "& .MuiOutlinedInput-root": {
            borderRadius: 10,
            "& fieldset": {
              borderWidth: "1.5px",
              borderColor: "#E0E3E8",
            },
            "&:hover fieldset": {
              borderColor: "#2C3140",
            },
            "&.Mui-focused fieldset": {
              borderColor: "#2C3140",
              borderWidth: "1.5px",
            },
          },
          "& .MuiInputLabel-root": {
            fontSize: "0.8125rem", // 13px
            fontWeight: 500,
            color: "#5C6370",
          },
        },
      },
    },
    MuiAlert: {
      styleOverrides: {
        root: {
          borderRadius: 12,
        },
      },
    },
  },
});
