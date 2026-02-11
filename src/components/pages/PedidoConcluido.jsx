import React from "react";
import { Box, Typography, Button } from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";

export default function PedidoConcluido() {
  const navigate = useNavigate();
  const location = useLocation();

  // Recupera os dados do pedido enviados via state
  const { pedido } = location.state || {};

  const handleVoltarInicio = () => {
    navigate("/"); // Redireciona para a tela inicial
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        bgcolor: "#f5f5f5",
        padding: "16px",
      }}
    >
      <Typography
        variant="h4"
        component="h1"
        gutterBottom
        sx={{ color: "#197824", fontWeight: "bold", textAlign: "center" }}
      >
        Obrigado pelo seu pedido!
      </Typography>
      <Typography
        variant="body1"
        sx={{ color: "#555", textAlign: "center", marginBottom: "24px" }}
      >
        Seu pedido foi concluído com sucesso. Em breve, ele estará pronto para entrega ou retirada.
      </Typography>

      {/* Exibe os dados do pedido */}
      {pedido ? (
        <Box
          sx={{
            width: "100%",
            maxWidth: "600px",
            bgcolor: "#fff",
            boxShadow: 3,
            borderRadius: "8px",
            padding: "16px",
            marginBottom: "24px",
          }}
        >
          <Typography variant="h6" sx={{ marginBottom: "16px" }}>
            Detalhes do Pedido:
          </Typography>
          <Typography variant="body1" sx={{ marginBottom: "8px" }}>
            <strong>Tipo de Entrega:</strong> {pedido.tipoEntrega}
          </Typography>
          <Typography variant="body1" sx={{ marginBottom: "8px" }}>
            <strong>Observação:</strong> {pedido.observacao || "Nenhuma"}
          </Typography>
          <Typography variant="body1" sx={{ marginBottom: "16px" }}>
            <strong>Itens do Pedido:</strong>
          </Typography>
          <Box component="ul" sx={{ paddingLeft: "16px", margin: 0 }}>
            {pedido.itens.map((item, index) => (
              <Box component="li" key={index} sx={{ marginBottom: "8px" }}>
                <Typography variant="body2">
                  <strong>Produto:</strong>{" "}
                  {Array.isArray(item.produto)
                    ? item.produto.map(p => typeof p === 'object' ? p.nome : p).join(", ")
                    : typeof item.produto === 'object' ? item.produto.nome : item.produto}
                  <br />
                  <strong>Quantidade:</strong> {item.quantidade} <br />
                  <strong>Borda Recheada:</strong> {item.bordaRecheada || "Sem borda recheada"} <br />
                  <strong>Tamanho:</strong> {item.tamanhoPizza}
                </Typography>
              </Box>
            ))}
          </Box>
        </Box>
      ) : (
        <Typography variant="body1" sx={{ color: "#555", textAlign: "center" }}>
          Não há informações do pedido para exibir.
        </Typography>
      )}

      <Button
        variant="contained"
        color="primary"
        onClick={handleVoltarInicio}
        sx={{
          backgroundColor: "#197824",
          color: "#fff",
          padding: "10px 20px",
          fontSize: "16px",
          width: "auto",
          height: "auto",
        }}
      >
        Voltar à Tela Inicial
      </Button>
    </Box>
  );
}