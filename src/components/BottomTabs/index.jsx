import React from 'react';
import { BottomNavigation, BottomNavigationAction, Paper } from '@mui/material';
import { Link } from 'react-router-dom';
import HomeIcon from '@mui/icons-material/Home';
import InboxIcon from '@mui/icons-material/Inbox';
import DraftsIcon from '@mui/icons-material/Drafts';

const BottomTabs = () => {
  const [value, setValue] = React.useState(0);

  return (
    <Paper sx={{ position: 'fixed', bottom: 0, left: 0, right: 0 }} elevation={3}>
      <BottomNavigation showLabels value={value}
        onChange={(event, newValue) => {
          setValue(newValue);
        }}>
        <BottomNavigationAction label="Home" component={Link} to="/" icon={<HomeIcon />} />
        <BottomNavigationAction label="Inbox" component={Link} to="/inbox" icon={<InboxIcon />} />
        <BottomNavigationAction label="Drafts" component={Link} to="/drafts" icon={<DraftsIcon />} />
      </BottomNavigation>
    </Paper>
  );
};

export default BottomTabs;
