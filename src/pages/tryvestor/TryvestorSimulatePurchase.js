import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Button, FormControl, Input, InputLabel, MenuItem, Select, Stack, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { apiTryvestors } from '../../utils/api/api-tryvestors';

function TryvestorSimulatePurchase(props) {
  const userObj = useSelector((state) => state.user.user);
  const [loyaltiesByCat, setLoyaltiesByCat] = useState();
  const [businesses, setBusinesses] = useState();
  const [amountToInvest, setAmountToInvest] = useState(100);
  const [busToInvest, setBusToInvest] = useState();
  const idToName = {
    '05AFSVZFZUmKqTkTUCRZ': 'Nasoyaki',
    EHNhQ8fUZX0vYmnHVKky: 'Kingscrowd',
    Rn8nzVxboMWEYWtqL3oq: 'Pikestic',
    qH6LdUxPAxjwgYeTsvr0: 'TreeOfStories',
  };

  useEffect(() => {
    if (userObj) {
      apiTryvestors.getActiveLoyaltiesByCategory(userObj?.uid).then((data) => {
        setLoyaltiesByCat(data);
        const keys = Object.keys(data);
        const temp = [];
        console.log(data);
        keys.forEach((singleKey) => {
          if (data[singleKey] !== null) {
            temp.push(data[singleKey]);
          }
        });
        setBusinesses(temp);
        if (temp.length > 0) {
          setBusToInvest(temp[0].businessID);
        }
        console.log(temp);
      });
    }
  }, [userObj]);

  const navigate = useNavigate();

  useEffect(() => {
    console.log(busToInvest);
    console.log(amountToInvest);
  }, [busToInvest, amountToInvest]);

  const simulateTransaction = () => {
    const tryvestorID = userObj?.uid;
    apiTryvestors.simulatePurchase(tryvestorID, busToInvest, amountToInvest).then(() => {
      navigate('/dashboard/overview');
      window.location.reload();
    });
  };

  return (
    <div>
      {businesses && busToInvest ? (
        <div style={{ padding: '20px' }}>
          <Typography fontSize={'26px'}>
            This page is purely to simulate a transaction occurring. Please select a company, enter an amount, and
            submit. You can only simulate a purchase for the companies you have enrolled in a loyalty program for!
          </Typography>
          {businesses.length > 0 ? (
            <Stack padding={'40px'} spacing={2}>
              <div>
                <Typography>Amount to Invest</Typography>
                <Input defaultValue={amountToInvest} onChange={(event) => setAmountToInvest(event.target.value)} />
              </div>
              <FormControl style={{ width: '200px' }}>
                <InputLabel>Select Company</InputLabel>
                <Select
                  label={'Select Company'}
                  defaultValue={busToInvest}
                  onChange={(event) => setBusToInvest(event.target.value)}
                >
                  {businesses &&
                    businesses?.map((business) => {
                      return (
                        <MenuItem style={{ color: 'black' }} value={business.businessID}>
                          {idToName[business.businessID]}
                        </MenuItem>
                      );
                    })}
                </Select>
              </FormControl>
              <Button onClick={simulateTransaction} variant={'contained'}>
                Simulate Purchase for selected company and amount
              </Button>
            </Stack>
          ) : (
            <Typography>
              Please go back to dashboard and select loyalties before you attempt to simulate a purchase!
            </Typography>
          )}
        </div>
      ) : (
        <Typography>
          Please go back to dashboard and select loyalties before you attempt to simulate a purchase!
        </Typography>
      )}
    </div>
  );
}

export default TryvestorSimulatePurchase;
