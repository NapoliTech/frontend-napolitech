import React from "react";
import { TextField } from "@mui/material";

/**
 * Campo de input com validação integrada e feedback visual
 * Accessível e com estados claros de erro
 */
export default function InputField({
  label,
  type = "text",
  value,
  onChange,
  onBlur,
  error = false,
  helperText = "",
  required = false,
  fullWidth = true,
  autoComplete,
  placeholder,
  disabled = false,
  ...props
}) {
  return (
    <TextField
      label={label}
      type={type}
      value={value}
      onChange={onChange}
      onBlur={onBlur}
      error={error}
      helperText={helperText}
      required={required}
      fullWidth={fullWidth}
      autoComplete={autoComplete}
      placeholder={placeholder}
      disabled={disabled}
      variant="outlined"
      sx={{
        "& .MuiOutlinedInput-root": {
          "&:hover fieldset": {
            borderColor: error ? "error.main" : "primary.main",
          },
          "&.Mui-focused fieldset": {
            borderWidth: 2,
          },
        },
      }}
      {...props}
    />
  );
}
