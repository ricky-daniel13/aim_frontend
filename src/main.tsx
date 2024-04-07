import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import { AuthProvider } from './context/AuthContext';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment'
import { LocalizationProvider } from '@mui/x-date-pickers';
import { BrowserRouter } from "react-router-dom";
import { ThemeProvider, createTheme } from '@mui/material';
import App from './App';

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
        <BrowserRouter>
          <ThemeProvider theme={theme}>
            <App />
          </ThemeProvider>
        </BrowserRouter>
      </AuthProvider>
    </LocalizationProvider>
  </React.StrictMode>,
)
