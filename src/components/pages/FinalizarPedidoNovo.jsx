import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Box,
  Card,
  CardContent,
  Typography,
  CardHeader,
  TextField,
  Modal,
  Paper,
  Stack,
  ToggleButton,
  ToggleButtonGroup,
  Chip,
  Divider,
  Button,
  IconButton,
} from "@mui/material";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import StorefrontIcon from "@mui/icons-material/Storefront";
import { usePedido } from "../../context/PedidoContext";
import { pedidoService } from "../../services/pedidoService";
import ButtonCTA from "../atoms/ButtonCTA";
import ResumoPreco from "../molecules/ResumoPreco";
import CarrinhoItem from "../molecules/CarrinhoItem";
import EmptyState from "../atoms/EmptyState";
import ShoppingBasketIcon from "@mui/icons-material/ShoppingBasket";

export default function FinalizarPedidoNovo() {
  const location = useLocation();
  const navigate = useNavigate();
  
  // Pega endereço do location.state (se veio da navegação) ou undefined
  const enderecoDoState = location.state?.enderecoSelecionado;
  const userIdDoState = location.state?.userId;

  const {
    carrinho,
    bebidas,
    calcularTotalPizzas,
    calcularTotalBebidas,
    calcularTotalGeral,
    pizzaAtual,
    limparCarrinho,
    removerDoCarrinho,
    removerBebida,
    userId: userIdContext,
  } = usePedido();

  // Usa o userId do state ou do context
  const userId = userIdDoState || userIdContext;
  const [enderecoSelecionado, setEnderecoSelecionado] = useState(enderecoDoState);

  // Estados locais
  const [tipoEntrega, setTipoEntrega] = useState("ENCOMENDA");
  const [observacao, setObservacao] = useState("");
  const [modalAberto, setModalAberto] = useState(false);
  const [loading, setLoading] = useState(false);
  const [pedidoFinalizado, setPedidoFinalizado] = useState(null);

  // Atualiza endereço quando vier do state
  useEffect(() => {
    if (enderecoDoState) {
      setEnderecoSelecionado(enderecoDoState);
    }
  }, [enderecoDoState]);

  // Debug: mostra o estado do carrinho
  useEffect(() => {
    console.log("=== FinalizarPedidoNovo - Estado do Carrinho ===");
    console.log("Carrinho:", carrinho);
    console.log("Bebidas:", bebidas);
    console.log("Total de pizzas:", carrinho.length);
    console.log("UserId:", userId);
    console.log("Endereço:", enderecoSelecionado);
    console.log("===============================================");
  }, [carrinho, bebidas, userId, enderecoSelecionado]);

  // Redireciona se não houver userId
  if (!userId) {
    navigate("/pedidos");
    return null;
  }

  // Se não tiver endereço, redireciona para escolher
  if (!enderecoSelecionado) {
    // Aqui poderia mostrar modal de seleção de endereço
    // Por enquanto, redireciona
    navigate("/pedidos");
    return null;
  }

  // Se não tiver itens no carrinho, mostra mensagem mas não redireciona
  const temItensNoCarrinho = carrinho.length > 0 || bebidas.length > 0;

  const handleFinalizarPedido = async () => {
    setLoading(true);
    try {
      // Monta o payload usando o service
      const payload = pedidoService.montarPayload({
        clienteId: userId,
        carrinho,
        bebidas,
        observacao,
        tipoEntrega,
        tamanho: pizzaAtual.tamanho || "MEIO_A_MEIO",
        borda: pizzaAtual.borda || "CATUPIRY",
      });

      console.log("Payload enviado:", payload);

      const response = await pedidoService.finalizarPedido(payload);
      console.log("Pedido finalizado com sucesso:", response);

      setPedidoFinalizado(response);
      setModalAberto(true);
      limparCarrinho();
    } catch (error) {
      console.error("Erro ao finalizar pedido:", error);
      alert("Erro ao finalizar o pedido. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerPedido = () => {
    setModalAberto(false);
    navigate("/pedidoConcluido", { state: { pedido: pedidoFinalizado } });
  };

  const handleAdicionarMaisPizzas = () => {
    navigate("/pedidos");
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        backgroundColor: "#F5F5F5",
        py: { xs: 2, md: 4 },
      }}
    >
      <Box
        sx={{
          maxWidth: "1200px",
          margin: "0 auto",
          px: { xs: 2, md: 4 },
        }}
      >
        <Typography
          variant="h4"
          sx={{
            fontWeight: "bold",
            mb: { xs: 3, md: 4 },
            textAlign: "center",
            fontSize: { xs: "1.75rem", sm: "2rem", md: "2.125rem" },
          }}
        >
          Finalizar Pedido
        </Typography>

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
            gap: { xs: 2, sm: 2.5, md: 3 },
          }}
        >
          {/* Coluna Esquerda - Resumo do Pedido */}
          <Card elevation={3} sx={{ borderRadius: 2 }}>
            <CardHeader
              title="Resumo do Pedido"
              sx={{
                backgroundColor: "#B72A23",
                color: "#fff",
                "& .MuiCardHeader-title": {
                  fontWeight: "bold",
                  fontSize: { xs: "1.1rem", md: "1.25rem" },
                },
              }}
            />
            <CardContent sx={{ p: { xs: 2, md: 3 } }}>
              {/* Endereço */}
              <Box sx={{ mb: 3 }}>
                <Typography 
                  variant="subtitle1" 
                  sx={{ 
                    fontWeight: "bold", 
                    mb: 1,
                    fontSize: { xs: "0.95rem", md: "1rem" },
                  }}
                >
                  Endereço de Entrega:
                </Typography>
                <Paper sx={{ p: { xs: 1.5, md: 2 }, backgroundColor: "#F9F9F9" }}>
                  <Typography variant="body2" sx={{ fontSize: { xs: "0.85rem", md: "0.875rem" } }}>
                    {enderecoSelecionado.rua}, {enderecoSelecionado.numero}
                  </Typography>
                  <Typography variant="body2" sx={{ fontSize: { xs: "0.85rem", md: "0.875rem" } }}>
                    {enderecoSelecionado.bairro}, {enderecoSelecionado.cidade} -{" "}
                    {enderecoSelecionado.estado}
                  </Typography>
                  {enderecoSelecionado.complemento && (
                    <Typography variant="body2" sx={{ fontSize: { xs: "0.85rem", md: "0.875rem" } }}>
                      Complemento: {enderecoSelecionado.complemento}
                    </Typography>
                  )}
                </Paper>
              </Box>

              <Divider sx={{ my: 2 }} />

              {/* Pizzas */}
              {carrinho.length > 0 ? (
                <>
                  <Box 
                    sx={{ 
                      display: "flex", 
                      justifyContent: "space-between", 
                      alignItems: "center", 
                      mb: 2,
                      flexWrap: { xs: "wrap", sm: "nowrap" },
                      gap: { xs: 1, sm: 0 },
                    }}
                  >
                    <Typography 
                      variant="subtitle1" 
                      sx={{ 
                        fontWeight: "bold",
                        fontSize: { xs: "0.95rem", md: "1rem" },
                      }}
                    >
                      Pizzas ({carrinho.length})
                    </Typography>
                    <Button
                      variant="outlined"
                      size="small"
                      onClick={handleAdicionarMaisPizzas}
                      sx={{ 
                        fontSize: { xs: "0.7rem", md: "0.75rem" },
                        minHeight: { xs: 36, md: 32 },
                      }}
                    >
                      + Adicionar mais
                    </Button>
                  </Box>
                  <Stack spacing={1} sx={{ mb: 2 }}>
                    {carrinho.map((pizza, index) => (
                      <Paper 
                        key={pizza.id || index} 
                        sx={{ 
                          p: { xs: 1.5, md: 2 }, 
                          backgroundColor: "#FAFAFA", 
                          position: "relative" 
                        }}
                      >
                        <IconButton
                          size="small"
                          onClick={() => removerDoCarrinho(pizza.id)}
                          sx={{
                            position: "absolute",
                            top: 8,
                            right: 8,
                            color: "error.main",
                            minWidth: 32,
                            minHeight: 32,
                          }}
                        >
                          <Typography variant="caption">✕</Typography>
                        </IconButton>
                        <Typography 
                          variant="body2" 
                          sx={{ 
                            fontWeight: 500, 
                            mb: 0.5,
                            fontSize: { xs: "0.85rem", md: "0.875rem" },
                            pr: 4, // Para não sobrepor o botão X
                          }}
                        >
                          Pizza {index + 1} - Meio a Meio
                        </Typography>
                        <Typography variant="body2" sx={{ fontSize: { xs: "0.8rem", md: "0.875rem" } }}>
                          🍕 {pizza.metadeEsquerda?.nome || pizza.metadeEsquerda?.sabor}
                        </Typography>
                        <Typography variant="body2" sx={{ fontSize: { xs: "0.8rem", md: "0.875rem" } }}>
                          🍕 {pizza.metadeDireita?.nome || pizza.metadeDireita?.sabor}
                        </Typography>
                        <Box sx={{ display: "flex", gap: 0.5, mt: 1, flexWrap: "wrap" }}>
                          <Chip 
                            label={pizza.tamanho} 
                            size="small"
                            sx={{ fontSize: { xs: "0.7rem", md: "0.75rem" }, height: { xs: 24, md: 28 } }}
                          />
                          {pizza.borda && (
                            <Chip 
                              label={`Borda: ${pizza.borda}`} 
                              size="small"
                              sx={{ fontSize: { xs: "0.7rem", md: "0.75rem" }, height: { xs: 24, md: 28 } }}
                            />
                          )}
                        </Box>
                        <Typography 
                          variant="body1" 
                          sx={{ 
                            fontWeight: "bold", 
                            mt: 1, 
                            color: "#B72A23",
                            fontSize: { xs: "1rem", md: "1.1rem" },
                          }}
                        >
                          R$ {parseFloat(pizza.preco).toFixed(2)}
                        </Typography>
                      </Paper>
                    ))}
                  </Stack>
                </>
              ) : (
                <Box sx={{ textAlign: "center", py: { xs: 2, md: 3 } }}>
                  <Typography 
                    variant="body2" 
                    color="text.secondary" 
                    sx={{ mb: 2, fontSize: { xs: "0.85rem", md: "0.875rem" } }}
                  >
                    Nenhuma pizza no carrinho
                  </Typography>
                  <Button
                    variant="contained"
                    onClick={handleAdicionarMaisPizzas}
                    sx={{ 
                      backgroundColor: "#B72A23",
                      minHeight: { xs: 44, md: 40 },
                      fontSize: { xs: "0.9rem", md: "0.875rem" },
                    }}
                  >
                    Adicionar Pizzas
                  </Button>
                </Box>
              )}

              {/* Bebidas */}
              {bebidas.length > 0 && (
                <>
                  <Typography 
                    variant="subtitle1" 
                    sx={{ 
                      fontWeight: "bold", 
                      mb: 2,
                      fontSize: { xs: "0.95rem", md: "1rem" },
                    }}
                  >
                    Bebidas ({bebidas.length})
                  </Typography>
                  <Stack spacing={1} sx={{ mb: 2 }}>
                    {bebidas.map((bebida) => (
                      <Paper 
                        key={bebida.id} 
                        sx={{ 
                          p: { xs: 1.5, md: 2 }, 
                          backgroundColor: "#FAFAFA", 
                          position: "relative" 
                        }}
                      >
                        <IconButton
                          size="small"
                          onClick={() => removerBebida(bebida.id)}
                          sx={{
                            position: "absolute",
                            top: 8,
                            right: 8,
                            color: "error.main",
                            minWidth: 32,
                            minHeight: 32,
                          }}
                        >
                          <Typography variant="caption">✕</Typography>
                        </IconButton>
                        <Typography 
                          variant="body2" 
                          sx={{ 
                            fontWeight: 500,
                            fontSize: { xs: "0.85rem", md: "0.875rem" },
                            pr: 4,
                          }}
                        >
                          {bebida.nome}
                        </Typography>
                        <Typography variant="body2" sx={{ fontSize: { xs: "0.8rem", md: "0.875rem" } }}>
                          Quantidade: {bebida.quantidade || 1}
                        </Typography>
                        <Typography 
                          variant="body1" 
                          sx={{ 
                            fontWeight: "bold", 
                            mt: 1, 
                            color: "#2196F3",
                            fontSize: { xs: "1rem", md: "1.1rem" },
                          }}
                        >
                          R$ {(parseFloat(bebida.preco) * (bebida.quantidade || 1)).toFixed(2)}
                        </Typography>
                      </Paper>
                    ))}
                  </Stack>
                </>
              )}

              <Divider sx={{ my: 2 }} />

              {/* Total */}
              <ResumoPreco
                subtotalPizzas={calcularTotalPizzas()}
                subtotalBebidas={calcularTotalBebidas()}
                mostrarDetalhes={true}
              />
            </CardContent>
          </Card>

          {/* Coluna Direita - Detalhes da Entrega */}
          <Box>
            <Card elevation={3} sx={{ borderRadius: 2, mb: { xs: 2, md: 3 } }}>
              <CardHeader
                title="Detalhes da Entrega"
                sx={{
                  backgroundColor: "#197824",
                  color: "#fff",
                  "& .MuiCardHeader-title": {
                    fontWeight: "bold",
                    fontSize: { xs: "1.1rem", md: "1.25rem" },
                  },
                }}
              />
              <CardContent sx={{ p: { xs: 2, md: 3 } }}>
                {/* Tipo de Entrega */}
                <Typography 
                  variant="subtitle1" 
                  sx={{ 
                    fontWeight: "bold", 
                    mb: 2,
                    fontSize: { xs: "0.95rem", md: "1rem" },
                  }}
                >
                  Forma de Recebimento:
                </Typography>
                <ToggleButtonGroup
                  value={tipoEntrega}
                  exclusive
                  onChange={(e, newValue) => {
                    if (newValue !== null) {
                      setTipoEntrega(newValue);
                    }
                  }}
                  fullWidth
                  sx={{ mb: 3 }}
                >
                  <ToggleButton 
                    value="ENCOMENDA" 
                    sx={{ 
                      py: { xs: 1.5, md: 2 },
                      minHeight: { xs: 72, md: 80 },
                    }}
                  >
                    <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                      <LocalShippingIcon sx={{ fontSize: { xs: 28, md: 32 }, mb: 0.5 }} />
                      <Typography 
                        variant="body2" 
                        sx={{ 
                          fontWeight: 500,
                          fontSize: { xs: "0.85rem", md: "0.875rem" },
                        }}
                      >
                        Entrega
                      </Typography>
                    </Box>
                  </ToggleButton>
                  <ToggleButton 
                    value="RETIRADA" 
                    sx={{ 
                      py: { xs: 1.5, md: 2 },
                      minHeight: { xs: 72, md: 80 },
                    }}
                  >
                    <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                      <StorefrontIcon sx={{ fontSize: { xs: 28, md: 32 }, mb: 0.5 }} />
                      <Typography 
                        variant="body2" 
                        sx={{ 
                          fontWeight: 500,
                          fontSize: { xs: "0.85rem", md: "0.875rem" },
                        }}
                      >
                        Retirada
                      </Typography>
                    </Box>
                  </ToggleButton>
                </ToggleButtonGroup>

                {/* Observações */}
                <Typography 
                  variant="subtitle1" 
                  sx={{ 
                    fontWeight: "bold", 
                    mb: 1,
                    fontSize: { xs: "0.95rem", md: "1rem" },
                  }}
                >
                  Observações (opcional):
                </Typography>
                <TextField
                  fullWidth
                  multiline
                  rows={4}
                  placeholder="Alguma observação sobre o pedido?"
                  value={observacao}
                  onChange={(e) => setObservacao(e.target.value)}
                  sx={{ 
                    mb: 3,
                    "& .MuiInputBase-input": {
                      fontSize: { xs: "0.9rem", md: "1rem" },
                    },
                  }}
                />
              </CardContent>
            </Card>

            {/* Botões de ação */}
            <Stack spacing={2}>
              <ButtonCTA
                fullWidth
                onClick={handleFinalizarPedido}
                loading={loading}
                cor="#197824"
                disabled={!temItensNoCarrinho}
                sx={{ 
                  minHeight: { xs: 48, md: 44 },
                  fontSize: { xs: "1rem", md: "1rem" },
                }}
              >
                Confirmar Pedido
              </ButtonCTA>
              
              <Button
                fullWidth
                variant="outlined"
                onClick={handleAdicionarMaisPizzas}
                sx={{ 
                  fontWeight: "bold",
                  minHeight: { xs: 48, md: 44 },
                  fontSize: { xs: "0.9rem", md: "0.875rem" },
                }}
              >
                Adicionar Mais Pizzas
              </Button>
            </Stack>
          </Box>
        </Box>
      </Box>

      {/* Modal de Sucesso */}
      <Modal
        open={modalAberto}
        onClose={handleVerPedido}
        aria-labelledby="modal-pedido-concluido"
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: { xs: "90%", sm: 400 },
            maxWidth: "90vw",
            bgcolor: "background.paper",
            borderRadius: 3,
            boxShadow: 24,
            p: { xs: 3, sm: 4 },
            textAlign: "center",
          }}
        >
          <Box
            sx={{
              width: { xs: 64, sm: 80 },
              height: { xs: 64, sm: 80 },
              borderRadius: "50%",
              backgroundColor: "#197824",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 16px",
            }}
          >
            <Typography 
              variant="h2" 
              sx={{ 
                color: "white",
                fontSize: { xs: "2.5rem", sm: "3.75rem" },
              }}
            >
              ✓
            </Typography>
          </Box>
          <Typography 
            variant="h5" 
            sx={{ 
              fontWeight: "bold", 
              mb: 2,
              fontSize: { xs: "1.25rem", sm: "1.5rem" },
            }}
          >
            Pedido Realizado!
          </Typography>
          <Typography 
            variant="body1" 
            color="text.secondary" 
            sx={{ 
              mb: 3,
              fontSize: { xs: "0.9rem", sm: "1rem" },
            }}
          >
            Seu pedido foi enviado com sucesso e já está sendo preparado.
          </Typography>
          <ButtonCTA 
            fullWidth 
            onClick={handleVerPedido} 
            cor="#197824"
            sx={{ 
              minHeight: { xs: 48, md: 44 },
              fontSize: { xs: "0.95rem", md: "1rem" },
            }}
          >
            Ver Detalhes do Pedido
          </ButtonCTA>
        </Box>
      </Modal>
    </Box>
  );
}
