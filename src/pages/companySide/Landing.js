import React from 'react';
import Button from "@mui/material/Button";
import {Link as RouterLink, useNavigate} from "react-router-dom";
import Box from "@mui/material/Box";
import {AppBar, Backdrop, CircularProgress, Container, Link, Typography} from "@mui/material";
import {alpha, styled} from "@mui/material/styles";
import Page from "../../components/Page";

import useResponsive from "../../hooks/useResponsive";


const DRAWER_WIDTH = 280;
const APPBAR_MOBILE = 64;
const APPBAR_DESKTOP = 92;

const RootStyle = styled(AppBar)(({ theme }) => ({
  boxShadow: 'none',
  backdropFilter: 'blur(6px)',
  WebkitBackdropFilter: 'blur(6px)', // Fix on Mobile
  backgroundColor: alpha(theme.palette.background.default, 0.72),
  overflowY: 'scroll',
  [theme.breakpoints.up('lg')]: {
    width: `calc(100% - ${DRAWER_WIDTH + 1}px)`,
  },
}));

const HeaderStyle = styled('header')(({ theme }) => ({
  top: 0,
  zIndex: 9,
  lineHeight: 0,
  width: '100%',
  display: 'flex',
  alignItems: 'center',
  position: 'absolute',
  padding: theme.spacing(3),
  justifyContent: 'space-between',
  [theme.breakpoints.up('md')]: {
    alignItems: 'flex-start',
    padding: theme.spacing(7, 5, 0, 7),
  },
}));

const ContentStyle = styled('div')(({ theme }) => ({
  maxWidth: 480,
  margin: 'auto',
  minHeight: '100vh',
  display: 'flex',
  justifyContent: 'center',
  flexDirection: 'column',
  overflow: 'scroll',
  padding: theme.spacing(12, 0),
}));


function Landing() {

  const smUp = useResponsive('up', 'sm');

  const mdUp = useResponsive('up', 'md');

  const [spinner, setSpinner] = React.useState(true)

  const navigate = useNavigate()
  const handleClick = () => {
    navigate('/business/app')
  }


  return (
      <Page title="Landing">
          <Container maxWidth="sm" sx={{overflow: 'scroll'}}>
            <ContentStyle>
                <Backdrop
                    sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                    open={spinner}
                >
                  <CircularProgress color="inherit" />
                </Backdrop>

                <iframe title='Form' className="airtable-embed airtable-dynamic-height" onLoad={() => setSpinner(false)}
                        src="https://airtable.com/embed/shrTxWeRwlAxyBwQ2?backgroundColor=cyan" frameBorder="0"
                        width="100%" height="1155.005682" style={{background: 'transparent', border: '1px solid #ccc'}} />

                <Button  sx={{margin: '50px'}} variant='contained' size='large' disableElevation
                         color='secondary' onClick={handleClick}>
                  Go to Dashboard
                </Button>
            </ContentStyle>
          </Container>
      </Page>

  );
}

export default Landing;