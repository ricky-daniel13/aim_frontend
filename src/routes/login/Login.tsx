import React, { useContext, useState } from 'react';
import { TextField, Button, Container, CssBaseline, Paper, useTheme, Backdrop, CircularProgress } from '@mui/material';
import { AuthContext } from '../../context/AuthContext';
import { DoLogin } from '../../api/Aim';
import ExtError from '../../library/ExtError';
import { useNavigate } from 'react-router-dom';

const Login: React.FC = () => {
  const theme = useTheme();
  const UserState = useContext(AuthContext);
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isFail, setIsFail] = useState(false);

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
        /*setErrorMsg(error.userErrorTitle);
        setErrorDesc(error.userErrorMessage);*/
      } else {
        console.log(error.message);
        /*setErrorMsg("Unknown Connection Error");
        setErrorDesc("Try again later.");*/
      }

      setIsFail(true);
      setIsLoading(false);
    }
  };


  return (
    <Container
      component="main"
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyItems: 'center',
        alignSelf:'center',
        marginTop: 8,
        width:'100vw'
      }}
    >
      <CssBaseline />
      <Paper
        elevation={3}
        sx={{
          marginTop: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          padding: theme.spacing(3),
          borderRadius: 5,
          borderWidth: theme.spacing(0.5),
          borderColor: 'gray',
          borderStyle: 'solid'
        }}
      >
        <TextField
          variant="outlined"
          margin="normal"
          required
          fullWidth
          id="username"
          label="Username"
          name="username"
          autoFocus
          value={email}
          onChange={(event: React.ChangeEvent<HTMLInputElement>) => { setEmail(event.target.value); }}
        />
        <TextField
          variant="outlined"
          margin="normal"
          required
          fullWidth
          id="password"
          label="Password"
          name="password"
          type="password"
          value={password}
          onChange={(event: React.ChangeEvent<HTMLInputElement>) => { setPassword(event.target.value); }}
        />
        <Button
          type="submit"
          fullWidth
          variant="contained"
          sx={{ mt: 3, mb: 2 }}
          onClick={handleLogin}
        >
          ENTER
        </Button>
      </Paper>
    </Container>
  );
};

export default Login;
