import React, { useContext, useState } from 'react';
import { TextField, Button, Container, CssBaseline, Paper, useTheme, Backdrop, CircularProgress, AppBar, Toolbar, IconButton, Box, Icon, createTheme, ThemeProvider, Typography, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions } from '@mui/material';
import { AuthContext } from '../../context/AuthContext';
import { DoLogin } from '../../api/Aim';
import ExtError from '../../library/ExtError';
import { useNavigate } from 'react-router-dom';

const Login: React.FC = () => {
  const theme = useTheme();
  const UserState = useContext(AuthContext);
  const navigate = useNavigate();

  const darkTheme = createTheme({
    palette: {
      mode: 'light',
      primary: {
        main: '#ffffff',
      },
      secondary: {
        main: '#000000',
      },
      background: {
        default: '#ffffff',
      },
    },

  });

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [errorTitle, setErrorTitle] = useState('');

  const handleLogin = async () => {
    setIsLoading(true);
    //Gets Login information
    try {
      const response = await DoLogin(email, password);
      console.log("Response: ", response);
      UserState?.setUserData({
        email: email,
        password: password,
        authToken: response!.authToken,
        name: response!.name,
        isClient: response!.isClient
      });
      UserState?.setUserCookie({
        email: email,
        password: password,
        authToken: response!.authToken,
        name: response!.name,
        isClient: response!.isClient
      });

      navigate("/invoices");
    }
    catch (error: any) {
      if (error instanceof ExtError) {
        console.log(error.message);
        setErrorTitle(error.userErrorTitle);
        setErrorMsg(error.userErrorMessage);
      } else {
        console.log(error.message);
        setErrorTitle("Unknown Connection Error");
        setErrorMsg("Try again later.");
      }

      setIsLoading(false);
    }
  };


  return (
    <Container
      component="main"
      maxWidth={false}
      sx={{
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent:'center',
        gap:theme.spacing(15),
        marginTop: 8,
        width: '100vw'
      }}
    >
      <CssBaseline />
      <Backdrop open={isLoading} sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}><CircularProgress color="inherit" /></Backdrop>
      <Dialog
        open={errorTitle.length>0}
        onClose={()=>{setErrorTitle("")}}>
        <DialogTitle>
          {errorTitle}
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            {errorMsg}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button autoFocus onClick={()=>{setErrorTitle("")}}>Okay</Button>
        </DialogActions>
      </Dialog>
      <ThemeProvider theme={darkTheme}>
        <AppBar position="fixed">
          <Toolbar>
            <Box
              component="img"
              sx={{
                height: 48,
              }}
              alt="Your logo."
              src={'/aimedge_logo.png'}
            />
          </Toolbar>
        </AppBar>
      </ThemeProvider>
      <Box
        sx={{
          marginTop: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'left',
          width:'27rem',
        }}>
        <Typography variant="h3" style={{marginBottom:theme.spacing(2),marginLeft:theme.spacing(2)}}>Log In<br/></Typography>
        <Typography variant='body1' style={{textAlign: 'center'}}>We are an international
        IT consulting firm, focused in software development. We use cutting edge technologies and an innovate methodology, through all lifecycle phases of design and implementation for
        large-scale systems. Our commitment, technical expertise and excellent location allows us to present an innovative and bright solution worldwide customeres.</Typography>
      </Box>
      <Paper
        elevation={3}
        sx={{
          marginTop: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          padding: theme.spacing(4),
          borderRadius: 7,
          borderWidth: theme.spacing(0.25),
          borderColor: 'gray',
          borderStyle: 'solid',
          width:'27rem',
        }}>
        <img src={'/aimedge_banner.png'} style={{ width: "50%", height: "50%", alignSelf: "center", marginBottom:theme.spacing(5) }} />
        <TextField variant="outlined"
          margin="normal"
          required
          fullWidth
          id="username"
          label="Username"
          name="username"
          autoFocus
          value={email}
          onChange={(event: React.ChangeEvent<HTMLInputElement>) => { setEmail(event.target.value); }} />
        <TextField variant="outlined"
          margin="normal"
          required
          fullWidth
          id="password"
          label="Password"
          name="password"
          type="password"
          value={password}
          onChange={(event: React.ChangeEvent<HTMLInputElement>) => { setPassword(event.target.value); }} />
        <Button type="submit"
          fullWidth
          size='large'
          variant="contained"
          sx={{ m:'auto', mt: 3, mb: 2}}
          onClick={handleLogin}>
          ENTER
        </Button>
      </Paper>
    </Container>
  );
};

export default Login;
