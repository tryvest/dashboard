import React, {useEffect, useState} from 'react'
import {useParams} from 'react-router-dom';
// material
import {
  Grid,
  Button,
  Container,
  Stack,
  Typography,
  Card,
  CardContent,
  Modal,
  Backdrop,
  Fade,
  CircularProgress
} from '@mui/material';
// components
import {CopyToClipboard} from 'react-copy-to-clipboard';
import Page from '../components/Page';

import COMPANIES from '../_mock/companies'
import {apiBusinesses} from "../utils/api/api-businesses";



// ----------------------------------------------------------------------



const ModalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};



// ----------------------------------------------------------------------

export default function Company() {

  const { id } = useParams()

  console.log(id)

  // const company = COMPANIES.find((c) => c.id ===  id)
  // const {name, description, funding, colors, status, cover } = company

  const [openReferralModal, setOpenReferralModal] = useState(false)

  const [textToCopy, setTextToCopy] = useState('https://tryvest.us/referral/company?#referrer=pablo')

  const [company, setCompany] = useState()
  const [companyLoaded, setCompanyLoaded] = useState(false)

  useEffect( () => {

    const response = apiBusinesses.getSingle(id).then(data => {
      console.log(data);
      setCompany(data);
      setCompanyLoaded(true)
    });
  }, []);

  return (
      <Page title="Dashboard: Company">
        <Container>

          <Grid container spacing={3}>

            <Grid item xs={12} sm={12} md={12}>
              <Card sx={{ position: 'relative',  width: '100%', height: '100%'}}>
                {companyLoaded ? (
                  <CardContent
                      sx={{
                        pt: 4,
                        height: 500,
                        justifyContent: "space-between"
                      }}
                  >
                    <Typography
                        variant="h1"
                        sx={{
                          zIndex: 1,
                        }}
                    >
                      {company.name}
                    </Typography>
                    <Typography
                        variant="h4"
                        style={{fontStyle: 'italic'}}
                        sx={{
                          zIndex: 1,
                        }}
                    >
                      {company.tagline}
                    </Typography>
                    <Typography
                        variant="p"
                        sx={{
                           zIndex: 1,
                        }}
                    >
                      {company.description}
                    </Typography>
                  </CardContent>
                ) : (
                    <CircularProgress style={{justifyContent: 'center', alignContent: 'center'}}/>
                )}
              </Card>
            </Grid>
          </Grid>
        </Container>
      </Page>
  );
}

/*
<Modal
    aria-labelledby="transition-modal-title"
    aria-describedby="transition-modal-description"
    open={openReferralModal}
    onClose={() => {setOpenReferralModal(false)}}
    closeAfterTransition
    BackdropComponent={Backdrop}
    BackdropProps={{
      timeout: 500,
    }}

>
  <Fade in={openReferralModal}>
    <Card sx={{
      position: 'absolute',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      width: 400,
      boxShadow: 24,
      p: 4,
    }}>

      <Stack spacing={2} sx={{ p: 3 }}>
        <Typography variant="h4" noWrap>
          Here's your link!
        </Typography>
        <Typography variant="p" >
          Thus far, you have referred a, b, c.
        </Typography>
        <Typography variant="p" >
          You can continue adding more friends by sending the following link: <span style={{color: '#04d49c'}}>{textToCopy}</span>
        </Typography>

        <CopyToClipboard text={textToCopy}>
          <Button>Copy to clipboard</Button>
        </CopyToClipboard>

      </Stack>
    </Card>
  </Fade>
</Modal>

<Button variant='contained' sx={{}} onClick={() => {setOpenReferralModal(true)}}>
  Referral Link
</Button>
*/
