import React from "react";
import { Button, CircularProgress } from "@mui/material";

/**
 * Botão com estado de loading integrado
 * Previne múltiplos cliques e mostra feedback visual
 */
export default function LoadingButton({
  children,
  loading = false,
  disabled = false,
  onClick,
  type = "submit",
  variant = "contained",
  fullWidth = true,
  color = "primary",
  size = "large",
  sx = {},
  ...props
}) {
  return (
    <Button
      type={type}
      variant={variant}
      fullWidth={fullWidth}
      color={color}
      size={size}
      disabled={loading || disabled}
      onClick={onClick}
      sx={{
        py: { xs: 1.2, sm: 1.5 },
        fontSize: { xs: "0.95rem", sm: "1rem" },
        fontWeight: 600,
        textTransform: "none",
        position: "relative",
        ...sx,
      }}
      {...props}
    >
      {loading ? (
        <>
          <CircularProgress
            size={24}
            sx={{
              color: "white",
              position: "absolute",
              top: "50%",
              left: "50%",
              marginTop: "-12px",
              marginLeft: "-12px",
            }}
          />
          <span style={{ visibility: "hidden" }}>{children}</span>
        </>
      ) : (
        children
      )}
    </Button>
  );
}
