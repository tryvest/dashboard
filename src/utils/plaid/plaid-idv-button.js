import React, { useEffect, useState } from 'react';
import { usePlaidLink } from 'react-plaid-link';
import { Button, CircularProgress, Stack, Typography } from '@mui/material';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { api } from '../api/api';

const Link = (props) => {
  const { IDVerifStatusNum } = props;
  const [linkToken, setLinkToken] = useState(null);
  const currentUserUID = useSelector((state) => state?.user?.user?.uid);
  const currentUserType = useSelector((state) => state?.user?.user?.userType);
  const [plaidIdentityVerificationID, setPlaidIdentityVerificationID] = useState();
  const [completedLinkIDV, setCompletedLinkIDV] = useState(false);

  const generateToken = async () => {
    api.createPlaidIDVLinkToken(currentUserUID).then((data) => {
      setLinkToken(data.link_token);
      console.log(data);
    });
  };

  const disableManual = IDVerifStatusNum === 1;
  const isRetry = IDVerifStatusNum === -1;

  let buttonMessage = 'Complete Identity Verification';
  if (IDVerifStatusNum === 1) {
    buttonMessage = 'Already Verified';
  } else if (isRetry) {
    buttonMessage = 'Retry Verifying Identity';
  }
  const navigate = useNavigate();

  const prepopulate = async () => {
    api.createPlaidIDVPrepopulated(currentUserUID).then((data) => {
      setPlaidIdentityVerificationID(data.plaidIdentityVerificationID);
    });
  };

  useEffect(() => {
    prepopulate().then(() => generateToken());
  }, []);

  useEffect(() => {
    if (completedLinkIDV) {
      api.updateIdentityVerificationStatus(currentUserUID, plaidIdentityVerificationID).then((r) => {
        window.location.reload();
      });
    }
  }, [completedLinkIDV]);

  return linkToken && currentUserUID && currentUserType ? (
    <LinkHelper
      currentUserUID={currentUserUID}
      currentUserType={currentUserType}
      linkToken={linkToken}
      disableManual={disableManual}
      buttonMessage={buttonMessage}
      isRetry={isRetry}
      setCompletedLinkIDV={setCompletedLinkIDV}
    />
  ) : (
    <CircularProgress />
  );
};

const LinkHelper = (props) => {
  const { linkToken, currentUserUID, currentUserType, disableManual, buttonMessage, isRetry, setCompletedLinkIDV } =
    props;
  const onSuccess = React.useCallback((data) => {
    console.log(data);
    setCompletedLinkIDV(true);
  }, []);

  const config = {
    token: linkToken,
    onSuccess,
  };

  const { open, ready } = usePlaidLink(config);

  useEffect(() => {
    // if (ready) {
    //   open();
    // }
  }, [ready, open]);

  return (
    <Button
      variant={'contained'}
      onClick={() => open()}
      disabled={!ready || disableManual}
      sx={{ borderRadius: '30px', paddingInline: '25px', height: '40px' }}
    >
      <Stack direction={'row'} marginLeft={'-60px'} alignItems={'center'}>
        <svg width="126" height="40" viewBox="0 0 126 48" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M68.516 10L61.0883 11.9261L59.0414 19.3218L61.6015 21.9244L59 24.484L60.9265 31.9121L68.3219 33.958L70.9239 31.3979L73.484 34L80.9117 32.0739L82.9581 24.6776L80.3985 22.0761L83 19.5165L81.0735 12.0879L73.677 10.042L71.0761 12.6016L68.516 10ZM63.9579 13.3488L67.8706 12.3336L69.5816 14.0727L67.0863 16.5277L63.9579 13.3488ZM72.5471 14.096L74.2857 12.3857L78.1815 13.4635L75.002 16.5914L72.5471 14.096ZM61.3855 18.7147L62.4634 14.8194L65.5908 17.9983L63.096 20.4533L61.3855 18.7147ZM76.472 18.0863L79.6515 14.9574L80.6656 18.8704L78.9275 20.5812L76.472 18.0863ZM68.5568 18.0221L71.0521 15.5671L73.5065 18.0625L71.0117 20.5175L68.5568 18.0221ZM64.567 21.9477L67.0618 19.4927L69.5177 21.9881L67.022 24.4431L64.567 21.9477ZM72.4828 22.0119L74.9775 19.5569L77.4325 22.0523L74.9372 24.5073L72.4828 22.0119ZM61.3334 25.1296L63.0725 23.4183L65.5269 25.9142L62.3485 29.0416L61.3334 25.1296ZM68.4925 25.9375L70.9877 23.4825L73.4427 25.9779L70.9479 28.4329L68.4925 25.9375ZM76.4077 26.0022L78.903 23.5472L80.614 25.2858L79.5366 29.1811L76.4077 26.0022ZM63.8185 30.537L66.9974 27.4081L69.4534 29.9035L67.7143 31.6148L63.8185 30.537ZM72.4184 29.9273L74.9132 27.4723L78.0411 30.6517L74.1289 31.6664L72.4184 29.9273Z"
            fill="white"
          />
        </svg>
        <Typography marginLeft={'-35px'} fontWeight={'600'} fontSize={'16px'}>
          {buttonMessage}
        </Typography>
      </Stack>
    </Button>
  );
};

Link.displayName = 'Link';

export default Link;
