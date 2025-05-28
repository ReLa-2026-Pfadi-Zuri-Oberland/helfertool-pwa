import {
  Assignment,
  Business,
  CorporateFare,
  Dashboard,
  Email,
  ExpandLess,
  ExpandMore,
  Group,
  Language,
  Login,
  Menu,
  Person,
  Place,
  Schedule,
  Work,
} from '@mui/icons-material';
import {
  Avatar,
  Collapse,
  Grid,
  ListItemAvatar,
  ListItemButton,
  ListItemIcon,
} from '@mui/material';
import { useContext, useState } from 'react';

import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import { UserContext } from '../../stores/UserContext';
import reLaLogo from '../../assets/reLaLogo.png';
import { useNavigate } from 'react-router-dom';

const drawerWidth = 240;

const TopSideBar = ({ children }) => {
  const navigate = useNavigate();
  const { hasPermission } = useContext(UserContext);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dashboardOpen, setDashboardOpen] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const drawer = (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <div>
        <Toolbar>
          <img
            src={reLaLogo}
            style={{ maxHeight: '50px' }}
            className='cursor-pointer'
            onClick={() => {
              setMobileOpen(false);
              navigate('/0/anmelden');
            }}
          />
        </Toolbar>
        <Divider />
        <List>
          <ListItem disablePadding key='Helfendeneinsätze'>
            <ListItemButton
              onClick={() => {
                setMobileOpen(false);
                navigate('0/anmelden');
              }}
            >
              <ListItemIcon>
                <Menu />
              </ListItemIcon>
              <ListItemText primary='Helfendeneinsätze' />
            </ListItemButton>
          </ListItem>
          {hasPermission(['user:read']) && (
            <ListItem disablePadding key='Profil'>
              <ListItemButton
                onClick={() => {
                  setMobileOpen(false);
                  navigate('/profile');
                }}
              >
                <ListItemIcon>
                  <Person />
                </ListItemIcon>
                <ListItemText primary='Profil' />
              </ListItemButton>
            </ListItem>
          )}
          {hasPermission(['user:login:view']) && (
            <ListItem disablePadding key='Login'>
              <ListItemButton
                onClick={() => {
                  setMobileOpen(false);
                  navigate('/login');
                }}
              >
                <ListItemIcon>
                  <Login />
                </ListItemIcon>
                <ListItemText primary='Login' />
              </ListItemButton>
            </ListItem>
          )}
          {hasPermission(['dashboard:view']) && (
            <>
              <ListItemButton onClick={() => setDashboardOpen(!dashboardOpen)}>
                <ListItemIcon>
                  <Dashboard />
                </ListItemIcon>
                <ListItemText primary='Dashboard' />
                {dashboardOpen ? <ExpandLess /> : <ExpandMore />}
              </ListItemButton>
              <Collapse in={dashboardOpen} timeout='auto' unmountOnExit>
                {[
                  {
                    text: 'Organizations',
                    to: 'dashboard/organizations',
                    icon: <Business />,
                  },
                  {
                    text: 'Locations',
                    to: 'dashboard/locations',
                    icon: <Place />,
                  },
                  {
                    text: 'JobTypes',
                    to: 'dashboard/jobTypes',
                    icon: <Work />,
                  },
                  {
                    text: 'Shifts',
                    to: 'dashboard/shifts',
                    icon: <Schedule />,
                  },
                  {
                    text: 'Users',
                    to: 'dashboard/users',
                    icon: <Group />,
                  },
                  {
                    text: 'Engagements',
                    to: 'dashboard/engagements',
                    icon: <Assignment />,
                  },
                ].map(({ text, to, icon }) => (
                  <ListItem disablePadding key={text} sx={{ pl: 4 }}>
                    <ListItemButton
                      onClick={() => {
                        setMobileOpen(false);
                        navigate(`/${to}`);
                      }}
                    >
                      <ListItemIcon>{icon}</ListItemIcon>
                      <ListItemText primary={text} />
                    </ListItemButton>
                  </ListItem>
                ))}
              </Collapse>
            </>
          )}
        </List>
      </div>
      <Box sx={{ mt: 'auto' }}>
        <Divider />
        <List>
          <ListItem
            className='cursor-pointer'
            onClick={() => {
              setMobileOpen(false);
              window.open('https://www.rela26.ch', '_blank');
            }}
          >
            <ListItemAvatar>
              <Avatar>
                <CorporateFare />
              </Avatar>
            </ListItemAvatar>
            <ListItemText primary='Organisation' secondary={'ReLa26'} />
          </ListItem>
          <ListItem
            className='cursor-pointer'
            onClick={() => {
              setMobileOpen(false);
              window.open('https://www.rela26.ch', '_blank');
            }}
          >
            <ListItemAvatar>
              <Avatar>
                <Language />
              </Avatar>
            </ListItemAvatar>
            <ListItemText primary='Website' secondary='www.rela26.ch' />
          </ListItem>
          <ListItem
            className='cursor-pointer'
            onClick={() => {
              setMobileOpen(false);
              window.location.href = 'mailto:info@rela26.ch';
            }}
          >
            <ListItemAvatar>
              <Avatar>
                <Email />
              </Avatar>
            </ListItemAvatar>
            <ListItemText primary='Kontakt-Email' secondary='info@rela26.ch' />
          </ListItem>
        </List>
      </Box>
    </Box>
  );

  return (
    <Box>
      <AppBar
        position='fixed'
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
          bgcolor: 'white', // Set AppBar background color to red
        }}
      >
        <Toolbar>
          <IconButton
            aria-label='open drawer'
            edge='start'
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: 'none' }, color: '#6a0c00' }}
          >
            <Menu />
          </IconButton>
          <Typography variant='h6' noWrap component='div' color='black'>
            Helfendentool
          </Typography>
        </Toolbar>
      </AppBar>
      <Box
        component='nav'
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
        aria-label='mailbox folders'
      >
        {/* Mobile drawer */}
        <Drawer
          variant='temporary'
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: drawerWidth,
            },
          }}
        >
          {drawer}
        </Drawer>
        {/* Desktop drawer */}
        <Drawer
          variant='permanent'
          sx={{
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: drawerWidth,
            },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>
      <Box
        component='main'
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
        }}
        ml={{ sm: `${drawerWidth}px` }}
      >
        <Toolbar />
        <Grid container columns={16}>
          <Grid
            offset={{ xs: 1, sm: 1, md: 1, lg: 2 }}
            size={{ xs: 14, sm: 14, md: 14, lg: 12 }}
            className='pt-3'
          >
            {children}
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default TopSideBar;
