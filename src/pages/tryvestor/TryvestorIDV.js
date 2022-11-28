import React, {useEffect, useState} from 'react';
import {
    Button,
    Card,
    CircularProgress,
    Grid,
    Stack,
    Typography
} from "@mui/material";
import {useSelector} from "react-redux";
import {useNavigate} from "react-router-dom";
import {DarkLogo} from "../../components/Logo";
import PlaidIDVButton from "../../utils/plaid/plaid-idv-button";
import {apiTryvestors} from "../../utils/api/api-tryvestors";

const iff = (condition, then, otherwise) => {
    if(condition){
        return then
    }
    return otherwise
}


const TryvestorIDV = () => {
    const uid = useSelector(state => state.user?.user.uid)
    const IDVerifStatusNum = useSelector(state => state.user?.user.data.IDVerificationStatus)
    const navigate = useNavigate();

    return (
        <div>
            <Stack spacing={3} paddingX={"25px"}>
                <Card style={{padding: '30px', borderRadius: 0}}>
                    <DarkLogo/>
                    <Typography fontSize={"33px"} fontWeight={"800"}>
                        Verify your Identity
                    </Typography>
                    <Typography color={"rgba(37,39,51,0.87)"} fontWeight={500} fontSize={"17px"} fontStyle={"italic"}>
                        Before you can claim your equity, we need to verify your identity using Plaid.
                    </Typography>
                </Card>
                <Card style={{padding: '30px', borderRadius: 0}}>
                    <Stack direction={"row"} alignItems={"center"} justifyContent={"space-between"} spacing={1} marginRight={"6vw"}>
                        <Stack>
                            <Typography fontSize={"25px"} fontWeight={"800"}>
                                Your Identity Verification Status
                            </Typography>
                            <Typography>
                                {iff(IDVerifStatusNum === 1, "Success - You're all Set!", (IDVerifStatusNum === -1 ? "Failed - Identity verification failed, please try again" : "Unverified - Verify your identity by clicking on the button to the right."))}
                            </Typography>
                        </Stack>
                        <PlaidIDVButton IDVerifStatusNum={IDVerifStatusNum}/>
                    </Stack>
                </Card>
                <Button onClick={() => navigate("/", {replace: true})}
                        style={{width: "175px", padding: '8px', fontWeight: '200', borderRadius: '35px'}} size="medium"
                        variant="contained">
                    Back to Dashboard
                </Button>
            </Stack>
        </div>
    )
}

export default TryvestorIDV;