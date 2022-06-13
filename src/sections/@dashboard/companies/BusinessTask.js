import React, {useEffect, useState} from 'react';
import {Card, CardContent, Grid, Typography} from "@mui/material";
import {useNavigate} from "react-router-dom";
import Button from "@mui/material/Button";
import {useSelector} from "react-redux";
import {apiBusinesses} from "../../../utils/api/api-businesses";


function BusinessTask({singleTermDoc}) {
    const user = useSelector((state) => state.auth?.user)
    const uid = user?.uid

    const navigate = useNavigate()
    const askLogin = () => {navigate('/login')}
    const [tryvestorID, setTryvestorID] = useState(uid)
    const [response, setResponse] = useState()

    useEffect( () => {

        const allResponses = singleTermDoc.responses;
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
                                {`Task Description: ${singleTermDoc.responses.length} Responses`}
                            </Typography>
                            {singleTermDoc.description}
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
                                        <Button variant={"contained"} size={"medium"} onClick={user ? () => {navigate(`/termDocuments/${singleTermDoc.formLink}`)} : askLogin}>
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