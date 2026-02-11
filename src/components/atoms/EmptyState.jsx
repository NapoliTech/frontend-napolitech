import React from "react";
import { Box, Typography } from "@mui/material";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";

/**
 * Componente para estado vazio ou mensagens informativas
 */
export default function EmptyState({
  titulo = "Nenhum item encontrado",
  mensagem = "",
  icone: IconeCustomizado = ErrorOutlineIcon,
  acao,
}) {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: 4,
        textAlign: "center",
        minHeight: "200px",
      }}
    >
      <IconeCustomizado
        sx={{
          fontSize: 64,
          color: "text.secondary",
          marginBottom: 2,
        }}
      />
      <Typography
        variant="h6"
        color="text.secondary"
        gutterBottom
        sx={{ fontWeight: 500 }}
      >
        {titulo}
      </Typography>
      {mensagem && (
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          {mensagem}
        </Typography>
      )}
      {acao && <Box sx={{ mt: 2 }}>{acao}</Box>}
    </Box>
  );
}
