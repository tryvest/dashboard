import { faker } from '@faker-js/faker';
// @mui
import { useTheme } from '@mui/material/styles';
import { Grid, Container, Typography } from '@mui/material';
// components
import Page from '../components/Page';
import Iconify from '../components/Iconify';
import ACCOUNT from '../_mock/account';
import COMPANIES from '../_mock/companies';

// sections
import {
  AppTasks,
  AppNewsUpdate,
  AppOrderTimeline,
  AppCurrentVisits,
  AppWebsiteVisits,
  AppTrafficBySite,
  AppWidgetSummary,
  AppCurrentSubject,
  AppConversionRates,
} from '../sections/@dashboard/app';

import TASKS from '../_mock/tasks';

// ----------------------------------------------------------------------

export default function DashboardApp() {
  const theme = useTheme();
  return (
    <Page title="Dashboard">
      <Container maxWidth="xl">

          { /* currentUser ?
              <Typography variant="h4" sx={{ mb: 5 }}> Welcome Back, placehold! </Typography>
              :
              <Typography variant="h4" sx={{ mb: 5 }}>User not logged in</Typography> */
          }



        <Grid container spacing={3}>

          <Grid item xs={12} md={6} lg={8}>
            <AppTasks
                title="Tasks"
                subheader='Weekly'
                tasks={TASKS}
            />
          </Grid>

          <Grid item xs={12} md={6} lg={4}>
            <AppCurrentVisits
              title="Current Visits"
              chartData={[
                { label: 'America', value: 4344 },
                { label: 'Asia', value: 5435 },
                { label: 'Europe', value: 1443 },
                { label: 'Africa', value: 4443 },
              ]}
              chartColors={[
                theme.palette.primary.main,
                theme.palette.chart.blue[0],
                theme.palette.chart.violet[0],
                theme.palette.chart.yellow[0],
              ]}
            />
          </Grid>

          <Grid item xs={12} md={6} lg={8}>
            <AppConversionRates
              title="My Companies"
              subheader="User Growth (users per month)"
              chartData={
                COMPANIES.map((c) => (
                    {label: c.name, value: c.userGrowth}
                ))
              }
            />
          </Grid>

          <Grid item xs={12} md={6} lg={4}>
            <AppCurrentSubject
              title="Effort Devoted"
              chartLabels={['English', 'History', 'Physics', 'Geography', 'Chinese', 'Math']}
              chartData={[
                { name: 'Series 1', data: [80, 50, 30, 40, 100, 20] },
                { name: 'Series 2', data: [20, 30, 40, 80, 20, 80] },
                { name: 'Series 3', data: [44, 76, 78, 13, 43, 10] },
              ]}
              chartColors={[...Array(6)].map(() => theme.palette.text.secondary)}
            />
          </Grid>
        </Grid>
      </Container>
    </Page>
  );
}
