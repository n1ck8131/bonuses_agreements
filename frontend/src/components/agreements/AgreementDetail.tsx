import React, { useEffect, useState } from "react";
import {
  Alert,
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
  InputAdornment,
  Paper,
  Stack,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import CalculateIcon from "@mui/icons-material/Calculate";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import RestoreIcon from "@mui/icons-material/Restore";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import dayjs, { Dayjs } from "dayjs";
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
import { SearchableSelect } from "../common/SearchableSelect";

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

  const { suppliers, agreementTypes, scales } = useReferenceData();

  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    validFrom: null as Dayjs | null,
    validTo: null as Dayjs | null,
    supplierCode: "",
    agreementTypeCode: "",
    scaleCode: "",
    conditionValue: "",
  });
  const [saveError, setSaveError] = useState("");
  const [saving, setSaving] = useState(false);

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
    if (!agreement) return;
    setEditForm({
      validFrom: dayjs(agreement.valid_from),
      validTo: dayjs(agreement.valid_to),
      supplierCode: agreement.supplier_code,
      agreementTypeCode: agreement.agreement_type_code,
      scaleCode: agreement.scale_code,
      conditionValue: String(agreement.condition_value),
    });
    setSaveError("");
    setIsEditing(true);
  };

  const cancelEditing = () => {
    setIsEditing(false);
    setSaveError("");
  };

  const handleSave = async () => {
    if (!id) return;
    const { validFrom, validTo, supplierCode, agreementTypeCode, scaleCode, conditionValue } = editForm;

    if (!validFrom || !validTo || !supplierCode || !agreementTypeCode || !scaleCode || !conditionValue) {
      setSaveError("Все поля обязательны для заполнения");
      return;
    }

    const value = parseFloat(conditionValue);
    if (isNaN(value) || value <= 0) {
      setSaveError("Значение условия должно быть больше 0");
      return;
    }

    const selectedScale = scales.find((s) => s.code === scaleCode);
    if (selectedScale?.grid === "PERCENT" && value > 100) {
      setSaveError("Для процентной шкалы значение не может превышать 100");
      return;
    }

    if (validTo.isBefore(validFrom)) {
      setSaveError("Дата окончания должна быть позже даты начала");
      return;
    }

    setSaving(true);
    setSaveError("");
    try {
      const updated = await updateAgreement(id, {
        valid_from: validFrom.format("YYYY-MM-DD"),
        valid_to: validTo.format("YYYY-MM-DD"),
        supplier_code: supplierCode,
        agreement_type_code: agreementTypeCode,
        scale_code: scaleCode,
        condition_value: value,
      });
      setAgreement(updated);
      setIsEditing(false);
    } catch (err) {
      setSaveError(err instanceof Error ? err.message : "Ошибка сохранения");
    } finally {
      setSaving(false);
    }
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

  if (loading) return <LoadingSpinner />;

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

  const editSelectedScale = scales.find((s) => s.code === editForm.scaleCode);
  const editIsPercent = editSelectedScale?.grid === "PERCENT";

  const detailRows = [
    { label: "Номер соглашения", value: agreement.code },
    { label: "Код поставщика", value: agreement.supplier_code },
    { label: "Наименование поставщика", value: agreement.supplier_name },
    { label: "Действует с", value: formatDate(agreement.valid_from) },
    { label: "Действует по", value: formatDate(agreement.valid_to) },
    { label: "Вид соглашения", value: agreement.agreement_type_name },
    { label: "Шкала", value: agreement.scale_name },
    { label: "Значение условия", value: formatCondition(agreement) },
  ];

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="ru">
      <Box sx={{ backgroundColor: "#F7F8FA", minHeight: "calc(100vh - 89px)", py: 4 }}>
        <Container maxWidth="md">
          <Stack spacing={3}>
            {/* Section 1: Header */}
            <Paper sx={{ p: 3, border: "1px solid #EBEDF0" }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                <IconButton
                  onClick={() => (isEditing ? cancelEditing() : navigate("/agreements"))}
                  sx={backButtonSx}
                >
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

                <Chip label={statusCfg.label} color={statusCfg.color} size="small" />

                {isEditing ? (
                  <>
                    <Button
                      variant="contained"
                      onClick={handleSave}
                      disabled={saving}
                      startIcon={<SaveIcon />}
                      sx={{ textTransform: "none", fontWeight: 600, minWidth: 130 }}
                    >
                      {saving ? "Сохранение..." : "Сохранить"}
                    </Button>
                    <Button
                      variant="outlined"
                      onClick={cancelEditing}
                      disabled={saving}
                      sx={{ textTransform: "none" }}
                    >
                      Отмена
                    </Button>
                  </>
                ) : (
                  <>
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

                    {isDeleted ? (
                      <Tooltip title="Восстановить">
                        <IconButton onClick={handleRestore} sx={{ color: "#1B8F5A" }}>
                          <RestoreIcon />
                        </IconButton>
                      </Tooltip>
                    ) : (
                      <Tooltip title="Удалить">
                        <IconButton
                          onClick={() => setDeleteDialogOpen(true)}
                          sx={{ color: "#E30613" }}
                        >
                          <DeleteOutlineIcon />
                        </IconButton>
                      </Tooltip>
                    )}
                  </>
                )}
              </Box>
            </Paper>

            {(error || saveError) && <Alert severity="error">{saveError || error}</Alert>}

            {isEditing ? (
              /* ====== INLINE EDIT MODE ====== */
              <Paper sx={{ p: 3, border: "1px solid #EBEDF0" }}>
                {/* Supplier */}
                <Box sx={{ mb: 3 }}>
                  <SectionHeader title="Поставщик" />
                  <SearchableSelect
                    options={suppliers}
                    value={editForm.supplierCode}
                    onChange={(code) =>
                      setEditForm((prev) => ({ ...prev, supplierCode: code }))
                    }
                    label="Поставщик"
                    required
                  />
                </Box>

                {/* Period */}
                <Box sx={{ mb: 3 }}>
                  <SectionHeader title="Период действия" />
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <DatePicker
                        label="Действует с"
                        value={editForm.validFrom}
                        onChange={(v) =>
                          setEditForm((prev) => ({ ...prev, validFrom: v }))
                        }
                        format="DD.MM.YYYY"
                        slotProps={{
                          textField: { fullWidth: true, required: true },
                        }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <DatePicker
                        label="Действует по"
                        value={editForm.validTo}
                        onChange={(v) =>
                          setEditForm((prev) => ({ ...prev, validTo: v }))
                        }
                        format="DD.MM.YYYY"
                        slotProps={{
                          textField: { fullWidth: true, required: true },
                        }}
                      />
                    </Grid>
                  </Grid>
                </Box>

                {/* Agreement conditions */}
                <Box>
                  <SectionHeader title="Условия соглашения" />
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <SearchableSelect
                        options={agreementTypes}
                        value={editForm.agreementTypeCode}
                        onChange={(code) =>
                          setEditForm((prev) => ({
                            ...prev,
                            agreementTypeCode: code,
                          }))
                        }
                        label="Вид соглашения"
                        required
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <SearchableSelect
                        options={scales}
                        value={editForm.scaleCode}
                        onChange={(code) =>
                          setEditForm((prev) => ({
                            ...prev,
                            scaleCode: code,
                          }))
                        }
                        label="Шкала"
                        required
                      />
                    </Grid>
                    <Grid item xs={12} sm={5}>
                      <TextField
                        fullWidth
                        label={editIsPercent ? "Условие, %" : "Условие, руб."}
                        type="number"
                        value={editForm.conditionValue}
                        onChange={(e) =>
                          setEditForm((prev) => ({
                            ...prev,
                            conditionValue: e.target.value,
                          }))
                        }
                        inputProps={{
                          step: "0.01",
                          min: "0.01",
                          ...(editIsPercent ? { max: "100" } : {}),
                        }}
                        InputProps={{
                          endAdornment: (
                            <InputAdornment position="end">
                              {editIsPercent ? "%" : "руб."}
                            </InputAdornment>
                          ),
                        }}
                        required
                      />
                    </Grid>
                  </Grid>
                </Box>
              </Paper>
            ) : (
              /* ====== VIEW MODE ====== */
              <>
                {/* Key Metrics */}
                <Box
                  sx={{
                    display: "grid",
                    gridTemplateColumns: { xs: "1fr", sm: "repeat(3, 1fr)" },
                    gap: 2,
                  }}
                >
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
                        {formatDate(agreement.valid_from)} &mdash;{" "}
                        {formatDate(agreement.valid_to)}
                      </Typography>
                    </Box>
                  </Paper>

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
                      Вид соглашения
                    </Typography>
                    <Box sx={{ mt: 0.75 }}>
                      <Box
                        sx={{
                          display: "inline-block",
                          px: 2,
                          py: 0.5,
                          borderRadius: 2,
                          backgroundColor: "#F0F1F3",
                          color: "#5C6370",
                          fontSize: "0.8125rem",
                          fontWeight: 600,
                        }}
                      >
                        {agreement.agreement_type_name}
                      </Box>
                    </Box>
                  </Paper>
                </Box>

                {/* Details */}
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
                            sx={{
                              fontSize: "0.875rem",
                              fontWeight: 500,
                              color: "#2C3140",
                            }}
                          >
                            {value}
                          </Typography>
                        </Grid>
                      </React.Fragment>
                    ))}
                  </Grid>
                </Paper>
              </>
            )}

            {/* Metadata */}
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

        {/* Delete confirmation dialog */}
        <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
          <DialogTitle>Удаление соглашения</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Вы уверены, что хотите удалить соглашение с поставщиком
              &laquo;{agreement.supplier_name}&raquo;? Соглашение будет помечено как
              удалённое и станет недоступно для расчёта.
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
    </LocalizationProvider>
  );
};
