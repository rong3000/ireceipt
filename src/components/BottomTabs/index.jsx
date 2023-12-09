import React, { useState, useRef, useEffect } from 'react';
import { BottomNavigation, BottomNavigationAction, Paper } from '@mui/material';
import { Link, useLocation } from 'react-router-dom';
import HomeIcon from '@mui/icons-material/Home';
import ReceiptIcon from '@mui/icons-material/Receipt';
import SettingsIcon from '@mui/icons-material/Settings';

const BottomTabs = () => {
  const location = useLocation();
  const [value, setValue] = React.useState(0);

  useEffect(() => {
    if (location.pathname === '/') {
      setValue(0);
    } else if (location.pathname === '/receipts') {
      setValue(1);
    } else if (location.pathname === '/settings') {
      setValue(2);
    }
  }, [location]);

  return (
    <Paper sx={{ position: 'fixed', bottom: 0, left: 0, right: 0 }} elevation={3}>
      <BottomNavigation showLabels value={value}
        onChange={(event, newValue) => {
          setValue(newValue);
        }}>
        <BottomNavigationAction label="Home" component={Link} to="/" icon={<HomeIcon />} />
        <BottomNavigationAction label="Receipts" component={Link} to="/receipts" icon={<ReceiptIcon />} />
        <BottomNavigationAction label="Settings" component={Link} to="/settings" icon={<SettingsIcon />} />
      </BottomNavigation>
    </Paper>
  );
};

export default BottomTabs;
