import React from "react";
import { Box, Skeleton } from "@mui/material";

/**
 * Skeleton loader para cards de produtos
 */
export function CardSkeleton() {
  return (
    <Box
      sx={{
        p: 2,
        border: "1px solid #E0E0E0",
        borderRadius: 2,
        backgroundColor: "#fff",
      }}
    >
      <Skeleton variant="rectangular" height={120} sx={{ borderRadius: 1, mb: 2 }} />
      <Skeleton variant="text" height={32} sx={{ mb: 1 }} />
      <Skeleton variant="text" height={20} width="80%" sx={{ mb: 1 }} />
      <Skeleton variant="text" height={24} width="40%" />
    </Box>
  );
}

/**
 * Skeleton loader para lista de items do carrinho
 */
export function CarrinhoItemSkeleton() {
  return (
    <Box
      sx={{
        p: 2,
        mb: 1,
        border: "1px solid #E0E0E0",
        borderRadius: 2,
        backgroundColor: "#fff",
      }}
    >
      <Skeleton variant="text" height={28} width="70%" sx={{ mb: 1 }} />
      <Skeleton variant="text" height={20} width="50%" sx={{ mb: 0.5 }} />
      <Skeleton variant="text" height={20} width="30%" />
    </Box>
  );
}

/**
 * Skeleton genérico para conteúdo em carregamento
 */
export default function LoadingShimmer({ quantidade = 3, tipo = "card" }) {
  const Componente = tipo === "card" ? CardSkeleton : CarrinhoItemSkeleton;

  return (
    <Box sx={{ width: "100%" }}>
      {Array.from({ length: quantidade }).map((_, index) => (
        <Componente key={index} />
      ))}
    </Box>
  );
}
