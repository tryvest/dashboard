import { useState } from 'react';
import {Outlet, useLocation} from 'react-router-dom';
// material
import { styled } from '@mui/material/styles';
//
import {useSelector} from "react-redux";
import DashboardNavbar from './DashboardNavbar';
import DashboardSidebar from './DashboardSidebar';
import Footer from "./Footer";
// ----------------------------------------------------------------------

const APP_BAR_MOBILE = 64;
const APP_BAR_DESKTOP = 92;

const RootStyle = styled('div')({
  display: 'flex',
  minHeight: '100%',
  overflow: 'hidden'
});

const MainStyle = styled('div')(({ theme }) => ({
  flexGrow: 1,
  overflow: 'auto',
  minHeight: '100%',
  paddingTop: APP_BAR_MOBILE + 24,
  paddingBottom: theme.spacing(10),
  [theme.breakpoints.up('lg')]: {
    paddingTop: APP_BAR_DESKTOP,
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2)
  }
}));

// ----------------------------------------------------------------------

export default function DashboardLayout() {
  const [open, setOpen] = useState(false);
  const userType = useSelector((state) => state.user?.userType)

  const { host } = window.location

  return (
      <div>
        <RootStyle>
          <DashboardNavbar onOpenSidebar={() => setOpen(true)} onCloseSidebar={() => setOpen(false)} />
          <DashboardSidebar userType={userType} isOpenSidebar={open} onCloseSidebar={() => setOpen(false)} />
          <MainStyle>
            <Outlet />
          </MainStyle>
        </RootStyle>
      </div>
);
}
