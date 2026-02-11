import React from "react";
import { styled } from "@mui/material/styles";
import { Box } from "@mui/material";
import { SectionQualidade } from "../atoms/SectionQualidade";
import { TituloH2 } from "../atoms/TituloH2";

const StyledBox = styled(Box)(({ theme }) => ({
  width: "290px",
  height: "280px",
  margin: "8px",
  borderRadius: "8px",
  display: "flex",
  flexDirection: "column",
  gap: "8px",
  "& img": {
    width: "80px",
    height: "auto",
    objectFit: "cover",
    marginBottom: "8px",
  },
  [theme.breakpoints.down("lg")]: {
    width: "100%",
    maxWidth: "100%",
    margin: "0",
  },
}));

export function BannerPizza() {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        boxSizing: "border-box",
        margin: { xs: "20px", lg: "50px" },
        marginTop: { xs: "20px", lg: "30px" },
        padding: { xs: "16px", lg: "0" },
      }}
    >
      <Box
        sx={{
          width: { xs: "100%", lg: "80%" },
          display: { xs: "flex", lg: "flex" },
          flexDirection: { xs: "column", lg: "row" },
          justifyContent: "center",
          alignItems: "center",
          gap: { xs: "32px", lg: "24px" },
        }}
      >
        {/* MOBILE/TABLET: Logo + Título + Grid vertical */}
        <Box
          sx={{
            display: { xs: "flex", lg: "none" },
            flexDirection: "column",
            gap: "32px",
            width: "100%",
            alignItems: "center",
          }}
        >
          {/* Logo centralizada */}
          <img
            src="/img/logo_bonari.png"
            alt="Logo Bonari"
            style={{
              width: "auto",
              height: "140px",
              objectFit: "contain",
            }}
          />

          {/* Título */}
          <TituloH2
            text={
              <>
                Você merece uma <br /> pizza hoje!
              </>
            }
            fontSize={"clamp(32px, 5vw, 50px)"}
            color={"red"}
          />

          {/* Grid vertical - 1 coluna */}
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: "16px",
              width: "100%",
              maxWidth: "400px",
            }}
          >
            <StyledBox>
              <SectionQualidade
                srcImg={"/img/camarao.png"}
                textH2={"Produtos de qualidade"}
                textP={
                  <>
                    cuidadosamente escolidos <br /> para um alto nivel de
                    qualidade
                  </>
                }
              />
            </StyledBox>

            <StyledBox>
              <SectionQualidade
                srcImg={"/img/tomate.png"}
                textH2={"Produtos de qualidade"}
                textP={
                  <>
                    cuidadosamente escolidos <br /> para um alto nivel de
                    qualidade
                  </>
                }
              />
            </StyledBox>

            <StyledBox>
              <SectionQualidade
                srcImg={"/img/azeite.png"}
                textH2={"Produtos de qualidade"}
                textP={
                  <>
                    cuidadosamente escolidos <br /> para um alto nivel de
                    qualidade
                  </>
                }
              />
            </StyledBox>

            <StyledBox>
              <SectionQualidade
                srcImg={"/img/joia.png"}
                textH2={"Produtos de qualidade"}
                textP={
                  <>
                    cuidadosamente escolidos <br /> para um alto nivel de
                    qualidade
                  </>
                }
              />
            </StyledBox>
          </Box>
        </Box>

        {/* DESKTOP: Layout original com imagem da pizza */}
        <Box
          sx={{
            width: "50%",
            display: { xs: "none", lg: "flex" },
          }}
        >
          <img
            src="/img/pizzaBanner.png"
            alt="Pizza Banner"
            style={{
              width: "150%",
              height: "100%",
              objectFit: "cover",
              borderRadius: "8px",
              marginLeft: "-190px",
            }}
          />
        </Box>

        <Box
          sx={{
            display: { xs: "none", lg: "flex" },
            flexDirection: "column",
            gap: "24px",
            maxWidth: "50%",
            flex: 1,
            boxSizing: "border-box",
          }}
        >
          <TituloH2
            text={
              <>
                Você merece uma <br /> pizza hoje!
              </>
            }
            fontSize={"50px"}
            color={"red"}
          />
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: "repeat(2, 1fr)",
              gap: "8px",
              marginTop: "16px",
            }}
          >
            <StyledBox>
              <SectionQualidade
                srcImg={"/img/camarao.png"}
                textH2={"Produtos de qualidade"}
                textP={
                  <>
                    cuidadosamente escolidos <br /> para um alto nivel de
                    qualidade
                  </>
                }
              />
            </StyledBox>

            <StyledBox>
              <SectionQualidade
                srcImg={"/img/tomate.png"}
                textH2={"Produtos de qualidade"}
                textP={
                  <>
                    cuidadosamente escolidos <br /> para um alto nivel de
                    qualidade
                  </>
                }
              />
            </StyledBox>

            <StyledBox>
              <SectionQualidade
                srcImg={"/img/azeite.png"}
                textH2={"Produtos de qualidade"}
                textP={
                  <>
                    cuidadosamente escolidos <br /> para um alto nivel de
                    qualidade
                  </>
                }
              />
            </StyledBox>

            <StyledBox>
              <SectionQualidade
                srcImg={"/img/joia.png"}
                textH2={"Produtos de qualidade"}
                textP={
                  <>
                    cuidadosamente escolidos <br /> para um alto nivel de
                    qualidade
                  </>
                }
              />
            </StyledBox>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
