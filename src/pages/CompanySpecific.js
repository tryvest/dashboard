import { useEffect, useState, View } from 'react';
// material
import { useTheme } from '@mui/material/styles';
import {
  Avatar,
  CircularProgress,
  Grid,
  Container,
  Typography,
  Backdrop,
  Button,
  Card,
  Stack,
  CardHeader,
  CardContent,
  Box,
  Chip,
  SvgIcon,
  IconButton,
  Slider,
  Modal,
  Checkbox,
  Input,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  ListSubheader,
} from '@mui/material';
import ReactMarkdown from 'react-markdown';
import { bindActionCreators } from 'redux';
// components
import ReactReduxContext, { connect, useSelector, useStore } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { fShortenNumber, fCurrency, fPercent } from '../utils/formatNumber';
import Page from '../components/Page';
import { DarkLogo } from '../components/Logo';
import Divider from '../images/divider.png';
import { apiBusinesses } from '../utils/api/api-businesses';

import ACCOUNT from '../_mock/account';
import { apiTryvestors } from '../utils/api/api-tryvestors';
import LandingNav from './general/LandingNav';

const CompanySpecificPage = (props) => {
  const { nav, unauth } = props;
  const theme = useTheme();
  const businessID = useParams();
  const [businessInfo, setBusinessInfo] = useState();
  const [businessCampaignInfo, setBusinessCampaignInfo] = useState();
  const userObj = useSelector((state) => state.user.user);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalOpen2, setModalOpen2] = useState(false);
  const [categoryObj, setCategoryObj] = useState();
  const [confirmed, setConfirmed] = useState(false);
  const [invested, setInvested] = useState(false);
  const [enrolled, setEnrolled] = useState(false);
  const navigate = useNavigate();
  const [amountToInvest, setAmountToInvest] = useState(50);
  const [accountDetails, setAccountDetails] = useState(null);

  useEffect(() => {
    apiBusinesses.getMostRecentCampaignInfo(businessID.id).then((campaignInfoByID) => {
      setBusinessCampaignInfo(campaignInfoByID[0]);
    });
    apiBusinesses.getCompanyInfoByID(businessID.id).then((companyInfoByID) => {
      setBusinessInfo(companyInfoByID);
      apiBusinesses.getCategoryByName(companyInfoByID.categoryID).then((data) => {
        setCategoryObj(data);
      });
    });
  }, []);

  useEffect(() => {
    console.log('details got changed', accountDetails)
  }, [accountDetails])

  let additionalInfoMissing = false;
  let IDMissing = false;
  let bankingMissing = false;

  useEffect(() => {
    additionalInfoMissing =
      userObj?.data.address.streetAddress === 'None' || userObj?.data.address.streetAddress === null;
    IDMissing = userObj?.data.IDVerificationStatus !== 1;
    bankingMissing = userObj?.data.defaultItemID === 'None' || userObj?.data.defaultItemID === null;
    setInvested(userObj?.data.businessesInvestedIn[businessID.id] || false);
    if (userObj) {
      apiTryvestors.getActiveLoyaltiesByCategory(userObj?.uid).then((data) => {
        const catID = businessInfo?.categoryID;
        if (data[catID]) {
          setEnrolled(data[catID].businessID === businessID.id);
        }
      });
    }
  }, [userObj, businessInfo]);

  const handleOpen = () => setModalOpen(true);
  const handleClose = () => setModalOpen(false);

  const handleOpen2 = () => setModalOpen2(true);
  const handleClose2 = () => setModalOpen2(false);

  const style = {
    marginTop: '60px',
    marginInline: 'auto',
    width: '85%',
    bgcolor: theme.palette.primary.light,
    boxShadow: 24,
    p: 4,
  };

  const attemptChangingLoyalty = () => {
    const tryvestorID = userObj?.uid;
    const businessID = businessInfo.businessID;
    const categoryID = businessInfo.categoryID;
    apiTryvestors.changeLoyalty(tryvestorID, businessID, categoryID).then((_) => {
      handleClose();
      window.location.reload();
    });
  };

  const commitInvestment = () => {
    const tryvestorID = userObj?.uid;
    const businessID = businessInfo.businessID;
    apiTryvestors.commitInvestment(tryvestorID, businessID, amountToInvest, accountDetails.itemID, accountDetails.accountID).then((_) => {
      handleClose2();
      window.location.reload();
    });
  }

  const withdrawPendingInvestment = () => {
    const tryvestorID = userObj?.uid;
    const businessID = businessInfo.businessID;
    const campaignID = businessCampaignInfo.campaignID;
    apiTryvestors.withdrawPendingInvestment(tryvestorID, businessID, campaignID).then(() => {
      window.location.reload();
    });
  };

  return (
    <Page title="Company Specific Information">
      {nav && <LandingNav />}
      {businessInfo && businessCampaignInfo ? (
        <Container style={{ marginTop: '25px', paddingBottom: '25px' }}>
          <Grid container direction="row" style={{ alignItems: 'center', display: 'flex' }}>
            <div style={{ height: 60, width: 100, marginRight: '20px' }}>
              <DarkLogo />
            </div>
            <div style={{ height: 60, marginRight: '20px' }}>
              <img src={Divider} alt="Divider" />
            </div>
            <div style={{ height: 60, width: 150 }}>
              <img src={businessInfo.logo} alt="Company Logo" />
            </div>
          </Grid>
          <Stack alignItems={'center'} direction={'row'} justifyContent={'space-between'} style={{ padding: '10px' }}>
            <div style={{ marginTop: '20px' }}>
              <Typography fontSize={'40px'} fontWeight={'700'}>
                {businessInfo.name} Stock-Back Program
              </Typography>
              <Typography fontSize={'20px'} fontWeight={'500'} fontStyle={'italic'}>
                Receive equity for helping {businessInfo.name} grow
              </Typography>
            </div>
            {<Stack spacing={1}>
              {/* ! unauth ? (
                <Button
                  disabled={enrolled}
                  onClick={handleOpen}
                  style={{ borderRadius: '14px', padding: '10px', height: '50px', width: '200px', marginRight: '10px' }}
                  variant={'contained'}
                >
                  <SvgIcon>
                    <svg width="26" height="23" viewBox="0 0 26 23" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path
                        d="M24.1247 4.74792C21.2745 4.75123 18.5418 5.91426 16.5264 7.98186C14.5109 10.0495 13.3772 12.8528 13.374 15.7768V21.0762C13.3846 21.5793 13.5868 22.0582 13.9375 22.4103C14.2881 22.7623 14.7592 22.9594 15.2497 22.9594C15.7403 22.9594 16.2114 22.7623 16.562 22.4103C16.9126 22.0582 17.1149 21.5793 17.1255 21.0762V15.7768C17.1275 13.8731 17.8656 12.048 19.1778 10.7019C20.49 9.35574 22.269 8.59855 24.1247 8.59643C24.6152 8.58559 25.082 8.3781 25.4252 8.01841C25.7683 7.65872 25.9605 7.17546 25.9605 6.67218C25.9605 6.16889 25.7683 5.68563 25.4252 5.32594C25.082 4.96625 24.6152 4.75876 24.1247 4.74792"
                        fill="white"
                      />
                      <path
                        d="M23.4776 3.8485C23.9681 3.83767 24.4349 3.63017 24.7781 3.27049C25.1212 2.9108 25.3134 2.42754 25.3134 1.92425C25.3134 1.42097 25.1212 0.937703 24.7781 0.578016C24.4349 0.218329 23.9681 0.0108364 23.4776 5.45531e-07C21.5242 -0.000650693 19.5905 0.401907 17.7919 1.18371C15.9932 1.96551 14.3662 3.11058 13.0079 4.55075C11.6494 3.10625 10.0203 1.95848 8.21834 1.17644C6.41643 0.394392 4.47897 -0.00577231 2.52244 5.45531e-07C2.03196 0.0108364 1.56513 0.218329 1.22199 0.578016C0.878842 0.937703 0.68668 1.42097 0.68668 1.92425C0.68668 2.42754 0.878842 2.9108 1.22199 3.27049C1.56513 3.63017 2.03196 3.83767 2.52244 3.8485C4.07897 3.84363 5.61808 4.18444 7.03407 4.84753C8.45006 5.51061 9.70937 6.48026 10.7255 7.68987C10.5307 8.04679 10.35 8.41174 10.1836 8.78472C9.17651 7.52275 7.90876 6.506 6.47195 5.80789C5.03514 5.10978 3.46513 4.74775 1.87531 4.74794C1.38483 4.75878 0.918004 4.96627 0.574858 5.32596C0.231712 5.68565 0.0395508 6.16891 0.0395508 6.67219C0.0395508 7.17548 0.231712 7.65874 0.574858 8.01843C0.918004 8.37812 1.38483 8.58561 1.87531 8.59645C3.73054 8.59928 5.50896 9.35677 6.82056 10.7028C8.13217 12.0489 8.86989 13.8736 8.87196 15.7768V21.0762C8.88253 21.5794 9.08479 22.0583 9.4354 22.4103C9.78602 22.7623 10.2571 22.9595 10.7477 22.9595C11.2383 22.9595 11.7094 22.7623 12.06 22.4103C12.4106 22.0583 12.6128 21.5794 12.6234 21.0762V15.7768C12.6234 15.5859 12.6188 15.3961 12.6095 15.2075C12.6185 15.1323 12.6232 15.0566 12.6234 14.9809C12.6266 12.0289 13.7713 9.19889 15.8062 7.11181C17.8412 5.02472 20.6001 3.8511 23.4776 3.8485"
                        fill="white"
                      />
                    </svg>
                  </SvgIcon>
                  <Typography fontWeight={600} style={{ marginLeft: '8px', fontSize: '18px' }}>
                    {enrolled ? 'Already Enrolled' : 'Join Loyalty'}
                  </Typography>
                </Button>
              ) : (
                <Button
                  disabled={enrolled}
                  onClick={() => navigate('/tryvestor/login')}
                  style={{ borderRadius: '14px', padding: '10px', height: '50px', width: '200px', marginRight: '10px' }}
                  variant={'contained'}
                >
                  <SvgIcon>
                    <svg width="26" height="23" viewBox="0 0 26 23" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path
                        d="M24.1247 4.74792C21.2745 4.75123 18.5418 5.91426 16.5264 7.98186C14.5109 10.0495 13.3772 12.8528 13.374 15.7768V21.0762C13.3846 21.5793 13.5868 22.0582 13.9375 22.4103C14.2881 22.7623 14.7592 22.9594 15.2497 22.9594C15.7403 22.9594 16.2114 22.7623 16.562 22.4103C16.9126 22.0582 17.1149 21.5793 17.1255 21.0762V15.7768C17.1275 13.8731 17.8656 12.048 19.1778 10.7019C20.49 9.35574 22.269 8.59855 24.1247 8.59643C24.6152 8.58559 25.082 8.3781 25.4252 8.01841C25.7683 7.65872 25.9605 7.17546 25.9605 6.67218C25.9605 6.16889 25.7683 5.68563 25.4252 5.32594C25.082 4.96625 24.6152 4.75876 24.1247 4.74792"
                        fill="white"
                      />
                      <path
                        d="M23.4776 3.8485C23.9681 3.83767 24.4349 3.63017 24.7781 3.27049C25.1212 2.9108 25.3134 2.42754 25.3134 1.92425C25.3134 1.42097 25.1212 0.937703 24.7781 0.578016C24.4349 0.218329 23.9681 0.0108364 23.4776 5.45531e-07C21.5242 -0.000650693 19.5905 0.401907 17.7919 1.18371C15.9932 1.96551 14.3662 3.11058 13.0079 4.55075C11.6494 3.10625 10.0203 1.95848 8.21834 1.17644C6.41643 0.394392 4.47897 -0.00577231 2.52244 5.45531e-07C2.03196 0.0108364 1.56513 0.218329 1.22199 0.578016C0.878842 0.937703 0.68668 1.42097 0.68668 1.92425C0.68668 2.42754 0.878842 2.9108 1.22199 3.27049C1.56513 3.63017 2.03196 3.83767 2.52244 3.8485C4.07897 3.84363 5.61808 4.18444 7.03407 4.84753C8.45006 5.51061 9.70937 6.48026 10.7255 7.68987C10.5307 8.04679 10.35 8.41174 10.1836 8.78472C9.17651 7.52275 7.90876 6.506 6.47195 5.80789C5.03514 5.10978 3.46513 4.74775 1.87531 4.74794C1.38483 4.75878 0.918004 4.96627 0.574858 5.32596C0.231712 5.68565 0.0395508 6.16891 0.0395508 6.67219C0.0395508 7.17548 0.231712 7.65874 0.574858 8.01843C0.918004 8.37812 1.38483 8.58561 1.87531 8.59645C3.73054 8.59928 5.50896 9.35677 6.82056 10.7028C8.13217 12.0489 8.86989 13.8736 8.87196 15.7768V21.0762C8.88253 21.5794 9.08479 22.0583 9.4354 22.4103C9.78602 22.7623 10.2571 22.9595 10.7477 22.9595C11.2383 22.9595 11.7094 22.7623 12.06 22.4103C12.4106 22.0583 12.6128 21.5794 12.6234 21.0762V15.7768C12.6234 15.5859 12.6188 15.3961 12.6095 15.2075C12.6185 15.1323 12.6232 15.0566 12.6234 14.9809C12.6266 12.0289 13.7713 9.19889 15.8062 7.11181C17.8412 5.02472 20.6001 3.8511 23.4776 3.8485"
                        fill="white"
                      />
                    </svg>
                  </SvgIcon>
                  <Typography fontWeight={600} style={{ marginLeft: '8px', fontSize: '18px' }}>
                    Sign In to Invest
                  </Typography>
                </Button>
              ) */}
              {!unauth ? (
                <Button
                  onClick={handleOpen2}
                  style={{ borderRadius: '14px', padding: '10px', height: '50px', width: '200px', marginRight: '10px' }}
                  variant={'contained'}
                  color={'secondary'}
                >
                  <SvgIcon>
                    <svg width="26" height="23" viewBox="0 0 26 23" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path
                        d="M24.1247 4.74792C21.2745 4.75123 18.5418 5.91426 16.5264 7.98186C14.5109 10.0495 13.3772 12.8528 13.374 15.7768V21.0762C13.3846 21.5793 13.5868 22.0582 13.9375 22.4103C14.2881 22.7623 14.7592 22.9594 15.2497 22.9594C15.7403 22.9594 16.2114 22.7623 16.562 22.4103C16.9126 22.0582 17.1149 21.5793 17.1255 21.0762V15.7768C17.1275 13.8731 17.8656 12.048 19.1778 10.7019C20.49 9.35574 22.269 8.59855 24.1247 8.59643C24.6152 8.58559 25.082 8.3781 25.4252 8.01841C25.7683 7.65872 25.9605 7.17546 25.9605 6.67218C25.9605 6.16889 25.7683 5.68563 25.4252 5.32594C25.082 4.96625 24.6152 4.75876 24.1247 4.74792"
                        fill="white"
                      />
                      <path
                        d="M23.4776 3.8485C23.9681 3.83767 24.4349 3.63017 24.7781 3.27049C25.1212 2.9108 25.3134 2.42754 25.3134 1.92425C25.3134 1.42097 25.1212 0.937703 24.7781 0.578016C24.4349 0.218329 23.9681 0.0108364 23.4776 5.45531e-07C21.5242 -0.000650693 19.5905 0.401907 17.7919 1.18371C15.9932 1.96551 14.3662 3.11058 13.0079 4.55075C11.6494 3.10625 10.0203 1.95848 8.21834 1.17644C6.41643 0.394392 4.47897 -0.00577231 2.52244 5.45531e-07C2.03196 0.0108364 1.56513 0.218329 1.22199 0.578016C0.878842 0.937703 0.68668 1.42097 0.68668 1.92425C0.68668 2.42754 0.878842 2.9108 1.22199 3.27049C1.56513 3.63017 2.03196 3.83767 2.52244 3.8485C4.07897 3.84363 5.61808 4.18444 7.03407 4.84753C8.45006 5.51061 9.70937 6.48026 10.7255 7.68987C10.5307 8.04679 10.35 8.41174 10.1836 8.78472C9.17651 7.52275 7.90876 6.506 6.47195 5.80789C5.03514 5.10978 3.46513 4.74775 1.87531 4.74794C1.38483 4.75878 0.918004 4.96627 0.574858 5.32596C0.231712 5.68565 0.0395508 6.16891 0.0395508 6.67219C0.0395508 7.17548 0.231712 7.65874 0.574858 8.01843C0.918004 8.37812 1.38483 8.58561 1.87531 8.59645C3.73054 8.59928 5.50896 9.35677 6.82056 10.7028C8.13217 12.0489 8.86989 13.8736 8.87196 15.7768V21.0762C8.88253 21.5794 9.08479 22.0583 9.4354 22.4103C9.78602 22.7623 10.2571 22.9595 10.7477 22.9595C11.2383 22.9595 11.7094 22.7623 12.06 22.4103C12.4106 22.0583 12.6128 21.5794 12.6234 21.0762V15.7768C12.6234 15.5859 12.6188 15.3961 12.6095 15.2075C12.6185 15.1323 12.6232 15.0566 12.6234 14.9809C12.6266 12.0289 13.7713 9.19889 15.8062 7.11181C17.8412 5.02472 20.6001 3.8511 23.4776 3.8485"
                        fill="white"
                      />
                    </svg>
                  </SvgIcon>
                  <Typography fontWeight={600} style={{ marginLeft: '8px', fontSize: '18px' }}>
                    {'Invest Capital'}
                  </Typography>
                </Button>
              ) : (
                <Button
                  disabled={enrolled}
                  onClick={() => navigate('/tryvestor/login')}
                  style={{ borderRadius: '14px', padding: '10px', height: '50px', width: '200px', marginRight: '10px' }}
                  variant={'contained'}
                  color={'secondary'}
                >
                  <SvgIcon>
                    <svg width="26" height="23" viewBox="0 0 26 23" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path
                        d="M24.1247 4.74792C21.2745 4.75123 18.5418 5.91426 16.5264 7.98186C14.5109 10.0495 13.3772 12.8528 13.374 15.7768V21.0762C13.3846 21.5793 13.5868 22.0582 13.9375 22.4103C14.2881 22.7623 14.7592 22.9594 15.2497 22.9594C15.7403 22.9594 16.2114 22.7623 16.562 22.4103C16.9126 22.0582 17.1149 21.5793 17.1255 21.0762V15.7768C17.1275 13.8731 17.8656 12.048 19.1778 10.7019C20.49 9.35574 22.269 8.59855 24.1247 8.59643C24.6152 8.58559 25.082 8.3781 25.4252 8.01841C25.7683 7.65872 25.9605 7.17546 25.9605 6.67218C25.9605 6.16889 25.7683 5.68563 25.4252 5.32594C25.082 4.96625 24.6152 4.75876 24.1247 4.74792"
                        fill="white"
                      />
                      <path
                        d="M23.4776 3.8485C23.9681 3.83767 24.4349 3.63017 24.7781 3.27049C25.1212 2.9108 25.3134 2.42754 25.3134 1.92425C25.3134 1.42097 25.1212 0.937703 24.7781 0.578016C24.4349 0.218329 23.9681 0.0108364 23.4776 5.45531e-07C21.5242 -0.000650693 19.5905 0.401907 17.7919 1.18371C15.9932 1.96551 14.3662 3.11058 13.0079 4.55075C11.6494 3.10625 10.0203 1.95848 8.21834 1.17644C6.41643 0.394392 4.47897 -0.00577231 2.52244 5.45531e-07C2.03196 0.0108364 1.56513 0.218329 1.22199 0.578016C0.878842 0.937703 0.68668 1.42097 0.68668 1.92425C0.68668 2.42754 0.878842 2.9108 1.22199 3.27049C1.56513 3.63017 2.03196 3.83767 2.52244 3.8485C4.07897 3.84363 5.61808 4.18444 7.03407 4.84753C8.45006 5.51061 9.70937 6.48026 10.7255 7.68987C10.5307 8.04679 10.35 8.41174 10.1836 8.78472C9.17651 7.52275 7.90876 6.506 6.47195 5.80789C5.03514 5.10978 3.46513 4.74775 1.87531 4.74794C1.38483 4.75878 0.918004 4.96627 0.574858 5.32596C0.231712 5.68565 0.0395508 6.16891 0.0395508 6.67219C0.0395508 7.17548 0.231712 7.65874 0.574858 8.01843C0.918004 8.37812 1.38483 8.58561 1.87531 8.59645C3.73054 8.59928 5.50896 9.35677 6.82056 10.7028C8.13217 12.0489 8.86989 13.8736 8.87196 15.7768V21.0762C8.88253 21.5794 9.08479 22.0583 9.4354 22.4103C9.78602 22.7623 10.2571 22.9595 10.7477 22.9595C11.2383 22.9595 11.7094 22.7623 12.06 22.4103C12.4106 22.0583 12.6128 21.5794 12.6234 21.0762V15.7768C12.6234 15.5859 12.6188 15.3961 12.6095 15.2075C12.6185 15.1323 12.6232 15.0566 12.6234 14.9809C12.6266 12.0289 13.7713 9.19889 15.8062 7.11181C17.8412 5.02472 20.6001 3.8511 23.4776 3.8485"
                        fill="white"
                      />
                    </svg>
                  </SvgIcon>
                  <Typography fontWeight={600} style={{ marginLeft: '8px', fontSize: '18px' }}>
                    Sign In to Invest
                  </Typography>
                </Button>
              )}
            </Stack>}
          </Stack>
          <Grid container spacing={1} style={{ marginTop: '15px' }}>
            <Grid item xs={12} sm={12} md={9}>
              <Stack spacing={2}>
                {/* {enrolled ? (
                  <Card style={{ backgroundColor: theme.palette.primary.dark }}>
                    <CardContent>
                      <div>
                        <Stack direction={'row'} justifyContent={'space-between'}>
                          <Typography fontSize={'28px'} fontWeight={'600'} color={'#fff'}>
                            You're Enrolled in {businessInfo.name} Loyalty
                          </Typography>
                          <Typography fontSize={'32px'} fontWeight={'700'} color={'#04D49C'}>
                            {fPercent(businessCampaignInfo.stockBackPercent * 100)}
                          </Typography>
                        </Stack>
                        <Typography fontSize={'16px'} fontWeight={'400'} color={'#fff'} fontStyle="italic">
                          When you make purchases at {businessInfo.name}, you can earn money while you help it grow
                        </Typography>
                      </div>
                    </CardContent>
                  </Card>
                ) : (
                  <Card style={{ backgroundColor: theme.palette.primary.dark }}>
                    <CardContent>
                      <Stack spacing={1}>
                        <div style={{ marginBottom: '45px' }}>
                          <Typography fontSize={'28px'} fontWeight={'600'} color={'#fff'}>
                            Your Potential Stake in {businessInfo.name}
                          </Typography>
                          <Typography fontSize={'16px'} fontWeight={'400'} color={'#fff'} fontStyle="italic">
                            As a part of {businessInfo.name}, you can earn money while you help it grow
                          </Typography>
                          <Typography fontSize={'64px'} fontWeight={'700'} color={'#04D49C'}>
                            {fPercent(businessCampaignInfo.stockBackPercent * 100)}
                          </Typography>
                          <Typography fontSize={'24px'} fontWeight={'500'} color={'#fff'} fontStyle="italic">
                            stock-back in {businessInfo.name} for each {businessInfo.name} purchase
                          </Typography>
                        </div>
                      </Stack>
                    </CardContent>
                  </Card>
                )} */}
                <Card style={{ backgroundColor: theme.palette.primary.dark }}>
                  <CardContent>
                    <Stack spacing={1}>
                      <div style={{ marginBottom: '15px' }}>
                        <Typography fontSize={'28px'} fontWeight={'600'} color={'#fff'}>
                          Your Stake in {businessInfo.name}
                        </Typography>
                        <Typography fontSize={'16px'} fontWeight={'400'} color={'#fff'} fontStyle="italic">
                          Here's how much money you have invested in and earned cashback for in {businessInfo.name}.
                        </Typography>
                      </div>
                      <Grid container spacing={1}>
{/*                        <Grid item>
                          <Card
                            style={{
                              padding: '10px',
                              backgroundColor: theme.palette.primary.dark,
                              border: `2px ${theme.palette.primary.main}`,
                              borderRadius: '0px',
                              color: 'white',
                            }}
                          >
                            <Typography>Amount Spent</Typography>
                            <Typography color={theme.palette.primary.main}>
                              {fCurrency(invested.amountSpent)}
                            </Typography>
                          </Card>
                        </Grid>
                        <Grid item>
                          <Card
                            style={{
                              padding: '10px',
                              backgroundColor: theme.palette.primary.dark,
                              border: `2px ${theme.palette.primary.main}`,
                              borderRadius: '0px',
                              color: 'white',
                            }}
                          >
                            <Typography>Cashback Earned</Typography>
                            <Typography color={theme.palette.primary.main}>
                              {fCurrency(invested.amountEquityEarned)}
                            </Typography>
                          </Card>
                        </Grid> */}
                        <Grid item>
                          <Card
                            style={{
                              padding: '10px',
                              backgroundColor: theme.palette.primary.dark,
                              border: `2px ${theme.palette.primary.main}`,
                              borderRadius: '0px',
                              color: 'white',
                            }}
                          >
                            <Typography>Pending Investment</Typography>
                            <Typography color={theme.palette.primary.main}>
                              {fCurrency(invested.amountEquityPendingInvestment)}
                            </Typography>
                          </Card>
                        </Grid>
                        <Grid item>
                          <Card
                            style={{
                              padding: '10px',
                              backgroundColor: theme.palette.primary.dark,
                              border: `2px ${theme.palette.primary.main}`,
                              borderRadius: '0px',
                              color: 'white',
                            }}
                          >
                            <Typography>Withdrawn Cash</Typography>
                            <Typography color={theme.palette.primary.main}>
                              {fCurrency(invested.amountEquityWithdrawn)}
                            </Typography>
                          </Card>
                        </Grid>
                      </Grid>
                      <Stack justifyContent={'space-between'} alignItems={'center'} color={'white'} direction={'row'}>
                        <Stack>
                          <Typography>Current Campaign Ends On:</Typography>
                          <Typography color={'lightgrey'}>{`${new Date(businessCampaignInfo?.endDate)}`}</Typography>
                          <Typography>You can withdraw your investment up until 48 hours before then.</Typography>
                        </Stack>
                        <Button onClick={withdrawPendingInvestment} variant={'contained'}>
                          Withdraw Pending Investment
                        </Button>
                      </Stack>
                    </Stack>
                  </CardContent>
                </Card>
              </Stack>
              <div style={{ marginTop: '25px', marginLeft: '5px' }}>
                <Typography fontWeight={700} fontSize={20} color={'black'}>
                  Information regarding {businessInfo.name}
                </Typography>
              </div>
              <div style={{ marginTop: '5px', marginLeft: '5px' }}>
                <Typography fontWeight={500} fontSize={15} color={'black'}>
                   {businessInfo.additionalInformation}
                  {'For real companies, here we will provide company details including but not limited to: ' +
                    'Major updates & accomplishments, Pitch deck (problem, solution, traction, customers, business model, market, competitors, founders, etc.)'}
                </Typography>
              </div>
            </Grid>
            <Grid item xs={12} sm={12} md={3}>
              <Stack spacing={3}>
                <Card style={{ padding: '25px', marginLeft: '20px', backgroundColor: theme.palette.primary.dark }}>
                  <Stack>
                    <Typography fontWeight={600} fontSize={18} color={'white'}>
                      Company-Specified Requirements
                    </Typography>
                    <Typography fontWeight={500} fontSize={16} color={'lightgrey'}>
                      {businessInfo.tryvestorRequirements}
                    </Typography>
                  </Stack>
                </Card>
                <Card style={{ marginTop: '25px', marginLeft: '20px', padding: '25px' }}>
                  <Stack spacing={1}>
                    <Typography fontWeight={600} fontSize={24}>
                      Financial Disclosures
                    </Typography>
                    {/*                    <Stack>
                      <Typography fontWeight={800} fontSize={16}>
                        Valuation:
                      </Typography>
                      <Typography fontWeight={400} fontSize={15}>
                        {fCurrency(businessInfo.valuation)}
                      </Typography>
                    </Stack>
                    <Stack>
                      <Typography fontWeight={800} fontSize={16}>
                        Amount Raised:
                      </Typography>
                      <Typography fontWeight={400} fontSize={15}>
                        {fCurrency(businessInfo.amountRaised)}
                      </Typography>
                    </Stack>
                    <Stack>
                      <Typography fontWeight={800} fontSize={16}>
                        Current Investors:
                      </Typography>
                      {businessInfo.currentInvestors}
                    </Stack> */}
                    {
                      'Here we will have information about company finances including but not limited to: valuation cap, max stock-back reward, security type (usually Crowd SAFE)'
                    }
                  </Stack>
                </Card>
                <Card style={{ marginTop: '25px', marginLeft: '20px', padding: '25px' }}>
                  <Stack spacing={1}>
                    <Typography fontWeight={600} fontSize={24}>
                      Additional Documents
                    </Typography>
                    {
                      "Here we will have PDFs of the participating company's (including but not limited to): Form C, Crowd SAFE, additional company-specific disclosures and risks"
                    }
                  </Stack>
                </Card>
              </Stack>
            </Grid>
          </Grid>
          <Modal
            style={{ margin: 'auto' }}
            open={modalOpen}
            onClose={handleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
          >
            <Card sx={style}>
              <ReactMarkdown>
                {'#### Disclosures\n' +
                  '- I understand that I can cancel my investment up until 48 hours prior to the deal deadline.\n' +
                  '- I understand I will not have voting rights and will grant a third-party nominee broad authority to act on my behalf.\n' +
                  '- I understand I may never become an equity holder, only a beneficial owner of equity interest in the Company.\n' +
                  '- I understand that investing this amount into several deals would better diversify my risk\n' +
                  '- I understand that there is no guarantee of a relationship between Tryvest and the company post-offering\n' +
                  '- I consent to electronic delivery of all documents, notices and agreements as related to my investment\n' +
                  '- I understand my investment won’t be transferable for 12 months and may not have a market for resale\n' +
                  '- I have read the Terms of Service, Privacy Policy, and agree to both of them including arbitration provisions\n' +
                  "- I understand this investment is risky and that I shouldn't invest unless I can afford to lose all invested funds\n" +
                  '- I have read the education materials that Tryvest provides\n' +
                  '- I understand I am responsible for all fees and charges associated with the use of my payment method\n' +
                  '- I understand that Tryvest will receive cash based on the number and size of purchases that you make\n' +
                  '- I confirm that this investment, together with all my other Regulation Crowdfunding investments during the past 12 months on any crowdfunding portal, does not exceed my investment limit'}
              </ReactMarkdown>
              <Typography variant={'h6'}>Confirmation</Typography>
              <Stack direction={'row'} style={{ alignItems: 'center' }}>
                <Checkbox checked={confirmed} onChange={(event) => setConfirmed(event.target.checked)} />
                <Typography onClick={() => setConfirmed(!confirmed)}>
                  I confirm that I have read and agree to all disclosures above and want "{businessInfo?.name}" to be my
                  company of choice for the "{categoryObj?.categoryName}" category.
                </Typography>
              </Stack>
              <div style={{ display: 'flex', justifyContent: 'end' }}>
                <Button
                  onClick={attemptChangingLoyalty}
                  fullWidth
                  size={'large'}
                  disabled={!confirmed || IDMissing}
                  variant={'contained'}
                  style={{ marginY: '10px', marginInline: 'auto' }}
                >
                  Join Program
                </Button>
              </div>
              {additionalInfoMissing && (
                <Typography color={'red'} fontSize={10} fontStyle={'italic'}>
                  {'You must provide additional information on your dashboard before you can invest.'}
                </Typography>
              )}
              {IDMissing && (
                <Typography color={'red'} fontSize={10} fontStyle={'italic'}>
                  {'You must complete identity verification on your dashboard before you can invest.'}
                </Typography>
              )}
              {bankingMissing && (
                <Typography color={'red'} fontSize={10} fontStyle={'italic'}>
                  {'You must add a bank account and select a default bank and account before you can invest.'}
                </Typography>
              )}
            </Card>
          </Modal>
          {/* Investment Modal Below */}
          <Modal
            style={{ margin: 'auto' }}
            open={modalOpen2}
            onClose={handleClose2}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
          >
            <Card sx={style}>
              <Stack spacing={1}>
                <Typography variant={'h6'}>Investment Details</Typography>
                <div>
                  <Typography>Amount to Invest</Typography>
                  <Input defaultValue={amountToInvest} onChange={(event) => setAmountToInvest(event.target.value)} />
                </div>
                <BankAccountSelector tryvestorID={userObj?.uid} setAccountDetails={setAccountDetails}/>
              </Stack>
              <ReactMarkdown>
                {'#### Disclosures\n' +
                  '- I understand that I can cancel my investment up until 48 hours prior to the deal deadline.\n' +
                  '- I understand I will not have voting rights and will grant a third-party nominee broad authority to act on my behalf.\n' +
                  '- I understand I may never become an equity holder, only a beneficial owner of equity interest in the Company.\n' +
                  '- I understand that investing this amount into several deals would better diversify my risk\n' +
                  '- I understand that there is no guarantee of a relationship between Tryvest and the company post-offering\n' +
                  '- I consent to electronic delivery of all documents, notices and agreements as related to my investment\n' +
                  '- I understand my investment won’t be transferable for 12 months and may not have a market for resale\n' +
                  '- I have read the Terms of Service, Privacy Policy, and agree to both of them including arbitration provisions\n' +
                  "- I understand this investment is risky and that I shouldn't invest unless I can afford to lose all invested funds\n" +
                  '- I have read the education materials that Tryvest provides\n' +
                  '- I understand I am responsible for all fees and charges associated with the use of my payment method\n' +
                  '- I understand that Tryvest will receive cash based on the number and size of purchases that you make\n' +
                  '- I confirm that this investment, together with all my other Regulation Crowdfunding investments during the past 12 months on any crowdfunding portal, does not exceed my investment limit'}
              </ReactMarkdown>
              <Typography variant={'h6'}>Confirmation</Typography>
              <Stack direction={'row'} style={{ alignItems: 'center' }}>
                <Checkbox checked={confirmed} onChange={(event) => setConfirmed(event.target.checked)} />
                <Typography onClick={() => setConfirmed(!confirmed)}>
                  I confirm that I have read and agree to all disclosures above and want to invest the above amount into
                  "{businessInfo?.name}".
                </Typography>
              </Stack>
              <div style={{ display: 'flex', justifyContent: 'end' }}>
                <Button
                  onClick={commitInvestment}
                  fullWidth
                  size={'large'}
                  disabled={!confirmed || IDMissing || !accountDetails}
                  variant={'contained'}
                  style={{ marginY: '10px', marginInline: 'auto' }}
                >
                  Commitment Investment
                </Button>
              </div>
              {additionalInfoMissing && (
                <Typography color={'red'} fontSize={10} fontStyle={'italic'}>
                  {'You must provide additional information on your dashboard before you can invest.'}
                </Typography>
              )}
              {IDMissing && (
                <Typography color={'red'} fontSize={10} fontStyle={'italic'}>
                  {'You must complete identity verification on your dashboard before you can invest.'}
                </Typography>
              )}
              {bankingMissing && (
                <Typography color={'red'} fontSize={10} fontStyle={'italic'}>
                  {'You must add a bank account and select a default bank and account before you can invest.'}
                </Typography>
              )}
            </Card>
          </Modal>
        </Container>
      ) : (
        <CircularProgress />
      )}
    </Page>
  );
};

const BankAccountSelector = (props) => {
  const [selectedAcctIndex, setSelectedAcctIndex] = useState();
  const [allAccounts, setAllAccounts] = useState();
  const { tryvestorID, setAccountDetails } = props;

  useEffect(() => {
    apiTryvestors.getUserItems(tryvestorID).then((data) => {
      let tempAccounts = [];
      for (let i = 0; i < data.length; i += 1) {
        const userItem = data[i];
        if (userItem.itemIsActive) {
          const accountIDs = userItem.userAccountIDs.reduce((result, acct) => {
            if (acct.accountIsActive) {
              result.push({
                itemID: userItem.userItemID,
                accountID: acct.plaidAccountID,
                accountMask: acct.plaidAccountMask,
              });
            }
            return result;
          }, []);
          console.log(accountIDs)
          tempAccounts = tempAccounts.concat(accountIDs)
        }
      }
      setAllAccounts(tempAccounts);
    });
  }, []);

  const handleChange = (event) => {
    setSelectedAcctIndex(event.target.value);
    setAccountDetails(allAccounts[event.target.value])
  };

  return (
    <div>
      {allAccounts && allAccounts.length > 0 ? (
        <FormControl style={{ width: '200px' }}>
          <InputLabel>Select Bank Account</InputLabel>
          <Select label={'Select Bank Account'} value={selectedAcctIndex} onChange={handleChange}>
            {allAccounts?.map((userAccount, index) => {
              return (
                <MenuItem style={{ color: 'black' }} value={index}>
                  {userAccount?.accountMask}
                </MenuItem>
              );
            })}
          </Select>
        </FormControl>
      ) : (
        <Typography>Please connect a bank account on the banking page!</Typography>
      )}
    </div>
  );
};

export default CompanySpecificPage;
