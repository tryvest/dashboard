import { useRef, useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
// @mui
import { alpha } from '@mui/material/styles';
import { Box, Divider, Typography, Stack, MenuItem, Avatar, IconButton, Button } from '@mui/material';
// components
import { useDispatch, useSelector } from 'react-redux';
import { signOut } from 'firebase/auth';
import { auth } from '../../firebase';
import MenuPopover from '../../components/MenuPopover';
// mocks_
import account from '../../_mock/account';
import { logout } from '../../features/userSlice';

// ----------------------------------------------------------------------

const MENU_OPTIONS = [
  {
    label: 'Home',
    icon: 'eva:home-fill',
    linkTo: '/',
  },
  {
    label: 'Banking',
    icon: 'mdi:bank-circle',
    linkTo: '/dashboard/setup-banking',
  },
  /*  {
    label: 'Profile',
    icon: 'eva:person-fill',
    linkTo: 'profile',
  }, */
];

// ----------------------------------------------------------------------

export default function AccountPopover() {
  const anchorRef = useRef(null);
  const dispatch = useDispatch();
  const [open, setOpen] = useState(null);

  const navigate = useNavigate();

  const handleOpen = (event) => {
    setOpen(event.currentTarget);
  };

  const handleClose = () => {
    setOpen(null);
  };

  const handleLogout = () => {
    setOpen(null);
    dispatch(logout());
    signOut(auth).then(() => {
      navigate('', { replace: true });
    });
  };

  const user = useSelector((state) => state.user?.user);

  return (
    <>
      <Button
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
              position: 'absolute',
              // bgcolor: (theme) => alpha(theme.palette.grey[900], 0.8),
            },
          }),
        }}
      >
        {user ? (
          <Box>
            <Stack direction={'row'} spacing={1} alignItems={'center'}>
              <Typography fontSize={'20px'}>{`${user.data.firstName} ${user.data.lastName}`}</Typography>
              <svg width="12" height="7" viewBox="0 0 12 7" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M10.585 0L6 4.32839L1.415 0L0 1.33581L6 7L12 1.33581L10.585 0Z" fill="black" />
              </svg>
            </Stack>
          </Box>
        ) : (
          <div />
        )}

        {/* <Avatar src={account.photoURL} alt="photoURL" /> */}
      </Button>

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
        {user ? (
          <>
            <Box sx={{ mb: 1.5, px: 2.5 }}>
              <Typography variant="subtitle2" noWrap>
                {user.firstName} {user.lastName}
              </Typography>
            </Box>
            {/* <Divider sx={{borderStyle: 'dashed'}}/> */}

            <Stack sx={{ p: 1 }}>
              {MENU_OPTIONS.map((option) => (
                <MenuItem key={option.label} to={option.linkTo} component={RouterLink} onClick={handleClose}>
                  {option.label}
                </MenuItem>
              ))}
            </Stack>

             <Divider sx={{borderStyle: 'dashed'}} />
            <MenuItem onClick={handleLogout} sx={{ m: 1 }}>
              Logout
            </MenuItem>
          </>
        ) : (
          <>
            <Box sx={{ my: 1.5, px: 2.5 }}>
              <Typography variant="subtitle2" noWrap>
                Sign In
              </Typography>
            </Box>
          </>
        )}
      </MenuPopover>
    </>
  );
}
