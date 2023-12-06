import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import DrawerMenu from '../DrawerMenu';
import Home from '../Home';
import Inbox from '../Inbox';
import Drafts from '../Drafts';

const App = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);

  const toggleDrawer = () => {
    setDrawerOpen(!drawerOpen);
  };

  return (
    <div>
      <button onClick={toggleDrawer}>Open Drawer</button>
      
        <DrawerMenu open={drawerOpen} onClose={toggleDrawer} />
        
        <Routes>
          <Route exact path="/" element={<Home />} />
          <Route path="/inbox" element={<Inbox />} />
          <Route path="/drafts" element={<Drafts />} />
        </Routes>
      
    </div>
  );
};

export default App;
