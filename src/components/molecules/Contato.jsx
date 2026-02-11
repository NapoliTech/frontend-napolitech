import { Box, Stack, Typography, Divider } from '@mui/material';
import PhoneIcon from '@mui/icons-material/Phone';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import React from 'react';

export default function Contato() {
  return (
    <Stack
      direction={{ xs: "column", md: "row" }}
      spacing={{ xs: 4, sm: 5, md: 8 }}
      sx={{
        justifyContent: "space-between",
        alignItems: { xs: 'center', md: 'flex-start' },
        width: { xs: '95%', sm: '90%', md: '85%' },
        maxWidth: '1200px',
        px: { xs: 2, sm: 3, md: 4 },
      }}
    >
      {/* Fale Conosco */}
      <Box sx={{ textAlign: { xs: "center", md: "left" }, flex: 1 }}>
        <Stack direction="row" spacing={1} justifyContent={{ xs: "center", md: "flex-start" }} sx={{ mb: 2 }}>
          <PhoneIcon sx={{ color: "#B72A23" }} />
          <Typography variant="h6" sx={{ fontWeight: "bold", fontSize: { xs: "1.1rem", md: "1.25rem" } }}>
            Fale Conosco
          </Typography>
        </Stack>
        <Typography variant="body1" sx={{ mb: 0.5, fontSize: { xs: "0.9rem", md: "1rem" } }}>
          (11) 91324-3487
        </Typography>
        <Stack direction="row" spacing={0.5} justifyContent={{ xs: "center", md: "flex-start" }} sx={{ mt: 2 }}>
          <LocationOnIcon sx={{ color: "#B72A23", fontSize: "1.2rem" }} />
          <Box>
            <Typography variant="body2" sx={{ fontSize: { xs: "0.85rem", md: "0.875rem" } }}>
              Rua Juquiá, 675
            </Typography>
            <Typography variant="body2" sx={{ fontSize: { xs: "0.85rem", md: "0.875rem" } }}>
              Jardim Cristiane
            </Typography>
            <Typography variant="body2" sx={{ fontSize: { xs: "0.85rem", md: "0.875rem" } }}>
              Santo André-SP
            </Typography>
            <Typography variant="body2" sx={{ fontSize: { xs: "0.85rem", md: "0.875rem" } }}>
              09185-235
            </Typography>
          </Box>
        </Stack>
      </Box>

      {/* Logo Central - oculta em mobile pequeno */}
      <Box 
        sx={{ 
          display: { xs: "flex", sm: "flex" },
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          flex: { xs: 0, md: 1 },
        }}
      >
        <Divider sx={{ width: "100%", mb: 2, display: { xs: "block", md: "none" } }} />
        <img 
          src="/img/logo_bonari_preto.png" 
          alt="Logo Bonari" 
          style={{
            width: "auto",
            height: "120px",
            maxWidth: "100%",
            objectFit: "contain",
          }}
        />
        <Divider sx={{ width: "100%", mt: 2, display: { xs: "block", md: "none" } }} />
      </Box>

      {/* Horários */}
      <Box sx={{ textAlign: { xs: "center", md: "left" }, flex: 1 }}>
        <Stack direction="row" spacing={1} justifyContent={{ xs: "center", md: "flex-start" }} sx={{ mb: 2 }}>
          <AccessTimeIcon sx={{ color: "#B72A23" }} />
          <Typography variant="h6" sx={{ fontWeight: "bold", fontSize: { xs: "1.1rem", md: "1.25rem" } }}>
            Horários
          </Typography>
        </Stack>
        <Typography variant="body2" sx={{ mb: 1, fontSize: { xs: "0.85rem", md: "0.875rem" } }}>
          Terça a Sábado: 18:00 - 01:00
        </Typography>
        <Typography variant="body2" sx={{ mb: 1, fontSize: { xs: "0.85rem", md: "0.875rem" } }}>
          Feriados: 18:00 - 23:00
        </Typography>
        <Typography variant="body2" sx={{ fontSize: { xs: "0.85rem", md: "0.875rem" }, fontStyle: "italic", color: "text.secondary" }}>
          Fechados às segundas-feiras, exceto feriados
        </Typography>
      </Box>
    </Stack>
  );
}