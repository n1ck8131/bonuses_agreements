import React, { useState } from "react";
import {
  Box,
  Button,
  Divider,
  Grid,
  InputAdornment,
  TextField,
  Typography,
  Alert,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { Dayjs } from "dayjs";
import "dayjs/locale/ru";
import { AgreementCreate, RefSupplier, RefAgreementType, RefScale } from "../../types/agreement";
import { SearchableSelect } from "../common/SearchableSelect";

export interface AgreementFormValues {
  validFrom: Dayjs | null;
  validTo: Dayjs | null;
  supplierCode: string;
  agreementTypeCode: string;
  scaleCode: string;
  conditionValue: string;
}

interface AgreementFormProps {
  initialValues?: AgreementFormValues;
  suppliers: RefSupplier[];
  agreementTypes: RefAgreementType[];
  scales: RefScale[];
  onSubmit: (data: AgreementCreate) => Promise<void>;
  onCancel: () => void;
  submitLabel: string;
  loadingLabel: string;
}

const defaultValues: AgreementFormValues = {
  validFrom: null,
  validTo: null,
  supplierCode: "",
  agreementTypeCode: "",
  scaleCode: "",
  conditionValue: "",
};

const sectionLabelSx = {
  color: "#5C6370",
  textTransform: "uppercase" as const,
  letterSpacing: "0.5px",
  fontSize: "0.6875rem",
  fontWeight: 600,
};

const FormSection: React.FC<{ title: string; children: React.ReactNode }> = ({
  title,
  children,
}) => (
  <Box sx={{ mb: 3 }}>
    <Typography variant="caption" sx={sectionLabelSx}>
      {title}
    </Typography>
    <Divider sx={{ mt: 0.75, mb: 2 }} />
    {children}
  </Box>
);

export const AgreementForm: React.FC<AgreementFormProps> = ({
  initialValues,
  suppliers,
  agreementTypes,
  scales,
  onSubmit,
  onCancel,
  submitLabel,
  loadingLabel,
}) => {
  const init = initialValues ?? defaultValues;
  const [validFrom, setValidFrom] = useState<Dayjs | null>(init.validFrom);
  const [validTo, setValidTo] = useState<Dayjs | null>(init.validTo);
  const [supplierCode, setSupplierCode] = useState(init.supplierCode);
  const [agreementTypeCode, setAgreementTypeCode] = useState(init.agreementTypeCode);
  const [scaleCode, setScaleCode] = useState(init.scaleCode);
  const [conditionValue, setConditionValue] = useState(init.conditionValue);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const selectedScale = scales.find((s) => s.code === scaleCode);
  const isPercent = selectedScale?.grid === "PERCENT";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!validFrom || !validTo || !supplierCode || !agreementTypeCode || !scaleCode || !conditionValue) {
      setError("Все поля обязательны для заполнения");
      return;
    }

    const value = parseFloat(conditionValue);
    if (isNaN(value) || value <= 0) {
      setError("Значение условия должно быть больше 0");
      return;
    }
    if (isPercent && value > 100) {
      setError("Для процентной шкалы значение не может превышать 100");
      return;
    }

    if (validTo.isBefore(validFrom)) {
      setError("Дата окончания должна быть больше или равна дате начала");
      return;
    }

    setLoading(true);
    try {
      await onSubmit({
        valid_from: validFrom.format("YYYY-MM-DD"),
        valid_to: validTo.format("YYYY-MM-DD"),
        supplier_code: supplierCode,
        agreement_type_code: agreementTypeCode,
        scale_code: scaleCode,
        condition_value: value,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Произошла ошибка");
    } finally {
      setLoading(false);
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="ru">
      <Box component="form" onSubmit={handleSubmit}>
        {/* Section 1: Period */}
        <FormSection title="Период действия">
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <DatePicker
                label="Действует с"
                value={validFrom}
                onChange={setValidFrom}
                format="DD.MM.YYYY"
                slotProps={{
                  textField: {
                    fullWidth: true,
                    required: true,
                    placeholder: "ДД.ММ.ГГГГ",
                  },
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <DatePicker
                label="Действует по"
                value={validTo}
                onChange={setValidTo}
                format="DD.MM.YYYY"
                slotProps={{
                  textField: {
                    fullWidth: true,
                    required: true,
                    placeholder: "ДД.ММ.ГГГГ",
                  },
                }}
              />
            </Grid>
          </Grid>
        </FormSection>

        {/* Section 2: Supplier */}
        <FormSection title="Поставщик">
          <SearchableSelect
            options={suppliers}
            value={supplierCode}
            onChange={setSupplierCode}
            label="Поставщик"
            required
          />
        </FormSection>

        {/* Section 3: Agreement conditions */}
        <FormSection title="Условия соглашения">
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <SearchableSelect
                options={agreementTypes}
                value={agreementTypeCode}
                onChange={setAgreementTypeCode}
                label="Вид соглашения"
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <SearchableSelect
                options={scales}
                value={scaleCode}
                onChange={setScaleCode}
                label="Шкала"
                required
              />
            </Grid>
            <Grid item xs={12} sm={5}>
              <TextField
                fullWidth
                label={isPercent ? "Условие, %" : "Условие, руб."}
                type="number"
                value={conditionValue}
                onChange={(e) => setConditionValue(e.target.value)}
                inputProps={{
                  step: "0.01",
                  min: "0.01",
                  ...(isPercent ? { max: "100" } : {}),
                }}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      {isPercent ? "%" : "руб."}
                    </InputAdornment>
                  ),
                }}
                required
                placeholder={isPercent ? "Например: 5.50" : "Например: 10000.00"}
              />
            </Grid>
          </Grid>
        </FormSection>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {/* Actions */}
        <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2, mt: 1 }}>
          <Button
            variant="outlined"
            onClick={onCancel}
            disabled={loading}
            sx={{ minWidth: 120 }}
          >
            Отмена
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={loading}
            sx={{ minWidth: 160 }}
          >
            {loading ? loadingLabel : submitLabel}
          </Button>
        </Box>
      </Box>
    </LocalizationProvider>
  );
};
