import { useRef, useState } from 'react';
import {Link as RouterLink, useNavigate} from 'react-router-dom';
// @mui
import { alpha } from '@mui/material/styles';
import { Box, Divider, Typography, Stack, MenuItem, Avatar, IconButton } from '@mui/material';
// components
import {useDispatch, useSelector} from "react-redux";
import {bindActionCreators} from "redux";
import MenuPopover from '../../components/MenuPopover';
// mocks_
import account from '../../_mock/account';
import {authActionCreators} from "../../store";

// ----------------------------------------------------------------------

const MENU_OPTIONS = [
  {
    label: 'Home',
    icon: 'eva:home-fill',
    linkTo: '/',
  },
  {
    label: 'Profile',
    icon: 'eva:person-fill',
    linkTo: 'profile',
  },
/*  {
    label: 'Settings',
    icon: 'eva:settings-2-fill',
    linkTo: '#',
  }, */
];

// ----------------------------------------------------------------------

export default function AccountPopover() {
  const anchorRef = useRef(null);

  const [open, setOpen] = useState(null);

  const state = useSelector((state) => state.user);
  const navigate = useNavigate()

  const dispatch = useDispatch();

  const { logOut } = bindActionCreators(authActionCreators, dispatch);

  const handleOpen = (event) => {
    setOpen(event.currentTarget);
  };

  const handleClose = () => {
    setOpen(null);
  };

  const handleLogout = () => {
    setOpen(null);
    logOut();
    console.log(state);

  }

  const user = useSelector((state) => state.user?.user)

  return (
    <>
      <IconButton
        ref={anchorRef}
        onClick={handleOpen}
        sx={{
          p: 0,
          ...(open && {
            '&:before': {
              zIndex: 1,
              content: "''",
              width: '100%',
              height: '100%',
              borderRadius: '50%',
              position: 'absolute',
              bgcolor: (theme) => alpha(theme.palette.grey[900], 0.8),
            },
          }),
        }}
      >
        <Avatar src={account.photoURL} alt="photoURL" />
      </IconButton>

      <MenuPopover
        open={Boolean(open)}
        anchorEl={open}
        onClose={handleClose}
        sx={{
          p: 0,
          mt: 1.5,
          ml: 0.75,
          '& .MuiMenuItem-root': {
            typography: 'body2',
            borderRadius: 0.75,
          },
        }}
      >
        {user ?
            <>
              <Box sx={{my: 1.5, px: 2.5}}>
                <Typography variant="subtitle2" noWrap>
                  {user.firstName} {user.lastName}
                </Typography>
              </Box>
              <Divider sx={{borderStyle: 'dashed'}}/>

            <Stack sx={{p: 1}}>
          {MENU_OPTIONS.map((option) => (
            <MenuItem key={option.label} to={option.linkTo} component={RouterLink} onClick={handleClose}>
          {option.label}
            </MenuItem>
            ))}
            </Stack>

            <Divider sx={{borderStyle: 'dashed'}} />

            <MenuItem onClick={handleLogout} sx={{m: 1}}>
              Logout
            </MenuItem>
            </>
          :
            <>
              <Box sx={{my: 1.5, px: 2.5}}>
                <Typography variant="subtitle2" noWrap>
                  Sign In
                </Typography>
              </Box>
            </>
        }
      </MenuPopover>
    </>
  );
}
