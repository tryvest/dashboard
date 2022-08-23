import PropTypes from 'prop-types';
// material
import { alpha, styled } from '@mui/material/styles';
import {Box, Stack, AppBar, Toolbar, IconButton, Button, Typography} from '@mui/material';
// components
import {useNavigate} from "react-router-dom";
import {useEffect, useState} from "react";
import {useSelector} from "react-redux";
import Iconify from '../../components/Iconify';
//
import Searchbar from './Searchbar';import AccountPopover from './AccountPopover';
import LanguagePopover from './LanguagePopover';
import NotificationsPopover from './NotificationsPopover';
import {DRAWER_WIDTH} from "./DashboardSidebar";
import {apiBusinesses} from "../../utils/api/api-businesses";
// ----------------------------------------------------------------------

// const DRAWER_WIDTH = 200;
const APPBAR_MOBILE = 64;
const APPBAR_DESKTOP = 92;

const RootStyle = styled(AppBar)(({ theme }) => ({
  boxShadow: 'none',
  backdropFilter: 'blur(6px)',
  WebkitBackdropFilter: 'blur(6px)', // Fix on Mobile
  backgroundColor: alpha(theme.palette.background.default, 0.72),
  [theme.breakpoints.up('lg')]: {
    width: `calc(100% - ${DRAWER_WIDTH + 1}px)`,
  },
}));

const ToolbarStyle = styled(Toolbar)(({ theme }) => ({
  minHeight: APPBAR_MOBILE,
  [theme.breakpoints.up('lg')]: {
    minHeight: APPBAR_DESKTOP,
    padding: theme.spacing(0, 5),
  },
}));

// ----------------------------------------------------------------------

DashboardNavbar.propTypes = {
  onOpenSidebar: PropTypes.func,
};

export default function DashboardNavbar({ onOpenSidebar }) {

  const navigate = useNavigate()
  const userType = useSelector((state) => state.user?.userType)
  const businessID = useSelector((state) => state.user?.userType)
  const [businessInfo, setBusinessInfo] = useState()

  useEffect(() => {
    apiBusinesses.getSingle(businessID).then((data) => {
      setBusinessInfo(data)
    })
  }, [businessID])

  const iff = (condition, then, otherwise) => {
    if(condition){
      return then
    }
    return otherwise
  }

  return (
    <RootStyle>
      <ToolbarStyle>
        <IconButton onClick={onOpenSidebar} sx={{ mr: 1, color: 'text.primary', display: { lg: 'none' } }}>
          <Iconify icon="eva:menu-2-fill" />
        </IconButton>

        <Box sx={{ flexGrow: 1 }} />

        <Stack direction="row" alignItems="center" spacing={{ xs: 0.5, sm: 1.5 }}>
          {/*
          <Button onClick={() => {navigate('/landing')}} variant='outlined'>
            For Business
          </Button>
          <LanguagePopover />
          */}
          <NotificationsPopover />
          <div style={{height: "100%", padding: "5px", paddingLeft: '15px', borderLeft: "0.05em solid #DFE0EB"}}>
            {
              iff(userType === "business",
                  (
                      businessInfo ? (
                          <Typography style={{color: "black"}}>
                            {businessInfo.name}
                          </Typography>
                      ) : (
                          <Typography style={{borderLeft: "0.1em solid black", height: "100%"}}>
                            Login Here
                          </Typography>
                      )
                  ),
                  (<AccountPopover/>)
              )
            }
          </div>
        </Stack>
      </ToolbarStyle>
    </RootStyle>
  );
}
