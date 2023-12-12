import React, { useState, useRef, useEffect } from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';

import { connect } from 'react-redux';
import { login, authInit } from '../../redux/actions/authActions';
import { Routes, Route, useNavigate, Link as RouterLink } from 'react-router-dom';
import { CircularProgress, Modal } from '@mui/material';


function Copyright(props) {
  return (
    <Typography variant="body2" color="text.secondary" align="center" {...props}>
      {'Copyright © '}
      <Link color="inherit" href="#">
        https://ireceipts.au/
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}


const defaultTheme = createTheme();

function SignIn({ isLoggedIn, user, login, authInit, error }) {
  const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const closeErrorModal = () => {
    setIsErrorModalOpen(false);
  };

  const navigate = useNavigate();

  useEffect(() => {
    if (isLoggedIn) {
      setIsLoading(false);

      navigate('/', { replace: true });
    }
    if (error) {
      setIsLoading(false);

      setIsErrorModalOpen(true);
    }
  }, [isLoggedIn, error]);

  const handleSubmit = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    authInit();
    login(data.get('email'), data.get('password'));
    setIsLoading(true);

  };

  return (
    <ThemeProvider theme={defaultTheme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign in
          </Typography>
          <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
            />
            <FormControlLabel
              control={<Checkbox value="remember" color="primary" />}
              label="Remember me"
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Sign In
            </Button>
            <Grid container>
              <Grid item>
                <RouterLink to="/signup" variant="body2">
                  {"Don't have an account? Please Sign Up"}
                </RouterLink>
              </Grid>
            </Grid>
          </Box>
          <Modal open={isLoading}>
            <div className="modal-content">
              <CircularProgress />
            </div>
          </Modal>

          <Modal open={isErrorModalOpen}>
            <div className="modal-content">
              <h2>Error</h2>
              <p>{error ? `${error}` : 'An error occurred.'}</p>
              <Button onClick={closeErrorModal}>Close</Button>
            </div>
          </Modal>
        </Box>
        <Copyright sx={{ mt: 8, mb: 4 }} />
      </Container>
    </ThemeProvider>
  );
}

const mapStateToProps = (state) => ({
  isLoggedIn: state.authx.isLoggedIn,
  user: state.authx.user,
  error: state.authx.error
});

export default connect(mapStateToProps, { login, authInit })(SignIn)