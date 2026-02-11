import { Box } from "@mui/material";
import React from "react";
import SectionPedidosNovo from "../organisms/SectionPedidosNovo";

export default function Pedidos() {
  return (
    <Box
      sx={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        overflow: 'hidden'
      }}
    >
      <SectionPedidosNovo />
    </Box>
  );
}
