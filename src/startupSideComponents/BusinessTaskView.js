import React, {useEffect, useState} from 'react';
// material
import {Card, CardContent, CircularProgress, Container, Grid, Stack, Typography, LinearProgress, Box} from '@mui/material';
// components
import {styled} from "@mui/material/styles";
import {useSelector} from "react-redux";
import Page from '../components/Page';
import { ProductSort, ProductCartWidget, CompanyList, ProductFilterSidebar } from '../sections/@dashboard/companies';
// mock
import COMPANIES from '../_mock/companies';
import {apiBusinesses} from "../utils/api/api-businesses";
import {apiTryvestors} from "../utils/api/api-tryvestors";
import UserDashboardInfo from "../sections/@dashboard/user/UserDashboardInfo";
import {business} from "../App";


// ----------------------------------------------------------------------

export default function BusinessTaskView() {
    // const business = useSelector((state) => state?.business)
    const [businessInfo, setBusinessInfo] = useState()

    useEffect(() => {
        if(business){
            apiBusinesses.getSingle(business.businessID).then((data) => {
                setBusinessInfo(data)
            })
        }
    }, [business])

    return (
        <Page title="Dashboard: Products">
            {businessInfo ?
                (<Grid container spacing={1}>
                    <Grid item xs={12} sm={12} md={12}>
                        <Card sx={{padding: "5px", display: "inline-block"}}>
                            <CardContent>
                                <Stack direction={"row"}>
                                    <Stack direction={"row"} spacing={2}>
                                        <div style={{height: "60px", width: "60px"}}>
                                            <img src={businessInfo.logo} alt="business logo"/>
                                        </div>
                                        <Typography variant={"h3"}>
                                            {businessInfo.name}
                                        </Typography>
                                    </Stack>
                                </Stack>
                            </CardContent>
                        </Card>
                    </Grid>

                    <Grid item xs={12} sm={12} md={12}>
                        <Card sx={{padding: "15px", display: "inline-block", width: "100%", height: "50px"}}>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <Box sx={{ width: '100%', mr: 1 }}>
                                    <LinearProgress variant={"determinate"} value={calcProgress().percentComplete} style={{borderRadius: "7.5px", height: "15px"}}/>
                                </Box>
                                <Box sx={{ minWidth: 35 }}>
                                    <Typography variant="body2" color="text.secondary">{`${Math.round(calcProgress().percentComplete
                                    )}%`}</Typography>
                                </Box>
                            </Box>
                        </Card>
                    </Grid>

                    <Grid item xs={12} sm={12} md={12}>
                        <Card>
                            <UserDashboardInfo
                                title="Your"
                                subheader='Businesses'
                                userObj={userInfo}
                                businessInfo={businessInfo}
                            />
                        </Card>
                    </Grid>

                    {/*
                    <Stack direction="row" flexWrap="wrap-reverse" alignItems="center" justifyContent="flex-end"
                           sx={{mb: 5}}>
                        <Stack direction="row" spacing={1} flexShrink={0} sx={{my: 1}}>
                            <ProductFilterSidebar
                                isOpenFilter={openFilter}
                                onOpenFilter={handleOpenFilter}
                                onCloseFilter={handleCloseFilter}
                            />
                            <ProductSort/>
                        </Stack>
                    </Stack>
                    */}
                </Grid>) :
                (<CircularProgress/>)
            }
        </Page>
    );
}
