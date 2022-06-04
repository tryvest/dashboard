import React from 'react'
import {Container, Grid, Paper} from "@mui/material";
import Box from "@mui/material/Box";
import Task from './Task'
import {fakeCompanies} from '../fakeCompanies'

function Dashboard() {

  return (
      <Box
        component='main'
        sx={{
        backgroundColor: '#fff',
        flexGrow: 1,
      }}>
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>

          <Grid container spacing={8}>
            <Grid item xs={8}>
              <Paper variant='outlined'
                  sx={{
                    p: 2,
                    display: 'flex',
                    flexDirection: 'column',
                    borderRadius: 15,
                    backgroundColor: '#f6f6f6',
                    alignItems: 'left',
                    paddingBottom: '50px'
                  }}
                  elevation={0}
              >

                <div className='flexbox-container' style={{
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'start',
                  textAlign: 'start',
                  width: '100%',
                  paddingLeft: '20px'
                  }}>
                  <h1>My Progress</h1>
                  <h3>Tasks <span style={{fontWeight: '300'}}>&nbsp;Weekly</span></h3>
                </div>
                <div style={{ display: 'flex',
                              flexDirection: 'column',
                              alignItems: 'center',
                            }}>
                  <h4 style={{marginLeft: '40px', marginRight: 'auto', fontWeight: '400'}}>Outstanding</h4>
                  <Task title='V1 Testing' company={fakeCompanies[3].name} progress={20}
                        description='This task is very important...'
                        coins={40} color={fakeCompanies[3].themeColor}/>
                  <Task title='iOS App Review' company={fakeCompanies[2].name} progress={60}
                        description='This task is very important...' coins={60} color={fakeCompanies[2].themeColor}/>
                  <Task title='V2 Testing' company={fakeCompanies[3].name} progress={90} description='This task is very important...'
                        coins={60} color={fakeCompanies[3].themeColor}/>
                  <Task title='Beta Testing' company={fakeCompanies[0].name} progress={55}
                        description='This task is very important...' coins={10} color={fakeCompanies[0].themeColor}/>

                  <Task title='Tester Briefing' company={fakeCompanies[0].name} progress={30}
                        description='This task is very important...' coins={15} color={fakeCompanies[0].themeColor}/>
                  <h4 style={{marginLeft: '40px', marginRight: 'auto', fontWeight: '400'}}>Completed</h4>
                  <Task title='Follow on Instagram' company={fakeCompanies[2].name} progress={100}
                        description='This task is very important...' coins={2} color={fakeCompanies[2].themeColor}/>
                </div>
              </Paper>
            </Grid>
            <Grid item xs={4}>
              <Paper
                  sx={{
                    p: 2,
                    display: 'flex',
                    flexDirection: 'column',
                    height: '60vh',
                    borderRadius: 15,
                    backgroundColor: '#f6f6f6',
                    border: 1, borderColor: '#e2e2e2',
                  }}
                  elevation={0}
              >
              </Paper>
            </Grid>
            <Grid item xs={8}>
              <Paper variant='outlined'
                     sx={{
                       p: 2,
                       display: 'flex',
                       flexDirection: 'column',
                       borderRadius: 15,
                       backgroundColor: '#f6f6f6',
                       alignItems: 'left',
                       paddingBottom: '50px'
                     }}
                     elevation={0}
              >

                <div className='flexbox-container' style={{
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'start',
                  textAlign: 'start',
                  width: '100%',
                  paddingLeft: '20px'
                }}>
                  <h1>My Companies</h1>
                  <h3>Tasks</h3>
                </div>
                <div>
                  <Task title='V1 Testing' company={fakeCompanies[3].name} progress={20}
                        description='This task is very important...'
                        coins={40} color={fakeCompanies[3].themeColor}/>
                  <Task title='iOS App Review' company={fakeCompanies[2].name} progress={60}
                        description='This task is very important...' coins={60} color={fakeCompanies[2].themeColor}/>
                  <Task title='V2 Testing' company={fakeCompanies[3].name} progress={90} description='This task is very important...'
                        coins={60} color={fakeCompanies[3].themeColor}/>
                  <Task title='Beta Testing' company={fakeCompanies[0].name} progress={55}
                        description='This task is very important...' coins={10} color={fakeCompanies[0].themeColor}/>
                  <Task title='Follow on Instagram' company={fakeCompanies[2].name} progress={100}
                        description='This task is very important...' coins={2} color={fakeCompanies[2].themeColor}/>
                  <Task title='Tester Briefing' company={fakeCompanies[0].name} progress={30}
                        description='This task is very important...' coins={15} color={fakeCompanies[0].themeColor}/>
                </div>
              </Paper>
            </Grid>

          </Grid>
        </Container>
      </Box>
  )
}

export default Dashboard;