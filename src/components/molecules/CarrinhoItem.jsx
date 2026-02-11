import React from "react";
import { Box, Typography, IconButton, Chip, Tooltip } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";

/**
 * Componente para exibir um item no carrinho
 */
export default function CarrinhoItem({ item, onRemover, tipo = "pizza" }) {
  const renderPizza = () => {
    const { metadeEsquerda, metadeDireita, preco, tamanho, borda } = item;
    
    return (
      <>
        <Box sx={{ flex: 1 }}>
          <Typography variant="subtitle1" sx={{ fontWeight: "bold", mb: 0.5 }}>
            Pizza Meio a Meio
          </Typography>
          
          {/* Metades */}
          <Typography variant="body2" color="text.secondary" sx={{ mb: 0.3 }}>
            🍕 {metadeEsquerda?.sabor || metadeEsquerda?.nome}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
            🍕 {metadeDireita?.sabor || metadeDireita?.nome}
          </Typography>

          {/* Detalhes */}
          <Box sx={{ display: "flex", gap: 0.5, flexWrap: "wrap", mt: 1 }}>
            {tamanho && (
              <Chip
                label={`Tamanho: ${tamanho}`}
                size="small"
                variant="outlined"
                sx={{ fontSize: "0.7rem" }}
              />
            )}
            {borda && borda !== "SEM_BORDA" && (
              <Chip
                label={`Borda: ${borda}`}
                size="small"
                variant="outlined"
                sx={{ fontSize: "0.7rem" }}
              />
            )}
          </Box>
        </Box>

        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-end",
            justifyContent: "space-between",
            ml: 2,
          }}
        >
          <Typography variant="h6" sx={{ fontWeight: "bold", color: "#B72A23" }}>
            R$ {parseFloat(preco).toFixed(2)}
          </Typography>
          <Tooltip title="Remover item">
            <IconButton
              size="small"
              onClick={() => onRemover(item.id)}
              sx={{
                color: "error.main",
                "&:hover": {
                  backgroundColor: "error.light",
                },
              }}
            >
              <DeleteIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>
      </>
    );
  };

  const renderBebida = () => {
    const { nome, preco, quantidade } = item;
    
    return (
      <>
        <Box sx={{ flex: 1 }}>
          <Typography variant="subtitle1" sx={{ fontWeight: "bold", mb: 0.5 }}>
            {nome}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Quantidade: {quantidade || 1}
          </Typography>
        </Box>

        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-end",
            justifyContent: "space-between",
            ml: 2,
          }}
        >
          <Typography variant="h6" sx={{ fontWeight: "bold", color: "#2196F3" }}>
            R$ {(parseFloat(preco) * (quantidade || 1)).toFixed(2)}
          </Typography>
          <Tooltip title="Remover item">
            <IconButton
              size="small"
              onClick={() => onRemover(item.id)}
              sx={{
                color: "error.main",
                "&:hover": {
                  backgroundColor: "error.light",
                },
              }}
            >
              <DeleteIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>
      </>
    );
  };

  return (
    <Box
      sx={{
        display: "flex",
        p: 2,
        mb: 1,
        border: "1px solid #E0E0E0",
        borderRadius: 2,
        backgroundColor: "#fff",
        transition: "all 0.2s ease",
        "&:hover": {
          boxShadow: 3,
          backgroundColor: "#FAFAFA",
        },
      }}
    >
      {tipo === "pizza" ? renderPizza() : renderBebida()}
    </Box>
  );
}
