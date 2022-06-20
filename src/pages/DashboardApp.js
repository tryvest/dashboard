import {faker} from '@faker-js/faker';
import React, {useEffect, useState} from "react";

// @mui
import {useTheme} from '@mui/material/styles';
import {Grid, Container, Typography, Backdrop, Button, CircularProgress} from '@mui/material';
// components
import {useSelector} from "react-redux";
import {useNavigate} from "react-router-dom";
import Page from '../components/Page';

import COMPANIES from '../_mock/companies';

// sections
import TASKS from '../_mock/tasks';
import UserDashboardInfo from "../sections/@dashboard/user/UserDashboardInfo";
import {apiTryvestors} from "../utils/api/api-tryvestors";

// ----------------------------------------------------------------------

export default function DashboardApp() {
    const theme = useTheme();
    const user = useSelector((state) => state.auth?.user)
    // const [responses, setResponses] =  useState(null)
    const [userObj, setUserObj] = useState(null)
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
            apiTryvestors.getSingle(user.uid).then((data) => {
                setUserObj(data);
                console.log(data.businessesRespondedTo)
            })
        }

    }, [user, userObj])

    return (<Page title="Dashboard">
        <Container maxWidth="xl">

            {user ? iff((userObj), (
                <>
                    <Typography variant="h4" sx={{mb: 5}}> Welcome Back, {user.firstName}! </Typography>
                    <Grid container spacing={3}>
                        <Grid item xs={12} md={12} lg={12}>
                            <UserDashboardInfo
                                title="Your"
                                subheader='Businesses'
                                userObj={userObj}
                            />
                        </Grid>
                    </Grid>
                </>), (<CircularProgress style={{justifyContent: 'center', alignContent: 'center'}}/>)) : (<>
                <Grid container spacing={1}>
                    <Grid item xs={12} md={6} lg={8}>
                        <div>
                            <Button onClick={() => {
                                navigate('/register')
                            }} variant='contained'>
                                Register
                            </Button>
                        </div>
                    </Grid>
                    <Grid item xs={12} md={6} lg={8}>
                        <div>
                            <Button onClick={() => {
                                navigate('/login')
                            }} variant='outlined'>
                                Login
                            </Button>
                        </div>
                    </Grid>
                </Grid>
            </>)}
        </Container>
    </Page>);
}
