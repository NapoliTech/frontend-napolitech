import React, { useState } from "react";
import {
  Box,
  Stack,
  Typography,
  Paper,
  Alert,
  Snackbar,
  ToggleButtonGroup,
  ToggleButton,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { usePedido } from "../../context/PedidoContext";
import { useProdutos } from "../../hooks/useProdutos";
import PizzaVisual from "../molecules/PizzaVisual";
import ModalSelecionarSabor from "../organisms/ModalSelecionarSabor";
import ButtonCTA from "../atoms/ButtonCTA";
import LoadingState from "../atoms/LoadingState";
import ModalNaoAutenticado from "../molecules/ModalNaoAutenticado";
import EscolherEndereco from "../molecules/EscolherEndereco";
import CadastroEndereco from "../molecules/CadastroEndereco";
import { pedidoService } from "../../services/pedidoService";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from "@mui/material";

/**
 * Nova Section Pedidos - Refatorada e Organizada
 * Mantém 100% de compatibilidade com os endpoints existentes
 */
export default function SectionPedidosNovo() {
  const navigate = useNavigate();
  
  // Context e hooks
  const {
    pizzaAtual,
    carrinho: pizzasSelecionadas,
    setMetadeEsquerda,
    setMetadeDireita,
    setTamanho,
    setBorda,
    adicionarAoCarrinho,
    limparPizzaAtual,
    pizzaCompleta,
    userId,
  } = usePedido();

  const { produtos, loading: loadingProdutos } = useProdutos();

  // Estados locais
  const [modalSaborAberto, setModalSaborAberto] = useState(false);
  const [metadeSelecionando, setMetadeSelecionando] = useState(null); // 'esquerda' ou 'direita'
  const [modalEnderecoAberto, setModalEnderecoAberto] = useState(false);
  const [modalEscolherEnderecoAberto, setModalEscolherEnderecoAberto] = useState(false);
  const [modalNaoAutenticado, setModalNaoAutenticado] = useState(false);
  const [enderecos, setEnderecos] = useState([]);
  const [snackbar, setSnackbar] = useState({ aberto: false, mensagem: "", tipo: "success" });

  // Handlers de seleção de sabor
  const handleClickMetade = (metade) => {
    setMetadeSelecionando(metade);
    setModalSaborAberto(true);
  };

  const handleSelecionarSabor = (produto) => {
    const metade = {
      id: produto.id,
      nome: produto.nome,
      sabor: produto.nome,
      descricao: produto.descricao || produto.ingredientes,
      preco: (produto.preco / 2).toFixed(2),
    };

    if (metadeSelecionando === "esquerda") {
      setMetadeEsquerda(metade);
    } else if (metadeSelecionando === "direita") {
      setMetadeDireita(metade);
    }

    setMetadeSelecionando(null);
    setModalSaborAberto(false);
    
    mostrarSnackbar("Sabor adicionado com sucesso!", "success");
  };

  // Handler de adicionar ao carrinho e ir para finalização
  const handleAdicionarAoCarrinho = () => {
    if (!pizzaCompleta()) {
      mostrarSnackbar("Complete todos os campos antes de adicionar", "warning");
      return;
    }

    const preco = pedidoService.calcularPrecoPizza(
      pizzaAtual.metadeEsquerda,
      pizzaAtual.metadeDireita
    );

    const novaPizza = {
      metadeEsquerda: pizzaAtual.metadeEsquerda,
      metadeDireita: pizzaAtual.metadeDireita,
      tamanho: pizzaAtual.tamanho,
      borda: pizzaAtual.borda,
      preco,
    };

    adicionarAoCarrinho(novaPizza);
    limparPizzaAtual();
    
    mostrarSnackbar("Pizza adicionada com sucesso!", "success");
  };

  // Handler de finalizar pedido
  const handleFinalizarPedido = async () => {
    if (!userId) {
      setModalNaoAutenticado(true);
      return;
    }

    // Verifica endereço
    const endereco = await pedidoService.verificarEndereco(userId);
    if (endereco) {
      setEnderecos([endereco]);
      setModalEscolherEnderecoAberto(true);
    } else {
      setModalEnderecoAberto(true);
    }
  };

  const handleEnderecoCadastrado = async () => {
    setModalEnderecoAberto(false);
    const endereco = await pedidoService.verificarEndereco(userId);
    if (endereco) {
      setEnderecos([endereco]);
    }
    setModalEscolherEnderecoAberto(true);
  };

  const handleSelecionarEndereco = (endereco) => {
    // Navega para a página de finalização
    navigate("/finalizarPedido", {
      state: {
        userId,
        enderecoSelecionado: endereco,
      },
    });
  };

  // Helper snackbar
  const mostrarSnackbar = (mensagem, tipo = "success") => {
    setSnackbar({ aberto: true, mensagem, tipo });
  };

  const fecharSnackbar = () => {
    setSnackbar({ ...snackbar, aberto: false });
  };

  if (loadingProdutos) {
    return <LoadingState />;
  }

  return (
    <Box
      component="section"
      sx={{
        width: "100%",
        minHeight: "90vh",
        boxSizing: "border-box",
        backgroundImage: 'url("/img/bg_pedidos.png")',
        backgroundSize: "cover",
        backgroundPosition: "center",
        py: { xs: 3, md: 4 },
      }}
    >
      <Stack
        spacing={{ xs: 3, md: 4 }}
        sx={{
          maxWidth: "1200px",
          margin: "0 auto",
          px: { xs: 2, md: 4 },
        }}
      >
        {/* Título e Indicador de Carrinho */}
        <Stack
          direction={{ xs: "column", md: "row" }}
          spacing={{ xs: 2, md: 3 }}
          sx={{
            alignItems: { xs: "center", md: "center" },
            justifyContent: { xs: "center", md: "space-between" },
          }}
        >
          <Typography
            variant="h3"
            sx={{
              color: "white",
              fontWeight: "bold",
              textAlign: "center",
              textShadow: "2px 2px 4px rgba(0,0,0,0.5)",
              fontSize: { xs: "clamp(1.75rem, 6vw, 3rem)", md: "3rem" },
            }}
          >
            Monte Sua Pizza
          </Typography>
          
          {/* Indicador de pizzas no carrinho */}
          {pizzasSelecionadas.length > 0 && (
            <Paper
              elevation={4}
              sx={{
                p: { xs: 1.5, md: 2 },
                backgroundColor: "rgba(255, 255, 255, 0.95)",
                borderRadius: 2,
                minWidth: { xs: "100%", sm: "280px", md: "220px" },
                textAlign: { xs: "center", md: "left" },
              }}
            >
              <Typography 
                variant="body2" 
                sx={{ 
                  fontWeight: "bold", 
                  mb: 0.5,
                  fontSize: { xs: "0.875rem", md: "0.875rem" },
                }}
              >
                Carrinho Atual:
              </Typography>
              <Typography 
                variant="h6" 
                sx={{ 
                  color: "#B72A23", 
                  fontWeight: "bold",
                  fontSize: { xs: "1.1rem", md: "1.25rem" },
                }}
              >
                {pizzasSelecionadas.length} {pizzasSelecionadas.length === 1 ? 'pizza' : 'pizzas'}
              </Typography>
              <Typography 
                variant="body2" 
                color="text.secondary"
                sx={{ fontSize: { xs: "0.8rem", md: "0.875rem" } }}
              >
                Total: R$ {pizzasSelecionadas.reduce((total, p) => total + parseFloat(p.preco), 0).toFixed(2)}
              </Typography>
            </Paper>
          )}
        </Stack>

        {/* Grid Principal */}
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
            gap: { xs: 2, sm: 3, md: 4 },
          }}
        >
          {/* Coluna Esquerda - Montagem da Pizza */}
          <Paper
            elevation={6}
            sx={{
              p: { xs: 2, sm: 2.5, md: 3 },
              borderRadius: { xs: 2, md: 3 },
              backgroundColor: "rgba(255, 255, 255, 0.95)",
            }}
          >
            <Typography
              variant="h5"
              sx={{ 
                fontWeight: "bold", 
                mb: { xs: 2, md: 3 }, 
                textAlign: "center",
                fontSize: { xs: "1.25rem", sm: "1.5rem", md: "1.5rem" },
              }}
            >
              1. Escolha os Sabores
            </Typography>

            {/* Visualizador da Pizza */}
            <Box 
              sx={{ 
                display: "flex", 
                justifyContent: "center", 
                mb: { xs: 2, md: 3 },
              }}
            >
              <PizzaVisual
                metadeEsquerda={pizzaAtual.metadeEsquerda}
                metadeDireita={pizzaAtual.metadeDireita}
                onClickEsquerda={() => handleClickMetade("esquerda")}
                onClickDireita={() => handleClickMetade("direita")}
              />
            </Box>

            {/* Informações das seleções */}
            {(pizzaAtual.metadeEsquerda || pizzaAtual.metadeDireita) && (
              <Alert severity="info" sx={{ mb: 2, fontSize: { xs: "0.85rem", md: "0.875rem" } }}>
                {pizzaAtual.metadeEsquerda && pizzaAtual.metadeDireita
                  ? "Ambas as metades selecionadas! Agora escolha o tamanho e a borda."
                  : "Selecione a outra metade da pizza"}
              </Alert>
            )}
          </Paper>

          {/* Coluna do Meio - Personalização */}
          <Paper
            elevation={6}
            sx={{
              p: { xs: 2, sm: 2.5, md: 3 },
              borderRadius: { xs: 2, md: 3 },
              backgroundColor: "rgba(255, 255, 255, 0.95)",
            }}
          >
            <Typography
              variant="h5"
              sx={{ 
                fontWeight: "bold", 
                mb: { xs: 2, md: 3 }, 
                textAlign: "center",
                fontSize: { xs: "1.25rem", sm: "1.5rem", md: "1.5rem" },
              }}
            >
              2. Personalize
            </Typography>

            <Stack spacing={{ xs: 2, md: 3 }}>
              {/* Seletor de Tamanho */}
              <FormControl fullWidth>
                <InputLabel sx={{ fontSize: { xs: "0.9rem", md: "1rem" } }}>
                  Tamanho da Pizza
                </InputLabel>
                <Select
                  value={pizzaAtual.tamanho}
                  label="Tamanho da Pizza"
                  onChange={(e) => setTamanho(e.target.value)}
                  disabled={!pizzaAtual.metadeEsquerda || !pizzaAtual.metadeDireita}
                  sx={{ fontSize: { xs: "0.9rem", md: "1rem" } }}
                >
                  <MenuItem value="MEIO_A_MEIO">Grande (Meio a Meio)</MenuItem>
                </Select>
              </FormControl>

              {/* Seletor de Borda */}
              <FormControl fullWidth>
                <InputLabel sx={{ fontSize: { xs: "0.9rem", md: "1rem" } }}>
                  Borda Recheada
                </InputLabel>
                <Select
                  value={pizzaAtual.borda}
                  label="Borda Recheada"
                  onChange={(e) => setBorda(e.target.value)}
                  disabled={!pizzaAtual.metadeEsquerda || !pizzaAtual.metadeDireita}
                  sx={{ fontSize: { xs: "0.9rem", md: "1rem" } }}
                >
                  <MenuItem value="">Sem Borda</MenuItem>
                  <MenuItem value="CATUPIRY">Catupiry</MenuItem>
                </Select>
              </FormControl>

              {/* Resumo da pizza atual */}
              {pizzaCompleta() && (
                <Paper
                  sx={{
                    p: { xs: 1.5, md: 2 },
                    backgroundColor: "#F5F5F5",
                    borderRadius: 2,
                    mt: 2,
                  }}
                >
                  <Typography 
                    variant="subtitle2" 
                    gutterBottom 
                    sx={{ 
                      fontWeight: "bold",
                      fontSize: { xs: "0.9rem", md: "0.875rem" },
                    }}
                  >
                    Resumo:
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 0.5, fontSize: { xs: "0.85rem", md: "0.875rem" } }}>
                    • {pizzaAtual.metadeEsquerda.nome}
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 0.5, fontSize: { xs: "0.85rem", md: "0.875rem" } }}>
                    • {pizzaAtual.metadeDireita.nome}
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 0.5, fontSize: { xs: "0.85rem", md: "0.875rem" } }}>
                    • Tamanho: {pizzaAtual.tamanho === "MEIO_A_MEIO" ? "Grande" : pizzaAtual.tamanho}
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 1, fontSize: { xs: "0.85rem", md: "0.875rem" } }}>
                    • Borda: {pizzaAtual.borda || "Sem borda"}
                  </Typography>
                  <Typography 
                    variant="h6" 
                    sx={{ 
                      fontWeight: "bold", 
                      color: "#B72A23",
                      fontSize: { xs: "1.1rem", md: "1.25rem" },
                    }}
                  >
                    R${" "}
                    {pedidoService.calcularPrecoPizza(
                      pizzaAtual.metadeEsquerda,
                      pizzaAtual.metadeDireita
                    )}
                  </Typography>
                </Paper>
              )}

              {/* Botão Adicionar ao Carrinho */}
              <ButtonCTA
                fullWidth
                onClick={handleAdicionarAoCarrinho}
                disabled={!pizzaCompleta()}
                startIcon={<CheckCircleIcon />}
                sx={{ 
                  minHeight: { xs: 48, md: 44 },
                  fontSize: { xs: "0.95rem", md: "1rem" },
                }}
              >
                Adicionar ao Carrinho
              </ButtonCTA>

              {/* Botão Finalizar Pedido (se tiver itens no carrinho) */}
              {pizzasSelecionadas.length > 0 && (
                <ButtonCTA
                  fullWidth
                  onClick={handleFinalizarPedido}
                  cor="#197824"
                  sx={{ 
                    mt: 2,
                    minHeight: { xs: 48, md: 44 },
                    fontSize: { xs: "0.95rem", md: "1rem" },
                  }}
                >
                  Finalizar Pedido ({pizzasSelecionadas.length} {pizzasSelecionadas.length === 1 ? 'pizza' : 'pizzas'})
                </ButtonCTA>
              )}
            </Stack>
          </Paper>
        </Box>
      </Stack>

      {/* Modal de Seleção de Sabor */}
      <ModalSelecionarSabor
        aberto={modalSaborAberto}
        onFechar={() => {
          setModalSaborAberto(false);
          setMetadeSelecionando(null);
        }}
        onSelecionarSabor={handleSelecionarSabor}
        produtos={produtos}
        loading={loadingProdutos}
        titulo={`Selecione o Sabor - Metade ${metadeSelecionando === "esquerda" ? "Esquerda" : "Direita"}`}
      />

      {/* Modal Não Autenticado */}
      <ModalNaoAutenticado
        aberto={modalNaoAutenticado}
        onOk={() => {
          setModalNaoAutenticado(false);
          navigate("/login");
        }}
      />

      {/* Modal Cadastro de Endereço */}
      <Dialog
        open={modalEnderecoAberto}
        onClose={() => setModalEnderecoAberto(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Cadastrar Endereço</DialogTitle>
        <DialogContent>
          {userId && (
            <CadastroEndereco
              userId={userId}
              onEnderecoCadastrado={handleEnderecoCadastrado}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Modal Escolher Endereço */}
      <Dialog
        open={modalEscolherEnderecoAberto}
        onClose={() => setModalEscolherEnderecoAberto(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Escolher Endereço</DialogTitle>
        <DialogContent>
          <EscolherEndereco
            enderecos={enderecos}
            userId={userId}
            onSelecionarEndereco={handleSelecionarEndereco}
            onClose={() => setModalEscolherEnderecoAberto(false)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setModalEscolherEnderecoAberto(false)}>
            Cancelar
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar de Feedback */}
      <Snackbar
        open={snackbar.aberto}
        autoHideDuration={3000}
        onClose={fecharSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={fecharSnackbar}
          severity={snackbar.tipo}
          sx={{ width: "100%" }}
        >
          {snackbar.mensagem}
        </Alert>
      </Snackbar>
    </Box>
  );
}
