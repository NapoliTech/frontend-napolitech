import React from "react";
import {
  Card,
  CardContent,
  CardActions,
  Typography,
  Box,
  Chip,
} from "@mui/material";
import LocalPizzaIcon from "@mui/icons-material/LocalPizza";
import ButtonCTA from "../atoms/ButtonCTA";

/**
 * Card moderno para exibir produtos (pizzas/bebidas)
 */
export default function CardProduto({
  produto,
  onSelecionar,
  selected = false,
  loading = false,
}) {
  const { nome, descricao, ingredientes, preco, categoriaProduto } = produto;

  const getCategoriaLabel = () => {
    switch (categoriaProduto) {
      case "PIZZA":
        return { label: "Salgada", cor: "#B72A23" };
      case "PIZZA_DOCE":
        return { label: "Doce", cor: "#FF6B9D" };
      case "BEBIDAS":
        return { label: "Bebida", cor: "#2196F3" };
      default:
        return { label: "Produto", cor: "#757575" };
    }
  };

  const categoria = getCategoriaLabel();

  return (
    <Card
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        transition: "all 0.3s ease",
        border: selected ? `3px solid ${categoria.cor}` : "1px solid #E0E0E0",
        borderRadius: 2,
        boxShadow: selected ? 6 : 2,
        "&:hover": {
          boxShadow: 6,
          transform: "translateY(-4px)",
        },
        cursor: "pointer",
        position: "relative",
        overflow: "visible",
      }}
      onClick={() => !loading && onSelecionar(produto)}
    >
      {/* Badge de categoria */}
      <Chip
        label={categoria.label}
        size="small"
        sx={{
          position: "absolute",
          top: 12,
          right: 12,
          backgroundColor: categoria.cor,
          color: "white",
          fontWeight: "bold",
          zIndex: 1,
        }}
      />

      <CardContent sx={{ pb: 1 }}>
        {/* Ícone ilustrativo */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: 80,
            mb: 2,
            backgroundColor: "#FAFAFA",
            borderRadius: 2,
          }}
        >
          <LocalPizzaIcon
            sx={{
              fontSize: 48,
              color: categoria.cor,
            }}
          />
        </Box>

        {/* Nome do produto */}
        <Typography
          variant="h6"
          component="h3"
          gutterBottom
          sx={{
            fontWeight: "bold",
            fontSize: "1.1rem",
            color: "#212121",
            minHeight: "2.2em",
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
          }}
        >
          {nome}
        </Typography>

        {/* Ingredientes/Descrição */}
        {(ingredientes || descricao) && (
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              mb: 2,
              minHeight: "3em",
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
            }}
          >
            {ingredientes || descricao || "Delicioso produto da Napolitech"}
          </Typography>
        )}

        {/* Preço */}
        <Typography
          variant="h5"
          sx={{
            fontWeight: "bold",
            color: categoria.cor,
            mt: 1,
          }}
        >
          R$ {parseFloat(preco).toFixed(2)}
        </Typography>
      </CardContent>

      <CardActions sx={{ p: 2, pt: 0 }}>
        <ButtonCTA
          fullWidth
          loading={loading}
          onClick={(e) => {
            e.stopPropagation();
            onSelecionar(produto);
          }}
          cor={categoria.cor}
          tamanho="medium"
        >
          Selecionar
        </ButtonCTA>
      </CardActions>
    </Card>
  );
}
