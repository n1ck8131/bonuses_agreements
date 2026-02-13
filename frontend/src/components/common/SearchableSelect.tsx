import React from "react";
import { Autocomplete, Box, TextField, Typography } from "@mui/material";

export interface SearchableSelectOption {
  code: string;
  name: string;
}

interface SearchableSelectProps<T extends SearchableSelectOption> {
  options: T[];
  value: string;
  onChange: (code: string) => void;
  label: string;
  required?: boolean;
  /** Show code as secondary text below name. Default: true for lists > 10 items */
  showCode?: boolean;
  /** Custom filter function. Default: matches name + code case-insensitively */
  filterOptions?: (options: T[], inputValue: string) => T[];
  /** Custom option label for the input field. Default: "name (code)" */
  getInputLabel?: (option: T) => string;
}

export function SearchableSelect<T extends SearchableSelectOption>({
  options,
  value,
  onChange,
  label,
  required,
  showCode,
  filterOptions: customFilter,
  getInputLabel,
}: SearchableSelectProps<T>) {
  const selected = options.find((o) => o.code === value) ?? null;
  const shouldShowCode = showCode ?? options.length > 10;

  const defaultFilter = (opts: T[], inputValue: string): T[] => {
    const q = inputValue.toLowerCase();
    if (!q) return opts;
    return opts.filter(
      (o) =>
        o.name.toLowerCase().includes(q) || o.code.toLowerCase().includes(q)
    );
  };

  const filterFn = customFilter ?? defaultFilter;

  const defaultInputLabel = (option: T): string =>
    `${option.name} (${option.code})`;

  const inputLabelFn = getInputLabel ?? defaultInputLabel;

  return (
    <Autocomplete<T, false, false, false>
      options={options}
      value={selected}
      onChange={(_e, newValue) => {
        onChange(newValue ? newValue.code : "");
      }}
      getOptionLabel={(option) => inputLabelFn(option)}
      filterOptions={(opts, state) => filterFn(opts, state.inputValue)}
      isOptionEqualToValue={(option, val) => option.code === val.code}
      noOptionsText="Ничего не найдено"
      renderOption={(props, option) => (
        <li {...props} key={option.code}>
          <Box>
            <Typography variant="body2" sx={{ fontWeight: 500, lineHeight: 1.3 }}>
              {option.name}
            </Typography>
            {shouldShowCode && (
              <Typography variant="caption" sx={{ color: "#5C6370" }}>
                {option.code}
              </Typography>
            )}
          </Box>
        </li>
      )}
      renderInput={(params) => (
        <TextField {...params} label={label} required={required} />
      )}
    />
  );
}
