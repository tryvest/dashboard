import React, {useEffect, useState} from "react";
import WidgetBot from '@widgetbot/react-embed'
import {useSelector} from "react-redux";
import Page from '../../components/Page';
import {apiBusinesses} from "../../utils/api/api-businesses";
import {BUSINESS} from "../../UserTypes";

// ----------------------------------------------------------------------

export default function BusinessCommunity() {
    const [businessInfo, setBusinessInfo] = useState(null)
    const [serverInfo, setServerInfo] = useState(null)
    const user = useSelector((state) => state.user?.user)
    const userType = useSelector((state) => state.user?.userType)

    useEffect(() => {
        if (userType === BUSINESS) {
            apiBusinesses.getSingle(user?.uid).then((data) => {
                setBusinessInfo(data);
            })
        }

    }, [user])

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