import React from 'react';
import {useParams} from "react-router-dom";
import Page from "../../../components/Page";

function AirtableEmbedPage(props) {
    const { embedUrl } = useParams()

    return (
        <Page title={"Specific Task Page"}>
            <div style={{height: "100vh"}}>
                <iframe className="airtable-embed airtable-dynamic-height" src={"https://airtable.com/embed/shrEY45pgx1j6xRXA?backgroundColor=yellow"} title={embedUrl}
                        frameBorder="0" onScroll="" width="100%" height="100vh"
                        style={{background: "transparent", border: "1px solid #ccc"}}/>
            </div>
        </Page>
        // <iframe className="airtable-embed airtable-dynamic-height"
        //         src="https://airtable.com/embed/shrEY45pgx1j6xRXA?backgroundColor=yellow" frameBorder="0"
        //         onmousewheel="" width="100%" height="1055"
        //         style="background: transparent; border: 1px solid #ccc;"></iframe>

    );
}

export default AirtableEmbedPage;