import React from "react";
import { styled } from "@mui/material/styles";
import { Box } from "@mui/material";
import { SectionQualidade } from "../atoms/SectionQualidade";
import { TituloH2 } from "../atoms/TituloH2";

const StyledBox = styled(Box)(() => ({
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
}));

export function BannerPizza() {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        boxSizing: "border-box",
        margin: "50px",
        marginTop: "30px",
      }}
    >
      <Box
        sx={{
          width: "80%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: "24px",
        }}
      >
        <Box
          sx={{
            width: "50%",
            display: "flex",
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
            display: "flex",
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
