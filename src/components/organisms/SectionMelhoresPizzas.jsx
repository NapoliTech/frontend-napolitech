import { Box } from "@mui/material";
import React from "react";
import { MelhoresPizzas } from "../molecules/MelhoresPizzas";
import { TituloH2 } from "../atoms/TituloH2";


export function SectionMelhoresPizzas(){
  return (
    <>
      <Box
        component="section"
        sx={{
          display: "flex",
          backgroundColor: "#DFDDD8",
          boxSizing: "border-box",
          width: "100%",
          height: "100%",
          justifyContent: "center",
          alignItems: "center",
          padding: "32px",
        }}
      >
        <MelhoresPizzas />
      </Box>

      <Box
        sx={{
          boxSizing: "border-box",
          width: "100%",
          height: "10%",
          overflow: "hidden",
          whiteSpace: "nowrap", 
          textOverflow: "ellipsis",
          backgroundColor: "#DFDDD8",
        }}
      >
        <TituloH2
          text={"* AMOR POR ENTREGAR* * AMOR POR PIZZA*  * AMOR POR ENTREGAR*"}
          fontSize={"70px"}
          color={"red"}
        />
      </Box>
    </>
  );
}