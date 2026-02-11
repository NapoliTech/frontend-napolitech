import React from "react";
import { Box, LinearProgress, Typography } from "@mui/material";

/**
 * Indicador visual de força de senha
 * Aplica feedback em tempo real sem bloquear o usuário
 */
export default function PasswordStrength({ password }) {
  const calculateStrength = (pwd) => {
    if (!pwd) return { score: 0, label: "", color: "error" };

    let score = 0;
    const checks = {
      length: pwd.length >= 8,
      hasUpperCase: /[A-Z]/.test(pwd),
      hasLowerCase: /[a-z]/.test(pwd),
      hasNumber: /\d/.test(pwd),
      hasSpecial: /[!@#$%^&*(),.?":{}|<>]/.test(pwd),
    };

    // Pontuação
    if (checks.length) score += 20;
    if (pwd.length >= 12) score += 10;
    if (checks.hasUpperCase) score += 20;
    if (checks.hasLowerCase) score += 10;
    if (checks.hasNumber) score += 20;
    if (checks.hasSpecial) score += 20;

    // Classificação
    if (score < 40) return { score: 33, label: "Fraca", color: "error" };
    if (score < 70) return { score: 66, label: "Média", color: "warning" };
    return { score: 100, label: "Forte", color: "success" };
  };

  const strength = calculateStrength(password);

  if (!password) return null;

  return (
    <Box sx={{ mt: 1 }}>
      <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 0.5 }}>
        <Typography variant="caption" sx={{ fontSize: "0.75rem" }}>
          Força da senha:
        </Typography>
        <Typography
          variant="caption"
          sx={{
            fontWeight: "bold",
            fontSize: "0.75rem",
            color: `${strength.color}.main`,
          }}
        >
          {strength.label}
        </Typography>
      </Box>
      <LinearProgress
        variant="determinate"
        value={strength.score}
        color={strength.color}
        sx={{ height: 4, borderRadius: 2 }}
      />
      <Typography
        variant="caption"
        sx={{ display: "block", mt: 0.5, fontSize: "0.7rem", color: "text.secondary" }}
      >
        Use 8+ caracteres, maiúsculas, números e símbolos
      </Typography>
    </Box>
  );
}
