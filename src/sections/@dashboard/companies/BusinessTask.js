import React, {useEffect, useState} from 'react';
import {Card, CardContent, Grid, Typography} from "@mui/material";
import {useNavigate} from "react-router-dom";
import Button from "@mui/material/Button";
import {apiBusinesses} from "../../../utils/api/api-businesses";


function BusinessTask(props) {
    const navigate = useNavigate()
    const goAirtableEmbedPage = () => {navigate(`/termDocuments/embedURL`)}
    const [tryvestorID, setTryvestorID] = useState("mjg7s3tfUkTyOeFQeKzEaiuCk562")
    const [response, setResponse] = useState()

    useEffect( () => {

        const allResponses = props.singleTermDoc.responses;
        let currentUserResponse = null
        allResponses.forEach((response) => {
            if(response.tryvestorID === tryvestorID) {
                currentUserResponse = response
            }
        })
        setResponse(currentUserResponse)
    }, []);

    return (
        <div>
            <Card>
                <CardContent>
                    <Grid container justifyContent={"space-between"} justifyItems={"space-between"}>
                        <Grid item xs={12} sm={12} md={12}>
                            <Typography variant={"h4"}>
                                {`Task Description: ${props.singleTermDoc.responses.length} Responses`}
                            </Typography>
                            {props.singleTermDoc.description}
                        </Grid>
                        <Grid item xs={12} sm={6} md={6} lg={6}>
                            <div>
                                {
                                    response ? (
                                        <div>
                                            <Typography variant={"h6"}>
                                                You Submitted! - Verification Status: {response.verificationStatus}
                                            </Typography>
                                        </div>
                                    ) : (
                                        <Button variant={"contained"} size={"medium"} onClick={goAirtableEmbedPage}>
                                            Complete Task
                                        </Button>
                                    )
                                }
                            </div>
                        </Grid>
                    </Grid>
                </CardContent>
            </Card>
        </div>
    );
}

export default BusinessTask;