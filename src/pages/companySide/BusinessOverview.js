import React, {useState} from 'react';
import {Button, Card, Grid, IconButton, Stack, Typography} from "@mui/material";
import {useTheme} from "@mui/material/styles";
import SwitchSelector from "react-switch-selector";

function BusinessOverview(props) {
    const topCardsSize = {
        xs: 12,
        sm: 6,
        md: 2
    }
    const topCardFontSize = 13
    const numTryvestorsTotal = 780
    const numTryvestorsPending = 116
    const numSharesIssued = 300
    const theme = useTheme()

    const [pendingOrCompleted, setPendingOrCompleted] = useState("pending")
    const [businessInfo, setBusinessInfo] = useState({tryvestors: [
            {name: 'person1'}, {name: 'person2'}
        ]})
    const selectorOptions = [
        {
            label: "Pending Tryvestors",
            value: "pending",
            selectedBackgroundColor: theme.palette.primary.dark
        },
        {
            label: "Completed Tryvestors",
            value: "completed",
            selectedBackgroundColor: theme.palette.primary.dark
        }
    ]
    const initialSelectedIndex = selectorOptions.findIndex(({value}) => value === "pending");
    const onSelectorChange = (val) => {
        setPendingOrCompleted(val)
    }



    return (
        <Grid container spacing={3}>
            <Grid item xs={12} sm={12} md={12}>
                <Grid container spacing={2}>
                    <Grid item xs={topCardsSize.xs} sm={topCardsSize.sm} md={topCardsSize.md}>
                        <Card style={{minHeight: "120px", minWidth: "150px", backgroundColor: theme.palette.primary.dark, color: 'white'}}>
                            <Stack margin={"auto"} style={{alignItems: 'center', textAlign: "center", justifyItems: "center"}}>
                                <Typography fontWeight={800} fontSize={42}>
                                    {numTryvestorsTotal}
                                </Typography>
                                <Typography marginTop={"-5px"} fontWeight={600} fontSize={topCardFontSize}>
                                    Current <br/> Tryvestors
                                </Typography>
                            </Stack>
                        </Card>
                    </Grid>
                    <Grid item xs={topCardsSize.xs} sm={topCardsSize.sm} md={topCardsSize.md}>
                        <Card style={{minHeight: "120px", minWidth: "150px", border: '1.5px solid black'}}>
                            <Stack margin={"auto"} style={{alignItems: 'center', textAlign: "center", justifyItems: "center"}}>
                                <Typography fontWeight={800} fontSize={42}>
                                    {numTryvestorsPending}
                                </Typography>
                                <Typography marginTop={"-5px"} fontWeight={600} fontSize={topCardFontSize}>
                                    Pending <br/> Tryvestors
                                </Typography>
                            </Stack>
                        </Card>
                    </Grid>
                    <Grid item xs={topCardsSize.xs} sm={topCardsSize.sm} md={topCardsSize.md}>
                        <Card style={{minHeight: "120px", minWidth: "150px", border: '1.5px solid black'}}>
                            <Stack margin={"auto"} style={{alignItems: 'center', textAlign: "center", justifyItems: "center"}}>
                                <Typography fontWeight={800} fontSize={42}>
                                    {numSharesIssued}
                                </Typography>
                                <Typography marginTop={"-5px"} fontWeight={600} fontSize={topCardFontSize}>
                                    Phantom Shares <br/> Issued
                                </Typography>
                            </Stack>
                        </Card>
                    </Grid>
                    <Grid item xs={topCardsSize.xs} sm={topCardsSize.sm} md={topCardsSize.md}/>
                    <Grid item xs={topCardsSize.xs} sm={topCardsSize.sm} md={topCardsSize.md * 2}>
                        <Stack spacing={1} margin={"auto"} style={{alignItems: 'flex-end', textAlign: "center", justifyItems: "center"}}>
                            <Button style={{marginTop: "5px", color: 'black'}} variant={"outlined"}>
                                <svg width="57" height="34" viewBox="0 0 64 50" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M42.6565 14.4847H37.3284V22.6012H29.3363V28.0123H37.3284V36.1288H42.6565V28.0123H50.6487V22.6012H42.6565V14.4847ZM5.35984 25.3068C5.35984 17.7584 9.7422 11.2516 16.0427 8.20786V2.37746C6.73182 5.70525 0.0317383 14.7146 0.0317383 25.3068C0.0317383 35.8989 6.73182 44.9083 16.0427 48.2361V42.4057C9.7422 39.3619 5.35984 32.8552 5.35984 25.3068ZM39.9925 0.957062C26.7655 0.957062 16.016 11.8738 16.016 25.3068C16.016 38.7397 26.7655 49.6564 39.9925 49.6564C53.2195 49.6564 63.9689 38.7397 63.9689 25.3068C63.9689 11.8738 53.2195 0.957062 39.9925 0.957062ZM39.9925 44.2454C29.7092 44.2454 21.3441 35.7501 21.3441 25.3068C21.3441 14.8634 29.7092 6.3681 39.9925 6.3681C50.2757 6.3681 58.6408 14.8634 58.6408 25.3068C58.6408 35.7501 50.2757 44.2454 39.9925 44.2454Z" fill="black"/>
                                </svg>
                                <Typography marginLeft={"10px"} fontWeight={600} fontSize={topCardFontSize}>
                                    View Tryvestor Tasks
                                </Typography>
                            </Button>
                            <Button style={{alignItems: 'center', textAlign: "center", justifyItems: "center"}} variant={'contained'}>
                                <svg width="57" height="34" viewBox="0 0 57 34" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M39.4182 0.171753L45.8249 6.5534L32.2018 20.1092L21.0353 8.98649L0.335449 29.6052L4.2856 33.5399L21.0353 16.8558L32.2018 27.9785L49.7611 10.4742L56.1679 16.8558V0.171753H39.4182Z" fill="white"/>
                                </svg>
                                <Typography marginLeft={"10px"} marginTop={"5px"} fontWeight={600} fontSize={topCardFontSize}>
                                    Inform of Valuation Raise
                                </Typography>
                            </Button>
                        </Stack>
                    </Grid>
                </Grid>
            </Grid>
            <Grid item xs={12} sm={2.5} md={2.5}>
                    <Typography fontWeight={500} fontSize={25}>
                        Your Tryvestors
                    </Typography>
            </Grid>
            <Grid item xs={12} sm={5} md={5}>
                <SwitchSelector
                    options={selectorOptions}
                    initialSelectedIndex={initialSelectedIndex}
                    fontSize={14}
                    onChange={onSelectorChange}
                    border={`1 solid ${theme.palette.primary.dark}`}
                />
            </Grid>
            <Grid item xs={11} sm={3} md={3}/>
            <Grid item xs={1} sm={1.5} md={1.5}>
                <IconButton>
                    <svg width="30" height="30" viewBox="0 0 47 47" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="23.5" cy="23.5" r="23.5" fill="#042534"/>
                        <path d="M31.654 20.5378H26.721V13.4286H19.3216V20.5378H14.3887L23.0213 28.8319L31.654 20.5378ZM14.3887 31.2017V33.5714H31.654V31.2017H14.3887Z" fill="white"/>
                    </svg>
                </IconButton>
            </Grid>
            <Grid item>
                {
                    pendingOrCompleted === "pending" ? (
                        businessInfo.tryvestors.map((tryvestor) => {
                            if(tryvestor.status !== 1){
                                return <Tryvestor incomplete name={tryvestor.name} email={tryvestor.username} completedTasks={tryvestor.completedTasks} incompleteTasks={tryvestor.incompleteTasks}/>
                            }
                            return <div/>
                        })
                    ) : (
                        businessInfo.tryvestors.map((tryvestor) => {
                            if(tryvestor.status === 1){
                                return <Tryvestor name={tryvestor.name} email={tryvestor.username} completedTasks={tryvestor.completedTasks} incompleteTasks={tryvestor.incompleteTasks}/>
                            }
                            return <div/>
                        })
                    )
                }
            </Grid>
        </Grid>
    )
}

function Tryvestor({name, completedTasks, incompleteTasks, percentComplete, ...props}) {
    return (
        <div></div>
    );
}

export default BusinessOverview;