import React, {useEffect, useState} from "react";
import WidgetBot from '@widgetbot/react-embed'
import Page from '../../components/Page';
import {apiBusinesses} from "../../utils/api/api-businesses";
import {business} from "../../App";

// ----------------------------------------------------------------------

export default function BusinessCommunity() {
    const [businessInfo, setBusinessInfo] = useState(null)
    const [serverInfo, setServerInfo] = useState(null)

    useEffect(() => {
        if (business) {
            apiBusinesses.getSingle(business.businessID).then((data) => {
                setBusinessInfo(data);
            })
        }

    }, [business])

    useEffect(() => {
        if(businessInfo) {
            setServerInfo({
                channelID: businessInfo.channelID,
                serverID: businessInfo.serverID
            })
        }
    }, [businessInfo])

    return (
        <Page title="Communication">
            <div style={{width: "100%", height: "100%", padding: "20px"}}>
                {serverInfo && <WidgetBot
                    style={{width: "100%", height: "75vh"}}
                    server={serverInfo.serverID}
                    channel={serverInfo.channelID}
                />}
            </div>
        </Page>
    );
}