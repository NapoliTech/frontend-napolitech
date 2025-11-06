import {
  Box,
  Stack,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  TextField,
  InputAdornment,
} from "@mui/material";
import React, { useState, useEffect } from "react";
// import axios from "axios";
import SelectValores from "../atoms/SelectValores";
import { TituloH2 } from "../atoms/TituloH2";
import ButtonMaterialUi from "../atoms/ButtonMaterialUi";
import ItemListaDePedidos from "../atoms/ItemListaDePedidos";
import Acordeon from "../atoms/Acordeon";
import SearchIcon from "@mui/icons-material/Search";
import { MelhoresPizzas } from "../molecules/MelhoresPizzas";
import.meta.env;
import TabuaPizza from "../../../public/img/tabua_pizza__.png";
import TabuaPizzaEsq from "../../../public/img/tabua_pizzaEsq.png";
import TabuaPizzaDir from "../../../public/img/tomate.png";
import { api } from "../../provider/apiInstance";
// import { decode } from "jwt-decode";
// import jwtDecode from "jwt-decode";
import { jwtDecode } from "jwt-decode";
import CadastroEndereco from "../molecules/CadastroEndereco";
import EscolherEndereco from "../molecules/EscolherEndereco";
import { useNavigate } from "react-router-dom";
import DialogoBebidas from "../molecules/DialogoBebidas";
import ModalNaoAutenticado from "../molecules/ModalNaoAutenticado";
export default function SectionPedidos() {
  const [tooltipOpen, setTooltipOpen] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [produtos, setProdutos] = useState([]);
  const [pizzasSelecionadas, setPizzasSelecionadas] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [produtosFiltrados, setProdutosFiltrados] = useState([]);
  const [metadeSelecionada, setMetadeSelecionada] = useState(null);
  const [saborEsquerda, setSaborEsquerda] = useState(null);
  const [saborDireita, setSaborDireita] = useState(null);
  const [enderecos, setEnderecos] = useState([]);
  const [dialogEnderecoOpen, setDialogEnderecoOpen] = useState(false);
  const [dialogEscolherEnderecoOpen, setDialogEscolherEnderecoOpen] =
    useState(false);
  const [userId, setUserId] = useState(null); // Estado para armazenar o ID do usuário
  const navigate = useNavigate();
  const [idsPizzasSelecionadas, setIdsPizzasSelecionadas] = useState([]);
  const [tamanhoSelecionado, setTamanhoSelecionado] = useState(""); // Estado para o tamanho
  const [bordaSelecionada, setBordaSelecionada] = useState(""); // Estado para a borda
  const [dialogBebidasOpen, setDialogBebidasOpen] = useState(false);
  const [bebidas, setBebidas] = useState([]);
  const [modalNaoAutenticado, setModalNaoAutenticado] = useState(false);

  const handleAdicionarBebida = (bebida) => {
    console.log("Bebida adicionada:", bebida);
    setDialogBebidasOpen(false); // Fecha o diálogo após adicionar a bebida
  };

  const handleSelecionarEndereco = (endereco) => {
    console.log("Endereço selecionado:", endereco);
    console.log(
      "Pizzas selecionadas antes de redirecionar:",
      pizzasSelecionadas
    );

    navigate("/finalizarPedido", {
      state: {
        userId,
        enderecoSelecionado: endereco,
        pizzasSelecionadas, // Passa as pizzas selecionadas
        idsPizzasSelecionadas, // Passa os IDs das pizzas selecionadas
      },
    });
  };

  const fetchProdutos = async () => {
    try {
      const response = await api.get("/api/produtos");
      console.log("Resposta da API:", response);
      if (response.data && Array.isArray(response.data.content)) {
        setProdutos(response.data.content);

        // Filtra apenas os produtos com categoriaProduto = "BEBIDAS"
        const bebidasFiltradas = response.data.content.filter(
          (produto) => produto.categoriaProduto === "BEBIDAS"
        );
        setBebidas(bebidasFiltradas);
      } else {
        console.error("A resposta da API não contém um array em content:", response.data);
      }
    } catch (error) {
      console.error("Erro ao buscar produtos:", error);
    }
  };

  console.log(localStorage.getItem("token"));

  const gerarTokerDescrip = () => {
    const token = localStorage.getItem("token"); // Obtém o token do localStorage
    if (!token) {
      setModalNaoAutenticado(true);
      return null; // Retorna null se o token não existir
    }

    try {
      const decodedToken = jwtDecode(token); // Decodifica o token
      console.log("Token decodificado:", decodedToken); // Verifica o conteúdo do token decodificado

      const userId = decodedToken.id; // Obtém o campo id do token
      console.log("ID do usuário extraído do token:", userId);

      if (!userId) {
        alert("ID do usuário não encontrado no token.");
        return null; // Retorna null se o ID não for encontrado
      }

      return userId; // Retorna o userId
    } catch (error) {
      console.error("Erro ao decodificar o token:", error);
      alert("Token inválido. Faça login novamente.");
      return null; // Retorna null em caso de erro
    }
  };

  const verificarEndereco = async () => {
    console.log("Botão clicado, função verificarEndereco chamada");
    try {
      if (!userId) {
        return; // Interrompe a execução se o userId não for válido
      }

      // Faz a requisição para a API usando o ID do usuário
      const response = await api.get(`/api/enderecos/${userId}`);
      console.log("Resposta da API:", response.data);

      // Verifica se há um endereço cadastrado
      if (response.data && response.data.endereco) {
        console.log("Endereço encontrado:", response.data.endereco);
        setEnderecos([response.data.endereco]); // Define o endereço no estado como um array
        setDialogEscolherEnderecoOpen(true); // Abre o diálogo de escolha de endereços
      } else {
        console.log(
          "Nenhum endereço encontrado. Abrindo cadastro de endereço."
        );
        setDialogEnderecoOpen(true); // Abre o diálogo de cadastro de endereço
      }
    } catch (error) {
      console.error("Erro ao verificar o endereço:", error);
      alert("Ocorreu um erro ao verificar o endereço. Tente novamente.");
    }
  };

  useEffect(() => {
    // Define o userId ao montar o componente
    const id = gerarTokerDescrip();
    if (id) {
      setUserId(id);
    }
    fetchProdutos();
  }, []);

  // Efeito para filtrar produtos quando o termo de pesquisa muda
  useEffect(() => {
    if (searchTerm.trim() === "") {
      setProdutosFiltrados(produtos);
    } else {
      const filtered = produtos.filter(
        (produto) =>
          produto.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (produto.descricao &&
            produto.descricao.toLowerCase().includes(searchTerm.toLowerCase()))
      );
      setProdutosFiltrados(filtered);
    }
  }, [searchTerm, produtos]);

  // Função para lidar com o clique em uma metade da pizza
  const handleMetadeClick = (metade) => {
    setMetadeSelecionada(metade);
    setTooltipOpen(false);
    setDialogOpen(true);
    fetchProdutos();
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
    setSearchTerm("");
    setMetadeSelecionada(null);
  };

  // Função para lidar com a mudança no campo de pesquisa
  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  // Função para adicionar sabor à metade selecionada
  const adicionarSaborMetade = (produto) => {
    if (metadeSelecionada === "esquerda") {
      setSaborEsquerda({
        id: produto.id, // Usa o ID real do produto retornado pela API
        sabor: produto.nome,
        texto: produto.descricao || "Ingredientes não especificados",
        preco: (produto.preco / 2).toFixed(2), // Metade do preço para meia pizza
        imagem: "meia_pizza_frango_com_catupiry.png", // Imagem da metade esquerda
      });
    } else if (metadeSelecionada === "direita") {
      setSaborDireita({
        id: produto.id, // Usa o ID real do produto retornado pela API
        sabor: produto.nome,
        texto: produto.descricao || "Ingredientes não especificados",
        preco: (produto.preco / 2).toFixed(2), // Metade do preço para meia pizza
        imagem: "meia_pizza_frango_com_catupiry.png", // Imagem da metade direita
      });
    }

    setDialogOpen(false);
    setSearchTerm("");
    setMetadeSelecionada(null);
  };

  function adicionarPizzaAoPedido() {
    console.log("Função adicionarPizzaAoPedido chamada");
    console.log("Sabor Esquerda:", saborEsquerda);
    console.log("Sabor Direita:", saborDireita);

    if (saborEsquerda && saborDireita) {
      const precoTotal = (
        parseFloat(saborEsquerda.preco) + parseFloat(saborDireita.preco)
      ).toFixed(2);

      console.log("Preço total calculado:", precoTotal);

      const novaPizza = {
        id: Date.now(), // ID único para a pizza
        metades: [
          {
            lado: "esquerda",
            sabor: saborEsquerda.sabor,
            texto: saborEsquerda.texto,
            preco: saborEsquerda.preco,
            imagem: saborEsquerda.imagem,
            id: saborEsquerda.id, // ID real da metade esquerda
          },
          {
            lado: "direita",
            sabor: saborDireita.sabor,
            texto: saborDireita.texto,
            preco: saborDireita.preco,
            imagem: saborDireita.imagem,
            id: saborDireita.id, // ID real da metade direita
          },
        ],
        sabor: `Meia ${saborEsquerda.sabor} / Meia ${saborDireita.sabor}`,
        texto: `Pizza meio a meio`,
        preco: precoTotal,
      };

      console.log("Nova pizza a ser adicionada:", novaPizza);

      setPizzasSelecionadas((pizzasAtuais) => {
        const novaLista = [...pizzasAtuais, novaPizza];
        console.log("Nova lista de pizzas:", novaLista);
        return novaLista;
      });

      // Atualiza os IDs das pizzas selecionadas
      setIdsPizzasSelecionadas((idsAtuais) => [
        ...idsAtuais,
        saborEsquerda.id,
        saborDireita.id,
      ]);

      // Limpa as seleções após adicionar ao pedido
      setSaborEsquerda(null);
      setSaborDireita(null);

      console.log("Seleções limpas");
    } else {
      // Se apenas uma metade foi selecionada
      alert(
        "Por favor, selecione ambas as metades da pizza antes de adicionar ao carrinho."
      );
    }
  }

  useEffect(() => {
    console.log("IDs das pizzas selecionadas:", idsPizzasSelecionadas);
  }, [idsPizzasSelecionadas]);

  // Função para calcular o valor total do pedido
  const calcularTotal = () => {
    return pizzasSelecionadas
      .reduce((total, pizza) => {
        return total + parseFloat(pizza.preco || 0);
      }, 0)
      .toFixed(2);
  };

  // Função para ser chamada após cadastro de endereço
  const handleEnderecoCadastrado = async () => {
    setDialogEnderecoOpen(false);
    // Atualize os endereços do usuário após cadastro
    try {
      const response = await api.get(`/api/enderecos/${userId}`);
      if (response.data && response.data.endereco) {
        setEnderecos([response.data.endereco]);
      }
    } catch (error) {
      // Trate erro se necessário
    }
    setDialogEscolherEnderecoOpen(true);
  };

  return (
    <Box
      component="section"
      sx={{
        width: "100vw",
        height: "90vh",
        boxSizing: "border-box",
        overflowX: "hidden",
        overflowY: "hidden",
      }}
    >
      <ModalNaoAutenticado
        aberto={modalNaoAutenticado}
        onOk={() => {
          setModalNaoAutenticado(false);
          navigate("/login");
        }}
      />
      <Stack
        direction={{ xs: "column", sm: "row" }}
        spacing={{ xs: 1, sm: 2, md: 4 }}
        sx={{
          justifyContent: "space-evenly",
          alignItems: "center",
          backgroundImage: 'url("/img/bg_pedidos.png")',
          backgroundSize: "cover",
          backgroundPosition: "center",
          height: "100%",
          width: "100%",
          "& > div": {
            alignItems: "center",
            justifyContent: "center",
          },
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            width: "100%",
            height: "90%",
          }}
        >
          <SelectValores
            texto="Selecione o tamanho"
            options={[{ value: "MEIO_A_MEIO", label: "Grande" }]}
            onChange={(event) => {
              setTamanhoSelecionado(event.target.value);
              console.log(tamanhoSelecionado); // Verifica o valor selecionado
            }}
          />

          <SelectValores
            texto="Escolher Borda recheada"
            options={[
              { value: "CATUPIRY", label: "Sem Borda" },
              { value: "CATUPIRY", label: "Catupiry" },
            ]}
            onChange={(event) => {
              setBordaSelecionada(event.target.value);
              console.log("Borda selecionada:", event.target.value); // Verifica o valor selecionado
            }}
          />

          <Box>
            {/* Botão para abrir o diálogo */}
            <ButtonMaterialUi
              texto={"selecionar bebida"}
              bg={"#B72A23"}
              onClick={() => setDialogBebidasOpen(true)}
            />

            {/* Diálogo de seleção de bebidas */}
            <DialogoBebidas
              open={dialogBebidasOpen}
              onClose={() => setDialogBebidasOpen(false)}
              bebidas={bebidas} // Passa as bebidas filtradas
              onAdicionarBebida={handleAdicionarBebida}
            />
          </Box>
        </Box>

        <Box
          sx={{
            width: "100%",
            height: "100vh",
            display: "flex",
            flexDirection: "column",
            gap: "32px",
          }}
        >
          <TituloH2 text={"Pizza Grande"} color={"white"} />
          <Tooltip
            title={
              tooltipOpen ? "Clique em uma metade para escolher o sabor" : ""
            }
            open={tooltipOpen}
            arrow
          >
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                width: "400px", // Largura fixa para garantir que o contêiner seja quadrado
                height: "400px", // Altura igual à largura
                borderRadius: "50%", // Garante o formato circular
                position: "relative", // Permite posicionar elementos sobrepostos
                overflow: "hidden", // Garante que os elementos fiquem dentro do círculo
                maxWidth: "100%", // Garante que a largura não ultrapasse o contêiner pai
                maxHeight: "100%", // Garante que a altura não ultrapasse o contêiner pai
              }}
            >
              {/* Metade esquerda */}
              <Box
                sx={{
                  width: "50%", // Ocupa metade da largura
                  height: "100%", // Ocupa toda a altura
                  position: "relative", // Permite sobreposição
                  display: "flex",
                  justifyContent: "flex-end", // Alinha a pizza para a borda direita
                }}
                onClick={() => handleMetadeClick("esquerda")}
              >
                {/* Tábua da metade esquerda */}
                <Box
                  sx={{
                    width: "100%",
                    height: "94%",
                    backgroundImage: `url(/img/tabua_pizzaEsq.png)`, // Imagem da tábua esquerda
                    backgroundSize: "cover", // Garante que a imagem ocupe todo o espaço
                    backgroundRepeat: "no-repeat", // Evita repetição da imagem
                    backgroundPosition: "center",
                  }}
                />
                {/* Pizza da metade esquerda */}
                {saborEsquerda && (
                  <Box
                    sx={{
                      width: "85%", // Reduz o tamanho da pizza para 85% da largura da tábua
                      height: "85%", // Reduz o tamanho da pizza para 85% da altura da tábua
                      backgroundImage: `url(/img/mussarela_esq.png)`, // Imagem da pizza esquerda
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                      position: "absolute", // Sobrepõe a tábua
                      top: "4%", // Centraliza verticalmente
                      // right: "-2%", // Cola a pizza no centro
                    }}
                  />
                )}
              </Box>

              {/* Metade direita */}
              <Box
                sx={{
                  width: "50%", // Ocupa metade da largura
                  height: "100%", // Ocupa toda a altura
                  position: "relative", // Permite sobreposição
                  display: "flex",
                  justifyContent: "flex-start", // Alinha a pizza para a borda esquerda
                }}
                onClick={() => handleMetadeClick("direita")}
              >
                {/* Tábua da metade direita */}
                <Box
                  sx={{
                    width: "100%",
                    height: "94%",
                    backgroundImage: `url(/img/tabua_pizzaDir.png)`, // Imagem da tábua direita
                    backgroundSize: "cover", // Garante que a imagem ocupe todo o espaço
                    backgroundRepeat: "no-repeat", // Evita repetição da imagem
                    backgroundPosition: "center",
                  }}
                />
                {/* Pizza da metade direita */}
                {saborDireita && (
                  <Box
                    sx={{
                      width: "85%", // Reduz o tamanho da pizza para 85% da largura da tábua
                      height: "85%", // Reduz o tamanho da pizza para 85% da altura da tábua
                      backgroundImage: `url(/img/mussarela_dir.png)`, // Imagem da pizza direita
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                      position: "absolute", // Sobrepõe a tábua
                      top: "4%", // Centraliza verticalmente
                      // left: "%", // Cola a pizza no centro
                    }}
                  />
                )}
              </Box>
            </Box>
          </Tooltip>

          {/* Informações das metades selecionadas */}
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 1,
              alignItems: "center",
            }}
          >
            {saborEsquerda && (
              <Typography variant="body2" color="white">
                Metade Esquerda: {saborEsquerda.sabor}
              </Typography>
            )}
            {saborDireita && (
              <Typography variant="body2" color="white">
                Metade Direita: {saborDireita.sabor}
              </Typography>
            )}
          </Box>

          <ButtonMaterialUi
            texto={"Adicionar Ao Carrinho"}
            bg={"#B72A23"}
            onClick={adicionarPizzaAoPedido}
            disabled={
              !tamanhoSelecionado || // Desabilitado se o tamanho não for selecionado
              !bordaSelecionada || // Desabilitado se a borda não for selecionada
              !saborEsquerda || // Desabilitado se a metade esquerda não for selecionada
              !saborDireita // Desabilitado se a metade direita não for selecionada
            }
          />
        </Box>
        <Box
          sx={{
            width: "100%",
            display: "flex",
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              gap: "10px",
              alignItems: "center",
              width: "90%",
              height: "auto",
              backgroundColor: "#f5f5f5",
              padding: "16px",
              borderRadius: "8px",
              boxSizing: "border-box",
            }}
          >
            <Box
              sx={{
                width: "100%",
                textAlign: "center",
              }}
            >
              <TituloH2 text={"Suas Pizzas"} color={"#333"} />
            </Box>
            <Stack
              sx={{
                width: "100%",
                maxHeight: "200px",
                overflowY: "auto",
              }}
            >
              {pizzasSelecionadas.length > 0 ? (
                pizzasSelecionadas.map((pizza) => (
                  <Box
                    key={pizza.id}
                    sx={{
                      p: 2,
                      mb: 1,
                      border: "1px solid #ddd",
                      borderRadius: "4px",
                      backgroundColor: "#fff",
                    }}
                  >
                    <Typography variant="subtitle1" fontWeight="bold">
                      {pizza.sabor}
                    </Typography>

                    {/* Se for uma pizza meio a meio, mostra acordeons para cada metade */}
                    {pizza.metades ? (
                      <Box sx={{ mt: 1 }}>
                        <Typography variant="body2" sx={{ mb: 1 }}>
                          Pizza meio a meio - R$ {pizza.preco}
                        </Typography>

                        {/* Acordeon para a metade esquerda */}
                        <Box sx={{ mb: 1 }}>
                          <Acordeon
                            sabor={`Metade Esquerda: ${pizza.metades[0].sabor}`}
                            texto={pizza.metades[0].texto}
                            preco={pizza.metades[0].preco}
                          />
                        </Box>

                        {/* Acordeon para a metade direita */}
                        <Box>
                          <Acordeon
                            sabor={`Metade Direita: ${pizza.metades[1].sabor}`}
                            texto={pizza.metades[1].texto}
                            preco={pizza.metades[1].preco}
                          />
                        </Box>
                      </Box>
                    ) : (
                      <>
                        <Typography variant="body2">{pizza.texto}</Typography>
                        <Typography variant="body2" color="primary">
                          R$ {pizza.preco}
                        </Typography>
                      </>
                    )}
                  </Box>
                ))
              ) : (
                <Typography sx={{ p: 2, textAlign: "center" }}>
                  Nenhuma pizza selecionada ainda
                </Typography>
              )}
            </Stack>

            {pizzasSelecionadas.length > 0 && (
              <Box
                sx={{
                  width: "100%",
                  display: "flex",
                  justifyContent: "space-between",
                  mt: 2,
                  p: 2,
                  backgroundColor: "#eee",
                  borderRadius: "4px",
                }}
              >
                <Typography variant="subtitle1" fontWeight="bold">
                  Total:
                </Typography>
                <Typography variant="subtitle1" fontWeight="bold">
                  R$ {calcularTotal()}
                </Typography>
              </Box>
            )}
            <ButtonMaterialUi
              texto={"Finalizar Pedido"}
              bg={"#B72A23"}
              disabled={pizzasSelecionadas.length === 0}
              onClick={verificarEndereco}
            />
          </Box>
        </Box>
      </Stack>

      <Dialog
        open={dialogOpen}
        onClose={handleDialogClose}
        fullWidth
        maxWidth="sm"
        sx={{
          "& .MuiDialog-paper": {
            width: "100%",
            height: "90vh",
            display: "flex",
            flexDirection: "column",
          },
        }}
      >
        <DialogTitle>
          {metadeSelecionada === "esquerda"
            ? "Selecione o Sabor para a Metade Esquerda"
            : "Selecione o Sabor para a Metade Direita"}
        </DialogTitle>

        {/* Campo de pesquisa */}
        <Box sx={{ px: 3, pt: 1, pb: 2 }}>
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Pesquisar pizza..."
            value={searchTerm}
            onChange={handleSearchChange}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />
        </Box>

        <DialogContent
          sx={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            padding: "16px",
            overflowY: "auto",
          }}
        >
          <Stack
            sx={{
              flex: 1,
              width: "100%",
              gap: 2,
            }}
          >
            {/* Renderiza os produtos da categoriaProduto PIZZA */}
            {produtosFiltrados.some(
              (produto) => produto.categoriaProduto === "PIZZA"
            ) && (
              <>
                <Typography variant="h6" sx={{ marginBottom: "8px" }}>
                  Pizzas Salgadas
                </Typography>
                {produtosFiltrados
                  .filter((produto) => produto.categoriaProduto === "PIZZA")
                  .map((produto) => (
                    <ItemListaDePedidos
                      key={produto.id}
                      sabor={produto.nome}
                      texto={
                        produto.descricao || "Ingredientes não especificados"
                      }
                      preco={produto.preco.toFixed(2)}
                      produto={produto}
                      adicionarAoPedido={(produtoSelecionado) =>
                        adicionarSaborMetade(produtoSelecionado)
                      }
                    />
                  ))}
              </>
            )}

            {/* Renderiza os produtos da categoriaProduto PIZZA_DOCE */}
            {produtosFiltrados.some(
              (produto) => produto.categoriaProduto === "PIZZA_DOCE"
            ) && (
              <>
                <Typography
                  variant="h6"
                  sx={{ marginTop: "16px", marginBottom: "8px" }}
                >
                  Pizzas Doces
                </Typography>
                {produtosFiltrados
                  .filter(
                    (produto) => produto.categoriaProduto === "PIZZA_DOCE"
                  )
                  .map((produto) => (
                    <ItemListaDePedidos
                      key={produto.id}
                      sabor={produto.nome}
                      texto={
                        produto.descricao || "Ingredientes não especificados"
                      }
                      preco={produto.preco.toFixed(2)}
                      produto={produto}
                      adicionarAoPedido={(produtoSelecionado) =>
                        adicionarSaborMetade(produtoSelecionado)
                      }
                    />
                  ))}
              </>
            )}
          </Stack>
        </DialogContent>

        <DialogActions
          sx={{
            flexShrink: 0,
            justifyContent: "flex-end",
            padding: "16px",
          }}
        >
          <Button onClick={handleDialogClose}>Fechar</Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={dialogEnderecoOpen}
        onClose={() => setDialogEnderecoOpen(false)}
        fullWidth
        maxWidth="sm"
        sx={{
          "& .MuiDialog-paper": {
            width: "100%",
            height: "90vh",
            display: "flex",
            flexDirection: "column",
          },
        }}
      >
        <DialogTitle>Cadastrar Endereço</DialogTitle>
        <DialogContent
          sx={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            padding: "16px",
            overflowY: "auto",
          }}
        >
          {userId && (
            <CadastroEndereco
              userId={userId}
              onEnderecoCadastrado={handleEnderecoCadastrado} // Passe a função aqui
            />
          )}
        </DialogContent>
      </Dialog>
      <Box
        sx={{
          boxSizing: "border-box",
          width: "100%",
          height: "auto",
          overflow: "hidden",
          whiteSpace: "nowrap",
          textOverflow: "ellipsis",
          backgroundColor: "#DFDDD8",
        }}
      ></Box>

      <Dialog
        open={dialogEscolherEnderecoOpen}
        onClose={() => setDialogEscolherEnderecoOpen(false)}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>Escolher Endereço</DialogTitle>
        <DialogContent>
          <EscolherEndereco
            enderecos={enderecos} // Passa o estado enderecos diretamente
            userId={userId} // Passa o userId como prop
            pizzasSelecionadas={pizzasSelecionadas} // Passa as pizzas selecionadas
            onSelecionarEndereco={handleSelecionarEndereco} // Redireciona ao selecionar
            idsPizzasSelecionadas={idsPizzasSelecionadas}
            tamanhoSelecionado={tamanhoSelecionado} // Passa o tamanho selecionado
            bordaSelecionada={bordaSelecionada} // Passa a borda selecionada
            onClose={() => setDialogEscolherEnderecoOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </Box>
  );
}
