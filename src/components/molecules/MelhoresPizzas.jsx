import { Box, Stack } from "@mui/material";
import React from "react";
import { TituloH2 } from "../atoms/TituloH2";
import CardPizza from "./CardPizza";

export function MelhoresPizzas() {
  return (
    <Stack
      direction={{ xs: "column", sm: "row" }}
      spacing={{ xs: 1, sm: 2, md: 4 }}
    >
      <Box>
        <TituloH2
          text={
            <>
              As Mais <br /> Pedidas da <br /> Casa
            </>
          }
          fontSize={"50px"}
          color={"red"}
        />

        <p>
          Experimente as nossas <br /> especialidades! As pizzas mais <br />{" "}
          populares do nosso cardápio.
        </p>
      </Box>

      <CardPizza
        src={"/img/pizzaMaguerita.png"}
        sabor={"Calabresa"}
        desc={
          <>
            Molho de tomate, queijo, linguiça <br /> calabresa e cebola.
          </>
        }
        preco={"45$"}
      />
      <CardPizza
        src={"/img/pizzaAtum.png"}
        sabor={"Bacon"}
        desc={<>Molho de tomate, queijo e pedaços <br /> de bacon crocante.</>}
        preco={"45$"}
      />
      <CardPizza
        src={"/img/pizzaMajericao.png"}
        sabor={"Marguerita"}
        desc={
          <>
            Molho de tomate, queijo mussarela, rodelas de <br /> tomate e
            manjericão.
          </>
        }
        preco={"45$"}
      />
    </Stack>
  );
}
