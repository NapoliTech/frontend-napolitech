import React from "react";
import { Box, Card, CircularProgress, Typography } from "@mui/material";
import PropTypes from "prop-types";

export default function CardLoad({ isLoading, message, isPositive }) {
  return (
    <Box
      sx={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 1300,
      }}
    >
      <Card
        sx={{
          width: "300px",
          padding: "24px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: 3,
          borderRadius: "8px", // Bordas arredondadas
          border: "1px solid #ddd",
          backgroundColor: isPositive ? "#E8F5E9" : "#FFEBEE", // Verde claro para positivo, vermelho claro para negativo
        }}
      >
        {isLoading ? (
          <CircularProgress color={isPositive ? "success" : "error"} />
        ) : (
          <Typography
            variant="h6"
            sx={{
              color: isPositive ? "#2E7D32" : "#C62828", // Verde escuro para positivo, vermelho escuro para negativo
              textAlign: "center",
              marginTop: "16px",
            }}
          >
            {message}
          </Typography>
        )}
      </Card>
    </Box>
  );
}

CardLoad.propTypes = {
  isLoading: PropTypes.bool.isRequired, // Indica se está carregando
  message: PropTypes.string, // Mensagem a ser exibida após o carregamento
  isPositive: PropTypes.bool, // Define se a mensagem é positiva ou negativa
};

CardLoad.defaultProps = {
  message: "",
  isPositive: true,
};