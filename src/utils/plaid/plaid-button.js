import React, { useEffect, useContext, useState } from 'react';
import { usePlaidLink } from 'react-plaid-link';
import Button from 'plaid-threads/Button';
import {CircularProgress} from "@mui/material";
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
      convertAndAddPublicToken();
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
    <Button type="button" large onClick={() => open()} disabled={!ready}>
      Launch Link
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
