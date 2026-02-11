import { 
  Box, 
  IconButton, 
  Drawer, 
  List, 
  ListItem, 
  ListItemButton, 
  ListItemText,
  Badge,
  useTheme,
  useMediaQuery,
  Divider,
  Typography,
  ListItemIcon,
  Avatar,
  Chip,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import RestaurantMenuIcon from "@mui/icons-material/RestaurantMenu";
import PhoneIcon from "@mui/icons-material/Phone";
import LoginIcon from "@mui/icons-material/Login";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import LogoutIcon from "@mui/icons-material/Logout";
import HomeIcon from "@mui/icons-material/Home";
import LocalPizzaIcon from "@mui/icons-material/LocalPizza";
import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import CarrinhoFlutuante from "../organisms/CarrinhoFlutuante";
import ModalSair from "./ModalSair";
import ModalChatbot from "./ModalChatbot";
import { usePedido } from "../../context/PedidoContext";

export default function Nav({ backgroundColor, padding, position, left }) {
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  
  const [carrinhoAberto, setCarrinhoAberto] = useState(false);
  const [modalSairAberto, setModalSairAberto] = useState(false);
  const [modalChatbotAberto, setModalChatbotAberto] = useState(false);
  const [drawerAberto, setDrawerAberto] = useState(false);

  const token = localStorage.getItem("token");
  
  // Safely get cart items with fallback
  let totalItensCarrinho = 0;
  try {
    const { carrinho, bebidas } = usePedido() || {};
    totalItensCarrinho = (carrinho?.length || 0) + (bebidas?.length || 0);
  } catch {
    // Context não disponível, usa valor padrão
    totalItensCarrinho = 0;
  }

  const handleLogout = () => {
    sessionStorage.clear();
    localStorage.removeItem("token");
    setModalSairAberto(false);
    navigate("/");
    window.location.reload();
  };

  const isHomePage = location.pathname === "/";

  const menuItems = [
    { 
      label: "Início", 
      icon: <HomeIcon />, 
      action: () => {
        navigate("/");
        setDrawerAberto(false);
      },
      color: "#4CAF50",
    },
    { 
      label: "Fazer Pedido", 
      icon: <LocalPizzaIcon />, 
      action: () => {
        navigate("/pedidos");
        setDrawerAberto(false);
      },
      color: "#FF5722",
    },
    { 
      label: "Cardápio", 
      icon: <RestaurantMenuIcon />, 
      action: () => {
        setModalChatbotAberto(true);
        setDrawerAberto(false);
      },
      color: "#FF9800",
    },
    { 
      label: "Fale Conosco", 
      icon: <PhoneIcon />, 
      action: () => {
        navigate("/");
        setDrawerAberto(false);
      },
      color: "#2196F3",
    },
  ];

  const authItems = token
    ? [{ 
        label: "Sair", 
        icon: <LogoutIcon />, 
        action: () => {
          setModalSairAberto(true);
          setDrawerAberto(false);
        },
        color: "#F44336",
      }]
    : [
        { 
          label: "Cadastrar", 
          icon: <PersonAddIcon />, 
          action: () => {
            navigate("/Cadastro");
            setDrawerAberto(false);
          },
          color: "#9C27B0",
        },
        { 
          label: "Login", 
          icon: <LoginIcon />, 
          action: () => {
            navigate("/login");
            setDrawerAberto(false);
          },
          color: "#3F51B5",
        },
      ];

  return (
    <>
      <Box
        component="nav"
        sx={{
          position: position || "relative",
          left: left || "auto",
          width: "100%",
          maxWidth: "100vw",
          display: "flex",
          justifyContent: isMobile ? "flex-start" : "flex-start",
          alignItems: isMobile ? "flex-start" : "center",
          gap: { md: 1, lg: 1.5 },
          padding: padding || { xs: "8px 16px", md: "8px 16px", lg: "10px 24px" },
          zIndex: 10,
          backgroundColor: backgroundColor || "transparent",
          color: "#FFF",
          transition: "all 0.3s ease",
          overflow: "hidden",
          boxSizing: "border-box",
        }}
      >
        {/* MOBILE: Logo no topo + Menu e Carrinho na mesma linha */}
        {isMobile ? (
          <>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-start",
                gap: 0.5,
                width: "100%",
              }}
            >
              {/* Logo no topo */}
              <img
                src="/img/logo_bonari.png"
                alt="Logo Bonari"
                style={{
                  width: "auto",
                  height: isHomePage ? "60px" : "50px",
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                  filter: "drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3))",
                }}
                onClick={() => navigate("/")}
              />

              {/* Linha com Menu e Carrinho */}
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  width: "100%",
                }}
              >
                <IconButton
                  onClick={() => setDrawerAberto(true)}
                  sx={{ 
                    color: "#FFF",
                    width: 40,
                    height: 40,
                    backgroundColor: "rgba(255, 255, 255, 0.1)",
                    transition: "all 0.3s ease",
                    "&:hover": {
                      backgroundColor: "rgba(255, 255, 255, 0.2)",
                      transform: "scale(1.05)",
                    },
                    "&:active": {
                      transform: "scale(0.95)",
                    },
                  }}
                  aria-label="Abrir menu"
                >
                  <MenuIcon sx={{ fontSize: 24 }} />
                </IconButton>

                <IconButton
                  onClick={() => setCarrinhoAberto(true)}
                  sx={{ 
                    color: "#FFF",
                    width: 40,
                    height: 40,
                    backgroundColor: "rgba(255, 255, 255, 0.1)",
                    transition: "all 0.3s ease",
                    "&:hover": {
                      backgroundColor: "rgba(255, 255, 255, 0.2)",
                      transform: "scale(1.05)",
                    },
                    "&:active": {
                      transform: "scale(0.95)",
                    },
                  }}
                  aria-label="Abrir carrinho"
                >
                  <Badge 
                    badgeContent={totalItensCarrinho} 
                    color="error"
                    sx={{
                      "& .MuiBadge-badge": {
                        fontSize: "0.7rem",
                        fontWeight: "bold",
                        minWidth: "18px",
                        height: "18px",
                        animation: totalItensCarrinho > 0 ? "pulse 2s infinite" : "none",
                      },
                      "@keyframes pulse": {
                        "0%, 100%": { transform: "scale(1)" },
                        "50%": { transform: "scale(1.1)" },
                      },
                    }}
                  >
                    <ShoppingCartIcon sx={{ fontSize: 22 }} />
                  </Badge>
                </IconButton>
              </Box>
            </Box>
          </>
        ) : (
          /* DESKTOP: Layout simplificado - todos os itens inline */
          <>
            <NavLink onClick={() => navigate("/")}>
              <HomeIcon sx={{ mr: 0.5, fontSize: 18 }} />
              Início
            </NavLink>
            <NavLink onClick={() => setModalChatbotAberto(true)}>
              <RestaurantMenuIcon sx={{ mr: 0.5, fontSize: 18 }} />
              Cardápio
            </NavLink>
            <NavLink onClick={() => navigate("/")}>
              <PhoneIcon sx={{ mr: 0.5, fontSize: 18 }} />
              Contato
            </NavLink>

            {/* Logo - centralizada */}
            <Box
              onClick={() => navigate("/")}
              sx={{
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                mx: "auto",
                transition: "all 0.3s ease",
                "&:hover": {
                  transform: "scale(1.05)",
                },
              }}
            >
              <img
                src="/img/logo_bonari.png"
                alt="Logo Bonari"
                style={{
                  width: "auto",
                  height: isHomePage ? "70px" : "55px",
                  display: "block",
                  pointerEvents: "none",
                }}
              />
            </Box>

            {token ? (
              <NavLink onClick={() => setModalSairAberto(true)}>
                <LogoutIcon sx={{ mr: 0.5, fontSize: 18 }} />
                Sair
              </NavLink>
            ) : (
              <>
                <NavLink onClick={() => navigate("/Cadastro")}>
                  <PersonAddIcon sx={{ mr: 0.5, fontSize: 18 }} />
                  Cadastrar
                </NavLink>
                <NavLink onClick={() => navigate("/login")} variant="outlined">
                  <LoginIcon sx={{ mr: 0.5, fontSize: 18 }} />
                  Login
                </NavLink>
              </>
            )}
            
            <IconButton
              onClick={() => setCarrinhoAberto(true)}
              sx={{
                color: "#FFF",
                backgroundColor: "#B72A23",
                borderRadius: "8px",
                width: 44,
                height: 44,
                minWidth: 44,
                maxWidth: 44,
                p: 0,
                flexShrink: 0,
                transition: "all 0.3s ease",
                "&:hover": {
                  backgroundColor: "#8B1F1A",
                  transform: "translateY(-2px)",
                  boxShadow: "0 4px 12px rgba(183, 42, 35, 0.5)",
                },
                "&:active": {
                  transform: "translateY(0)",
                },
              }}
              aria-label="Abrir carrinho"
            >
              <Badge 
                badgeContent={totalItensCarrinho} 
                color="error"
                sx={{
                  "& .MuiBadge-badge": {
                    fontSize: "0.7rem",
                    fontWeight: "bold",
                    minWidth: "18px",
                    height: "18px",
                    animation: totalItensCarrinho > 0 ? "pulse 2s infinite" : "none",
                  },
                  "@keyframes pulse": {
                    "0%, 100%": { transform: "scale(1)" },
                    "50%": { transform: "scale(1.1)" },
                  },
                }}
              >
                <ShoppingCartIcon sx={{ fontSize: 20 }} />
              </Badge>
            </IconButton>
          </>
        )}
      </Box>

      {/* DRAWER MOBILE - UI/UX Aprimorada */}
      <Drawer
        anchor="left"
        open={drawerAberto}
        onClose={() => setDrawerAberto(false)}
        PaperProps={{
          sx: {
            width: 300,
            background: "linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)",
            color: "#FFF",
            boxShadow: "4px 0 24px rgba(0, 0, 0, 0.5)",
          },
        }}
        transitionDuration={400}
      >
        {/* Header do Drawer com gradiente */}
        <Box 
          sx={{ 
            p: 3,
            background: "linear-gradient(135deg, #B72A23 0%, #8B1F1A 100%)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 2,
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.3)",
          }}
        >
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%" }}>
            <Typography variant="h6" sx={{ fontWeight: "bold", letterSpacing: "0.5px" }}>
              Menu
            </Typography>
            <IconButton
              onClick={() => setDrawerAberto(false)}
              sx={{ 
                color: "#FFF",
                backgroundColor: "rgba(255, 255, 255, 0.1)",
                "&:hover": {
                  backgroundColor: "rgba(255, 255, 255, 0.2)",
                  transform: "rotate(90deg)",
                },
                transition: "all 0.3s ease",
              }}
            >
              <CloseIcon />
            </IconButton>
          </Box>
          
          {/* Logo no drawer */}
          <img
            src="/img/logo_bonari.png"
            alt="Logo Bonari"
            style={{
              width: "auto",
              height: "80px",
              filter: "drop-shadow(0 2px 8px rgba(0, 0, 0, 0.5))",
            }}
          />
          
          {/* Badge de status do usuário */}
          {token && (
            <Chip
              icon={<PersonAddIcon />}
              label="Autenticado"
              size="small"
              sx={{
                backgroundColor: "rgba(255, 255, 255, 0.2)",
                color: "#FFF",
                fontWeight: "600",
                backdropFilter: "blur(10px)",
              }}
            />
          )}
        </Box>

        {/* Menu de Navegação */}
        <Box sx={{ py: 2 }}>
          <Typography 
            variant="caption" 
            sx={{ 
              px: 3, 
              py: 1, 
              color: "rgba(255, 255, 255, 0.6)",
              fontWeight: "600",
              textTransform: "uppercase",
              letterSpacing: "1px",
            }}
          >
            Navegação
          </Typography>
          <List>
            {menuItems.map((item, index) => (
              <ListItem key={item.label} disablePadding>
                <ListItemButton 
                  onClick={item.action}
                  sx={{ 
                    minHeight: 60,
                    px: 3,
                    py: 1.5,
                    transition: "all 0.3s ease",
                    animation: `slideIn 0.3s ease ${index * 0.1}s both`,
                    "@keyframes slideIn": {
                      "0%": { opacity: 0, transform: "translateX(-20px)" },
                      "100%": { opacity: 1, transform: "translateX(0)" },
                    },
                    "&:hover": { 
                      backgroundColor: "rgba(255, 255, 255, 0.1)",
                      paddingLeft: "32px",
                    },
                    "&:active": {
                      backgroundColor: "rgba(255, 255, 255, 0.15)",
                    },
                  }}
                >
                  <ListItemIcon sx={{ minWidth: 40 }}>
                    <Box
                      sx={{
                        width: 40,
                        height: 40,
                        borderRadius: "10px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        backgroundColor: `${item.color}20`,
                        color: item.color,
                        transition: "all 0.3s ease",
                        "&:hover": {
                          backgroundColor: item.color,
                          color: "#FFF",
                          transform: "scale(1.1) rotate(5deg)",
                        },
                      }}
                    >
                      {item.icon}
                    </Box>
                  </ListItemIcon>
                  <ListItemText 
                    primary={item.label}
                    primaryTypographyProps={{
                      fontWeight: 500,
                      fontSize: "1rem",
                    }}
                  />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Box>

        <Divider sx={{ borderColor: "rgba(255, 255, 255, 0.15)", mx: 2 }} />

        {/* Menu de Autenticação */}
        <Box sx={{ py: 2 }}>
          <Typography 
            variant="caption" 
            sx={{ 
              px: 3, 
              py: 1, 
              color: "rgba(255, 255, 255, 0.6)",
              fontWeight: "600",
              textTransform: "uppercase",
              letterSpacing: "1px",
            }}
          >
            {token ? "Conta" : "Autenticação"}
          </Typography>
          <List>
            {authItems.map((item, index) => (
              <ListItem key={item.label} disablePadding>
                <ListItemButton 
                  onClick={item.action}
                  sx={{ 
                    minHeight: 60,
                    px: 3,
                    py: 1.5,
                    transition: "all 0.3s ease",
                    animation: `slideIn 0.3s ease ${(menuItems.length + index) * 0.1}s both`,
                    "@keyframes slideIn": {
                      "0%": { opacity: 0, transform: "translateX(-20px)" },
                      "100%": { opacity: 1, transform: "translateX(0)" },
                    },
                    "&:hover": { 
                      backgroundColor: "rgba(255, 255, 255, 0.1)",
                      paddingLeft: "32px",
                    },
                    "&:active": {
                      backgroundColor: "rgba(255, 255, 255, 0.15)",
                    },
                  }}
                >
                  <ListItemIcon sx={{ minWidth: 40 }}>
                    <Box
                      sx={{
                        width: 40,
                        height: 40,
                        borderRadius: "10px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        backgroundColor: `${item.color}20`,
                        color: item.color,
                        transition: "all 0.3s ease",
                        "&:hover": {
                          backgroundColor: item.color,
                          color: "#FFF",
                          transform: "scale(1.1) rotate(5deg)",
                        },
                      }}
                    >
                      {item.icon}
                    </Box>
                  </ListItemIcon>
                  <ListItemText 
                    primary={item.label}
                    primaryTypographyProps={{
                      fontWeight: 500,
                      fontSize: "1rem",
                    }}
                  />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Box>

        {/* Botão Carrinho Destacado no Drawer */}
        <Box sx={{ px: 3, pb: 3, mt: "auto" }}>
          <Box
            onClick={() => {
              setCarrinhoAberto(true);
              setDrawerAberto(false);
            }}
            sx={{
              backgroundColor: "#B72A23",
              borderRadius: "12px",
              p: 2,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              cursor: "pointer",
              transition: "all 0.3s ease",
              boxShadow: "0 4px 12px rgba(183, 42, 35, 0.4)",
              "&:hover": {
                backgroundColor: "#9A1F1A",
                transform: "translateY(-2px)",
                boxShadow: "0 6px 16px rgba(183, 42, 35, 0.6)",
              },
              "&:active": {
                transform: "translateY(0)",
              },
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <ShoppingCartIcon sx={{ fontSize: 28 }} />
              <Box>
                <Typography variant="body2" sx={{ fontWeight: "600", opacity: 0.9 }}>
                  Meu Carrinho
                </Typography>
                <Typography variant="caption" sx={{ opacity: 0.7 }}>
                  {totalItensCarrinho} {totalItensCarrinho === 1 ? "item" : "itens"}
                </Typography>
              </Box>
            </Box>
            <Badge 
              badgeContent={totalItensCarrinho} 
              color="warning"
              sx={{
                "& .MuiBadge-badge": {
                  fontSize: "0.85rem",
                  fontWeight: "bold",
                  minWidth: "28px",
                  height: "28px",
                },
              }}
            />
          </Box>
        </Box>

        {/* Footer do Drawer */}
        <Box 
          sx={{ 
            p: 2, 
            textAlign: "center", 
            color: "rgba(255, 255, 255, 0.4)",
            fontSize: "0.75rem",
            borderTop: "1px solid rgba(255, 255, 255, 0.1)",
          }}
        >
          <Typography variant="caption">
            Bonari Pizzaria © 2025
          </Typography>
        </Box>
      </Drawer>

      <ModalChatbot
        aberto={modalChatbotAberto}
        fecharModal={() => setModalChatbotAberto(false)}
      />

      <CarrinhoFlutuante
        externalOpen={carrinhoAberto}
        onExternalClose={() => setCarrinhoAberto(false)}
      />

      <ModalSair
        aberto={modalSairAberto}
        fecharModal={() => setModalSairAberto(false)}
        onConfirmar={handleLogout}
      />
    </>
  );
}

// Componente helper NavLink para desktop
function NavLink({ children, onClick, variant = "default" }) {
  return (
    <Box
      onClick={onClick}
      sx={{
        color: "#FFF",
        cursor: "pointer",
        fontSize: { md: "0.95rem", lg: "1rem" },
        fontWeight: 500,
        minHeight: 44,
        display: "flex",
        alignItems: "center",
        px: variant === "outlined" ? 2 : 1.5,
        py: 1,
        borderRadius: "8px",
        border: variant === "outlined" ? "1.5px solid rgba(255, 255, 255, 0.3)" : "none",
        backgroundColor: variant === "outlined" ? "rgba(255, 255, 255, 0.05)" : "transparent",
        transition: "all 0.3s ease",
        "&:hover": {
          backgroundColor: variant === "outlined" 
            ? "rgba(255, 255, 255, 0.15)" 
            : "rgba(255, 255, 255, 0.1)",
          transform: "translateY(-2px)",
          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
        },
        "&:active": {
          transform: "translateY(0)",
        },
      }}
    >
      {children}
    </Box>
  );
}