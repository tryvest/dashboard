import React from 'react'
import Card from './Card'
import {Container, Grid, ListItem, Paper} from "@mui/material";
import styled from "@emotion/styled";
import Box from "@mui/material/Box";


function Dashboard() {


  return (
      <Box
        component='main'
        sx={{
        backgroundColor: '#fff',
        flexGrow: 1,
        height: '150vh',
        marginBottom: '100px',
      }}>
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>

          <Grid container spacing={4}>
            <Grid item xs={1}>
            </Grid>
            <Grid item xs={7}>
              <Paper
                  sx={{
                    p: 2,
                    display: 'flex',
                    flexDirection: 'column',
                    height: '150vh',
                    borderRadius: 15,
                    backgroundColor: '#f6f6f6',
                  }}
                  elevation={0}
              >
              </Paper>
            </Grid>
            <Grid item xs={4}>
              <Paper
                  sx={{
                    p: 2,
                    display: 'flex',
                    flexDirection: 'column',
                    height: '150vh',
                    borderRadius: 15,
                    backgroundColor: '#f6f6f6',
                  }}
                  elevation={0}
              >
              </Paper>
            </Grid>

          </Grid>
        </Container>
      </Box>
  )
}

export default Dashboard;