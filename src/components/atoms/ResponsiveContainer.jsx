import { Box } from "@mui/material";

/**
 * ResponsiveContainer - Container otimizado para responsividade
 * 
 * Substitui uso de 100vw (que causa scroll horizontal) por largura 100%
 * com maxWidth configurável e padding responsivo
 * 
 * @param {string} maxWidth - Largura máxima: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'false' | string com unidade
 * @param {boolean} fullWidth - Se true, ignora maxWidth e usa 100%
 * @param {object} sx - Estilos adicionais do Material-UI
 */
export default function ResponsiveContainer({ 
  children, 
  maxWidth = "lg",
  fullWidth = false,
  noPadding = false,
  sx = {},
  ...props 
}) {
  const maxWidthMapping = {
    xs: 444,
    sm: 600,
    md: 900,
    lg: 1200,
    xl: 1536,
  };

  const computedMaxWidth = fullWidth 
    ? "100%" 
    : maxWidthMapping[maxWidth] || maxWidth;

  return (
    <Box
      sx={{
        width: "100%",
        maxWidth: computedMaxWidth !== "100%" ? `${computedMaxWidth}px` : "100%",
        mx: "auto", // Centraliza
        px: noPadding ? 0 : { xs: 2, sm: 3, md: 4 }, // Padding responsivo
        ...sx,
      }}
      {...props}
    >
      {children}
    </Box>
  );
}
