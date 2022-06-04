import React from 'react';
import {Container, Grid, Paper} from "@mui/material";
import Box from "@mui/material/Box";
import Card from "./Card";
import {useNavigate} from "react-router-dom";

const fakeStartups = [ /// this data will come from firebase soon
  {
    name: 'Symbiotica',
    description: 'Symbiotica is an Ed-tech company based in Philadelphia. We created a web ' +
        'extension and a desktop app that retrieves the valuable intellectual content users learn ' +
        'online. The information you consume from articles, digital books, PDFs, or videos is categorized ' +
        'and saved in a database we call a Knowledge Architecture, which is a digital representation of your brain.' +
        ' With this unified record of your knowledge, you are able to interact with what you have learned and make ' +
        'money by selling parts of what you know to others.',
    employees: '2',
    yearFounded: '2022',
    moneyRaised: '$1',
    themeColor: '#f57c00',
    id: 123
  },
  {
    name: 'Tryvest',
    description: 'Gain a stake in exciting companies by being an early user of their product.',
    employees: '2',
    yearFounded: '2022',
    moneyRaised: '$150,000',
    themeColor: '#ce93d8',
    id: 456,
  },
  {
    name: 'Oliver Space',
    description: 'Create a space you love with beautiful furniture, amazing service, and flexibility to fit your life.',
    employees: '62',
    yearFounded: '2018',
    moneyRaised: '$19,800,000',
    themeColor: '#D32F2F',
    id: 789,
  },
  {
    name: 'Ripple',
    description: 'Bluetooth hell and insomnia cookies',
    employees: '1',
    yearFounded: '2022',
    moneyRaised: '$1',
    themeColor: '#90caf9',
    id: 135,
  }

]


function Discover() {

  //Maybe we should think about making this page more captivating? perhaps adding some kind of pictures or something?

  const navigate = useNavigate()

  const handleCardClick = (id) => {
    navigate('/companies/' + id)
  }
  return (
      <Box
          component='main'
          sx={{
            backgroundColor: '#fff',
            flexGrow: 1,

            marginBottom: '100px',
          }}>
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4}}>

          <Grid container spacing={4}>

            {
              //Trying to generate some volume so we can scroll a bit... sorry for the mess

                fakeStartups.map((startup) => (
                  <Grid item xs={6}>
                    <Card title={startup.name} description={startup.description} color={startup.themeColor}
                          funding={startup.moneyRaised} founded={startup.yearFounded} id={startup.id}
                          />

                  </Grid>
                ))}
            {
                fakeStartups.map((startup) => (
                  <Grid item xs={6}>
                    <Card title={startup.name} description={startup.description} color={startup.themeColor}
                          funding={startup.moneyRaised} founded={startup.yearFounded} id={startup.id}/>
                  </Grid>
                ))}
            {fakeStartups.map((startup) => (
                  <Grid item xs={6}>
                    <Card title={startup.name} description={startup.description} color={startup.themeColor}
                          funding={startup.moneyRaised} founded={startup.yearFounded} id={startup.id}/>
                  </Grid>
                ))}
            {fakeStartups.map((startup) => (
                  <Grid item xs={6}>
                    <Card title={startup.name} description={startup.description} color={startup.themeColor}
                          funding={startup.moneyRaised} founded={startup.yearFounded} id={startup.id}/>
                  </Grid>
                ))}
            {fakeStartups.map((startup) => (
                  <Grid item xs={6}>
                    <Card title={startup.name} description={startup.description} color={startup.themeColor}
                          funding={startup.moneyRaised} founded={startup.yearFounded} id={startup.id}/>
                  </Grid>
                ))}


            </Grid>
        </Container>
      </Box>
  )
}

export default Discover