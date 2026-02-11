import React from "react";
import { Button, CircularProgress } from "@mui/material";

/**
 * Botão Call-to-Action customizado e consistente
 * Usado para ações primárias importantes
 */
export default function ButtonCTA({
  children,
  loading = false,
  disabled = false,
  variant = "contained",
  cor = "#B72A23",
  corTexto = "#fff",
  fullWidth = false,
  tamanho = "large",
  onClick,
  startIcon,
  endIcon,
  ...props
}) {
  return (
    <Button
      variant={variant}
      size={tamanho}
      fullWidth={fullWidth}
      disabled={disabled || loading}
      onClick={onClick}
      startIcon={!loading && startIcon}
      endIcon={!loading && endIcon}
      sx={{
        backgroundColor: cor,
        color: corTexto,
        fontWeight: "bold",
        textTransform: "uppercase",
        fontSize: tamanho === "large" ? "1rem" : "0.875rem",
        padding: tamanho === "large" ? "12px 32px" : "8px 24px",
        borderRadius: "8px",
        boxShadow: 3,
        transition: "all 0.3s ease",
        "&:hover": {
          backgroundColor: cor,
          filter: "brightness(0.9)",
          boxShadow: 6,
          transform: "translateY(-2px)",
        },
        "&:active": {
          transform: "translateY(0)",
        },
        "&:disabled": {
          backgroundColor: "#ccc",
          color: "#666",
          boxShadow: 0,
        },
        ...props.sx,
      }}
      {...props}
    >
      {loading ? (
        <CircularProgress size={24} sx={{ color: corTexto }} />
      ) : (
        children
      )}
    </Button>
  );
}
