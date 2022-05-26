// material
import {Grid, Container, Typography, Card, CardContent, Avatar} from '@mui/material';
// components
import {styled} from "@mui/material/styles";
import Page from '../components/Page';

import ACCOUNT from "../_mock/account";

// ----------------------------------------------------------------------

const CardMediaStyle = styled('div')({
  position: 'relative',
  paddingTop: 'calc(15%)',
});


const AvatarStyle = styled(Avatar)(({ theme }) => ({
  zIndex: 9,
  width: 220,
  height: 220,
  position: 'absolute',
  left: theme.spacing(5),
  bottom: theme.spacing(0),


}));




// ----------------------------------------------------------------------

export default function Profile() {
  return (
    <Page title="Dashboard: Profile">
      <Container>


            <Card sx={{ position: 'relative' }}>
              <Grid container spacing={3}>
                <Grid item xs={12} sm={12} md={12}>
                <CardMediaStyle>

                  <AvatarStyle
                    alt={ACCOUNT.displayName}
                    src='https://directory.seas.upenn.edu/wp-content/uploads/2020/03/Greenberg-Clayton.jpg'
                    style={{
                      border: '4px solid lightgray'
                    }}
                />

                  {/* <CoverImgStyle alt="Account's Header" src='../images/angryimg.png' /> */}
                  <Typography variant='h2' sx={{marginLeft: '350px'}}>
                    {ACCOUNT.displayName}
                  </Typography>
              </CardMediaStyle>

              <CardContent
                  sx={{
                    pt: 4,
                  }}
              >
                <Typography variant='h5' gutterBottom>
                  Age: <span style={{fontWeight: 300}}>{ACCOUNT.age}</span>
                </Typography>
                <Typography variant='h5' gutterBottom>
                  Occupation: <span style={{fontWeight: 300}}>{ACCOUNT.occupation}</span>
                </Typography>
                <Typography variant='h5' gutterBottom>
                  Location: <span style={{fontWeight: 300}}>{ACCOUNT.location}</span>
                </Typography>
                <Typography variant='h5' gutterBottom>
                  Email: <span style={{fontWeight: 300}}>{ACCOUNT.email}</span>
                </Typography>
                <Typography variant='h5'>
                  Standing: <span style={{fontWeight: 300}}>#{ACCOUNT.leaderboardStanding}</span>
                </Typography>


              </CardContent>
                </Grid>
              </Grid>
            </Card>

      </Container>
    </Page>
  );
}
