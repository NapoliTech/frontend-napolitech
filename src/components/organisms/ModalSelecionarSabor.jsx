import React, { useState, useMemo } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  InputAdornment,
  Grid,
  Typography,
  Box,
  Tabs,
  Tab,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import CloseIcon from "@mui/icons-material/Close";
import CardProduto from "../molecules/CardProduto";
import LoadingShimmer from "../atoms/LoadingShimmer";
import EmptyState from "../atoms/EmptyState";
import LocalPizzaIcon from "@mui/icons-material/LocalPizza";

/**
 * Modal para seleção de sabor da pizza
 * Mantém compatibilidade total com a API existente
 */
export default function ModalSelecionarSabor({
  aberto,
  onFechar,
  onSelecionarSabor,
  produtos = [],
  loading = false,
  titulo = "Selecione o Sabor",
}) {
  const [termoBusca, setTermoBusca] = useState("");
  const [tabAtiva, setTabAtiva] = useState(0); // 0 = Todas, 1 = Salgadas, 2 = Doces

  // Filtra produtos por busca e categoria
  const produtosFiltrados = useMemo(() => {
    let filtrados = produtos;

    // Filtra por tab
    if (tabAtiva === 1) {
      filtrados = filtrados.filter((p) => p.categoriaProduto === "PIZZA");
    } else if (tabAtiva === 2) {
      filtrados = filtrados.filter((p) => p.categoriaProduto === "PIZZA_DOCE");
    }

    // Filtra por busca
    if (termoBusca.trim()) {
      const termo = termoBusca.toLowerCase();
      filtrados = filtrados.filter(
        (p) =>
          p.nome.toLowerCase().includes(termo) ||
          (p.descricao && p.descricao.toLowerCase().includes(termo)) ||
          (p.ingredientes && p.ingredientes.toLowerCase().includes(termo))
      );
    }

    // Remove bebidas
    filtrados = filtrados.filter(
      (p) => p.categoriaProduto === "PIZZA" || p.categoriaProduto === "PIZZA_DOCE"
    );

    return filtrados;
  }, [produtos, termoBusca, tabAtiva]);

  const handleFechar = () => {
    setTermoBusca("");
    setTabAtiva(0);
    onFechar();
  };

  const handleSelecionarProduto = (produto) => {
    onSelecionarSabor(produto);
    handleFechar();
  };

  return (
    <Dialog
      open={aberto}
      onClose={handleFechar}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
          maxHeight: "90vh",
        },
      }}
    >
      <DialogTitle
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          backgroundColor: "#B72A23",
          color: "white",
          fontWeight: "bold",
        }}
      >
        {titulo}
        <Button
          onClick={handleFechar}
          sx={{
            minWidth: "auto",
            color: "white",
            "&:hover": {
              backgroundColor: "rgba(255,255,255,0.1)",
            },
          }}
        >
          <CloseIcon />
        </Button>
      </DialogTitle>

      {/* Campo de busca */}
      <Box sx={{ p: 2, pb: 0 }}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Buscar pizza por nome ou ingredientes..."
          value={termoBusca}
          onChange={(e) => setTermoBusca(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
          sx={{
            "& .MuiOutlinedInput-root": {
              borderRadius: 2,
            },
          }}
        />
      </Box>

      {/* Tabs de categoria */}
      <Box sx={{ borderBottom: 1, borderColor: "divider", px: 2 }}>
        <Tabs
          value={tabAtiva}
          onChange={(e, newValue) => setTabAtiva(newValue)}
          aria-label="categorias de pizza"
          sx={{
            "& .MuiTab-root": {
              fontWeight: 500,
            },
          }}
        >
          <Tab label="Todas" />
          <Tab label="Salgadas" />
          <Tab label="Doces" />
        </Tabs>
      </Box>

      <DialogContent sx={{ p: 2 }}>
        {loading ? (
          <LoadingShimmer quantidade={6} tipo="card" />
        ) : produtosFiltrados.length > 0 ? (
          <Grid container spacing={2}>
            {produtosFiltrados.map((produto) => (
              <Grid item xs={12} sm={6} md={4} key={produto.id}>
                <CardProduto
                  produto={produto}
                  onSelecionar={handleSelecionarProduto}
                />
              </Grid>
            ))}
          </Grid>
        ) : (
          <EmptyState
            icone={LocalPizzaIcon}
            titulo="Nenhuma pizza encontrada"
            mensagem={
              termoBusca
                ? `Não encontramos pizzas com "${termoBusca}"`
                : "Nenhuma pizza disponível no momento"
            }
          />
        )}
      </DialogContent>

      <DialogActions sx={{ p: 2 }}>
        <Typography variant="body2" color="text.secondary" sx={{ flex: 1 }}>
          {produtosFiltrados.length} {produtosFiltrados.length === 1 ? "pizza encontrada" : "pizzas encontradas"}
        </Typography>
        <Button onClick={handleFechar} variant="outlined">
          Cancelar
        </Button>
      </DialogActions>
    </Dialog>
  );
}
