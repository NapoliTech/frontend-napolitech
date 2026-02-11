import React from "react";
import { Box, Typography, Divider } from "@mui/material";

/**
 * Componente para exibir o resumo de preços do pedido
 */
export default function ResumoPreco({
  subtotalPizzas = 0,
  subtotalBebidas = 0,
  taxaEntrega = 0,
  desconto = 0,
  mostrarDetalhes = true,
}) {
  const total = subtotalPizzas + subtotalBebidas + taxaEntrega - desconto;

  return (
    <Box
      sx={{
        p: 2,
        backgroundColor: "#F5F5F5",
        borderRadius: 2,
        border: "1px solid #E0E0E0",
      }}
    >
      {mostrarDetalhes && (
        <>
          {subtotalPizzas > 0 && (
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                mb: 1,
              }}
            >
              <Typography variant="body2" color="text.secondary">
                Pizzas
              </Typography>
              <Typography variant="body2" sx={{ fontWeight: 500 }}>
                R$ {subtotalPizzas.toFixed(2)}
              </Typography>
            </Box>
          )}

          {subtotalBebidas > 0 && (
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                mb: 1,
              }}
            >
              <Typography variant="body2" color="text.secondary">
                Bebidas
              </Typography>
              <Typography variant="body2" sx={{ fontWeight: 500 }}>
                R$ {subtotalBebidas.toFixed(2)}
              </Typography>
            </Box>
          )}

          {taxaEntrega > 0 && (
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                mb: 1,
              }}
            >
              <Typography variant="body2" color="text.secondary">
                Taxa de entrega
              </Typography>
              <Typography variant="body2" sx={{ fontWeight: 500 }}>
                R$ {taxaEntrega.toFixed(2)}
              </Typography>
            </Box>
          )}

          {desconto > 0 && (
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                mb: 1,
              }}
            >
              <Typography variant="body2" color="success.main">
                Desconto
              </Typography>
              <Typography
                variant="body2"
                sx={{ fontWeight: 500, color: "success.main" }}
              >
                - R$ {desconto.toFixed(2)}
              </Typography>
            </Box>
          )}

          <Divider sx={{ my: 1.5 }} />
        </>
      )}

      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography variant="h6" sx={{ fontWeight: "bold" }}>
          Total
        </Typography>
        <Typography
          variant="h5"
          sx={{
            fontWeight: "bold",
            color: "#197824",
          }}
        >
          R$ {total.toFixed(2)}
        </Typography>
      </Box>
    </Box>
  );
}
