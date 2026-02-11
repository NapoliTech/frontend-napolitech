import React from "react";
import {
  Box,
  Paper,
  Typography,
  Stack,
  Divider,
  Chip,
  IconButton,
  Tooltip,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { usePedido } from "../../context/PedidoContext";

/**
 * Componente para visualizar o resumo do pedido atual sendo montado
 * Mostra todas as pizzas adicionadas ao carrinho antes da finalização
 */
export default function ResumoPedidoAtual({ showRemove = true }) {
  const { carrinho, bebidas, removerDoCarrinho, removerBebida, calcularTotalGeral } = usePedido();

  if (carrinho.length === 0 && bebidas.length === 0) {
    return null;
  }

  return (
    <Paper
      elevation={3}
      sx={{
        p: 3,
        backgroundColor: "rgba(255, 255, 255, 0.95)",
        borderRadius: 2,
      }}
    >
      <Typography variant="h6" sx={{ fontWeight: "bold", mb: 2 }}>
        Seu Pedido Atual
      </Typography>

      {/* Pizzas */}
      {carrinho.length > 0 && (
        <>
          <Typography variant="subtitle2" sx={{ fontWeight: "bold", mb: 1, color: "text.secondary" }}>
            Pizzas ({carrinho.length})
          </Typography>
          <Stack spacing={1} sx={{ mb: 2 }}>
            {carrinho.map((pizza, index) => (
              <Paper
                key={pizza.id}
                sx={{
                  p: 2,
                  backgroundColor: "#FAFAFA",
                  position: "relative",
                  border: "1px solid #E0E0E0",
                }}
              >
                {showRemove && (
                  <Tooltip title="Remover pizza">
                    <IconButton
                      size="small"
                      onClick={() => removerDoCarrinho(pizza.id)}
                      sx={{
                        position: "absolute",
                        top: 8,
                        right: 8,
                        color: "error.main",
                      }}
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                )}
                
                <Typography variant="body2" sx={{ fontWeight: 500, mb: 1, pr: 4 }}>
                  Pizza #{index + 1}
                </Typography>
                
                <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, mb: 0.5 }}>
                  <Typography variant="body2">🍕</Typography>
                  <Typography variant="body2">
                    {pizza.metadeEsquerda?.nome || pizza.metadeEsquerda?.sabor}
                  </Typography>
                </Box>
                
                <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, mb: 1 }}>
                  <Typography variant="body2">🍕</Typography>
                  <Typography variant="body2">
                    {pizza.metadeDireita?.nome || pizza.metadeDireita?.sabor}
                  </Typography>
                </Box>

                <Box sx={{ display: "flex", gap: 0.5, mb: 1, flexWrap: "wrap" }}>
                  <Chip
                    label={pizza.tamanho || "Grande"}
                    size="small"
                    sx={{ fontSize: "0.7rem", height: "20px" }}
                  />
                  {pizza.borda && (
                    <Chip
                      label={`Borda: ${pizza.borda}`}
                      size="small"
                      sx={{ fontSize: "0.7rem", height: "20px" }}
                    />
                  )}
                </Box>

                <Typography variant="body1" sx={{ fontWeight: "bold", color: "#B72A23" }}>
                  R$ {parseFloat(pizza.preco).toFixed(2)}
                </Typography>
              </Paper>
            ))}
          </Stack>
        </>
      )}

      {/* Bebidas */}
      {bebidas.length > 0 && (
        <>
          <Typography variant="subtitle2" sx={{ fontWeight: "bold", mb: 1, color: "text.secondary" }}>
            Bebidas ({bebidas.length})
          </Typography>
          <Stack spacing={1} sx={{ mb: 2 }}>
            {bebidas.map((bebida) => (
              <Paper
                key={bebida.id}
                sx={{
                  p: 2,
                  backgroundColor: "#FAFAFA",
                  position: "relative",
                  border: "1px solid #E0E0E0",
                }}
              >
                {showRemove && (
                  <Tooltip title="Remover bebida">
                    <IconButton
                      size="small"
                      onClick={() => removerBebida(bebida.id)}
                      sx={{
                        position: "absolute",
                        top: 8,
                        right: 8,
                        color: "error.main",
                      }}
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                )}
                
                <Typography variant="body2" sx={{ fontWeight: 500, mb: 0.5, pr: 4 }}>
                  {bebida.nome}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                  Quantidade: {bebida.quantidade || 1}
                </Typography>
                <Typography variant="body1" sx={{ fontWeight: "bold", color: "#2196F3" }}>
                  R$ {(parseFloat(bebida.preco) * (bebida.quantidade || 1)).toFixed(2)}
                </Typography>
              </Paper>
            ))}
          </Stack>
        </>
      )}

      <Divider sx={{ my: 2 }} />

      {/* Total */}
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Typography variant="h6" sx={{ fontWeight: "bold" }}>
          Total do Pedido:
        </Typography>
        <Typography variant="h5" sx={{ fontWeight: "bold", color: "#197824" }}>
          R$ {calcularTotalGeral()}
        </Typography>
      </Box>
    </Paper>
  );
}
