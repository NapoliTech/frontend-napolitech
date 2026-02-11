import { useState, useEffect, useCallback } from "react";
import { api } from "../provider/apiInstance";

export function useProdutos() {
  const [produtos, setProdutos] = useState([]);
  const [bebidas, setBebidas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState(null);

  const fetchProdutos = useCallback(async () => {
    setLoading(true);
    setErro(null);
    try {
      const response = await api.get("/api/produtos");
      console.log("Produtos carregados:", response.data);
      
      if (response.data && Array.isArray(response.data.content)) {
        const todosProdutos = response.data.content;
        setProdutos(todosProdutos);

        // Filtra bebidas
        const bebidasFiltradas = todosProdutos.filter(
          (produto) => produto.categoriaProduto === "BEBIDAS"
        );
        setBebidas(bebidasFiltradas);
      } else {
        console.error("Resposta da API não contém array em content");
        setErro("Formato de resposta inválido");
      }
    } catch (error) {
      console.error("Erro ao buscar produtos:", error);
      setErro(error.message || "Erro ao carregar produtos");
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch inicial
  useEffect(() => {
    fetchProdutos();
  }, [fetchProdutos]);

  // Filtra produtos por categoria
  const getPizzasSalgadas = useCallback(() => {
    return produtos.filter((p) => p.categoriaProduto === "PIZZA");
  }, [produtos]);

  const getPizzasDoces = useCallback(() => {
    return produtos.filter((p) => p.categoriaProduto === "PIZZA_DOCE");
  }, [produtos]);

  // Busca por termo
  const buscarProdutos = useCallback(
    (termo) => {
      if (!termo || termo.trim() === "") {
        return produtos;
      }
      const termoLower = termo.toLowerCase();
      return produtos.filter(
        (produto) =>
          produto.nome.toLowerCase().includes(termoLower) ||
          (produto.descricao && produto.descricao.toLowerCase().includes(termoLower)) ||
          (produto.ingredientes && produto.ingredientes.toLowerCase().includes(termoLower))
      );
    },
    [produtos]
  );

  return {
    produtos,
    bebidas,
    loading,
    erro,
    refetch: fetchProdutos,
    getPizzasSalgadas,
    getPizzasDoces,
    buscarProdutos,
  };
}
