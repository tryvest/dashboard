import React, {useState} from 'react';
import PropTypes from 'prop-types';
// @mui
import {
  Card, Stack, Divider, Checkbox, MenuItem, IconButton, FormControlLabel,
  Accordion, AccordionDetails, AccordionSummary, Typography, Box, Grid
} from '@mui/material';
import LinearProgress, {linearProgressClasses} from "@mui/material/LinearProgress";

// components
import styled from "@emotion/styled";
import Iconify from '../../../components/Iconify';
import MenuPopover from '../../../components/MenuPopover';
import {AppWidgetSummary} from "./index";

import ACCOUNT from '../../../_mock/account'


// ----------------------------------------------------------------------

AppTasks.propTypes = {
  title: PropTypes.string,
  subheader: PropTypes.string,
  tasks: PropTypes.array,
};

export default function AppTasks({tasks, ...other }) {


  return (
    <Card {...other}>
      <Grid container spacing={0}>
        <Grid item xs={12} sm={12} md={4}>
          <AppWidgetSummary title="Total Coins" total={ACCOUNT.totalCoins} icon={'ph:coins-fill'}
                            sx={{marginLeft: 6, marginTop: 5, marginRight: 2}}/>
        </Grid>

        <Grid item xs={12} sm={12} md={4}>
          <AppWidgetSummary title="Outstanding Coins" total={ACCOUNT.outstandingCoins} color="info"
                            icon={'mdi:hand-coin-outline'} sx={{marginLeft: 4, marginTop: 5, marginRight: 4}}/>
        </Grid>

        <Grid item xs={12} sm={12} md={4}>
          <AppWidgetSummary title="Equity Paid Out" total={ACCOUNT.equityPaidOut} color="success"
                            icon={'mdi:currency-usd'} sx={{marginLeft: 2, marginTop: 5, marginRight: 6}}/>
        </Grid>

      </Grid>
      <Typography variant='h3' sx={{m: 2, mt: 4}}>Tasks <span style={{fontWeight: '300'}}>&nbsp;Weekly</span></Typography>

      <Typography variant='h5' sx={{m: 2, fontWeight: '300'}}>Outstanding</Typography>
      {tasks?.map((task) => (
            !task.completed &&
            <Task key={task.id} title={task.title} company={task.company} progress={task.progress}
                  description={task.description} coins={task.coins} color={task.color}/>


        ))
      }
      <Typography variant='h5' sx={{m: 2, fontWeight: '300'}}>Completed</Typography>
      {tasks?.map((task) => (
          task.completed &&
          <Task key={task.id} title={task.title} company={task.company} progress={task.progress}
                description={task.description} coins={task.coins} color={task.color}/>


      ))
      }


    </Card>
  );
}

// ----------------------------------------------------------------------

TaskItem.propTypes = {
  formik: PropTypes.object,
  checked: PropTypes.bool,
  task: PropTypes.object,
};

function TaskItem({ formik, task, checked, ...other }) {
  const { getFieldProps } = formik;

  const [open, setOpen] = useState(null);

  const handleOpenMenu = (event) => {
    setOpen(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setOpen(null);
  };

  const handleMarkComplete = () => {
    handleCloseMenu();
    console.log('MARK COMPLETE', task);
  };

  const handleShare = () => {
    handleCloseMenu();
    console.log('SHARE', task);
  };

  const handleEdit = () => {
    handleCloseMenu();
    console.log('EDIT', task);
  };

  const handleDelete = () => {
    handleCloseMenu();
    console.log('DELETE', task);
  };

  return (
    <Stack
      direction="row"
      sx={{
        px: 2,
        py: 0.75,
        ...(checked && {
          color: 'text.disabled',
          textDecoration: 'line-through',
        }),
      }}
    >
      <FormControlLabel
        control={<Checkbox {...getFieldProps('checked')} value={task.id} checked={checked} {...other} />}
        label={task.label}
        sx={{ flexGrow: 1, m: 0 }}
      />

      <MoreMenuButton
        open={open}
        onClose={handleCloseMenu}
        onOpen={handleOpenMenu}
        actions={
          <>
            <MenuItem onClick={handleMarkComplete}>
              <Iconify icon={'eva:checkmark-circle-2-fill'} />
              Mark Complete
            </MenuItem>

            <MenuItem onClick={handleEdit}>
              <Iconify icon={'eva:edit-fill'} />
              Edit
            </MenuItem>

            <MenuItem onClick={handleShare}>
              <Iconify icon={'eva:share-fill'} />
              Share
            </MenuItem>

            <Divider sx={{ borderStyle: 'dashed' }} />

            <MenuItem onClick={handleDelete} sx={{ color: 'error.main' }}>
              <Iconify icon={'eva:trash-2-outline'} />
              Delete
            </MenuItem>
          </>
        }
      />
    </Stack>
  );
}



function Task({title, company, progress, description, coins, color}) {


  const BorderLinearProgress = styled(LinearProgress)(({ theme }) => ({
    height: 16,
    borderRadius: 8,
    [`&.${linearProgressClasses.colorPrimary}`]: {
      backgroundColor: theme.palette.grey[theme.palette.mode === 'light' ? 200 : 800],
    },
    [`& .${linearProgressClasses.bar}`]: {
      borderRadius: 8,
      backgroundColor: theme.palette.mode === 'light' ? color : '#308fe8',
    },
  }));

  function LinearProgressWithLabel() {
    return (
        <Box sx={{ display: 'flex', alignItems: 'center' , width: '25%' }}>
          <Box sx={{ width: '200%', mr: 1 }}>
            <BorderLinearProgress variant="determinate" value={progress} />
          </Box>
          <Box sx={{ minWidth: 35 }}>
            <Typography variant="body2" color="text.secondary">
              {progress}%
            </Typography>
          </Box>
        </Box>
    );
  }

  const [expanded, setExpanded] = React.useState(false);

  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  return (
      <Accordion sx={{marginBottom: '10px', borderRadius: '5px', width: '90%'}}
                 expanded={expanded === 'panel1'} onChange={handleChange('panel1')}>

        <AccordionSummary
            expandIcon={<Iconify icon={'ic:baseline-expand-more'} /> }
            aria-controls="panel1bh-content"
            id="panel1bh-header"
            sx={{justifyContent: 'space-evenly'}}
        >
          <Typography sx={{ width: '25%', flexShrink: 0, color: '#444'}}>
            {company}
          </Typography>
          <Typography sx={{ width: '25%', flexShrink: 0 }}>
            {title}
          </Typography>

          <LinearProgressWithLabel/>

          <Box sx={{ width: '25%', flexShrink: 0, display: 'flex', flexDirection: 'row', justifyContent: 'center',
            alignItems: 'center', paddingLeft: '30px' }}>
            <Typography>
              {coins}&nbsp;
            </Typography>
            <Iconify icon={'ic:round-monetization-on'} />

          </Box>
        </AccordionSummary>
        <AccordionDetails>
          {description}
        </AccordionDetails>
      </Accordion>
  );
}

// ----------------------------------------------------------------------

MoreMenuButton.propTypes = {
  actions: PropTypes.node.isRequired,
  onClose: PropTypes.func,
  onOpen: PropTypes.func,
  open: PropTypes.object,
};

function MoreMenuButton({ actions, open, onOpen, onClose }) {
  return (
    <>
      <IconButton size="large" color="inherit" sx={{ opacity: 0.48 }} onClick={onOpen}>
        <Iconify icon={'eva:more-vertical-fill'} width={20} height={20} />
      </IconButton>

      <MenuPopover
        open={Boolean(open)}
        anchorEl={open}
        onClose={onClose}
        arrow="right-top"
        sx={{
          mt: -0.5,
          width: 'auto',
          '& .MuiMenuItem-root': {
            px: 1,
            typography: 'body2',
            borderRadius: 0.75,
            '& svg': { mr: 2, width: 20, height: 20 },
          },
        }}
      >
        {actions}
      </MenuPopover>
    </>
  );
}
