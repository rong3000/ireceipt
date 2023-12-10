import { connect } from 'react-redux'

import React, { useState } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import DrawerMenu from '../DrawerMenu';
import Home from '../Home';
import Receipts from '../Receipts';
import Settings from '../Settings';
import EditReceipt from '../Receipts/EditReceipt';

import { AppBar, Box, Toolbar, Typography, Button, IconButton } from '@mui/material';

import MenuIcon from '@mui/icons-material/Menu';

import BottomTabs from '../BottomTabs';
import { login, logout } from '../../redux/actions/authActions'
import Login from '../Login'
import ImagePicker from '../Home/ImagePicker'

const App = ({ isLoggedIn, user, login, logout }) => {
  const [drawerOpen, setDrawerOpen] = useState(false);

  const toggleDrawer = () => {
    setDrawerOpen(!drawerOpen);
  };

  const navigate = useNavigate();

  const redirectToLogin = () => {
    navigate('/login/', { replace: true });
  };

  const handleLogin = () => {
    redirectToLogin();
  };

  const handleLogout = () => {
    logout();
  };

  return (
    <div>
      <Box sx={{ flexGrow: 1 }}>
        <AppBar position="static">
          <Toolbar>
            <IconButton
              size="large"
              edge="start"
              color="inherit"
              aria-label="menu"
              sx={{ mr: 2 }}
              onClick={toggleDrawer} 
            >
              <MenuIcon />
            </IconButton>
            {
              isLoggedIn ?
                <>
                <Typography variant="h7" component="div" sx={{ flexGrow: 1 }}>
                  {user?.email}
                </Typography>
                
                <Button color="inherit" onClick={handleLogout}>Log Out</Button> 
                </>:
                <Button color="inherit" onClick={handleLogin}>Log In</Button>
            }

          </Toolbar>
        </AppBar>
      </Box>

      <DrawerMenu open={drawerOpen} onClose={toggleDrawer} />
      <Routes>
        <Route exact path="/" element={<Home />} />
        <Route path="/receipts" element={<Receipts />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/login" element={<Login />} />
        <Route path="/camera" element={<ImagePicker />} />
        <Route path="/edit" element={<EditReceipt />} />
      </Routes>

      <BottomTabs />

    </div>
  );
};

const mapStateToProps = (state) => ({
  isLoggedIn: state.authx.isLoggedIn,
  user: state.authx.user
});

export default connect(mapStateToProps, { login, logout })(App)
