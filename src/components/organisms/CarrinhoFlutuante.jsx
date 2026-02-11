import React, { useState, useEffect, useContext } from "react";
import {
  Box,
  Fab,
  Drawer,
  Typography,
  IconButton,
  Divider,
  Button,
  List,
  ListItem,
  Chip,
  Tooltip,
  Tabs,
  Tab,
  Paper,
  Stack,
} from "@mui/material";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import CloseIcon from "@mui/icons-material/Close";
import RefreshIcon from "@mui/icons-material/Refresh";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import HourglassEmptyIcon from "@mui/icons-material/HourglassEmpty";
import CancelIcon from "@mui/icons-material/Cancel";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import HistoryIcon from "@mui/icons-material/History";
import ReceiptIcon from "@mui/icons-material/Receipt";
import DeleteIcon from "@mui/icons-material/Delete";
import BadgeCarrinho from "../atoms/BadgeCarrinho";
import EmptyState from "../atoms/EmptyState";
import ShoppingBasketIcon from "@mui/icons-material/ShoppingBasket";
import LoadingState from "../atoms/LoadingState";
import { getPedidosUsuario } from "../../services/carrinhoService";
import { PedidoContext } from "../../context/PedidoContext";

// Hook seguro que funciona com ou sem Provider
function usePedidoSafe() {
  try {
    const context = useContext(PedidoContext);
    if (!context) {
      return {
        carrinho: [],
        bebidas: [],
        removerDoCarrinho: () => {},
        removerBebida: () => {},
        calcularTotalGeral: () => "0.00",
        quantidadeItensCarrinho: () => 0,
      };
    }
    return context;
  } catch {
    return {
      carrinho: [],
      bebidas: [],
      removerDoCarrinho: () => {},
      removerBebida: () => {},
      calcularTotalGeral: () => "0.00",
      quantidadeItensCarrinho: () => 0,
    };
  }
}

// Função para decodificar JWT
function decodeJWT(token) {
  try {
    const payload = token.split(".")[1];
    return JSON.parse(atob(payload));
  } catch {
    return null;
  }
}

// Função para retornar cor e ícone do status
function getStatusProps(status) {
  switch (status) {
    case "RECEBIDO":
      return { color: "info", icon: <HourglassEmptyIcon fontSize="small" /> };
    case "CONCLUIDO":
      return { color: "success", icon: <CheckCircleIcon fontSize="small" /> };
    case "CANCELADO":
      return { color: "error", icon: <CancelIcon fontSize="small" /> };
    default:
      return { color: "default", icon: <InfoOutlinedIcon fontSize="small" /> };
  }
}

/**
 * Carrinho flutuante que mostra TODOS os pedidos do usuário
 * Histórico completo com status
 * @param {boolean} externalOpen - Controle externo de abertura (opcional)
 * @param {function} onExternalClose - Callback ao fechar externamente (opcional)
 */
export default function CarrinhoFlutuante({ externalOpen, onExternalClose }) {
  const [internalOpen, setInternalOpen] = useState(false);
  const drawerAberto = externalOpen !== undefined ? externalOpen : internalOpen;
  const setDrawerAberto = (value) => {
    if (externalOpen !== undefined && onExternalClose) {
      if (!value) onExternalClose();
    } else {
      setInternalOpen(value);
    }
  };
  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [tabAtiva, setTabAtiva] = useState(0); // 0 = Pedido Atual, 1 = Histórico
  const { 
    carrinho, 
    bebidas, 
    removerDoCarrinho, 
    removerBebida,
    calcularTotalGeral,
    quantidadeItensCarrinho 
  } = usePedidoSafe();

  const quantidadePedidoAtual = carrinho.length + bebidas.length;
  const quantidadePedidosHistorico = pedidos.length;

  const fetchPedidos = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    setLoading(true);
    const decoded = decodeJWT(token);
    const userId = decoded?.id || decoded?.userId || decoded?.sub;
    if (userId) {
      const data = await getPedidosUsuario(userId);
      setPedidos(data.pedidosRealizados || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (drawerAberto) {
      fetchPedidos();
    }
  }, [drawerAberto]);

  return (
    <>
      {/* Botão flutuante - só aparece quando não está sendo controlado externamente */}
      {externalOpen === undefined && (
        <Fab
          color="primary"
          onClick={() => setDrawerAberto(true)}
          sx={{
            position: "fixed",
            bottom: { xs: 16, md: 32 },
            right: { xs: 16, md: 32 },
            backgroundColor: "#B72A23",
            width: { xs: 56, md: 64 },
            height: { xs: 56, md: 64 },
            zIndex: 1200,
            boxShadow: 6,
            "&:hover": {
              backgroundColor: "#B72A23",
              filter: "brightness(0.9)",
              transform: "scale(1.1)",
            },
          transition: "all 0.3s ease",
        }}
      >
        <BadgeCarrinho quantidade={quantidadePedidoAtual} />
      </Fab>
      )}

      {/* Drawer lateral */}
      <Drawer
        anchor="right"
        open={drawerAberto}
        onClose={() => setDrawerAberto(false)}
        PaperProps={{
          sx: {
            width: { xs: "100%", sm: 400 },
            maxWidth: "100%",
          },
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            height: "100%",
          }}
        >
          {/* Header */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              p: 2,
              backgroundColor: "#B72A23",
              color: "white",
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <ShoppingCartIcon />
              <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                Carrinho
              </Typography>
            </Box>
            <IconButton
              onClick={() => setDrawerAberto(false)}
              sx={{ color: "white" }}
            >
              <CloseIcon />
            </IconButton>
          </Box>

          {/* Tabs */}
          <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
            <Tabs
              value={tabAtiva}
              onChange={(e, newValue) => setTabAtiva(newValue)}
              variant="fullWidth"
              sx={{
                "& .MuiTab-root": {
                  fontWeight: 500,
                },
              }}
            >
              <Tab 
                icon={<ReceiptIcon />} 
                label={`Pedido Atual (${quantidadePedidoAtual})`} 
                iconPosition="start"
              />
              <Tab 
                icon={<HistoryIcon />} 
                label={`Histórico (${quantidadePedidosHistorico})`}
                iconPosition="start"
              />
            </Tabs>
          </Box>

          {/* Conteúdo */}
          <Box sx={{ flex: 1, overflowY: "auto", p: 2 }}>
            {/* Tab 0: Pedido Atual */}
            {tabAtiva === 0 && (
              <>
                {quantidadePedidoAtual === 0 ? (
                  <EmptyState
                    icone={ShoppingBasketIcon}
                    titulo="Nenhuma pizza no carrinho"
                    mensagem="Monte sua pizza e adicione ao carrinho!"
                    acao={
                      <Button
                        variant="outlined"
                        onClick={() => setDrawerAberto(false)}
                      >
                        Começar a montar
                      </Button>
                    }
                  />
                ) : (
                  <>
                    {/* Pizzas */}
                    {carrinho.length > 0 && (
                      <>
                        <Typography variant="subtitle1" sx={{ fontWeight: "bold", mb: 2 }}>
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
                        <Typography variant="subtitle1" sx={{ fontWeight: "bold", mb: 2 }}>
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
                    <Box
                      sx={{
                        p: 2,
                        backgroundColor: "#F5F5F5",
                        borderRadius: 2,
                        border: "1px solid #E0E0E0",
                      }}
                    >
                      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                          Total do Pedido:
                        </Typography>
                        <Typography variant="h5" sx={{ fontWeight: "bold", color: "#197824" }}>
                          R$ {calcularTotalGeral()}
                        </Typography>
                      </Box>
                    </Box>
                  </>
                )}
              </>
            )}

            {/* Tab 1: Histórico */}
            {tabAtiva === 1 && (
              <>
                {loading ? (
                  <LoadingState tamanho={40} />
                ) : pedidos.length > 0 ? (
              <List sx={{ maxHeight: "100%", overflow: "auto" }}>
                {pedidos.map((pedido, idx) => {
                  const statusProps = getStatusProps(pedido.statusPedido);
                  return (
                    <React.Fragment key={pedido.id}>
                      <ListItem
                        sx={{
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "flex-start",
                          bgcolor: "#f8fafc",
                          borderRadius: 2,
                          mb: 2,
                          boxShadow: 1,
                          transition: "box-shadow 0.2s, background 0.2s",
                          "&:hover": {
                            boxShadow: 4,
                            bgcolor: "#e3f2fd",
                          },
                          width: "100%",
                          p: 2,
                        }}
                      >
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1, width: "100%" }}>
                          <Typography variant="subtitle1" sx={{ fontWeight: "bold", flex: 1 }}>
                            Pedido #{pedido.id}
                          </Typography>
                          <Tooltip title={pedido.statusPedido}>
                            <Chip
                              icon={statusProps.icon}
                              label={pedido.statusPedido}
                              color={statusProps.color}
                              size="small"
                              sx={{ fontWeight: "bold" }}
                            />
                          </Tooltip>
                        </Box>
                        <Typography variant="body2" sx={{ mb: 0.5 }}>
                          <strong>Data:</strong> {new Date(pedido.dataPedido).toLocaleString()}
                        </Typography>
                        <Typography variant="body2" sx={{ mb: 0.5 }}>
                          <strong>Total:</strong> R$ {pedido.precoTotal.toFixed(2)}
                        </Typography>
                        <Box sx={{ mt: 1, width: "100%" }}>
                          <Typography variant="body2" sx={{ fontWeight: "bold", mb: 0.5 }}>
                            Produtos:
                          </Typography>
                          <List dense sx={{ pl: 2 }}>
                            {pedido.itens.map((item, i) => {
                              const produtos = Array.isArray(item.produto) ? item.produto : [item.produto];
                              const nomes = produtos.map(p => typeof p === 'object' ? p.nome : p).join(", ");
                              const categorias = [...new Set(produtos.map(p => typeof p === 'object' ? p.categoriaProduto : ''))].filter(Boolean).join(", ");
                              const ingredientes = produtos.map(p => typeof p === 'object' ? p.ingredientes : '').filter(Boolean).join(" | ");
                              const precoTotal = produtos.reduce((sum, p) => sum + (typeof p === 'object' ? p.preco : 0), 0);
                              
                              return (
                                <ListItem key={i} sx={{ py: 0.5, px: 0, alignItems: "flex-start" }}>
                                  <Box>
                                    <Typography variant="body2" sx={{ fontWeight: "bold" }}>
                                      {nomes}{" "}
                                      {categorias && (
                                        <Chip
                                          label={categorias}
                                          size="small"
                                          color="primary"
                                          sx={{ ml: 1, fontWeight: "bold", height: "20px" }}
                                        />
                                      )}
                                    </Typography>
                                    {ingredientes && (
                                      <Typography variant="body2" sx={{ color: "text.secondary" }}>
                                        Ingredientes: {ingredientes}
                                      </Typography>
                                    )}
                                    <Typography variant="body2">
                                      Preço: <strong>R$ {precoTotal.toFixed(2)}</strong>
                                    </Typography>
                                    <Typography variant="body2">
                                      Quantidade: <strong>{item.quantidade}</strong>
                                    </Typography>
                                    {item.bordaRecheada && (
                                      <Typography variant="body2">
                                        Borda: <strong>{item.bordaRecheada}</strong>
                                      </Typography>
                                    )}
                                    {item.tamanhoPizza && (
                                      <Typography variant="body2">
                                        Tamanho: <strong>{item.tamanhoPizza}</strong>
                                      </Typography>
                                    )}
                                  </Box>
                                </ListItem>
                              );
                            })}
                          </List>
                        </Box>
                      </ListItem>
                      {idx < pedidos.length - 1 && <Divider />}
                    </React.Fragment>
                  );
                })}
              </List>
                ) : (
                  <EmptyState
                    icone={ShoppingBasketIcon}
                    titulo="Nenhum pedido encontrado"
                    mensagem="Você ainda não fez nenhum pedido."
                    acao={
                      <Button
                        variant="outlined"
                        onClick={() => setDrawerAberto(false)}
                      >
                        Fazer primeiro pedido
                      </Button>
                    }
                  />
                )}
              </>
            )}
          </Box>

          {/* Footer com botão de atualizar */}
          <Box sx={{ p: 2, borderTop: "1px solid #E0E0E0", display: "flex", gap: 2 }}>
            <Button
              onClick={fetchPedidos}
              variant="outlined"
              color="primary"
              fullWidth
              startIcon={<RefreshIcon />}
              disabled={loading}
            >
              Atualizar
            </Button>
            <Button
              onClick={() => setDrawerAberto(false)}
              variant="contained"
              color="primary"
              fullWidth
            >
              Fechar
            </Button>
          </Box>
        </Box>
      </Drawer>
    </>
  );
}
