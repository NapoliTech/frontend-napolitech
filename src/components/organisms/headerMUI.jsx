import React from "react";
import { Box, Button, useTheme, useMediaQuery, Typography } from "@mui/material";
import FmdGoodIcon from "@mui/icons-material/FmdGood";
import PhoneIcon from "@mui/icons-material/Phone";
import InstagramIcon from "@mui/icons-material/Instagram";
import { Carrossel } from "./Carrossel";
import Nav from "../molecules/Nav";
import { useNavigate } from "react-router-dom";

export default function HeaderMUI() {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const isTablet = useMediaQuery(theme.breakpoints.down("lg"));

  const images = [
    { src: "/img/img_1_home.jpg", alt: "Background bem vindo" },
    { src: "/img/bg-pizzaMesa.jpg", alt: "Background bem vindo" },
  ];

  return (
    <header
      style={{
        position: "relative",
        width: "100%",
        height: isMobile ? "70vh" : "100vh",
        minHeight: isMobile ? "500px" : "600px",
        overflow: "hidden",
      }}
    >
      {/* TOP BAR - Oculta em mobile */}
      {!isMobile && (
        <Box
          sx={{
            backgroundColor: "#B72A23",
            height: "32px",
            display: "flex",
            justifyContent: "space-around",
            alignItems: "center",
            px: 2,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", color: "#FFF", gap: 1 }}>
            <FmdGoodIcon sx={{ fontSize: "18px" }} />
            <Typography variant="body2" component="span" sx={{ fontSize: "0.85rem" }}>
              Encontre a unidade mais próxima
            </Typography>
          </Box>

          <Box sx={{ display: "flex", alignItems: "center", color: "#FFF", gap: 1 }}>
            <PhoneIcon sx={{ fontSize: "18px" }} />
            <Typography variant="body2" component="span" sx={{ fontSize: "0.85rem" }}>
              (11) 91324-3487
            </Typography>
          </Box>

          <InstagramIcon sx={{ fontSize: "18px", cursor: "pointer" }} />
        </Box>
      )}

      {/* NAVEGAÇÃO */}
      <Nav
        backgroundColor="rgba(0, 0, 0, 0.0)"
        padding={isMobile ? "12px 16px" : "16px 32px"}
        position="absolute"
      />

      {/* CARROSSEL BACKGROUND */}
      <Box
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          height: "100%",
          width: "100%",
          zIndex: 0,
          "&::after": {
            content: '""',
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "linear-gradient(to right, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0.3) 60%, transparent 100%)",
            zIndex: 1,
          },
        }}
      >
        <Carrossel images={images} />
      </Box>

      {/* HERO CONTENT */}
      <Box
        sx={{
          position: "absolute",
          top: isMobile ? "50%" : "50%",
          left: isMobile ? "50%" : "8%",
          transform: isMobile ? "translate(-50%, -50%)" : "translateY(-50%)",
          width: isMobile ? "90%" : isTablet ? "60%" : "45%",
          maxWidth: isMobile ? "500px" : "650px",
          display: "flex",
          flexDirection: "column",
          gap: { xs: 2, md: 3 },
          color: "white",
          zIndex: 10,
          textAlign: isMobile ? "center" : "left",
        }}
      >
        <Typography
          variant="h1"
          sx={{
            fontSize: {
              xs: "clamp(2rem, 8vw, 3.5rem)",
              sm: "clamp(2.5rem, 7vw, 4rem)",
              md: "clamp(3rem, 6vw, 5rem)",
              lg: "clamp(4rem, 5vw, 5rem)",
            },
            fontWeight: 700,
            lineHeight: 1.2,
            textShadow: "2px 2px 8px rgba(0,0,0,0.7)",
            color: "#FFF",
          }}
        >
          Perfeição em cada fatia
        </Typography>

        <Button
          variant="contained"
          size={isMobile ? "large" : "large"}
          sx={{
            backgroundColor: "#B72A23",
            color: "#FFF",
            boxShadow: "0 4px 12px rgba(183, 42, 35, 0.4)",
            borderRadius: "10px",
            maxWidth: isMobile ? "100%" : "180px",
            minHeight: 48,
            fontSize: { xs: "1rem", md: "1.1rem" },
            fontWeight: 600,
            textTransform: "uppercase",
            transition: "all 0.3s ease",
            mx: isMobile ? "auto" : 0,
            "&:hover": {
              backgroundColor: "#9A1F1A",
              boxShadow: "0 6px 16px rgba(183, 42, 35, 0.6)",
              transform: "translateY(-2px)",
            },
            "&:active": {
              transform: "translateY(0)",
            },
          }}
          onClick={() => navigate("/pedidos")}
        >
          Peça Já
        </Button>
      </Box>
    </header>
  );
}
