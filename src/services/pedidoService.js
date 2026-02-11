import { api } from "../provider/apiInstance";

/**
 * Serviço centralizado para operações relacionadas a pedidos
 * Mantém 100% de compatibilidade com os endpoints existentes
 */

export const pedidoService = {
  /**
   * Finaliza um pedido
   * @param {Object} pedidoData - Dados do pedido
   * @returns {Promise} Resposta da API
   */
  async finalizarPedido(pedidoData) {
    try {
      console.log("Enviando pedido para API:", pedidoData);
      const response = await api.post("/api/pedidos", pedidoData);
      console.log("Pedido finalizado com sucesso:", response.data);
      return response.data;
    } catch (error) {
      console.error("Erro ao finalizar pedido:", error);
      throw error;
    }
  },

  /**
   * Busca pedidos de um usuário
   * @param {string|number} userId - ID do usuário
   * @returns {Promise} Lista de pedidos
   */
  async getPedidosUsuario(userId) {
    try {
      const response = await api.get(`/api/pedidos/usuario/${userId}`);
      return response.data;
    } catch (error) {
      console.error("Erro ao buscar pedidos do usuário:", error);
      throw error;
    }
  },

  /**
   * Monta o payload no formato esperado pela API
   * @param {Object} params - Parâmetros do pedido
   * @returns {Object} Payload formatado
   */
  montarPayload({
    clienteId,
    carrinho,
    bebidas,
    observacao,
    tipoEntrega,
    tamanho,
    borda,
  }) {
    // Monta os itens de pizzas
    const itensPizzas = carrinho.map((pizza) => ({
      produto: [pizza.metadeEsquerda.id, pizza.metadeDireita.id],
      quantidade: 1,
      bordaRecheada: pizza.borda || borda,
      tamanhoPizza: pizza.tamanho || tamanho,
    }));

    // Monta os itens de bebidas (se houver)
    const itensBebidas = bebidas.map((bebida) => ({
      produto: [bebida.id],
      quantidade: bebida.quantidade || 1,
    }));

    // Combina todos os itens
    const todosItens = [...itensPizzas, ...itensBebidas];

    return {
      clienteId,
      itens: todosItens,
      observacao: observacao || "",
      tipoEntrega: tipoEntrega || "ENCOMENDA",
    };
  },

  /**
   * Verifica se o usuário tem endereço cadastrado
   * @param {string|number} userId - ID do usuário
   * @returns {Promise} Endereço ou null
   */
  async verificarEndereco(userId) {
    try {
      const response = await api.get(`/api/enderecos/${userId}`);
      if (response.data && response.data.endereco) {
        return response.data.endereco;
      }
      return null;
    } catch (error) {
      console.error("Erro ao verificar endereço:", error);
      return null;
    }
  },

  /**
   * Calcula o preço de uma pizza meio a meio
   * @param {Object} metadeEsquerda - Produto da metade esquerda
   * @param {Object} metadeDireita - Produto da metade direita
   * @returns {string} Preço formatado
   */
  calcularPrecoPizza(metadeEsquerda, metadeDireita) {
    const precoEsquerda = parseFloat(metadeEsquerda.preco || 0) / 2;
    const precoDireita = parseFloat(metadeDireita.preco || 0) / 2;
    return (precoEsquerda + precoDireita).toFixed(2);
  },
};
