import React from "react";
import { Box, Typography, Paper, Chip } from "@mui/material";

/**
 * Componente para visualizar a pizza sendo montada
 * Mantém a mesma lógica visual do código original
 */
export default function PizzaVisual({
  metadeEsquerda,
  metadeDireita,
  onClickEsquerda,
  onClickDireita,
  tamanho = 350,
}) {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 2,
      }}
    >
      {/* Visualizador da pizza */}
      <Paper
        elevation={4}
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          width: { xs: 280, sm: tamanho },
          height: { xs: 280, sm: tamanho },
          borderRadius: "50%",
          position: "relative",
          overflow: "hidden",
          backgroundColor: "#F5F5F5",
        }}
      >
        {/* Metade Esquerda */}
        <Box
          onClick={onClickEsquerda}
          sx={{
            width: "50%",
            height: "100%",
            position: "relative",
            display: "flex",
            justifyContent: "flex-end",
            cursor: "pointer",
            transition: "all 0.3s ease",
            "&:hover": {
              filter: "brightness(0.95)",
              transform: "scale(1.02)",
            },
          }}
        >
          {/* Tábua esquerda */}
          <Box
            sx={{
              width: "100%",
              height: "94%",
              backgroundImage: "url(/img/tabua_pizzaEsq.png)",
              backgroundSize: "cover",
              backgroundRepeat: "no-repeat",
              backgroundPosition: "center",
            }}
          />

          {/* Pizza esquerda (se selecionada) */}
          {metadeEsquerda && (
            <Box
              sx={{
                width: "85%",
                height: "85%",
                backgroundImage: "url(/img/mussarela_esq.png)",
                backgroundSize: "cover",
                backgroundPosition: "center",
                position: "absolute",
                top: "4%",
              }}
            />
          )}

          {/* Overlay de Seleção */}
          {!metadeEsquerda && (
            <Box
              sx={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: "rgba(183, 42, 35, 0.1)",
                transition: "all 0.3s ease",
                "&:hover": {
                  backgroundColor: "rgba(183, 42, 35, 0.2)",
                },
              }}
            >
              <Chip
                label="Clique aqui"
                sx={{
                  backgroundColor: "#B72A23",
                  color: "white",
                  fontWeight: "bold",
                  fontSize: "0.8rem",
                }}
              />
            </Box>
          )}
        </Box>

        {/* Metade Direita */}
        <Box
          onClick={onClickDireita}
          sx={{
            width: "50%",
            height: "100%",
            position: "relative",
            display: "flex",
            justifyContent: "flex-start",
            cursor: "pointer",
            transition: "all 0.3s ease",
            "&:hover": {
              filter: "brightness(0.95)",
              transform: "scale(1.02)",
            },
          }}
        >
          {/* Tábua direita */}
          <Box
            sx={{
              width: "100%",
              height: "94%",
              backgroundImage: "url(/img/tabua_pizzaDir.png)",
              backgroundSize: "cover",
              backgroundRepeat: "no-repeat",
              backgroundPosition: "center",
            }}
          />

          {/* Pizza direita (se selecionada) */}
          {metadeDireita && (
            <Box
              sx={{
                width: "85%",
                height: "85%",
                backgroundImage: "url(/img/mussarela_dir.png)",
                backgroundSize: "cover",
                backgroundPosition: "center",
                position: "absolute",
                top: "4%",
              }}
            />
          )}

          {/* Overlay de Seleção */}
          {!metadeDireita && (
            <Box
              sx={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: "rgba(183, 42, 35, 0.1)",
                transition: "all 0.3s ease",
                "&:hover": {
                  backgroundColor: "rgba(183, 42, 35, 0.2)",
                },
              }}
            >
              <Chip
                label="Clique aqui"
                sx={{
                  backgroundColor: "#B72A23",
                  color: "white",
                  fontWeight: "bold",
                  fontSize: "0.8rem",
                }}
              />
            </Box>
          )}
        </Box>
      </Paper>

      {/* Informações das metades selecionadas */}
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 1,
          alignItems: "center",
          minHeight: "60px",
        }}
      >
        {metadeEsquerda && (
          <Typography
            variant="body1"
            sx={{
              fontWeight: 500,
              color: "#fff",
              backgroundColor: "rgba(0,0,0,0.5)",
              padding: "4px 12px",
              borderRadius: 1,
            }}
          >
            Esquerda: {metadeEsquerda.sabor || metadeEsquerda.nome}
          </Typography>
        )}
        {metadeDireita && (
          <Typography
            variant="body1"
            sx={{
              fontWeight: 500,
              color: "#fff",
              backgroundColor: "rgba(0,0,0,0.5)",
              padding: "4px 12px",
              borderRadius: 1,
            }}
          >
            Direita: {metadeDireita.sabor || metadeDireita.nome}
          </Typography>
        )}
      </Box>
    </Box>
  );
}
