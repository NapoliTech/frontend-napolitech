import React, { useState } from "react";
import {
  TextField,
  InputAdornment,
  IconButton,
  Tooltip,
} from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";

/**
 * Campo de senha com toggle show/hide
 * Melhora segurança e usabilidade
 */
export default function PasswordField({
  label,
  value,
  onChange,
  onBlur,
  error = false,
  helperText = "",
  required = false,
  fullWidth = true,
  autoComplete = "current-password",
  placeholder,
  disabled = false,
  showStrength = false,
  ...props
}) {
  const [showPassword, setShowPassword] = useState(false);

  const handleToggleVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  return (
    <TextField
      label={label}
      type={showPassword ? "text" : "password"}
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
      InputProps={{
        endAdornment: (
          <InputAdornment position="end">
            <Tooltip title={showPassword ? "Ocultar senha" : "Mostrar senha"}>
              <IconButton
                onClick={handleToggleVisibility}
                edge="end"
                aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
                size="small"
              >
                {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
              </IconButton>
            </Tooltip>
          </InputAdornment>
        ),
      }}
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
