import {useEffect, useState} from 'react';
// material
import { Container, Stack, Typography } from '@mui/material';
// components
import Page from '../components/Page';
import { ProductSort, ProductCartWidget, CompanyList, ProductFilterSidebar } from '../sections/@dashboard/companies';
// mock
import COMPANIES from '../_mock/companies';

// ----------------------------------------------------------------------

export default function EcommerceShop() {
  const [openFilter, setOpenFilter] = useState(false);

  const [companies, setCompanies] = useState([])

  const handleOpenFilter = () => {
    setOpenFilter(true);
  };

  const handleCloseFilter = () => {
    setOpenFilter(false);
  };

  useEffect(async () => {
     const response = await fetch('http://127.0.0.1:5000/api/businesses/', {
       method: 'GET',
       headers: {
         'Accept': 'application/json',
         'Content-Type': 'application/json'
       }
     });

    response.json().then(data => {
      console.log(data);
      setCompanies(data)
    });
  }, [])

  return (
    <Page title="Dashboard: Products">
      <Container>
        <Typography variant="h2" sx={{ mb: 5 }}>
          Discover
        </Typography>

        <Stack direction="row" flexWrap="wrap-reverse" alignItems="center" justifyContent="flex-end" sx={{ mb: 5 }}>
          <Stack direction="row" spacing={1} flexShrink={0} sx={{ my: 1 }}>
            <ProductFilterSidebar
              isOpenFilter={openFilter}
              onOpenFilter={handleOpenFilter}
              onCloseFilter={handleCloseFilter}
            />
            <ProductSort />
          </Stack>
        </Stack>

        <CompanyList companies={companies} />
      </Container>
    </Page>
  );
}
