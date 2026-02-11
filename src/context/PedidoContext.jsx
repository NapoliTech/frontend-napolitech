import React, { createContext, useContext, useReducer, useCallback, useEffect } from "react";
import { jwtDecode } from "jwt-decode";

// Estado inicial
const initialState = {
  // Configuração da pizza sendo montada
  pizzaAtual: {
    metadeEsquerda: null,
    metadeDireita: null,
    tamanho: "",
    borda: "",
  },
  // Carrinho de pizzas
  carrinho: [],
  // Bebidas selecionadas
  bebidas: [],
  // Estado do fluxo
  etapaAtual: "montar", // montar | personalizar | checkout
  // Endereço
  enderecoSelecionado: null,
  // Observações
  observacao: "",
  // Tipo de entrega
  tipoEntrega: "ENCOMENDA", // ENCOMENDA | RETIRADA
  // User ID
  userId: null,
  // Loading states
  loading: {
    produtos: false,
    finalizacao: false,
  },
  // Erros
  erro: null,
};

// Actions
const ACTIONS = {
  SET_USER_ID: "SET_USER_ID",
  SET_METADE_ESQUERDA: "SET_METADE_ESQUERDA",
  SET_METADE_DIREITA: "SET_METADE_DIREITA",
  SET_TAMANHO: "SET_TAMANHO",
  SET_BORDA: "SET_BORDA",
  ADICIONAR_AO_CARRINHO: "ADICIONAR_AO_CARRINHO",
  REMOVER_DO_CARRINHO: "REMOVER_DO_CARRINHO",
  LIMPAR_PIZZA_ATUAL: "LIMPAR_PIZZA_ATUAL",
  ADICIONAR_BEBIDA: "ADICIONAR_BEBIDA",
  REMOVER_BEBIDA: "REMOVER_BEBIDA",
  SET_ETAPA: "SET_ETAPA",
  SET_ENDERECO: "SET_ENDERECO",
  SET_OBSERVACAO: "SET_OBSERVACAO",
  SET_TIPO_ENTREGA: "SET_TIPO_ENTREGA",
  SET_LOADING: "SET_LOADING",
  SET_ERRO: "SET_ERRO",
  LIMPAR_CARRINHO: "LIMPAR_CARRINHO",
};

// Reducer
function pedidoReducer(state, action) {
  switch (action.type) {
    case ACTIONS.SET_USER_ID:
      return { ...state, userId: action.payload };

    case ACTIONS.SET_METADE_ESQUERDA:
      return {
        ...state,
        pizzaAtual: {
          ...state.pizzaAtual,
          metadeEsquerda: action.payload,
        },
      };

    case ACTIONS.SET_METADE_DIREITA:
      return {
        ...state,
        pizzaAtual: {
          ...state.pizzaAtual,
          metadeDireita: action.payload,
        },
      };

    case ACTIONS.SET_TAMANHO:
      return {
        ...state,
        pizzaAtual: {
          ...state.pizzaAtual,
          tamanho: action.payload,
        },
      };

    case ACTIONS.SET_BORDA:
      return {
        ...state,
        pizzaAtual: {
          ...state.pizzaAtual,
          borda: action.payload,
        },
      };

    case ACTIONS.ADICIONAR_AO_CARRINHO: {
      const novaPizza = {
        id: Date.now(),
        ...action.payload,
      };
      return {
        ...state,
        carrinho: [...state.carrinho, novaPizza],
      };
    }

    case ACTIONS.REMOVER_DO_CARRINHO:
      return {
        ...state,
        carrinho: state.carrinho.filter((item) => item.id !== action.payload),
      };

    case ACTIONS.LIMPAR_PIZZA_ATUAL:
      return {
        ...state,
        pizzaAtual: {
          metadeEsquerda: null,
          metadeDireita: null,
          tamanho: state.pizzaAtual.tamanho,
          borda: state.pizzaAtual.borda,
        },
      };

    case ACTIONS.ADICIONAR_BEBIDA:
      return {
        ...state,
        bebidas: [...state.bebidas, action.payload],
      };

    case ACTIONS.REMOVER_BEBIDA:
      return {
        ...state,
        bebidas: state.bebidas.filter((item) => item.id !== action.payload),
      };

    case ACTIONS.SET_ETAPA:
      return {
        ...state,
        etapaAtual: action.payload,
      };

    case ACTIONS.SET_ENDERECO:
      return {
        ...state,
        enderecoSelecionado: action.payload,
      };

    case ACTIONS.SET_OBSERVACAO:
      return {
        ...state,
        observacao: action.payload,
      };

    case ACTIONS.SET_TIPO_ENTREGA:
      return {
        ...state,
        tipoEntrega: action.payload,
      };

    case ACTIONS.SET_LOADING:
      return {
        ...state,
        loading: {
          ...state.loading,
          [action.payload.key]: action.payload.value,
        },
      };

    case ACTIONS.SET_ERRO:
      return {
        ...state,
        erro: action.payload,
      };

    case ACTIONS.LIMPAR_CARRINHO:
      return {
        ...state,
        carrinho: [],
        bebidas: [],
        pizzaAtual: initialState.pizzaAtual,
        observacao: "",
      };

    default:
      return state;
  }
}

// Context
export const PedidoContext = createContext();

// Provider
export function PedidoProvider({ children }) {
  const [state, dispatch] = useReducer(pedidoReducer, initialState);

  // Decodifica token e extrai userId ao montar
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        const userId = decodedToken.id;
        if (userId) {
          dispatch({ type: ACTIONS.SET_USER_ID, payload: userId });
        }
      } catch (error) {
        console.error("Erro ao decodificar token:", error);
      }
    }
  }, []);

  // Actions expostas
  const setMetadeEsquerda = useCallback(
    (produto) => dispatch({ type: ACTIONS.SET_METADE_ESQUERDA, payload: produto }),
    []
  );

  const setMetadeDireita = useCallback(
    (produto) => dispatch({ type: ACTIONS.SET_METADE_DIREITA, payload: produto }),
    []
  );

  const setTamanho = useCallback(
    (tamanho) => dispatch({ type: ACTIONS.SET_TAMANHO, payload: tamanho }),
    []
  );

  const setBorda = useCallback(
    (borda) => dispatch({ type: ACTIONS.SET_BORDA, payload: borda }),
    []
  );

  const adicionarAoCarrinho = useCallback((pizza) => {
    dispatch({ type: ACTIONS.ADICIONAR_AO_CARRINHO, payload: pizza });
  }, []);

  const removerDoCarrinho = useCallback(
    (id) => dispatch({ type: ACTIONS.REMOVER_DO_CARRINHO, payload: id }),
    []
  );

  const limparPizzaAtual = useCallback(
    () => dispatch({ type: ACTIONS.LIMPAR_PIZZA_ATUAL }),
    []
  );

  const adicionarBebida = useCallback(
    (bebida) => dispatch({ type: ACTIONS.ADICIONAR_BEBIDA, payload: bebida }),
    []
  );

  const removerBebida = useCallback(
    (id) => dispatch({ type: ACTIONS.REMOVER_BEBIDA, payload: id }),
    []
  );

  const setEtapa = useCallback(
    (etapa) => dispatch({ type: ACTIONS.SET_ETAPA, payload: etapa }),
    []
  );

  const setEndereco = useCallback(
    (endereco) => dispatch({ type: ACTIONS.SET_ENDERECO, payload: endereco }),
    []
  );

  const setObservacao = useCallback(
    (observacao) => dispatch({ type: ACTIONS.SET_OBSERVACAO, payload: observacao }),
    []
  );

  const setTipoEntrega = useCallback(
    (tipo) => dispatch({ type: ACTIONS.SET_TIPO_ENTREGA, payload: tipo }),
    []
  );

  const setLoading = useCallback(
    (key, value) => dispatch({ type: ACTIONS.SET_LOADING, payload: { key, value } }),
    []
  );

  const setErro = useCallback(
    (erro) => dispatch({ type: ACTIONS.SET_ERRO, payload: erro }),
    []
  );

  const limparCarrinho = useCallback(
    () => dispatch({ type: ACTIONS.LIMPAR_CARRINHO }),
    []
  );

  // Helpers
  const pizzaCompleta = useCallback(() => {
    return (
      state.pizzaAtual.metadeEsquerda &&
      state.pizzaAtual.metadeDireita &&
      state.pizzaAtual.tamanho &&
      state.pizzaAtual.borda
    );
  }, [state.pizzaAtual]);

  const calcularTotalPizzas = useCallback(() => {
    return state.carrinho.reduce((total, pizza) => {
      return total + parseFloat(pizza.preco || 0);
    }, 0);
  }, [state.carrinho]);

  const calcularTotalBebidas = useCallback(() => {
    return state.bebidas.reduce((total, bebida) => {
      return total + parseFloat(bebida.preco || 0) * (bebida.quantidade || 1);
    }, 0);
  }, [state.bebidas]);

  const calcularTotalGeral = useCallback(() => {
    return (calcularTotalPizzas() + calcularTotalBebidas()).toFixed(2);
  }, [calcularTotalPizzas, calcularTotalBebidas]);

  const quantidadeItensCarrinho = useCallback(() => {
    return state.carrinho.length + state.bebidas.length;
  }, [state.carrinho, state.bebidas]);

  const value = {
    // State
    ...state,
    // Actions
    setMetadeEsquerda,
    setMetadeDireita,
    setTamanho,
    setBorda,
    adicionarAoCarrinho,
    removerDoCarrinho,
    limparPizzaAtual,
    adicionarBebida,
    removerBebida,
    setEtapa,
    setEndereco,
    setObservacao,
    setTipoEntrega,
    setLoading,
    setErro,
    limparCarrinho,
    // Helpers
    pizzaCompleta,
    calcularTotalPizzas,
    calcularTotalBebidas,
    calcularTotalGeral,
    quantidadeItensCarrinho,
  };

  return (
    <PedidoContext.Provider value={value}>
      {children}
    </PedidoContext.Provider>
  );
}

// Hook customizado
export function usePedido() {
  const context = useContext(PedidoContext);
  if (!context) {
    throw new Error("usePedido deve ser usado dentro de PedidoProvider");
  }
  return context;
}
