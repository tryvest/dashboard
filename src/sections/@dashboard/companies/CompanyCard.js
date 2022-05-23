import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
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
  const { name, colors, funding, description, id } = company;
  const theme = useTheme();
  const navigate = useNavigate()

  return (
    <Card sx={{backgroundColor: colors}}>

      <Stack spacing={2} sx={{ p: 3 }}>
          <Typography variant="h4" noWrap>
            {name}
          </Typography>
          <Typography variant="p" >
            {description}
          </Typography>

        <Stack direction="row" alignItems="center" justifyContent="space-between">
          <Button variant='contained' sx={{backgroundColor: theme.palette.common.black,
            '&:hover': {
              backgroundColor: theme.palette.primary.main,
            },}} onClick={() => {navigate(`/companies/${  id}`)}}>
            View Terms
          </Button>
          <Typography variant="subtitle1">
            Capital raised: {fCurrency(funding)}
          </Typography>
        </Stack>
      </Stack>
    </Card>
  );
}
