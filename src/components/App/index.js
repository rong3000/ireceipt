import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import DrawerMenu from '../DrawerMenu';
import Home from '../Home';
import Inbox from '../Inbox';
import Drafts from '../Drafts';

import { AppBar, Toolbar, Typography, ListItemIcon } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import BottomTabs from '../BottomTabs';

const App = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);

  const toggleDrawer = () => {
    setDrawerOpen(!drawerOpen);
  };

  return (
    <div>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div">
            <ListItemIcon>
              <MenuIcon onClick={toggleDrawer}/>
            </ListItemIcon>
          </Typography>
        </Toolbar>
      </AppBar>

      <DrawerMenu open={drawerOpen} onClose={toggleDrawer} />
      
      <Routes>
        <Route exact path="/" element={<Home />} />
        <Route path="/inbox" element={<Inbox />} />
        <Route path="/drafts" element={<Drafts />} />
      </Routes>

      <BottomTabs/>

    </div>
  );
};

export default App;
