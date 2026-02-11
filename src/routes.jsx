import { createBrowserRouter } from "react-router-dom";
import { CarosselComTexto } from "./components/templates/CarosselComTexto";
import { Login } from "./components/organisms/Login";
import { Cadastro } from "./components/organisms/Cadastro";
import { Home } from "./components/pages/Home";
import Pedidos from "./components/pages/Pedidos";
import Atendimento from "./components/pages/Atendimento";
import FinalizarPedido from "./components/pages/FinalizarPedido";
import FinalizarPedidoNovo from "./components/pages/FinalizarPedidoNovo";
import NavPedidos from "./components/molecules/NavPedidos";
import PedidoConcluido from "./components/pages/PedidoConcluido";
import { PedidoProvider } from "./context/PedidoContext";


// Layout compartilhado para /pedidos e /finalizarPedido COM PedidoProvider único
const LayoutNavPedido = ({ children }) => (
  <div style={{ position: "relative", minHeight: "100vh" }}>
    {/* Renderiza a NavPedidos no topo */}
    <NavPedidos
      backgroundColor="#B72A23"
      // padding="10px"
      // height="100px"
      position="absolute" // Mantém o position absoluto
      // left="0"
    />
    {/* Compensa a altura da NavPedidos */}
    <div >
      {children}
    </div>
  </div>
);

// Layout com Context compartilhado para rotas de pedidos
const LayoutComContext = ({ children }) => (
  <PedidoProvider>
    <LayoutNavPedido>
      {children}
    </LayoutNavPedido>
  </PedidoProvider>
);

export const routes = createBrowserRouter([
  {
    path: "/teste",
    element: <h1> teste </h1>,
  },
  {
    path: "/Login",
    element: (
      <CarosselComTexto>
        <Login />
      </CarosselComTexto>
    ),
  },
  {
    path: "/cadastro",
    element: (
      <CarosselComTexto>
        <Cadastro />
      </CarosselComTexto>
    ),
  },
  { path: "/", element: <Home /> },
  {
    path: "/pedidos",
    element: (
      <LayoutComContext>
        <Pedidos />
      </LayoutComContext>
    ),
  },
  {
    path: "/finalizarPedido",
    element: (
      <LayoutComContext>
        <FinalizarPedidoNovo />
      </LayoutComContext>
    ),
  },
  {
    path: "/pedidoConcluido",
    element: (
      <LayoutNavPedido>
        <PedidoConcluido />
      </LayoutNavPedido>
    ),
  },
  { path: "/atendimento", element: <Atendimento /> },
]);