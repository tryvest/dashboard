import React from 'react';
import {Accordion, AccordionDetails, AccordionSummary, Typography} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Box from "@mui/material/Box";
import styled from "@emotion/styled";
import LinearProgress, {linearProgressClasses} from "@mui/material/LinearProgress";
import PaidIcon from '@mui/icons-material/Paid'

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
            expandIcon={<ExpandMoreIcon color='black' />}
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
            <PaidIcon  fontSize='10px'/>
          </Box>
        </AccordionSummary>
        <AccordionDetails>
          {description}
        </AccordionDetails>
      </Accordion>
  );
}

export default Task;