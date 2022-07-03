import PropTypes from 'prop-types';
import {useEffect, useState} from 'react';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import {bindActionCreators} from "redux";// material
import { styled } from '@mui/material/styles';
import {
  Box,
  Link,
  Button,
  Drawer,
  Typography,
  Avatar,
  Stack,
  Select,
  MenuItem,
  CircularProgress,
  useTheme
} from '@mui/material';

// mock
import {useSelector, useDispatch} from "react-redux";
import {useWhatChanged} from "@simbathesailor/use-what-changed";
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
import {apiTryvestors} from "../../utils/api/api-tryvestors";

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
  isBusiness: PropTypes.bool,
  isOpenSidebar: PropTypes.bool,
  onCloseSidebar: PropTypes.func,
};

export default function DashboardSidebar({ isBusiness, isOpenSidebar, onCloseSidebar }) {
  const { pathname } = useLocation();

  const isDesktop = useResponsive('up', 'lg');
  const user = useSelector((state) => state.auth?.user)
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
          <Logo sx={{zIndex: 10}} />
      </div>

      {isBusiness ?
          <NavSection navConfig={navConfig.businessSide} />
          :
          <>
          {user && <div style={{paddingInline: "5px"}}><CompanySwitcher user={user}/></div>}
          <NavSection navConfig={navConfig.userSide} />
          <Box sx={{flexGrow: 1}} />
        </>
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
          variant={!isDesktop ? "temporary" : "persistent"}
          open={!isDesktop ? isOpenSidebar : true}
          onClose={!isDesktop ? onCloseSidebar : () => {}}
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

CompanySwitcher.propTypes = {
  user: PropTypes.object,
};

function CompanySwitcher({user}) {
  const dispatchBus = useDispatch();
  const [selectedBusinessID, setSelectedBusinessID] = useState()
  const businessID = useSelector(state => state.business.businessID)
  const { switchBusiness } = bindActionCreators(businessActionCreators, dispatchBus);

  const style = "MuiListItemIcon-root css-121b4uz-MuiListItemIcon-root"

  const style2 = 1

  // const activeStyleOuter = "MuiListItemButton-root MuiButtonBase-root css-2hw4ur-MuiButtonBase-root-MuiListItemButton-root active"
  // const inactiveStyleOuter = "MuiListItemButton-root MuiButtonBase-root css-dbbdxt-MuiButtonBase-root-MuiListItemButton-root"

  const inactiveStyleOuter = "a.css-dbbdxt-MuiButtonBase-root-MuiListItemButton-root"
  const activeStyleOuter = "a.css-dbbdxt-MuiButtonBase-root-MuiListItemButton-root active"

  const pictureStyle = {
    borderRadius: "50%"
  }

  const handleChange = (event) => {
    const businessID = event.target.value
    console.log(businessID)
    setSelectedBusinessID(businessID);
    switchBusiness(businessID)
  };



  const theme = useTheme()

  useEffect(() => {
    if(businessID){
      setSelectedBusinessID(businessID)
      return
    }
    if(user && user.businessesRespondedTo.length > 0){
      const selectedBusIDTemp = user.businessesRespondedTo[0].businessID
      setSelectedBusinessID(selectedBusIDTemp)
      switchBusiness(selectedBusIDTemp)
    }
  }, [user])

  return (
      selectedBusinessID ?
      <Box borderRadius={"10px"} padding={"5px"}>
        <Select
          value={selectedBusinessID}
          onChange={handleChange}
          sx={{maxWidth: "100%", width: "100%"}}
          defaultValue={selectedBusinessID}
        >
          {user?.businessesRespondedTo.map((business, index) => {
            return (
                <MenuItem style={{maxWidth: "100%"}} value={business.businessID} key={index}>
                  <div style={{overflow: 'hidden'}}>
                    <Stack display={"flex"} alignItems={"center"} direction={"row"} spacing={1}>
                      <div style={{overflow: "hidden", borderRadius: "50%", height: "5vh", width:"5vh", display: "inline"}}>
                        <img src={business.logo} alt={"businessLogo"}/>
                      </div>
                      <Typography fontSize={"medium"} fontWeight={"900"} color={"#f1f1f1"}>
                        {business.name.charAt(0).toUpperCase() + business.name.slice(1)}
                      </Typography>
                    </Stack>
                  </div>
                </MenuItem>
            )
          })}
        </Select>
      </Box> :
      <div style={{display: "flex", justifyContent: 'center', alignItems: 'center'}}>
        <CircularProgress/>
      </div>
  );
}
/*
(
            <div>
              <Stack direction={"row"}>
                <div style={{overflow: "hidden", borderRadius: "50%", height: "vh", width:"5vh", display: "inline"}}>
                  <img src={business.logo} alt={"businessLogo"}/>
                </div>
              </Stack>
            </div>
        )
 */
