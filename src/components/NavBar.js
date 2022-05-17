import * as React from 'react';
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
import Avatar from "./Avatar";
import LogIn from "./LogIn";
import {useNavigate, useLocation} from "react-router-dom";

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

  const currentUser = true //placeholder
  const navigate = useNavigate()

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const {pathname} = useLocation()

  return (
      <Box sx={{ display: 'flex', paddingTop: '12vh'}}>
        <AppBar position="fixed" elevation={0}>
          <Toolbar>
              <Box display='flex' flexGrow={1}>
                <div className='header__left'>
                  <Link to="/dashboard" style={{textDecoration: "none"}}>
                      <h1 style={{color: "black"}}>Tryvest</h1>
                  </Link>
                </div>
              </Box>
              <div className='header__right'>
                {currentUser ?
                    <Avatar /> :
                    <LogIn/>
                }
              </div>

          </Toolbar>
        </AppBar>
        <Drawer variant="permanent" open={open} onMouseEnter={handleDrawerOpen} onMouseLeave={handleDrawerClose}>
          <List style={{marginTop: '10vh'}} >
            {['Dashboard', 'Discover', 'Messages', 'Settings', 'Profile'].map((text, index) => (
                <ListItem
                    key={text}
                    disablePadding
                    sx={{ display: 'block',
                    }}>
                  <ListItemButton
                      sx={{
                        minHeight: 60,
                        justifyContent: open ? 'initial' : 'center',
                        px: 2.5,
                        borderRadius: 5,
                      }}
                      onClick={() => {navigate('/' + text.toLowerCase())}}
                      selected={(pathname.substring(pathname.lastIndexOf("/") + 1, pathname.length) === text.toLowerCase())}
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
                    <ListItemText className='navText' primary={text} sx={{ opacity: open ? 1 : 0}} />
                  </ListItemButton>
                </ListItem>
            ))}
          </List>
        </Drawer>

      </Box>
  );
}
