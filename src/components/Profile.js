import React from 'react';
import Box from "@mui/material/Box";
import {Container, Grid, Paper, Avatar} from "@mui/material";

const fakeProfile = {
  name: 'Pablo Salamanca',
  occupation: 'Student',
  age: '20',
  location: 'Philadelphia, PA',
}

function Profile() {

  return (
      <Box component='main'
           sx={{
            backgroundColor: '#fff',
            flexGrow: 1,
           }}

      >
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4, backgroundColor: '#f6f6f6', borderRadius: 10,
                                       border: 1, borderColor: '#e2e2e2',}}>
          <Grid container spacing={2}>
            <Grid item xs={4} className='profile__picture'
                  sx={{display: 'flex', alignItems: 'center', justifyContent: 'center'}} >
              <Avatar
                  alt="Remy Sharp"
                  src="/static/images/avatar/1.jpg"
                  sx={{ width: 300, height: 300, marginTop: '20px' }}
              />

            </Grid>
            <Grid item xs={8}>

            </Grid>
            <Grid item xs={4} sx={{display: 'flex', alignItems: 'start', justifyContent: 'start',
                                    flexDirection: 'column', paddingLeft: '20px' }}>
              <h1>{fakeProfile.name}</h1>
              <h4><span style={{fontWeight: 'normal'}}>Age:</span> {fakeProfile.age}</h4>
              <h4><span style={{fontWeight: 'normal'}}>Location:</span> {fakeProfile.location}</h4>
              <h4><span style={{fontWeight: 'normal'}}>Occupation:</span> {fakeProfile.occupation}</h4>

            </Grid>

          </Grid>

        </Container>

      </Box>
  )
}

export default Profile