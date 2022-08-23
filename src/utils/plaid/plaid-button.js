/*
import React, { useEffect, useState } from "react";
import { usePlaidLink } from "react-plaid-link";
import Button from "plaid-threads/Button";
import {useSelector} from "react-redux";
import {api} from "../api/api";


const Link = () => {
    const [linkToken, setLinkToken] = useState()

    useEffect(() => {
        api.createPlaidLinkToken().then((data) => {
            setLinkToken(data.link_token)
            console.log(data)
        })
    }, [])

    const onSuccess = React.useCallback(
        (publicToken) => {
            // send public_token to server
            const setToken = async () => {
                const response = await fetch("/api/set_access_token", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
                    },
                    body: `public_token=${publicToken}`,
                });
                if (!response.ok) {
                    console.log({
                        type: "SET_STATE",
                        state: {
                            itemId: `no item_id retrieved`,
                            accessToken: `no access_token retrieved`,
                            isItemAccess: false,
                        },
                    });
                    return;
                }
                const data = await response.json();
                console.log({
                    type: "SET_STATE",
                    state: {
                        itemId: data.item_id,
                        accessToken: data.access_token,
                        isItemAccess: true,
                    },
                });
            };
            setToken();
            console.log({ type: "SET_STATE", state: { linkSuccess: true } });
            window.history.pushState("", "", "/");
        },
        []
    );

    const isOauth = false;
    const config = {
        token: linkToken,
        receivedRedirectUri: window.location.href,
        onSuccess,
        env: "sandbox",
        isOauth: false
    };

    if (window.location.href.includes("?oauth_state_id=")) {
        // TODO: figure out how to delete this ts-ignore
        // @ts-ignore
        config.receivedRedirectUri = window.location.href;
    }

    const { open, ready } = usePlaidLink(config);

    useEffect(() => {
        if (ready) {
            open();
        }
    }, [ready, open, isOauth]);

    return linkToken ?
            (<Button type="button" large onClick={() => open()} disabled={!ready}>
                Launch Link
            </Button>) : (<div/>)
};

Link.displayName = "Link";

export default Link;
*/
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
        // @ts-ignore
        config.receivedRedirectUri = window.location.href;
        isOauth = true;
    }
    console.log('got here 1')
    const { open, ready } = usePlaidLink(config);
    console.log('got here 2')

    const [isReady, setIsReady] = useState(ready)

    useEffect(() => {
        /*if (isOauth && ready) {
            open();
        }*/
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


