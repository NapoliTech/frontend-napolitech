import React from "react";
import { Badge } from "@mui/material";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";

/**
 * Badge do carrinho com quantidade de itens
 */
export default function BadgeCarrinho({ quantidade = 0, ...props }) {
  return (
    <Badge
      badgeContent={quantidade}
      color="error"
      sx={{
        "& .MuiBadge-badge": {
          fontWeight: "bold",
          fontSize: "0.75rem",
          minWidth: "22px",
          height: "22px",
        },
      }}
      {...props}
    >
      <ShoppingCartIcon
        sx={{
          fontSize: 28,
          color: "white",
        }}
      />
    </Badge>
  );
}
