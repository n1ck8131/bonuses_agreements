import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Chip,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  Paper,
  Tooltip,
  Typography,
  Alert,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import EditIcon from "@mui/icons-material/Edit";
import CalculateIcon from "@mui/icons-material/Calculate";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import RestoreIcon from "@mui/icons-material/Restore";
import dayjs from "dayjs";
import "dayjs/locale/ru";
import { useNavigate, useParams } from "react-router-dom";
import {
  getAgreement,
  updateAgreement,
  updateAgreementStatus,
} from "../../api/client";
import { Agreement, AgreementCreate, AgreementStatus } from "../../types/agreement";
import { useReferenceData } from "../../hooks/useReferenceData";
import { formatDate, formatDateTime, formatCondition } from "../../utils/formatters";
import { statusConfig } from "../../utils/statusConfig";
import { LoadingSpinner } from "../common/LoadingSpinner";
import { AgreementForm, AgreementFormValues } from "./AgreementForm";

export const AgreementDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [agreement, setAgreement] = useState<Agreement | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const { suppliers, agreementTypes } = useReferenceData();

  const [isEditing, setIsEditing] = useState(false);

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      if (!id) return;
      try {
        const data = await getAgreement(id);
        setAgreement(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Не удалось загрузить соглашение");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const startEditing = () => {
    setIsEditing(true);
  };

  const cancelEditing = () => {
    setIsEditing(false);
  };

  const handleSave = async (data: AgreementCreate) => {
    if (!id) return;
    const updated = await updateAgreement(id, data);
    setAgreement(updated);
    setIsEditing(false);
  };

  const handleDelete = async () => {
    if (!id) return;
    setDeleting(true);
    try {
      const updated = await updateAgreementStatus(id, AgreementStatus.DELETED);
      setAgreement(updated);
      setDeleteDialogOpen(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Не удалось удалить соглашение");
    } finally {
      setDeleting(false);
    }
  };

  const handleRestore = async () => {
    if (!id) return;
    try {
      const updated = await updateAgreementStatus(id, AgreementStatus.READY_FOR_CALCULATION);
      setAgreement(updated);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Не удалось восстановить соглашение");
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error && !agreement) {
    return (
      <Box sx={{ backgroundColor: "#F7F8FA", minHeight: "calc(100vh - 89px)", py: 4 }}>
        <Container maxWidth="sm">
          <Alert severity="error">{error}</Alert>
        </Container>
      </Box>
    );
  }

  if (!agreement) return null;

  const isDeleted = agreement.status === AgreementStatus.DELETED;
  const statusCfg = statusConfig[agreement.status];

  // Edit mode
  if (isEditing) {
    const editValues: AgreementFormValues = {
      validFrom: dayjs(agreement.valid_from),
      validTo: dayjs(agreement.valid_to),
      supplierCode: agreement.supplier_code,
      agreementTypeCode: agreement.agreement_type_code,
      conditionValue: String(agreement.condition_value),
    };

    return (
      <Box sx={{ backgroundColor: "#F7F8FA", minHeight: "calc(100vh - 89px)", py: 4 }}>
        <Container maxWidth="sm">
          <Paper sx={{ p: 4, border: "1px solid #EBEDF0" }}>
            <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
              <IconButton
                onClick={cancelEditing}
                sx={{
                  mr: 1,
                  width: 36,
                  height: 36,
                  backgroundColor: "#F7F8FA",
                  border: "1px solid #EBEDF0",
                  borderRadius: 2.5,
                  color: "#5C6370",
                  "&:hover": { backgroundColor: "#EBEDF0" },
                }}
              >
                <ArrowBackIcon />
              </IconButton>
              <Typography
                variant="h4"
                sx={{
                  fontFamily: '"Montserrat", sans-serif',
                  fontWeight: 700,
                  fontSize: "1.25rem",
                  color: "#2C3140",
                }}
              >
                Редактирование соглашения
              </Typography>
            </Box>

            <AgreementForm
              initialValues={editValues}
              suppliers={suppliers}
              agreementTypes={agreementTypes}
              onSubmit={handleSave}
              onCancel={cancelEditing}
              submitLabel="Сохранить"
              loadingLabel="Сохранение..."
            />
          </Paper>
        </Container>
      </Box>
    );
  }

  // View mode
  return (
    <Box sx={{ backgroundColor: "#F7F8FA", minHeight: "calc(100vh - 89px)", py: 4 }}>
      <Container maxWidth="sm">
        <Paper sx={{ p: 4, border: "1px solid #EBEDF0" }}>
          <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
            <IconButton
              onClick={() => navigate("/agreements")}
              sx={{
                mr: 1,
                width: 36,
                height: 36,
                backgroundColor: "#F7F8FA",
                border: "1px solid #EBEDF0",
                borderRadius: 2.5,
                color: "#5C6370",
                "&:hover": { backgroundColor: "#EBEDF0" },
              }}
            >
              <ArrowBackIcon />
            </IconButton>
            <Typography
              variant="h4"
              sx={{
                fontFamily: '"Montserrat", sans-serif',
                fontWeight: 700,
                fontSize: "1.25rem",
                color: "#2C3140",
                flex: 1,
              }}
            >
              Соглашение
            </Typography>
            <Chip
              label={statusCfg.label}
              color={statusCfg.color}
              size="small"
              variant="outlined"
            />
          </Box>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <Box sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>
            <Box>
              <Typography variant="caption" color="text.secondary">
                Наименование поставщика
              </Typography>
              <Typography variant="body1" sx={{ fontWeight: 500 }}>
                {agreement.supplier_name}
              </Typography>
            </Box>

            <Box sx={{ display: "flex", gap: 4 }}>
              <Box>
                <Typography variant="caption" color="text.secondary">
                  Действует с
                </Typography>
                <Typography variant="body1">{formatDate(agreement.valid_from)}</Typography>
              </Box>
              <Box>
                <Typography variant="caption" color="text.secondary">
                  Действует по
                </Typography>
                <Typography variant="body1">{formatDate(agreement.valid_to)}</Typography>
              </Box>
            </Box>

            <Box sx={{ display: "flex", gap: 4 }}>
              <Box>
                <Typography variant="caption" color="text.secondary">
                  Тип соглашения
                </Typography>
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
                    mt: 0.5,
                  }}
                >
                  {agreement.agreement_type_name}
                </Box>
              </Box>
              <Box>
                <Typography variant="caption" color="text.secondary">
                  Условие
                </Typography>
                <Typography
                  variant="body1"
                  sx={{ fontWeight: 700, color: "#E30613", fontSize: "1rem" }}
                >
                  {formatCondition(agreement)}
                </Typography>
              </Box>
            </Box>

            <Box sx={{ display: "flex", gap: 4 }}>
              <Box>
                <Typography variant="caption" color="text.secondary">
                  Создано
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {formatDateTime(agreement.created_at)}
                </Typography>
              </Box>
              <Box>
                <Typography variant="caption" color="text.secondary">
                  Обновлено
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {formatDateTime(agreement.updated_at)}
                </Typography>
              </Box>
            </Box>
          </Box>

          <Box sx={{ mt: 4, display: "flex", gap: 2, flexWrap: "wrap" }}>
            <Button
              variant="contained"
              startIcon={<EditIcon />}
              onClick={startEditing}
              disabled={isDeleted}
            >
              Редактировать
            </Button>
            <Tooltip title="Функция в разработке">
              <span>
                <Button variant="outlined" startIcon={<CalculateIcon />} disabled>
                  Рассчитать
                </Button>
              </span>
            </Tooltip>
            {isDeleted ? (
              <Button
                variant="outlined"
                color="success"
                startIcon={<RestoreIcon />}
                onClick={handleRestore}
              >
                Восстановить
              </Button>
            ) : (
              <Button
                variant="outlined"
                color="error"
                startIcon={<DeleteOutlineIcon />}
                onClick={() => setDeleteDialogOpen(true)}
              >
                Удалить
              </Button>
            )}
          </Box>
        </Paper>
      </Container>

      {/* Delete confirmation dialog */}
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Удаление соглашения</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Вы уверены, что хотите удалить соглашение с поставщиком &laquo;{agreement.supplier_name}&raquo;?
            Соглашение будет помечено как удалённое и станет недоступно для расчёта.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)} disabled={deleting}>
            Отмена
          </Button>
          <Button onClick={handleDelete} color="error" disabled={deleting}>
            {deleting ? "Удаление..." : "Удалить"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};
