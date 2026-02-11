import React from "react";
import { Alert, Collapse } from "@mui/material";

/**
 * Componente para exibir feedback de erros ou sucesso
 * Substitui alerts nativos e spans genéricos
 */
export default function FormFeedback({ 
  message, 
  severity = "error", 
  show = false,
  onClose,
  sx = {} 
}) {
  if (!message) return null;

  return (
    <Collapse in={show}>
      <Alert 
        severity={severity} 
        onClose={onClose}
        sx={{ 
          mb: 2,
          ...sx 
        }}
      >
        {message}
      </Alert>
    </Collapse>
  );
}
