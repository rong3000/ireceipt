import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import DrawerMenu from '../DrawerMenu';
import Home from '../Home';
import Receipts from '../Receipts';
import Settings from '../Settings';

import { AppBar, Box, Toolbar, Typography, ListItemIcon, Button, IconButton } from '@mui/material';

import MenuIcon from '@mui/icons-material/Menu';

import BottomTabs from '../BottomTabs';

const App = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);

  const toggleDrawer = () => {
    setDrawerOpen(!drawerOpen);
  };

  return (
    <div>
      <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div">
            <ListItemIcon>
              <MenuIcon onClick={toggleDrawer}/>
            </ListItemIcon>
          </Typography>
        </Toolbar>
      </AppBar>
      </Box>

      <DrawerMenu open={drawerOpen} onClose={toggleDrawer} />
      <Routes>
        <Route exact path="/" element={<Home />} />
        <Route path="/receipts" element={<Receipts />} />
        <Route path="/settings" element={<Settings />} />
      </Routes>

      <BottomTabs />

    </div>
  );
};

export default App;
