import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import {useState} from "react";

// material
import { Card, Typography, Stack, Button} from '@mui/material';
import { useTheme } from '@mui/material/styles';
// utils
import { fCurrency } from '../../../utils/formatNumber';
// components

// ----------------------------------------------------------------------

// ----------------------------------------------------------------------

DiscoverCompanyCard.propTypes = {
  company: PropTypes.object,
};

export default function DiscoverCompanyCard({ company }) {
  const { docID, name, description, topics, valuation, totalShares, logo, media, tagline} = company;
  const theme = useTheme();
  const navigate = useNavigate()
  const goCompanyPage = () => {navigate(`/companies/${docID}`)}

  return (
    <Card>
      <Stack spacing={1} sx={{ p: 3 }} style={{blockSize: "500px", cursor: "pointer"}} onClick={goCompanyPage}>
          <img src={logo} alt="logo"/>
          <Typography variant="h4" noWrap>
            {name}
          </Typography>
          <Typography variant="p" >
            {tagline}
          </Typography>

        <Stack direction="row" alignItems="center" justifyContent="space-between">
          <Button variant='contained' sx={{backgroundColor: theme.palette.common.black,
            '&:hover': {
              backgroundColor: theme.palette.primary.main,
            },width: '100%'}} onClick={goCompanyPage}>
            View Terms
          </Button>
        </Stack>
      </Stack>
    </Card>
  );
}
