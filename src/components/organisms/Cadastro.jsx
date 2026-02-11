import React, { useState, useEffect } from "react";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import {
  Box,
  Paper,
  Typography,
  Stack,
  Link,
  Divider,
  Grid,
} from "@mui/material";
import PersonAddOutlinedIcon from "@mui/icons-material/PersonAddOutlined";
import { api } from "../../provider/apiInstance";
import InputField from "../molecules/InputField";
import PasswordField from "../molecules/PasswordField";
import FormFeedback from "../molecules/FormFeedback";
import LoadingButton from "../atoms/LoadingButton";
import PasswordStrength from "../atoms/PasswordStrength";

/**
 * Cadastro refatorado - UX moderna em etapa única
 * Mantém 100% compatibilidade com endpoint /api/cadastro
 */
export function Cadastro() {
  const navigate = useNavigate();

  // Estados do formulário
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [dataNasc, setDataNasc] = useState("");
  const [cpf, setCpf] = useState("");
  const [senha, setSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");

  // Estados de validação
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  // Estados de fluxo
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    document.title = "Napolitech | Cadastro";
  }, []);

  // Máscara de CPF
  const formatCpf = (value) => {
    return value
      .replace(/\D/g, "")
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d{1,2})$/, "$1-$2")
      .slice(0, 14);
  };

  // Validações individuais
  const validateNome = (value) => {
    if (!value) return "Nome é obrigatório";
    if (value.length < 3) return "Nome deve ter pelo menos 3 caracteres";
    return "";
  };

  const validateEmail = (value) => {
    if (!value) return "Email é obrigatório";
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) return "Email inválido";
    return "";
  };

  const validateDataNasc = (value) => {
    if (!value) return "Data de nascimento é obrigatória";
    
    const hoje = new Date();
    const nascimento = new Date(value);
    const idade = hoje.getFullYear() - nascimento.getFullYear();
    
    if (idade < 18) return "Você deve ter pelo menos 18 anos";
    if (idade > 120) return "Data inválida";
    
    return "";
  };

  const validateCpf = (value) => {
    if (!value) return "CPF é obrigatório";
    const cpfNumeros = value.replace(/\D/g, "");
    if (cpfNumeros.length !== 11) return "CPF deve ter 11 dígitos";
    return "";
  };

  const validateSenha = (value) => {
    if (!value) return "Senha é obrigatória";
    if (value.length < 8) return "Mínimo de 8 caracteres";
    if (!/[A-Z]/.test(value)) return "Necessária uma letra maiúscula";
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(value)) return "Necessário um caractere especial";
    return "";
  };

  const validateConfirmarSenha = (value) => {
    if (!value) return "Confirme sua senha";
    if (value !== senha) return "As senhas não coincidem";
    return "";
  };

  // Handler de blur
  const handleBlur = (field) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    
    let error = "";
    switch (field) {
      case "nome":
        error = validateNome(nome);
        break;
      case "email":
        error = validateEmail(email);
        break;
      case "dataNasc":
        error = validateDataNasc(dataNasc);
        break;
      case "cpf":
        error = validateCpf(cpf);
        break;
      case "senha":
        error = validateSenha(senha);
        break;
      case "confirmarSenha":
        error = validateConfirmarSenha(confirmarSenha);
        break;
      default:
        break;
    }
    
    setErrors((prev) => ({ ...prev, [field]: error }));
  };

  // Handlers de mudança
  const handleNomeChange = (e) => {
    const value = e.target.value;
    setNome(value);
    if (touched.nome) {
      setErrors((prev) => ({ ...prev, nome: validateNome(value) }));
    }
  };

  const handleEmailChange = (e) => {
    const value = e.target.value;
    setEmail(value);
    if (touched.email) {
      setErrors((prev) => ({ ...prev, email: validateEmail(value) }));
    }
  };

  const handleDataNascChange = (e) => {
    const value = e.target.value;
    setDataNasc(value);
    if (touched.dataNasc) {
      setErrors((prev) => ({ ...prev, dataNasc: validateDataNasc(value) }));
    }
  };

  const handleCpfChange = (e) => {
    const value = formatCpf(e.target.value);
    setCpf(value);
    if (touched.cpf) {
      setErrors((prev) => ({ ...prev, cpf: validateCpf(value) }));
    }
  };

  const handleSenhaChange = (e) => {
    const value = e.target.value;
    setSenha(value);
    if (touched.senha) {
      setErrors((prev) => ({ ...prev, senha: validateSenha(value) }));
    }
    // Revalida confirmar senha se já foi tocado
    if (touched.confirmarSenha && confirmarSenha) {
      setErrors((prev) => ({
        ...prev,
        confirmarSenha: value !== confirmarSenha ? "As senhas não coincidem" : "",
      }));
    }
  };

  const handleConfirmarSenhaChange = (e) => {
    const value = e.target.value;
    setConfirmarSenha(value);
    if (touched.confirmarSenha) {
      setErrors((prev) => ({
        ...prev,
        confirmarSenha: validateConfirmarSenha(value),
      }));
    }
  };

  // Submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError("");
    setSuccessMessage("");

    // Valida todos os campos
    const validationErrors = {
      nome: validateNome(nome),
      email: validateEmail(email),
      dataNasc: validateDataNasc(dataNasc),
      cpf: validateCpf(cpf),
      senha: validateSenha(senha),
      confirmarSenha: validateConfirmarSenha(confirmarSenha),
    };

    setErrors(validationErrors);
    setTouched({
      nome: true,
      email: true,
      dataNasc: true,
      cpf: true,
      senha: true,
      confirmarSenha: true,
    });

    // Verifica se há erros
    const hasErrors = Object.values(validationErrors).some((error) => error !== "");
    if (hasErrors) {
      setApiError("Por favor, corrija os erros abaixo antes de continuar.");
      return;
    }

    setLoading(true);

    try {
      // Mantém estrutura EXATA do payload original
      const usuario = {
        nome,
        email,
        dataNasc: dataNasc.split("-").reverse().join("/"), // Converte para dd/mm/yyyy
        cpf,
        senha,
        confirmarSenha,
        telefone: "(11) 99999-9999", // Mantém telefone hardcoded como original
      };

      const response = await api.post("/api/cadastro", usuario);

      console.log("Cadastro realizado:", response.data);
      
      setSuccessMessage("Cadastro realizado com sucesso! Redirecionando...");
      
      // Aguarda 2 segundos para mostrar mensagem e redireciona
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (error) {
      console.error("Erro ao cadastrar:", error);
      
      if (error.response) {
        const message = error.response.data?.message || error.response.data;
        if (typeof message === "string") {
          setApiError(message);
        } else if (error.response.status === 409) {
          setApiError("Este email já está cadastrado. Tente fazer login.");
        } else {
          setApiError("Erro ao processar cadastro. Tente novamente.");
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
        maxHeight: { xs: "85vh", sm: "90vh" },
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
              <PersonAddOutlinedIcon sx={{ color: "white", fontSize: { xs: 28, sm: 32 } }} />
            </Box>
            <Typography variant="h4" sx={{ fontWeight: 700, color: "#333", mb: 0.5, fontSize: { xs: "1.75rem", sm: "2.125rem" } }}>
              Criar Conta
            </Typography>
            <Typography variant="body2" sx={{ color: "text.secondary", textAlign: "center", fontSize: { xs: "0.875rem", sm: "1rem" } }}>
              Preencha seus dados para começar
            </Typography>
          </Box>

          {/* Feedback de erro/sucesso */}
          <FormFeedback message={apiError} severity="error" show={!!apiError} />
          <FormFeedback message={successMessage} severity="success" show={!!successMessage} />

          {/* Formulário */}
          <Box component="form" onSubmit={handleSubmit} noValidate>
            <Stack spacing={{ xs: 2, sm: 2.5 }}>
              {/* Nome completo */}
              <InputField
                label="Nome Completo"
                type="text"
                value={nome}
                onChange={handleNomeChange}
                onBlur={() => handleBlur("nome")}
                error={touched.nome && !!errors.nome}
                helperText={touched.nome ? errors.nome : ""}
                autoComplete="name"
                placeholder="Digite seu nome completo"
                disabled={loading}
                required
              />

              {/* Email e Data de Nascimento lado a lado */}
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
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
                </Grid>
                <Grid item xs={12} sm={6}>
                  <InputField
                    label="Data de Nascimento"
                    type="date"
                    value={dataNasc}
                    onChange={handleDataNascChange}
                    onBlur={() => handleBlur("dataNasc")}
                    error={touched.dataNasc && !!errors.dataNasc}
                    helperText={touched.dataNasc ? errors.dataNasc : ""}
                    disabled={loading}
                    required
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>
              </Grid>

              {/* CPF */}
              <InputField
                label="CPF"
                type="text"
                value={cpf}
                onChange={handleCpfChange}
                onBlur={() => handleBlur("cpf")}
                error={touched.cpf && !!errors.cpf}
                helperText={touched.cpf ? errors.cpf : ""}
                placeholder="000.000.000-00"
                disabled={loading}
                required
              />

              {/* Senha */}
              <Box>
                <PasswordField
                  label="Senha"
                  value={senha}
                  onChange={handleSenhaChange}
                  onBlur={() => handleBlur("senha")}
                  error={touched.senha && !!errors.senha}
                  helperText={touched.senha ? errors.senha : ""}
                  autoComplete="new-password"
                  placeholder="Crie uma senha forte"
                  disabled={loading}
                  required
                />
                <PasswordStrength password={senha} />
              </Box>

              {/* Confirmar Senha */}
              <PasswordField
                label="Confirmar Senha"
                value={confirmarSenha}
                onChange={handleConfirmarSenhaChange}
                onBlur={() => handleBlur("confirmarSenha")}
                error={touched.confirmarSenha && !!errors.confirmarSenha}
                helperText={touched.confirmarSenha ? errors.confirmarSenha : ""}
                autoComplete="new-password"
                placeholder="Digite a senha novamente"
                disabled={loading}
                required
              />

              {/* Botão de Submit */}
              <LoadingButton
                type="submit"
                loading={loading}
                disabled={loading || !!successMessage}
                sx={{
                  mt: { xs: 1, sm: 2 },
                  backgroundColor: "#B72A23",
                  "&:hover": {
                    backgroundColor: "#9a1f1a",
                  },
                }}
              >
                Criar Conta
              </LoadingButton>
            </Stack>
          </Box>

          {/* Link para Login */}
          <Box sx={{ mt: { xs: 2, sm: 3 } }}>
            <Divider sx={{ my: { xs: 1.5, sm: 2 } }}>
              <Typography variant="body2" sx={{ color: "text.secondary" }}>
                Já possui conta?
              </Typography>
            </Divider>

            <Box sx={{ textAlign: "center" }}>
              <Link
                component={RouterLink}
                to="/login"
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
                Fazer Login
              </Link>
            </Box>
          </Box>
        </Paper>
  );
}