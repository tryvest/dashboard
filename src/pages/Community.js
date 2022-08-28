import {faker} from '@faker-js/faker';
import React, {useEffect, useState} from "react";

// @mui
import {useTheme} from '@mui/material/styles';
import {
    Grid,
    Container,
    Typography,
    Backdrop,
    Button,
    CircularProgress,
    Card,
    Stack,
    CardHeader,
    CardContent, Box, Chip,
    SvgIcon, IconButton, Slider,
} from '@mui/material';
// components
import {useSelector} from "react-redux";
import {useNavigate} from "react-router-dom";
import Carousel from "better-react-carousel";
import ReactPlayer from "react-player";
// import MuiMarkdown from "mui-markdown";
import ReactMarkdown from "react-markdown";
import WidgetBot from '@widgetbot/react-embed'
import {fShortenNumber, fCurrency} from '../utils/formatNumber'
import Page from '../components/Page';
import COMPANIES from '../_mock/companies';

// ----------------------------------------------------------------------

export default function Community() {
    const theme = useTheme();
    const user = useSelector((state) => state.auth?.user)
    const businessID = useSelector((state) => state.business.businessID)
    const [userObj, setUserObj] = useState(null)
    const [serverInfo, setServerInfo] = useState(null)
    const navigate = useNavigate()

    const iff = (condition, then, otherwise) => {
        if (condition) {
            console.log(condition)
            return then
        }
        return otherwise
    };

    useEffect(() => {
        if (user) {
            setUserObj(user)
        }

    }, [user])

    useEffect(() => {
        if(userObj) {
            userObj.businessesRespondedTo.forEach((businessTemp) => {
                if(businessTemp.businessID === businessID){
                    setServerInfo({
                        channelID: businessTemp.channelID,
                        serverID: businessTemp.serverID
                    })
                }
            })
        }
    }, [userObj, businessID])

    return (
        <Page title="Communication">
            <div style={{width: "100%", height: "100%", padding: "20px"}}>
                {/*
                {serverInfo && <WidgetBot
                    style={{width: "100%", height: "75vh"}}
                    server={serverInfo.serverID}
                    channel={serverInfo.channelID}
                />}
                */}
                WidgetBot has been commented out in ./src/pages/Community.js file - Temp placeholder
            </div>
        </Page>
    );
}