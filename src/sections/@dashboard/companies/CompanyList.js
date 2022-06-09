import PropTypes from 'prop-types';
// material
import { Grid } from '@mui/material';
import DiscoverCompanyCard from './CompanyCard';

// ----------------------------------------------------------------------

CompanyList.propTypes = {
  companies: PropTypes.array.isRequired
};

export default function CompanyList({ companies, ...other }) {
  return (
    <Grid container spacing={3} {...other}>
      {companies.map((company) => (
        <Grid key={company.id} item xs={12} sm={6} md={4}>
          <DiscoverCompanyCard company={company}/>
        </Grid>
      ))}
    </Grid>
  );
}
