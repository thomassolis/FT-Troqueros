import { Box, Typography } from '@mui/material';

export const NeonWarning = ({ message }: { message: string }) => {
  return (
    <Box
      sx={{
        padding: '12px 20px',
        margin: '16px 0',
        borderRadius: '4px',
        backgroundColor: 'rgba(255, 200, 0, 0.1)', // Fondo amarillo tenue
        border: '1px solid #ffcc00',
        display:'flex',
        justifyContent: 'center',
        boxShadow: `
          0 0 5px #fff,
          0 0 10px #ffcc00,
          0 0 15px #ffcc00,
          0 0 20px #ffcc00
        `, // Efecto neón
        animation: 'pulse 2s infinite alternate',
        '@keyframes pulse': {
          '0%': { boxShadow: '0 0 5px #fff, 0 0 10px #ffcc00' },
          '100%': { boxShadow: '0 0 15px #fff, 0 0 20px #ffcc00, 0 0 25px #ffcc00' }
        }
      }}
    >
      <Typography
        sx={{
          color: '#000', // Texto blanco          
          fontWeight: 'bold',
          fontSize: '1rem'
        }}
      >
        ⚠️ {message}
      </Typography>
    </Box>
  );
};