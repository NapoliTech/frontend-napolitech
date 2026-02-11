import React from "react";
import { Carrossel } from "../organisms/Carrossel";
import { TextBonari } from "../organisms/TextBonari";
import { Box, Grid } from "@mui/material";

export function CarosselComTexto({ children }) {
  const images = [
    { src: "/img/Bg-formularios.jpg", alt: "Background Formulários" },
    { src: "/img/bg-pizzaCaixa.jpg", alt: "Pizza na Caixa" },
    { src: "/img/bg-pizzaMesa.jpg", alt: "Pizza na Mesa" },
  ];

  return (
    <Box
      sx={{
        position: "relative",
        width: "100%",
        height: "100vh",
        overflow: "hidden",
      }}
    >
      {/* Carrossel como background fixo */}
      <Box
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          zIndex: 1,
        }}
      >
        <Carrossel images={images} />
      </Box>

      {/* Overlay escuro para melhorar legibilidade */}
      <Box
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          backgroundColor: "rgba(0, 0, 0, 0.5)",
          zIndex: 2,
        }}
      />

      {/* Grid responsivo para conteúdo */}
      <Grid
        container
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          zIndex: 3,
          margin: 0,
          padding: 0,
        }}
      >
        {/* Coluna esquerda - TextBonari (oculto em mobile) */}
        <Grid
          item
          xs={0}
          md={6}
          sx={{
            display: { xs: "none", md: "flex" },
            alignItems: "center",
            justifyContent: "center",
            height: "100%",
            pl: { md: 4, lg: 6 },
            pr: { md: 2 },
          }}
        >
          <Box
            sx={{
              maxWidth: "500px",
              width: "100%",
              "& .textBonari": {
                position: "relative !important",
                top: "auto !important",
                left: "auto !important",
                width: "100% !important",
                height: "auto !important",
              },
            }}
          >
            <TextBonari />
          </Box>
        </Grid>

        {/* Coluna direita - Formulário */}
        <Grid
          item
          xs={12}
          md={6}
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            height: "100%",
            px: { xs: 2, sm: 3, md: 4 },
          }}
        >
          <Box
            sx={{
              width: "100%",
              maxWidth: { xs: "400px", sm: "450px", md: "500px" },
            }}
          >
            {children}
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
}
