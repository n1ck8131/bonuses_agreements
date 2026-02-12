import React, { useEffect, useState } from "react";
import {
  Box,
  Container,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Alert,
  Typography,
  Fab,
  Tooltip,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import TaskAltIcon from "@mui/icons-material/TaskAlt";
import CancelIcon from "@mui/icons-material/Cancel";
import { useNavigate } from "react-router-dom";
import { getAgreements } from "../../api/client";
import { Agreement, AgreementStatus } from "../../types/agreement";
import { formatDate, formatDateTime, formatCondition } from "../../utils/formatters";
import { LoadingSpinner } from "../common/LoadingSpinner";

const getStatusIcon = (status: AgreementStatus) => {
  switch (status) {
    case AgreementStatus.READY_FOR_CALCULATION:
      return (
        <Tooltip title="Готово к расчёту">
          <CheckCircleOutlineIcon sx={{ color: "#1B8F5A", fontSize: 20 }} />
        </Tooltip>
      );
    case AgreementStatus.CALCULATED:
      return (
        <Tooltip title="Рассчитано">
          <TaskAltIcon sx={{ color: "#2C3140", fontSize: 20 }} />
        </Tooltip>
      );
    case AgreementStatus.DELETED:
      return (
        <Tooltip title="Удалено">
          <CancelIcon sx={{ color: "#A0A8B8", fontSize: 20 }} />
        </Tooltip>
      );
  }
};

export const AgreementsList: React.FC = () => {
  const navigate = useNavigate();
  const [agreements, setAgreements] = useState<Agreement[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchAgreements = async () => {
      try {
        const data = await getAgreements();
        setAgreements(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch agreements");
      } finally {
        setLoading(false);
      }
    };

    fetchAgreements();
  }, []);

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <Box sx={{ backgroundColor: "#F7F8FA", minHeight: "calc(100vh - 89px)" }}>
      <Container maxWidth="lg" sx={{ py: 4 }}>
        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        <TableContainer
          component={Paper}
          sx={{
            borderRadius: 2,
            overflow: "hidden",
            border: "1px solid #EBEDF0",
          }}
        >
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ width: 56 }}>Статус</TableCell>
                <TableCell>Наименование поставщика</TableCell>
                <TableCell>Действует с</TableCell>
                <TableCell>Действует по</TableCell>
                <TableCell>Тип соглашения</TableCell>
                <TableCell align="right">Условие</TableCell>
                <TableCell>Дата создания</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {agreements.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} align="center" sx={{ py: 6 }}>
                    <Typography variant="body1" color="text.secondary">
                      Соглашения не найдены
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                agreements.map((agreement) => (
                  <TableRow
                    key={agreement.id}
                    onClick={() => navigate(`/agreements/${agreement.id}`)}
                    sx={{
                      cursor: "pointer",
                      opacity: agreement.status === AgreementStatus.DELETED ? 0.5 : 1,
                      "&:hover": { backgroundColor: "#f8f9fa" },
                      transition: "background-color 0.2s, opacity 0.2s",
                    }}
                  >
                    <TableCell sx={{ textAlign: "center" }}>
                      {getStatusIcon(agreement.status)}
                    </TableCell>
                    <TableCell sx={{ fontWeight: 500 }}>{agreement.supplier_name}</TableCell>
                    <TableCell>{formatDate(agreement.valid_from)}</TableCell>
                    <TableCell>{formatDate(agreement.valid_to)}</TableCell>
                    <TableCell>
                      <Box
                        sx={{
                          display: "inline-block",
                          px: 2,
                          py: 0.5,
                          borderRadius: 2,
                          backgroundColor: "#F0F1F3",
                          color: "#5C6370",
                          fontSize: "0.75rem",
                          fontWeight: 500,
                        }}
                      >
                        {agreement.agreement_type_name}
                      </Box>
                    </TableCell>
                    <TableCell align="right" sx={{ fontWeight: 700, color: "#E30613", fontSize: "0.875rem" }}>
                      {formatCondition(agreement)}
                    </TableCell>
                    <TableCell sx={{ color: "text.secondary" }}>
                      {formatDateTime(agreement.created_at)}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>

        <Tooltip title="Создать новое соглашение" placement="left">
          <Fab
            color="primary"
            aria-label="создать соглашение"
            onClick={() => navigate("/agreements/create")}
            sx={{
              position: "fixed",
              bottom: 32,
              right: 32,
              width: 56,
              height: 56,
              borderRadius: 4,
              boxShadow: "0 4px 16px rgba(44, 49, 64, 0.35)",
              "&:hover": {
                boxShadow: "0 6px 24px rgba(44, 49, 64, 0.45)",
              },
            }}
          >
            <AddIcon sx={{ fontSize: 28 }} />
          </Fab>
        </Tooltip>
      </Container>
    </Box>
  );
};
