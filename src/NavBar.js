import React, {useState, useEffect} from 'react';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import MuiDrawer from '@mui/material/Drawer';
import MuiAppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import DashboardRoundedIcon from '@mui/icons-material/DashboardRounded';
import ExploreIcon from "@mui/icons-material/Explore";
import ForumIcon from '@mui/icons-material/Forum';
import SettingsIcon from '@mui/icons-material/Settings';
import AccountCircleIcon from '@mui/icons-material/AccountCircle'
import {Link} from "react-router-dom";
import Avatar from "./userSideComponents/Avatar";
import LogIn from "./userSideComponents/LogIn";
import {useNavigate, useLocation} from "react-router-dom";
import Button from "@mui/material/Button";
//import TryvestLogo from './images/Tryvest_logo_design.svg'

const drawerWidth = 240;

const openedMixin = (theme) => ({
  width: drawerWidth,
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: 'hidden',
});

const closedMixin = (theme) => ({
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: 'hidden',
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up('sm')]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
});

const Icons = [ <DashboardRoundedIcon color='secondary'/>,
                <ExploreIcon color='secondary'/>,
                <ForumIcon color='secondary'/>,
                <SettingsIcon color='secondary'/>,
                <AccountCircleIcon color='secondary'/>]


const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(['width', 'margin'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(
    ({ theme, open }) => ({
      width: drawerWidth,
      flexShrink: 0,
      whiteSpace: 'nowrap',
      boxSizing: 'border-box',
      ...(open && {
        ...openedMixin(theme),
        '& .MuiDrawer-paper': openedMixin(theme),
      }),
      ...(!open && {
        ...closedMixin(theme),
        '& .MuiDrawer-paper': closedMixin(theme),
      }),
    }),
);

export default function NavBar() {
  const [open, setOpen] = React.useState(false);
  const currentUser = false //placeholder
  const navigate = useNavigate()

  const userItems = ['', 'Discover', 'Messages', 'Settings', 'Profile']
  const businessItems = ['Analytics', 'Terms', 'Messages', 'Schedule', 'Billing']


  const {pathname} = useLocation()

  const [items, setItems] = React.useState(pathname.includes('business') ? businessItems : userItems)
  const [userSide, setUserSide] = React.useState(!pathname.includes('business'))


  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const handleClickStartup = () => {
    setUserSide(false)
    setItems(businessItems)
    navigate('/business/landing')
  }

  if(pathname === '/business/landing') {
    return
  }


  return (

      <Box sx={{display: 'flex', paddingTop: '10vh', }}>
        <AppBar position="fixed" elevation={0} sx={{borderBottom: 1, borderColor: '#ececec'}}>
          <Toolbar>
            <Box
                display='flex'
                flexGrow={1}
                sx={{
                  flexDirection: 'row',
                }}>
              {userSide ?
                  <Link to="/">
                    <img src={require('./images/Tryvest.jpg')} alt='Tryvest Logo' height='50px'/>
                    {/* Logo needs to be same height as text, and much neater. Looks bad right now*/}
                  </Link>
                  :
                  <Link to="/business/analytics" style={{textDecoration: 'none', color: '#000'}}>
                    <h1>Tryvest for Business</h1>
                  </Link>
              }
            </Box>

            <Box
                display='flex'
                sx={{flexDirection: 'row', paddingRight: 0, paddingLeft: 'auto'}}>
              {userSide &&
              <Button variant='text' color='secondary' onClick={handleClickStartup} style={{marginRight: '20px'}}>
                For Business
              </Button>
              }
              {currentUser ?
                  <Avatar/> :
                  <LogIn/>
              }
            </Box>

          </Toolbar>
        </AppBar>
        <Drawer variant="permanent" open={open} onMouseEnter={handleDrawerOpen} onMouseLeave={handleDrawerClose}>
          <List style={{marginTop: '8vh'}}>
            {items.map((text, index) => (
                <ListItem
                    key={text}
                    disablePadding
                    sx={{
                      display: 'block',
                    }}>
                  <ListItemButton
                      sx={{
                        minHeight: 60,
                        justifyContent: open ? 'initial' : 'center',
                        px: 2.5,
                        borderRadius: 5,
                      }}

                      onClick={() => {
                        userSide ? navigate('/' + text.toLowerCase()) : navigate('/business/' + text.toLowerCase())
                      }}
                      selected={
                        (pathname.substring(pathname.lastIndexOf("/") + 1, pathname.length) === text.toLowerCase()) ||
                        (text === 'Dashboard')
                      }
                  >
                    <ListItemIcon
                        sx={{
                          minWidth: 0,
                          mr: open ? 3 : 'auto',
                          justifyContent: 'center',
                        }}
                    >
                      {Icons[index]}
                    </ListItemIcon>
                    <ListItemText className='navText' primary={text !== '' ? text : 'Dashboard'}
                                  sx={{opacity: open ? 1 : 0}}/>
                  </ListItemButton>
                </ListItem>
            ))}
          </List>
        </Drawer>

      </Box>

  );
}
