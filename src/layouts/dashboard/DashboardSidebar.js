import PropTypes from 'prop-types';
import {useEffect, useState} from 'react';
import {  useLocation } from 'react-router-dom';
import { styled } from '@mui/material/styles';
import {
  Box,
  Drawer,
  useTheme
} from '@mui/material';

// mock
import {useSelector, useDispatch} from "react-redux";
// hooks
import useResponsive from '../../hooks/useResponsive';
// components
import {LightLogo} from '../../components/Logo';
import NavSection from '../../components/NavSection';
//
import navConfig from './NavConfig';

// ----------------------------------------------------------------------

export const DRAWER_WIDTH = 200;

const RootStyle = styled('div')(({ theme }) => ({
  [theme.breakpoints.up('lg')]: {
    flexShrink: 0,
    width: DRAWER_WIDTH,
  },
}));

const AccountStyle = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(2, 2.5),
  borderRadius: Number(theme.shape.borderRadius) * 1.5,
  backgroundColor: theme.palette.grey[500_12],
}));

// ----------------------------------------------------------------------

DashboardSidebar.propTypes = {
  userType: PropTypes.string,
  isOpenSidebar: PropTypes.bool,
  onCloseSidebar: PropTypes.func,
};

export default function DashboardSidebar({ userType, isOpenSidebar, onCloseSidebar }) {
  const { pathname } = useLocation();

  const isDesktop = useResponsive('up', 'lg');
  const user = useSelector((state) => state.user?.user)
  const theme = useTheme();

  useEffect(() => {
    if (isOpenSidebar) {
      onCloseSidebar();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  const renderContent = (
    <Box
      sx={{
        height: 1,
        '& .simplebar-content': { height: 1, display: 'flex', flexDirection: 'column'},
      }}
    >
      <div style={{height: 'auto', display: 'inline-flex', justifyContent: "center", margin: "15px"}}>
          <LightLogo sx={{zIndex: 10}} />
      </div>

      {
        userType === "business" ? (
          <NavSection navConfig={navConfig.businessSide} />
        ) : (
          <>
            <NavSection navConfig={navConfig.userSide} />
            <Box sx={{flexGrow: 1}} />
          </>
        )
      }
    </Box>
  );

  return (
    <RootStyle>
      {(
        <Drawer
          ModalProps ={{
            keepMounted: true
          }}
          sx={{zIndex: "100"}}
          variant={!isDesktop ? "temporary" : "persistent"}
          open={!isDesktop ? isOpenSidebar : true}
          // onClose={!isDesktop ? onCloseSidebar : () => {}}
          PaperProps={{
            sx: { width: DRAWER_WIDTH, bgcolor: theme.palette.primary.dark,},
          }}
        >
          {renderContent}
        </Drawer>
      )}

      {/*
        {isDesktop && (
          <Drawer
            open
            variant="persistent"
            PaperProps={{
              sx: {
                width: DRAWER_WIDTH,
                bgcolor: theme.palette.primary.dark,
              },
            }}
          >
            {renderContent}
          </Drawer>
        )}
      */}
    </RootStyle>
  );
}
