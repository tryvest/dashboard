import React, {useEffect, useState} from 'react';
import {Button, Card, Checkbox, CircularProgress, Stack, Typography,} from '@mui/material';
import {useNavigate} from 'react-router-dom';
import {useSelector} from 'react-redux';
import ReactMarkdown from 'react-markdown';
import {apiTryvestors} from '../../utils/api/api-tryvestors';
import {DarkLogo} from '../../components/Logo';
import {apiBusinesses} from '../../utils/api/api-businesses';
import LandingNav from '../general/LandingNav';
import {CompanyName} from '../discover/Styles';
import {CategoryDiscoverTileLight} from '../../components/CategoryDiscoverTile';

function TryvestorAdditionalInfo(props) {
  const uid = useSelector((state) => state.user.user.uid);
  const navigate = useNavigate();

  const [confirmed, setConfirmed] = useState(false);
  const [allBusinessesByCategory, setAllBusinessesByCategory] = useState();
  const [allCategories, setAllCategories] = useState();
  const [selectedBusinessPerCategory, setSelectedBusinessPerCategory] = useState();

  useEffect(() => {
    apiBusinesses.getBusinessInfoByCat().then((companyByCatData) => {
      setAllBusinessesByCategory(companyByCatData);
      const selectBusinessPerCategory = {};
      const keys = Object.keys(companyByCatData);
      keys.forEach((keyVal) => {
        selectBusinessPerCategory[keyVal] = "None";
      });
      setSelectedBusinessPerCategory(selectBusinessPerCategory);
    });
  }, []);

  useEffect(() => {
    apiBusinesses.getCategoryNames().then((categoryData) => {
      // setAllCategories(categoryData)
      const categoryToName = {};
      // const categoryIDs = Object.keys(categoryData)
      for (let i = 0; i < categoryData.length; i += 1) {
        const tempCat = categoryData[i];
        categoryToName[tempCat.categoryID] = tempCat.categoryName;
      }
      setAllCategories(categoryToName);
    });
  }, []);

  const selectBusinessForCategory = (categoryID, businessID) => {
    const temp = {...(selectedBusinessPerCategory)};
    temp[categoryID] = businessID;
    setSelectedBusinessPerCategory(temp);
  };

  const createSelectedLoyalties = async () => {
    const categories = Object.keys(selectedBusinessPerCategory);
    await Promise.all(categories.map((catID) => {
      if(selectedBusinessPerCategory[catID] !== "None") {
        return apiTryvestors.changeLoyalty(uid, selectedBusinessPerCategory[catID], catID);
      }
      return ""
    }))
    apiTryvestors.updateLoyaltyStatus(uid, 1).then(() => {
      navigate('/', { replace: true });
      window.location.reload();
    })
  };

  return (
    <Stack spacing={2}>
      <Card style={{ padding: '30px', borderRadius: 0 }}>
        <DarkLogo />
        <Typography fontSize={'33px'} fontWeight={'800'}>
          Subscribe to your favorite companies!
        </Typography>
        <Typography color={'rgba(37,39,51,0.87)'} fontWeight={500} fontSize={'17px'} fontStyle={'italic'}>
          You can choose to update your loyalties once you're set up
        </Typography>
      </Card>

      <Card style={{ padding: '25px', borderRadius: 0 }}>
        <Typography fontSize={'30px'} fontWeight={'800'} marginBottom={'15px'}>
          Select One Company Per Category
        </Typography>
        <div>
          {props.nav && <LandingNav />}
          <CompanyName>
            {allBusinessesByCategory && allCategories ? (
              Object.keys(allBusinessesByCategory)?.map((catKey) => {
                const catName = allCategories[catKey];
                const company = allBusinessesByCategory[catKey];
                return (
                  <CategoryDiscoverTileLight
                    selectedBusinessPerCategory={selectedBusinessPerCategory}
                    selectBusinessForCategory={selectBusinessForCategory}
                    categoryName={catName}
                    categoryID={catKey}
                    matchingCompanies={company}
                  />
                );
              })
            ) : (
              <CircularProgress />
            )}
          </CompanyName>
        </div>
      </Card>

      <Card style={{ padding: '20px' }}>
        <ReactMarkdown>
          {'#### Disclosures\n' +
            '- I understand that I can cancel my investment up until 48 hours prior to the deal deadline.\n' +
            '- I understand I will not have voting rights and will grant a third-party nominee broad authority to act on my behalf.\n' +
            '- I understand I may never become an equity holder, only a beneficial owner of equity interest in the Company.\n' +
            '- I understand that investing this amount into several deals would better diversify my risk\n' +
            '- I understand that there is no guarantee of a relationship between Tryvest and the company post-offering\n' +
            '- I consent to electronic delivery of all documents, notices and agreements as related to my investment\n' +
            '- I understand my investment won’t be transferable for 12 months and may not have a market for resale\n' +
            '- I have read the Terms of Service, Privacy Policy, and agree to both of them including arbitration provisions\n' +
            "- I understand this investment is risky and that I shouldn't invest unless I can afford to lose all invested funds\n" +
            '- I have read the education materials that Tryvest provides\n' +
            '- I understand I am responsible for all fees and charges associated with the use of my payment method\n' +
            '- I understand that Tryvest will receive cash based on the number and size of purchases that you make\n' +
            '- I confirm that this investment, together with all my other Regulation Crowdfunding investments during the past 12 months on any crowdfunding portal, does not exceed my investment limit'}
        </ReactMarkdown>
        <Typography variant={'h6'}>Confirmation</Typography>
        <Stack direction={'row'} style={{ alignItems: 'center' }}>
          <Checkbox checked={confirmed} onChange={(_) => setConfirmed(!confirmed)} />
          <Typography onClick={() => setConfirmed(!confirmed)}>
            I confirm that I have read and agree to all disclosures above.
          </Typography>
        </Stack>
      </Card>
      <Button
        fullWidth
        size={'large'}
        disabled={!confirmed}
        variant={'contained'}
        style={{ padding: '8px', fontWeight: '200', borderRadius: '35px', marginY: '10px', marginInline: 'auto' }}
        onClick={createSelectedLoyalties}
      >
        Select As Favorites
      </Button>
    </Stack>
  );
}

// todo finish the text-fields
export default TryvestorAdditionalInfo;
