import React, { useState, useEffect } from "react";
import { useNavigate, Link as RouterLink } from "react-router-dom";
import {
  Box,
  Paper,
  Typography,
  Stack,
  Link,
  Divider,
} from "@mui/material";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import { api } from "../../provider/apiInstance";
import InputField from "../molecules/InputField";
import PasswordField from "../molecules/PasswordField";
import FormFeedback from "../molecules/FormFeedback";
import LoadingButton from "../atoms/LoadingButton";

/**
 * Login refatorado com UX moderna
 * Mantém 100% compatibilidade com endpoint /api/login
 */
export function Login() {
  const navigate = useNavigate();

  // Estados do formulário
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  
  // Estados de validação
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  
  // Estados de fluxo
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState("");

  useEffect(() => {
    document.title = "Napolitech | Login";
  }, []);

  // Validação de email
  const validateEmail = (value) => {
    if (!value) return "Email é obrigatório";
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) return "Email inválido";
    return "";
  };

  // Validação de senha (apenas se existe)
  const validateSenha = (value) => {
    if (!value) return "Senha é obrigatória";
    if (value.length < 8) return "Senha deve ter pelo menos 8 caracteres";
    return "";
  };

  // Valida ao sair do campo (blur)
  const handleBlur = (field) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    
    let error = "";
    if (field === "email") {
      error = validateEmail(email);
    } else if (field === "senha") {
      error = validateSenha(senha);
    }
    
    setErrors((prev) => ({
      ...prev,
      [field]: error,
    }));
  };

  // Valida em tempo real após primeiro toque
  const handleEmailChange = (e) => {
    const value = e.target.value;
    setEmail(value);
    setApiError(""); // Limpa erro de API ao digitar
    
    if (touched.email) {
      setErrors((prev) => ({
        ...prev,
        email: validateEmail(value),
      }));
    }
  };

  const handleSenhaChange = (e) => {
    const value = e.target.value;
    setSenha(value);
    setApiError(""); // Limpa erro de API ao digitar
    
    if (touched.senha) {
      setErrors((prev) => ({
        ...prev,
        senha: validateSenha(value),
      }));
    }
  };

  // Submit do formulário
  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError("");

    // Valida todos os campos
    const emailError = validateEmail(email);
    const senhaError = validateSenha(senha);

    setErrors({
      email: emailError,
      senha: senhaError,
    });

    setTouched({
      email: true,
      senha: true,
    });

    // Se houver erros, não submete
    if (emailError || senhaError) {
      return;
    }

    setLoading(true);

    try {
      // Mantém estrutura exata do payload original
      const response = await api.post("/api/login", { email, senha });

      if (response.status === 200) {
        // Mantém lógica original de armazenamento
        localStorage.setItem("token", response.data);
        navigate("/pedidos");
      }
    } catch (error) {
      console.error("Erro ao fazer login:", error);
      
      // Mensagens amigáveis baseadas no status
      if (error.response) {
        if (error.response.status === 401) {
          setApiError("Email ou senha incorretos. Verifique suas credenciais.");
        } else if (error.response.status === 404) {
          setApiError("Usuário não encontrado. Deseja criar uma conta?");
        } else {
          setApiError("Erro ao conectar. Tente novamente em instantes.");
        }
      } else {
        setApiError("Erro de conexão. Verifique sua internet.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Paper
      elevation={6}
      sx={{
        p: { xs: 3, sm: 4 },
        borderRadius: 3,
        backgroundColor: "rgba(255, 255, 255, 0.98)",
        width: "100%",
        maxHeight: "90vh",
        overflowY: "auto",
        "&::-webkit-scrollbar": {
          width: "8px",
        },
        "&::-webkit-scrollbar-track": {
          background: "rgba(0,0,0,0.1)",
          borderRadius: "10px",
        },
        "&::-webkit-scrollbar-thumb": {
          background: "#B72A23",
          borderRadius: "10px",
        },
        "&::-webkit-scrollbar-thumb:hover": {
          background: "#9a1f1a",
        },
      }}
    >
          {/* Header */}
          <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", mb: { xs: 2, sm: 3 } }}>
            <Box
              sx={{
                width: { xs: 48, sm: 56 },
                height: { xs: 48, sm: 56 },
                borderRadius: "50%",
                backgroundColor: "#B72A23",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                mb: { xs: 1.5, sm: 2 },
              }}
            >
              <LockOutlinedIcon sx={{ color: "white", fontSize: { xs: 28, sm: 32 } }} />
            </Box>
            <Typography variant="h4" sx={{ fontWeight: 700, color: "#333", mb: 0.5, fontSize: { xs: "1.75rem", sm: "2.125rem" } }}>
              Bem-vindo de volta
            </Typography>
            <Typography variant="body2" sx={{ color: "text.secondary", textAlign: "center", fontSize: { xs: "0.875rem", sm: "1rem" } }}>
              Entre com suas credenciais para continuar
            </Typography>
          </Box>

          {/* Feedback de erro da API */}
          <FormFeedback message={apiError} severity="error" show={!!apiError} />

          {/* Formulário */}
          <Box component="form" onSubmit={handleSubmit} noValidate>
            <Stack spacing={{ xs: 2, sm: 2.5 }}>
              <InputField
                label="Email"
                type="email"
                value={email}
                onChange={handleEmailChange}
                onBlur={() => handleBlur("email")}
                error={touched.email && !!errors.email}
                helperText={touched.email ? errors.email : ""}
                autoComplete="email"
                placeholder="seu@email.com"
                disabled={loading}
                required
              />

              <PasswordField
                label="Senha"
                value={senha}
                onChange={handleSenhaChange}
                onBlur={() => handleBlur("senha")}
                error={touched.senha && !!errors.senha}
                helperText={touched.senha ? errors.senha : ""}
                autoComplete="current-password"
                placeholder="Digite sua senha"
                disabled={loading}
                required
              />

              <LoadingButton
                type="submit"
                loading={loading}
                sx={{
                  mt: { xs: 1, sm: 2 },
                  backgroundColor: "#B72A23",
                  "&:hover": {
                    backgroundColor: "#9a1f1a",
                  },
                }}
              >
                Entrar
              </LoadingButton>
            </Stack>
          </Box>

          {/* Links auxiliares */}
          <Box sx={{ mt: { xs: 2, sm: 3 } }}>
            <Divider sx={{ my: { xs: 1.5, sm: 2 } }}>
              <Typography variant="body2" sx={{ color: "text.secondary" }}>
                Novo por aqui?
              </Typography>
            </Divider>
            
            <Box sx={{ textAlign: "center" }}>
              <Link
                component={RouterLink}
                to="/cadastro"
                sx={{
                  color: "#B72A23",
                  textDecoration: "none",
                  fontWeight: 600,
                  fontSize: "0.95rem",
                  "&:hover": {
                    textDecoration: "underline",
                  },
                }}
              >
                Criar uma conta
              </Link>
            </Box>
          </Box>
        </Paper>
  );
}