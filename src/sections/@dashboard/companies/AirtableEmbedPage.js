import React from 'react';
import {useParams} from "react-router-dom";
import {useSelector} from "react-redux";
import Page from "../../../components/Page";

function AirtableEmbedPage() {
    const { embedURL } = useParams()
    const user = useSelector((state) => state.user?.user)
    const firstName = user?.firstName
    const lastName = user?.lastName
    const username = user?.username
    return (
        <Page title={"Specific Task Page"}>
            <div style={{height: "100vh"}}>
                <iframe className="airtable-embed airtable-dynamic-height" src={`https://airtable.com/embed/${embedURL}?prefill_First+Name=${firstName}&prefill_Last+Name=${lastName}&prefill_Email=${username}`} title={embedURL}
                        frameBorder="0" onScroll="" width="100%" height="1000vh"
                        style={{background: "transparent", border: "1px solid #ccc"}}/>
            </div>
        </Page>
    );
}

export default AirtableEmbedPage;