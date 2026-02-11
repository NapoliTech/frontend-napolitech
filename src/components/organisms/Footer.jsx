import React from 'react';
import { Box } from '@mui/material';
import Contato from '../molecules/Contato';

export default function Footer() {
  return (
    <Box
      component="footer"
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        height: 'auto',
        mt: { xs: 4, md: 6 },
        py: { xs: 3, md: 4 },
        backgroundColor: '#f5f5f5',
        borderTop: '1px solid #e0e0e0',
      }}
    >
      <Contato />
    </Box>
  );
}