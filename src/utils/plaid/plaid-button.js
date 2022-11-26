import React, { useEffect, useContext, useState } from 'react';
import { usePlaidLink } from 'react-plaid-link';
import {Button, CircularProgress, Stack, Typography} from "@mui/material";
import {useSelector} from "react-redux";
import { api } from '../api/api';
import { TRYVESTOR, BUSINESS } from '../../UserTypes'

const Link = () => {
  const [linkToken, setLinkToken] = useState(null);

  // const currentUserUID = useSelector(state => state.user?.uid)
  // const currentUserType = useSelector(state => state.user?.userType)
  const currentUserUID = useSelector(state => state?.user?.user?.uid)
  const currentUserType = useSelector(state => state?.user?.user?.userType)

  const generateToken = async () => {
    api.createPlaidLinkToken().then((data) => {
      setLinkToken(data.link_token);
    });
  };


  useEffect(() => {
    generateToken()
  }, [])

  return linkToken && currentUserUID && currentUserType ? (
    <LinkHelper currentUserUID={currentUserUID} currentUserType={currentUserType} linkToken={linkToken} />
  ) : (
    <CircularProgress/>
  )
};

const LinkHelper = (props) => {
  const { linkToken, currentUserUID, currentUserType } = props;
  const onSuccess = React.useCallback(
    (publicToken) => {
      console.log(publicToken)
      // send public_token to server
      const convertAndAddPublicToken = async () => {
        const body = {
          publicToken,
          "UID": currentUserUID,
          "userType": currentUserType
        }
        const response = await api.exchangePublicTokenForAccessToken(body)
        console.log(response)
        if (!response.isOk) {
          console.log('Not ok it seems')
          return;
        }
        const data = await response.json;
        console.log("Looks like it worked, the returned data is below")
        console.log(data)
        /* dispatch({
          type: 'SET_STATE',
          state: {
            itemId: data.item_id,
            accessToken: data.access_token,
            isItemAccess: true,
          },
        }); */
      };
      convertAndAddPublicToken().then(r => window.location.reload());
      // window.history.pushState('', '', '/');
    },
    []
  );

  let isOauth = false;
  const config = {
    token: linkToken,
    onSuccess,
  };

  if (window.location.href.includes('?oauth_state_id=')) {
    // TODO: figure out how to delete this ts-ignore
    config.receivedRedirectUri = window.location.href;
    isOauth = true;
  }

  const { open, ready } = usePlaidLink(config);

  useEffect(() => {
    if (isOauth && ready) {
      open();
    }
  }, [ready, open, isOauth]);

  return (
    <Button variant={"contained"} onClick={() => open()} disabled={!ready} sx={{borderRadius: "30px", paddingInline: "25px", height: "40px"}}>
      <Stack direction={"row"} marginLeft={"-60px"} alignItems={"center"}>
        <svg width="126" height="40" viewBox="0 0 126 48" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path fillRule="evenodd" clipRule="evenodd" d="M68.516 10L61.0883 11.9261L59.0414 19.3218L61.6015 21.9244L59 24.484L60.9265 31.9121L68.3219 33.958L70.9239 31.3979L73.484 34L80.9117 32.0739L82.9581 24.6776L80.3985 22.0761L83 19.5165L81.0735 12.0879L73.677 10.042L71.0761 12.6016L68.516 10ZM63.9579 13.3488L67.8706 12.3336L69.5816 14.0727L67.0863 16.5277L63.9579 13.3488ZM72.5471 14.096L74.2857 12.3857L78.1815 13.4635L75.002 16.5914L72.5471 14.096ZM61.3855 18.7147L62.4634 14.8194L65.5908 17.9983L63.096 20.4533L61.3855 18.7147ZM76.472 18.0863L79.6515 14.9574L80.6656 18.8704L78.9275 20.5812L76.472 18.0863ZM68.5568 18.0221L71.0521 15.5671L73.5065 18.0625L71.0117 20.5175L68.5568 18.0221ZM64.567 21.9477L67.0618 19.4927L69.5177 21.9881L67.022 24.4431L64.567 21.9477ZM72.4828 22.0119L74.9775 19.5569L77.4325 22.0523L74.9372 24.5073L72.4828 22.0119ZM61.3334 25.1296L63.0725 23.4183L65.5269 25.9142L62.3485 29.0416L61.3334 25.1296ZM68.4925 25.9375L70.9877 23.4825L73.4427 25.9779L70.9479 28.4329L68.4925 25.9375ZM76.4077 26.0022L78.903 23.5472L80.614 25.2858L79.5366 29.1811L76.4077 26.0022ZM63.8185 30.537L66.9974 27.4081L69.4534 29.9035L67.7143 31.6148L63.8185 30.537ZM72.4184 29.9273L74.9132 27.4723L78.0411 30.6517L74.1289 31.6664L72.4184 29.9273Z" fill="white"/>
        </svg>
        <Typography marginLeft={"-35px"} fontWeight={"600"} fontSize={"16px"}>
          Add Accounts via Plaid
        </Typography>
      </Stack>
    </Button>
  );
};

Link.displayName = 'Link';

export default Link;
/*
// APP COMPONENT
// Upon rendering of App component, make a request to create and
// obtain a link token to be used in the Link component
import React, { useEffect, useState } from 'react';
import { usePlaidLink } from 'react-plaid-link';
import {api} from "../api/api";

const App = () => {
    const [linkToken, setLinkToken] = useState(null);
    const generateToken = async () => {
        api.createPlaidLinkToken().then((data) => {
            setLinkToken(data.link_token);
        })
    };
    useEffect(() => {
        generateToken();
    }, []);
    return linkToken != null ? <Link linkToken={linkToken} /> : <></>;
};

// LINK COMPONENT
// Use Plaid Link and pass link token and onSuccess function
// in configuration to initialize Plaid Link
const Link = (props) => {
    const onSuccess = React.useCallback((publicToken, metadata) => {
        // send publicToken to server
        const response = fetch('/api/set_access_token', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ publicToken }),
        });
        // Handle response ...
    }, []);
    let isOauth = false;
    const config = {
        token: props.linkToken,
        receivedRedirectUri: window.location.href,
        onSuccess,
    };

    if (window.location.href.includes("?oauth_state_id=")) {
        // TODO: figure out how to delete this ts-ignore
        config.receivedRedirectUri = window.location.href;
        isOauth = true;
    }
    console.log('got here 1')
    const { open, ready } = usePlaidLink(config);
    console.log('got here 2')

    const [isReady, setIsReady] = useState(ready)

    useEffect(() => {
        /!*if (isOauth && ready) {
            open();
        }*!/
        if(ready){
            setIsReady(true)
        }
    }, [ready, open, isOauth]);

    return (
        <button onClick={() => open()} disabled={!isReady}>
            Link account
        </button>
    );
};
export default App;
*/
