import PropTypes from 'prop-types';
import { useEffect } from 'react';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import {bindActionCreators} from "redux";// material
import { styled } from '@mui/material/styles';
import { Box, Link, Button, Drawer, Typography, Avatar, Stack } from '@mui/material';
// mock
import {useSelector, useDispatch} from "react-redux";
import {businessActionCreators} from "../../store";
import account from '../../_mock/account';
// hooks
import useResponsive from '../../hooks/useResponsive';
// components
import Logo from '../../components/Logo';
import Scrollbar from '../../components/Scrollbar';
import NavSection from '../../components/NavSection';
//
import navConfig from './NavConfig';

// ----------------------------------------------------------------------

const DRAWER_WIDTH = 280;

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
  business: PropTypes.bool,
  isOpenSidebar: PropTypes.bool,
  onCloseSidebar: PropTypes.func,
};

export default function DashboardSidebar({ business, isOpenSidebar, onCloseSidebar }) {
  const { pathname } = useLocation();

  const isDesktop = useResponsive('up', 'lg');
  const user = useSelector((state) => state.auth?.user)

  useEffect(() => {
    if (isOpenSidebar) {
      onCloseSidebar();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  const renderContent = (
    <Scrollbar
      sx={{
        height: 1,
        '& .simplebar-content': { height: 1, display: 'flex', flexDirection: 'column' },
      }}
    >
      <Box sx={{ px: 2.5, py: 3, display: 'inline-flex', }}>
        <Logo sx={{zIndex: 10}} />
      </Box>

      {business ?
          <NavSection navConfig={navConfig.companySide} />
          :
          <>
            {user && <CompanySwitcher/>}


          <NavSection navConfig={navConfig.userSide} />

          <Box sx={{flexGrow: 1}} />
        </>
      }
    </Scrollbar>
  );

  return (
    <RootStyle>
      {!isDesktop && (
        <Drawer
          open={isOpenSidebar}
          onClose={onCloseSidebar}
          PaperProps={{
            sx: { width: DRAWER_WIDTH },
          }}
        >
          {renderContent}
        </Drawer>
      )}

      {isDesktop && (
        <Drawer
          open
          variant="persistent"
          PaperProps={{
            sx: {
              width: DRAWER_WIDTH,
              bgcolor: 'background.default',
              borderRightStyle: 'dashed',
            },
          }}
        >
          {renderContent}
        </Drawer>
      )}
    </RootStyle>
  );
}

function CompanySwitcher(props) {
  const user = useSelector((state) => state.auth?.user)
  const dispatch = useDispatch();
  const { switchBusiness } = bindActionCreators(businessActionCreators, dispatch);


  return (
      <Box sx={{mb: 5, mx: 2.5}} bgcolor={"#f1f1f1"} borderRadius={"10px"} padding={"5px"}>
        {user?.businessesRespondedTo.map((business) => {
          return (
            <div>
              <Stack direction={"row"}>
                <div style={{overflow: "hidden", borderRadius: "50%"}}>
                  <img src={business.logo} alt={"businessLogo"}/>
                </div>

              </Stack>
            </div>
          )
        })}
      </Box>
  );
}
