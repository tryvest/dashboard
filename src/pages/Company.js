import React, {useEffect, useState} from 'react'
import {useParams} from 'react-router-dom';
// material
import {
  Grid,
  Button,
  Container,
  Typography,
  Card,
  CardContent,
  CardHeader,
  CircularProgress
} from '@mui/material';
import { useTheme } from '@mui/material/styles'
import ReactPlayer from 'react-player'
import Carousel from 'better-react-carousel'
// components
import { fCurrency, fShortenNumber } from '../utils/formatNumber';
import Page from '../components/Page';

import COMPANIES from '../_mock/companies'
import {apiBusinesses} from "../utils/api/api-businesses";
import BusinessTask from "../sections/@dashboard/companies/BusinessTask";



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

export default function Business() {

  const { id } = useParams()

  console.log(id)

  // const business = COMPANIES.find((c) => c.id ===  id)
  // const {name, description, funding, colors, status, cover } = business

  const [business, setBusiness] = useState()
  const [businessLoaded, setBusinessLoaded] = useState(false)



  const theme = useTheme();

  useEffect( () => {

    const response = apiBusinesses.getSingle(id).then(data => {
      console.log(data);
      data.media.unshift("https://challengepost-s3-challengepost.netdna-ssl.com/photos/production/software_photos/001/068/527/datas/gallery.jpg")
      data.media.push('https://pbs.twimg.com/profile_images/1455185376876826625/s1AjSxph_400x400.jpg')
      setBusiness(data);
      setBusinessLoaded(true)
    });
  }, []);

  return (
      <Page title="Dashboard: Business">
        <Container>
          {businessLoaded ? (
            <Grid container spacing={2}>
            <Grid item xs={12} sm={9} md={9} lg={9} xl={9}>
              <Card sx={{ position: 'relative',  width: '100%', height: '100%'}}>
                  <CardContent
                      sx={{
                        pt: 4,
                        pb: '10px',
                        height: '100%',
                        justifyContent: "space-between"
                      }}
                  >
                    <Typography
                        variant="h2"
                        sx={{
                          zIndex: 1,
                        }}
                    >
                      {business.name}
                    </Typography>
                    <Typography
                        variant="h5"
                        style={{fontStyle: 'italic'}}
                        sx={{
                          zIndex: 1,
                        }}
                    >
                      {business.tagline}
                    </Typography>
                    <Typography
                        variant="p"
                        fontSize={14}
                        sx={{
                           zIndex: 1,
                        }}
                    >
                      {business.description}
                    </Typography>
                    <div style={{maxHeight: '500px', maxWidth: '800px', margin: '10px'}}>
                      <Carousel loop showDots scrollSnap dotColorActive={theme.palette.primary.main}>
                        {business.media.map((imgLink) => {
                          if (imgLink.includes('jpg') || imgLink.includes('png')) {
                            return (
                                <Carousel.Item>
                                  <img src={imgLink} alt="imageyay"/>
                                </Carousel.Item>)
                          }

                          if (imgLink.includes('mp4')) {
                            return (
                                <Carousel.Item>
                                  <ReactPlayer controls url={imgLink} width={"100%"}/>
                                </Carousel.Item>)
                          }
                          return <div/>
                        })}
                      </Carousel>
                    </div>
                  </CardContent>
                )
              </Card>
            </Grid>
            <Grid item xs={12} sm={3} md={3}>
              <Card>
                <CardHeader title={"Financial Details"}/>
                <CardContent sx={{
                  height: '100%',
                  justifyContent: "space-between",
                  pt: '0px'
                }}>
                  <Typography>
                    {`Valuation: $${fShortenNumber((business.valuation))}`}
                  </Typography>
                  <Typography>
                    {`Total Shares: ${fShortenNumber(business.totalShares)}`}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={12} md={12}>
              <Card>
                {/*
                  <CardHeader title={"All Tasks"}/>
                */}
                <CardContent sx={{
                  height: '100%',
                  justifyContent: 'space-around',
                  pt: '0px'
                }}>
                  <Typography variant={'h2'}>
                    Active Tasks
                  </Typography>
                  {business.termDocs.map((singleTermDoc) => (
                      <BusinessTask singleTermDoc={singleTermDoc}/>
                  ))}
                </CardContent>
              </Card>
            </Grid>
          </Grid>)
        : (
        <CircularProgress style={{justifyContent: 'center', alignContent: 'center'}}/>
        )}
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

const [openReferralModal, setOpenReferralModal] = useState(false)
const [textToCopy, setTextToCopy] = useState('https://tryvest.us/referral/business?#referrer=pablo')
*/
