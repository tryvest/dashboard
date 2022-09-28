import { useEffect, useState, View } from 'react';
// material
import { useTheme } from '@mui/material/styles';
import {
    Avatar,
    CircularProgress,
    Grid,
    Container,
    Typography,
    Backdrop,
    Button,
    Card,
    Stack,
    CardHeader,
    CardContent, Box, Chip,
    SvgIcon, IconButton, Slider,
} from '@mui/material';
import ReactMarkdown from "react-markdown";
import { bindActionCreators } from "redux";
// components
import ReactReduxContext, { connect, useSelector, useStore } from 'react-redux';
import { useParams } from "react-router-dom";
import { fShortenNumber, fCurrency } from '../utils/formatNumber'
import Page from '../components/Page';
import {DarkLogo} from '../components/Logo';
import Divider from '../images/divider.png'
import { apiBusinesses } from '../utils/api/api-businesses';


import ACCOUNT from "../_mock/account";

const CompanySpecificPage = () => {
    const theme = useTheme();
    const businessID = useParams()
    console.log(businessID.id)
    const [businessInfo, setBusinessInfo] = useState()
    const [businessCampaignInfo, setBusinessCampaignInfo] = useState()
    useEffect(() => {
        apiBusinesses.getMostRecentCampaignInfo(businessID.id).then(campaignInfoByID => setBusinessCampaignInfo(campaignInfoByID))
        apiBusinesses.getCompanyInfoByID(businessID.id).then(companyInfoByID => setBusinessInfo(companyInfoByID))
    }, [])

    // useEffect(() => {
    //     apiBusinesses.getCategoryName().then((categoryData) => {
    //         // setAllCategories(categoryData)
    //         const categoryToName = {}
    //         // const categoryIDs = Object.keys(categoryData)
    //         for (let i = 0; i < categoryData.length; i += 1) {
    //             const tempCat = categoryData[i]
    //             categoryToName[tempCat.categoryID] = tempCat.categoryName
    //         }
    //         console.log(categoryToName)
    //         setAllCategories(categoryToName)
    //     })
    // }, [])

    return (
        <Page title="Company Specific Information">
            {
                businessInfo && businessCampaignInfo ? (
                    <Container>
                        {/* <a>Business Name: {businessInfo.name}</a>
                        <a>Valuation: ${businessInfo.valuation}</a>
                        <a>Amount Raised: ${businessInfo.amountRaised}</a>
                        <a>Additional Info: {businessInfo.additionalInformation}</a>
                        <a>Stockback Percent: {businessCampaignInfo.stockBackPercent}%</a> */}
                        <Grid container direction="row" style={{alignItems: "center", display: "flex"}}>
                            <div style={{ height: 60, width: 100, marginRight: "20px" }}>
                                <DarkLogo/>
                            </div>
                            <div style={{ height: 60, marginRight: "20px" }}>
                                <img src={Divider} alt="Divider" />
                            </div>
                            <div style={{ height: 60, width: 150 }}>
                                <img src={businessInfo.logo} alt="Company Logo" />
                            </div>
                        </Grid>
                        <div style={{ marginTop: "20px" }}>

                            <Typography fontSize={"40px"} fontWeight={"700"}>
                                {businessInfo.name} Stock-Back Program
                        </Typography>
                            <Typography fontSize={"20px"} fontWeight={"500"} fontStyle={"italic"}>
                                Receive equity for helping {businessInfo.name} grow
                        </Typography>
                        </div>
                        <Grid container spacing={1} style={{ marginTop: "15px" }}>
                            <Grid item xs={12} sm={12} md={9}>
                                <Card style={{ backgroundColor: theme.palette.primary.dark }}>
                                    <CardContent>
                                        <Stack spacing={1}>
                                            <div style={{ marginBottom: '45px' }}>
                                                <Typography fontSize={"28px"} fontWeight={"600"} color={"#fff"}>
                                                    Your Potential Stake in {businessInfo.name}
                                                </Typography>
                                                <Typography fontSize={"16px"} fontWeight={"400"} color={"#fff"} fontStyle="italic">
                                                    As a part of {businessInfo.name}, you can earn money while you help it grow
                                                </Typography>
                                                <Typography fontSize={"64px"} fontWeight={"700"} color={"#04D49C"}>
                                                    {businessCampaignInfo.stockBackPercent}2.5%
                                                </Typography>
                                                <Typography fontSize={"24px"} fontWeight={"500"} color={"#fff"} fontStyle="italic">
                                                    stock-back in {businessInfo.name} for each {businessInfo.name} purchase
                                                </Typography>
                                            </div>
                                        </Stack>
                                    </CardContent>
                                </Card>
                                <div style={{ marginTop: "25px", marginLeft: '5px' }}>
                                    <Typography fontWeight={700} fontSize={20} color={"black"}>
                                        Information regarding {businessInfo.name}
                                    </Typography>
                                </div>
                                <div style={{ marginTop: "5px", marginLeft: '5px' }}>
                                    <Typography fontWeight={500} fontSize={15} color={"black"}>
                                        {businessInfo.additionalInformation}
                                    </Typography>
                                </div>
                            </Grid>
                            <Grid item xs={12} sm={12} md={3}>
                                <Stack spacing={3}>
                                    <Card style={{ padding: "25px", marginLeft: '20px', backgroundColor: theme.palette.primary.dark, width: '292px' }}>
                                        <Stack>
                                            <Typography fontWeight={600} fontSize={24} color={"white"}>
                                                Requirements
                                        </Typography>
                                            <Typography fontWeight={500} fontSize={20} color={"white"}>
                                                {businessInfo.tryvestorRequirements}
                                            </Typography>
                                        </Stack>
                                    </Card>
                                    <Card style={{ marginTop: '25px', marginLeft: '20px', padding: '25px', width: '292px' }}>
                                        <Stack spacing={1}>
                                            <Typography fontWeight={600} fontSize={24}>
                                                Financial Disclosures
                                        </Typography>
                                            <Stack>
                                                <Typography fontWeight={800} fontSize={16}>
                                                    Valuation:
                                            </Typography>
                                                <Typography fontWeight={400} fontSize={15}>
                                                    {fCurrency(businessInfo.valuation)}
                                                </Typography>
                                            </Stack>
                                            <Stack>
                                                <Typography fontWeight={800} fontSize={16}>
                                                    Amount Raised:
                                            </Typography>
                                                <Typography fontWeight={400} fontSize={15}>
                                                    {fCurrency(businessInfo.amountRaised)}
                                                </Typography>
                                            </Stack>
                                            <Stack>
                                                <Typography fontWeight={800} fontSize={16}>
                                                    Current Investors:
                                            </Typography>
                                                {/* {businessInfo.currentInvestors.map((investor, index) => (
                                                    <Typography key={index} fontWeight={400} fontSize={15}>
                                                        {investor}
                                                    </Typography>
                                                )
                                                )} */}
                                                {businessInfo.currentInvestors}
                                            </Stack>
                                        </Stack>
                                    </Card>
                                    <Grid container justifyContent={"center"} style={{ marginTop: "15px" }}>
                                        <Button style={{ borderRadius: "14px", padding: "10px", backgroundColor: "#04D49C" }} variant={"contained"}>
                                            <SvgIcon>
                                                <svg width="26" height="23" viewBox="0 0 26 23" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <path d="M24.1247 4.74792C21.2745 4.75123 18.5418 5.91426 16.5264 7.98186C14.5109 10.0495 13.3772 12.8528 13.374 15.7768V21.0762C13.3846 21.5793 13.5868 22.0582 13.9375 22.4103C14.2881 22.7623 14.7592 22.9594 15.2497 22.9594C15.7403 22.9594 16.2114 22.7623 16.562 22.4103C16.9126 22.0582 17.1149 21.5793 17.1255 21.0762V15.7768C17.1275 13.8731 17.8656 12.048 19.1778 10.7019C20.49 9.35574 22.269 8.59855 24.1247 8.59643C24.6152 8.58559 25.082 8.3781 25.4252 8.01841C25.7683 7.65872 25.9605 7.17546 25.9605 6.67218C25.9605 6.16889 25.7683 5.68563 25.4252 5.32594C25.082 4.96625 24.6152 4.75876 24.1247 4.74792" fill="white" />
                                                    <path d="M23.4776 3.8485C23.9681 3.83767 24.4349 3.63017 24.7781 3.27049C25.1212 2.9108 25.3134 2.42754 25.3134 1.92425C25.3134 1.42097 25.1212 0.937703 24.7781 0.578016C24.4349 0.218329 23.9681 0.0108364 23.4776 5.45531e-07C21.5242 -0.000650693 19.5905 0.401907 17.7919 1.18371C15.9932 1.96551 14.3662 3.11058 13.0079 4.55075C11.6494 3.10625 10.0203 1.95848 8.21834 1.17644C6.41643 0.394392 4.47897 -0.00577231 2.52244 5.45531e-07C2.03196 0.0108364 1.56513 0.218329 1.22199 0.578016C0.878842 0.937703 0.68668 1.42097 0.68668 1.92425C0.68668 2.42754 0.878842 2.9108 1.22199 3.27049C1.56513 3.63017 2.03196 3.83767 2.52244 3.8485C4.07897 3.84363 5.61808 4.18444 7.03407 4.84753C8.45006 5.51061 9.70937 6.48026 10.7255 7.68987C10.5307 8.04679 10.35 8.41174 10.1836 8.78472C9.17651 7.52275 7.90876 6.506 6.47195 5.80789C5.03514 5.10978 3.46513 4.74775 1.87531 4.74794C1.38483 4.75878 0.918004 4.96627 0.574858 5.32596C0.231712 5.68565 0.0395508 6.16891 0.0395508 6.67219C0.0395508 7.17548 0.231712 7.65874 0.574858 8.01843C0.918004 8.37812 1.38483 8.58561 1.87531 8.59645C3.73054 8.59928 5.50896 9.35677 6.82056 10.7028C8.13217 12.0489 8.86989 13.8736 8.87196 15.7768V21.0762C8.88253 21.5794 9.08479 22.0583 9.4354 22.4103C9.78602 22.7623 10.2571 22.9595 10.7477 22.9595C11.2383 22.9595 11.7094 22.7623 12.06 22.4103C12.4106 22.0583 12.6128 21.5794 12.6234 21.0762V15.7768C12.6234 15.5859 12.6188 15.3961 12.6095 15.2075C12.6185 15.1323 12.6232 15.0566 12.6234 14.9809C12.6266 12.0289 13.7713 9.19889 15.8062 7.11181C17.8412 5.02472 20.6001 3.8511 23.4776 3.8485" fill="white" />
                                                </svg>
                                            </SvgIcon>
                                            <Typography color="black" style={{ marginLeft: "8px", fontSize: "13px" }}>
                                                Join Program
                                                </Typography>
                                        </Button>
                                    </Grid>
                                </Stack>
                            </Grid>
                            {/* <Grid item xs={12} sm={12} md={12}>
                                <PayoutSlider currentVal={businessInfo.valuation} businessName={businessInfo.name} percentCompanyOwned={calcTotalPossibleSharesAsPercent()} />
                            </Grid> */}
                        </Grid>
                    </Container>

                ) : (<CircularProgress />)
            }
        </Page>
    );
}



export default (CompanySpecificPage);
