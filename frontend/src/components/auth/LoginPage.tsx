import React, { useState } from "react";
import {
  Box,
  Button,
  Container,
  Paper,
  TextField,
  Typography,
  Alert,
} from "@mui/material";
import { useAuth } from "../../contexts/AuthContext";

export const LoginPage: React.FC = () => {
  const { login } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!username || !password) {
      setError("Введите имя пользователя и пароль");
      return;
    }

    setLoading(true);
    try {
      await login(username, password);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Ошибка авторизации");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        backgroundColor: "#F7F8FA",
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Container maxWidth="xs">
        <Paper
          sx={{
            p: 4.5,
            border: "1px solid #EBEDF0",
            maxWidth: 340,
            margin: "0 auto",
          }}
        >
          <Box sx={{ textAlign: "center", mb: 3 }}>
            <Box
              component="img"
              src="/image001.png"
              alt="М.Видео-Эльдорадо"
              sx={{ height: 34, objectFit: "contain", mb: 2 }}
            />
            <Typography
              sx={{
                fontFamily: '"Montserrat", sans-serif',
                fontWeight: 700,
                fontSize: "1.25rem",
                color: "#2C3140",
                mt: 2
              }}
            >
              Вход в систему
            </Typography>
          </Box>

          <Box component="form" onSubmit={handleSubmit}>
            <TextField
              fullWidth
              margin="normal"
              label="Имя пользователя"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              autoComplete="username"
              autoFocus
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              fullWidth
              margin="normal"
              label="Пароль"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              InputLabelProps={{ shrink: true }}
            />
            {error && (
              <Alert severity="error" sx={{ mt: 2 }}>
                {error}
              </Alert>
            )}
            <Button
              type="submit"
              variant="contained"
              color="secondary"
              fullWidth
              disabled={loading}
              sx={{
                mt: 3,
                boxShadow: "0 2px 8px rgba(227, 6, 19, 0.35)",
                "&:hover": {
                  boxShadow: "0 4px 16px rgba(227, 6, 19, 0.45)",
                }
              }}
            >
              {loading ? "Вход..." : "Войти"}
            </Button>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};
