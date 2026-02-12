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
  Divider,
  Grid,
  IconButton,
  Menu,
  MenuItem,
  Paper,
  Stack,
  Tooltip,
  Typography,
  Alert,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import EditIcon from "@mui/icons-material/Edit";
import CalculateIcon from "@mui/icons-material/Calculate";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import RestoreIcon from "@mui/icons-material/Restore";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
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

const backButtonSx = {
  mr: 1,
  width: 36,
  height: 36,
  backgroundColor: "#F7F8FA",
  border: "1px solid #EBEDF0",
  borderRadius: 2.5,
  color: "#5C6370",
  "&:hover": { backgroundColor: "#EBEDF0" },
};

const SectionHeader: React.FC<{ title: string }> = ({ title }) => (
  <>
    <Typography
      variant="h6"
      sx={{
        fontFamily: '"Montserrat", sans-serif',
        fontWeight: 600,
        fontSize: "0.9375rem",
        color: "#2C3140",
        mb: 2,
      }}
    >
      {title}
    </Typography>
    <Divider sx={{ mb: 2 }} />
  </>
);

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

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

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
        <Container maxWidth="md">
          <Alert severity="error">{error}</Alert>
        </Container>
      </Box>
    );
  }

  if (!agreement) return null;

  const isDeleted = agreement.status === AgreementStatus.DELETED;
  const statusCfg = statusConfig[agreement.status];

  const detailRows = [
    { label: "Номер соглашения", value: agreement.code },
    { label: "Код поставщика", value: agreement.supplier_code },
    { label: "Наименование поставщика", value: agreement.supplier_name },
    { label: "Действует с", value: formatDate(agreement.valid_from) },
    { label: "Действует по", value: formatDate(agreement.valid_to) },
    { label: "Тип соглашения", value: agreement.agreement_type_name },
    { label: "Шкала", value: agreement.agreement_type_grid === "PERCENT" ? "Процент" : "Фикс" },
    { label: "Значение условия", value: formatCondition(agreement) },
  ];

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
        <Container maxWidth="md">
          <Paper sx={{ p: 4, border: "1px solid #EBEDF0" }}>
            <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
              <IconButton onClick={cancelEditing} sx={backButtonSx}>
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
      <Container maxWidth="md">
        <Stack spacing={3}>
          {/* Section 1: Header */}
          <Paper sx={{ p: 3, border: "1px solid #EBEDF0" }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
              <IconButton onClick={() => navigate("/agreements")} sx={backButtonSx}>
                <ArrowBackIcon />
              </IconButton>

              <Box sx={{ flex: 1, minWidth: 0 }}>
                <Typography
                  variant="h4"
                  sx={{
                    fontFamily: '"Montserrat", sans-serif',
                    fontWeight: 700,
                    fontSize: "1.25rem",
                    color: "#2C3140",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {agreement.supplier_name}
                </Typography>
                <Typography variant="caption" sx={{ color: "#5C6370" }}>
                  № {agreement.code} &bull; Поставщик: {agreement.supplier_code}
                </Typography>
              </Box>

              <Chip
                label={statusCfg.label}
                color={statusCfg.color}
                size="small"
              />

              <Tooltip title="Редактировать">
                <span>
                  <IconButton
                    onClick={startEditing}
                    disabled={isDeleted}
                    sx={{ color: "#2C3140" }}
                  >
                    <EditIcon />
                  </IconButton>
                </span>
              </Tooltip>

              <Tooltip title="Рассчитать (в разработке)">
                <span>
                  <IconButton disabled sx={{ color: "#5C6370" }}>
                    <CalculateIcon />
                  </IconButton>
                </span>
              </Tooltip>

              <IconButton onClick={(e) => setAnchorEl(e.currentTarget)}>
                <MoreVertIcon />
              </IconButton>
            </Box>
          </Paper>

          {error && (
            <Alert severity="error">{error}</Alert>
          )}

          {/* Section 2: Key Metrics */}
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", sm: "repeat(3, 1fr)" },
              gap: 2,
            }}
          >
            {/* Metric: Condition Value (hero) */}
            <Paper
              sx={{
                p: 2.5,
                border: "1px solid #EBEDF0",
                background: "linear-gradient(135deg, #FFF5F5 0%, #FFFFFF 100%)",
              }}
            >
              <Typography
                variant="caption"
                sx={{
                  color: "#5C6370",
                  textTransform: "uppercase",
                  letterSpacing: "0.5px",
                  fontSize: "0.6875rem",
                }}
              >
                Условие
              </Typography>
              <Typography
                sx={{
                  fontFamily: '"Montserrat", sans-serif',
                  fontWeight: 800,
                  fontSize: "1.75rem",
                  color: "#E30613",
                  lineHeight: 1.2,
                  mt: 0.5,
                }}
              >
                {formatCondition(agreement)}
              </Typography>
            </Paper>

            {/* Metric: Period */}
            <Paper sx={{ p: 2.5, border: "1px solid #EBEDF0" }}>
              <Typography
                variant="caption"
                sx={{
                  color: "#5C6370",
                  textTransform: "uppercase",
                  letterSpacing: "0.5px",
                  fontSize: "0.6875rem",
                }}
              >
                Период действия
              </Typography>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1, mt: 0.5 }}>
                <CalendarTodayIcon sx={{ fontSize: 18, color: "#5C6370" }} />
                <Typography
                  sx={{ fontWeight: 600, fontSize: "0.9375rem", color: "#2C3140" }}
                >
                  {formatDate(agreement.valid_from)} &mdash; {formatDate(agreement.valid_to)}
                </Typography>
              </Box>
            </Paper>

            {/* Metric: Agreement Type */}
            <Paper sx={{ p: 2.5, border: "1px solid #EBEDF0" }}>
              <Typography
                variant="caption"
                sx={{
                  color: "#5C6370",
                  textTransform: "uppercase",
                  letterSpacing: "0.5px",
                  fontSize: "0.6875rem",
                }}
              >
                Тип соглашения
              </Typography>
              <Box sx={{ mt: 0.75 }}>
                <Box
                  sx={{
                    display: "inline-block",
                    px: 2,
                    py: 0.5,
                    borderRadius: 2,
                    backgroundColor:
                      agreement.agreement_type_grid === "PERCENT"
                        ? "#EFF8F3"
                        : "#F0F1F3",
                    color:
                      agreement.agreement_type_grid === "PERCENT"
                        ? "#1B8F5A"
                        : "#5C6370",
                    fontSize: "0.8125rem",
                    fontWeight: 600,
                  }}
                >
                  {agreement.agreement_type_name}
                </Box>
              </Box>
            </Paper>
          </Box>

          {/* Section 3: Details */}
          <Paper sx={{ p: 3, border: "1px solid #EBEDF0" }}>
            <SectionHeader title="Подробности" />
            <Grid container spacing={1.5}>
              {detailRows.map(({ label, value }) => (
                <React.Fragment key={label}>
                  <Grid item xs={12} sm={4}>
                    <Typography variant="caption" sx={{ color: "#5C6370" }}>
                      {label}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={8}>
                    <Typography
                      sx={{ fontSize: "0.875rem", fontWeight: 500, color: "#2C3140" }}
                    >
                      {value}
                    </Typography>
                  </Grid>
                </React.Fragment>
              ))}
            </Grid>
          </Paper>

          {/* Section 4: Metadata */}
          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", sm: "row" },
              justifyContent: "space-between",
              px: 1,
            }}
          >
            <Typography variant="caption" sx={{ color: "#A0A8B8", fontSize: "0.75rem" }}>
              Создано: {formatDateTime(agreement.created_at)}
            </Typography>
            <Typography variant="caption" sx={{ color: "#A0A8B8", fontSize: "0.75rem" }}>
              Обновлено: {formatDateTime(agreement.updated_at)}
            </Typography>
          </Box>
        </Stack>
      </Container>

      {/* Overflow menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={() => setAnchorEl(null)}
      >
        {isDeleted ? (
          <MenuItem
            onClick={() => {
              handleRestore();
              setAnchorEl(null);
            }}
          >
            <RestoreIcon sx={{ mr: 1, fontSize: 20, color: "#1B8F5A" }} />
            Восстановить
          </MenuItem>
        ) : (
          <MenuItem
            onClick={() => {
              setDeleteDialogOpen(true);
              setAnchorEl(null);
            }}
            sx={{ color: "#E30613" }}
          >
            <DeleteOutlineIcon sx={{ mr: 1, fontSize: 20 }} />
            Удалить
          </MenuItem>
        )}
      </Menu>

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
