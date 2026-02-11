import React from "react";
import { Box, CircularProgress } from "@mui/material";

/**
 * Componente de carregamento simples e consistente
 */
export default function LoadingState({ tamanho = 40, cor = "primary" }) {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        width: "100%",
        minHeight: "200px",
        padding: 3,
      }}
    >
      <CircularProgress size={tamanho} color={cor} />
    </Box>
  );
}
