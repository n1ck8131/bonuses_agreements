import React, { useState } from "react";
import {
  Box,
  Button,
  FormControl,
  InputAdornment,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Alert,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { Dayjs } from "dayjs";
import "dayjs/locale/ru";
import { AgreementCreate, RefSupplier, RefAgreementType } from "../../types/agreement";

export interface AgreementFormValues {
  validFrom: Dayjs | null;
  validTo: Dayjs | null;
  supplierCode: string;
  agreementTypeCode: string;
  conditionValue: string;
}

interface AgreementFormProps {
  initialValues?: AgreementFormValues;
  suppliers: RefSupplier[];
  agreementTypes: RefAgreementType[];
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
  conditionValue: "",
};

export const AgreementForm: React.FC<AgreementFormProps> = ({
  initialValues,
  suppliers,
  agreementTypes,
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
  const [conditionValue, setConditionValue] = useState(init.conditionValue);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const selectedType = agreementTypes.find((t) => t.code === agreementTypeCode);
  const isPercent = selectedType?.grid === "PERCENT";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!validFrom || !validTo || !supplierCode || !agreementTypeCode || !conditionValue) {
      setError("Все поля обязательны для заполнения");
      return;
    }

    const value = parseFloat(conditionValue);
    if (isNaN(value) || value <= 0) {
      setError("Значение условия должно быть больше 0");
      return;
    }
    if (isPercent && value > 100) {
      setError("Для процентного типа значение не может превышать 100");
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
        condition_value: value,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Произошла ошибка");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit}>
      <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="ru">
        <DatePicker
          label="Действует с"
          value={validFrom}
          onChange={setValidFrom}
          format="DD.MM.YYYY"
          slotProps={{
            textField: {
              fullWidth: true,
              margin: "normal",
              required: true,
              placeholder: "ДД.ММ.ГГГГ",
            },
          }}
        />
        <DatePicker
          label="Действует по"
          value={validTo}
          onChange={setValidTo}
          format="DD.MM.YYYY"
          slotProps={{
            textField: {
              fullWidth: true,
              margin: "normal",
              required: true,
              placeholder: "ДД.ММ.ГГГГ",
            },
          }}
        />
      </LocalizationProvider>
      <FormControl fullWidth margin="normal" required>
        <InputLabel>Поставщик</InputLabel>
        <Select
          value={supplierCode}
          label="Поставщик"
          onChange={(e) => setSupplierCode(e.target.value)}
        >
          {suppliers.map((s) => (
            <MenuItem key={s.code} value={s.code}>
              {s.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <FormControl fullWidth margin="normal" required>
        <InputLabel>Тип соглашения</InputLabel>
        <Select
          value={agreementTypeCode}
          label="Тип соглашения"
          onChange={(e) => setAgreementTypeCode(e.target.value)}
        >
          {agreementTypes.map((t) => (
            <MenuItem key={t.code} value={t.code}>
              {t.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <TextField
        fullWidth
        margin="normal"
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
      {error && (
        <Alert severity="error" sx={{ mt: 2 }}>
          {error}
        </Alert>
      )}
      <Box sx={{ mt: 4, display: "flex", gap: 2 }}>
        <Button type="submit" variant="contained" disabled={loading} fullWidth>
          {loading ? loadingLabel : submitLabel}
        </Button>
        <Button
          variant="outlined"
          onClick={onCancel}
          disabled={loading}
          sx={{ minWidth: 120 }}
        >
          Отмена
        </Button>
      </Box>
    </Box>
  );
};
