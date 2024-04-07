import React from 'react'
import ReactDOM from 'react-dom/client'
import Invoices from './routes/invoices/Invoices'
import './index.css'
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import { ThemeOptions, ThemeProvider, createTheme } from '@mui/material/styles';
import { lime, orange, purple } from '@mui/material/colors';
import { AuthProvider } from './context/AuthContext';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment'
import { LocalizationProvider } from '@mui/x-date-pickers';


const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#313030',
    },
    secondary: {
      main: '#000000',
    },
    background: {
      default: '#ece9e9',
    },
  },
});

ReactDOM.createRoot(document.getElementById('root')!).render(

  <React.StrictMode>
    <LocalizationProvider dateAdapter={AdapterMoment}>
    <AuthProvider>
      <ThemeProvider theme={theme}>
        <Invoices />
      </ThemeProvider>
    </AuthProvider>
    </LocalizationProvider>
  </React.StrictMode>,
)
