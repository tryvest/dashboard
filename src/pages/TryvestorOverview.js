import React, {useState} from "react";

// @mui
import {useTheme} from '@mui/material/styles';
import {
    Typography,
    Card,
    Stack,
    CardContent,
    Slider,
    Grid,
    Box,
    Chip,
    Markdown,
    SvgIcon,
    Button,
    CircularProgress,
} from '@mui/material';
// components
import {useSelector} from "react-redux";
import {useNavigate} from "react-router-dom";
import ReactMarkdown from "react-markdown";
import Page from '../components/Page';
import {fShortenNumber, fCurrency} from '../utils/formatNumber'


// ----------------------------------------------------------------------

export default function TryvestorOverview() {
    const theme = useTheme()
    const user = useSelector(state => state?.user?.user)
    const navigate = useNavigate()

    const iff = (condition, then, otherwise) => {
        if (condition) {
            return then
        }
        return otherwise
    };

    /*  const calcTotalPossibleSharesAsPercent = () => {
        let totalPossible = 0
        if(businessObj){
            businessObj.termDocuments.forEach((termDoc) => {
                totalPossible += termDoc.numSharesAward
            })
        }
        return (totalPossible / businessObj.totalShares)
    }
    */

    return (
        <Page title="Company TryvestorOverview">
            <Typography variant="h4" gutterBottom>
                Dashboard
            </Typography>

            {(user) ? (
                <Grid container style={{margin: "0px 15px 0px", width: "90%"}}>
                    <Grid item xs={12} sm={12} md={12}>
                        <Card style={{backgroundColor: theme.palette.primary.dark, height: "120px", padding: "20px", display: "flex", alignContent: "center", borderRadius: "0px"}}>
                            <Grid container>
                                <Grid item xs={4.5} sm={2} md={1.5}>
                                    <CircularProgressWithLabel variant={"determinate"} value={100} size={80}/>
                                </Grid>
                                <Grid item xs={7.5} sm={10} md={4}>
                                    <Stack direction={"column"}>
                                        <Typography fontSize={"20px"} fontWeight={"bolder"} color={"white"}>
                                            Your next steps
                                        </Typography>
                                        <Typography color={"#f4f4f4"} fontStyle={"italic"}>
                                            Set up some extra credentials
                                        </Typography>
                                        <Button style={{marginTop: "2px", width: "100px", alignItems: "center", justifyContent: "center", color: "white", padding: "0px"}} variant={"outlined"}>
                                            <Stack direction={"row"} spacing={0.5}>
                                                <SvgIcon transform={"scale(0.9)"} viewBox={"0 0 19 16"}>
                                                    <svg width="19" height="16" viewBox="0 0 19 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                        <path d="M16.9464 3.95538C15.0811 3.95751 13.2927 4.71898 11.9732 6.07292C10.6536 7.42686 9.91046 9.26283 9.90666 11.1785V14.6524C9.90129 14.8215 9.92907 14.99 9.98837 15.1478C10.0477 15.3056 10.1373 15.4496 10.2518 15.5711C10.3664 15.6927 10.5036 15.7893 10.6552 15.8553C10.8069 15.9214 10.9699 15.9554 11.1346 15.9554C11.2994 15.9554 11.4624 15.9214 11.614 15.8553C11.7657 15.7893 11.9029 15.6927 12.0175 15.5711C12.132 15.4496 12.2216 15.3056 12.2809 15.1478C12.3402 14.99 12.368 14.8215 12.3626 14.6524V11.1785C12.3661 9.93191 12.8504 8.73755 13.7096 7.85697C14.5687 6.9764 15.7326 6.48137 16.9464 6.48031C17.2652 6.46963 17.5674 6.33208 17.7892 6.09674C18.011 5.8614 18.135 5.54671 18.135 5.21919C18.135 4.89167 18.011 4.57698 17.7892 4.34164C17.5674 4.1063 17.2652 3.96875 16.9464 3.95807" fill="white"/>
                                                        <path d="M16.9001 3.45931C17.2312 3.44871 17.5451 3.3122 17.7755 3.07863C18.006 2.84505 18.1348 2.53273 18.1348 2.20767C18.1348 1.8826 18.006 1.57028 17.7755 1.33671C17.5451 1.10313 17.2312 0.96662 16.9001 0.956019C15.5715 0.955412 14.2564 1.21719 13.0331 1.72577C11.8098 2.23434 10.7033 2.97931 9.77965 3.91627C8.85524 2.97659 7.74676 2.22996 6.52081 1.72125C5.29486 1.21254 3.97675 0.952247 2.64567 0.956019C2.47465 0.950544 2.30425 0.978866 2.1446 1.0393C1.98496 1.09974 1.83933 1.19106 1.71637 1.30782C1.59342 1.42459 1.49565 1.56442 1.42888 1.71901C1.36211 1.87359 1.3277 2.03977 1.3277 2.20767C1.3277 2.37556 1.36211 2.54174 1.42888 2.69632C1.49565 2.85091 1.59342 2.99074 1.71637 3.10751C1.83933 3.22428 1.98496 3.31559 2.1446 3.37603C2.30425 3.43647 2.47465 3.46479 2.64567 3.45931C3.70473 3.45647 4.75184 3.67876 5.71498 4.1109C6.67811 4.54304 7.53441 5.17476 8.22495 5.96261C8.08917 6.19442 7.97104 6.43156 7.85834 6.67403C7.17341 5.85243 6.31099 5.19042 5.33342 4.73584C4.35584 4.28125 3.28754 4.04546 2.20574 4.0455C1.86705 4.0455 1.54223 4.17751 1.30274 4.41249C1.06325 4.64747 0.928711 4.96617 0.928711 5.29848C0.928711 5.63079 1.06325 5.94949 1.30274 6.18447C1.54223 6.41945 1.86705 6.55146 2.20574 6.55146C3.46646 6.55286 4.67525 7.04433 5.56747 7.91825C6.4597 8.79217 6.96266 9.97736 6.96625 11.2143V14.6622C6.96067 14.83 6.98954 14.9972 7.05114 15.1538C7.11273 15.3105 7.2058 15.4533 7.32481 15.574C7.44382 15.6946 7.58633 15.7906 7.74389 15.8561C7.90144 15.9216 8.07081 15.9553 8.24192 15.9553C8.41304 15.9553 8.58241 15.9216 8.73996 15.8561C8.89751 15.7906 9.04003 15.6946 9.15904 15.574C9.27805 15.4533 9.37111 15.3105 9.43271 15.1538C9.49431 14.9972 9.52317 14.83 9.51759 14.6622V11.2143C9.51759 11.0904 9.51759 10.9665 9.50809 10.844C9.51472 10.7949 9.5179 10.7455 9.51759 10.6961C9.52011 8.77588 10.2988 6.93506 11.6827 5.5774C13.0667 4.21974 14.943 3.4561 16.9001 3.45398" fill="white"/>
                                                    </svg>
                                                </SvgIcon>
                                                <Typography fontSize={"15px"} fontWeight={"bold"}>
                                                    Set Up
                                                </Typography>
                                            </Stack>
                                        </Button>
                                    </Stack>
                                </Grid>
                            </Grid>
                        </Card>
                    </Grid>
                </Grid>
            ) : (
                <div>
                    <CircularProgress />
                </div>
            )}
        </Page>
    );
}

function CircularProgressWithLabel(props) {
    return (
        <Box sx={{ position: 'relative', display: 'inline-flex' }}>
            <CircularProgress variant="determinate" {...props} />
            <Box
                sx={{
                    top: 0,
                    left: 0,
                    bottom: 0,
                    right: 0,
                    position: 'absolute',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}
            >
                <Typography  fontSize={"18px"} fontWeight={"bolder"} variant="caption" component="div" color="white">
                    {`${Math.round(props.value)}%`}
                </Typography>
            </Box>
        </Box>
    );
}

function PayoutSlider({currentVal, percentCompanyOwned, businessName}) {
    const [newValuation, setNewValuation] = useState(currentVal)

    const handleChange = (event, newValue) => {
        setNewValuation(newValue);
    };

    const getMaxVal = () => {
        const tempVal = currentVal
        if(tempVal > 100000000){
            return 2000000000
        }

        if(tempVal > 10000000){
            return 1000000000
        }

        if(tempVal > 1000000){
            return 200000000
        }

        return tempVal * 100
    }

    const getMarks = () => {
        const maxVal = getMaxVal()
        const marks = [{
            value: currentVal,
            label: fShortenNumber(currentVal)
        }]
        const nextInterval = (maxVal - currentVal) / 10
        for (let i = 1; i < 10; i += 1) {
            marks.push({
                value: nextInterval * i,
                label: ""
            })
        }
        marks.push({
            value: maxVal,
            label: fShortenNumber(maxVal)
        })
        return marks
    }

    const theme = useTheme()

    return (
        <Card>
            <CardContent>
                <Stack spacing={1} style={{marginRight: "35px"}}>
                    <Typography fontWeight={"500"} fontSize={"20px"} style={{marginInline: "15px"}}>
                        Your Potential Payout
                    </Typography>
                    <Slider
                        style={{marginInline: "20px", marginTop: "30px", marginBottom: "30px", height: "10px"}}
                        value={newValuation}
                        onChange={handleChange}
                        valueLabelFormat={value => <div style={{fontSize: "10px", borderRadius: "10px"}}>{fShortenNumber(value)}</div>}
                        valueLabelDisplay={"auto"}
                        defaultValue={currentVal}
                        step={1000000}
                        min={currentVal}
                        max={getMaxVal()}
                        marks={getMarks()}
                    />
                    <Stack>
                        <Typography fontSize={11} fontWeight={150}>
                            CURRENT VALUE OF {businessName.toUpperCase()}
                        </Typography>
                        <Typography variant={"h3"}>
                            {fCurrency(currentVal)}
                        </Typography>
                    </Stack>
                    <Stack alignItems={"start"}>
                        <Typography fontSize={15} fontWeight={150}>
                            NEW VALUE OF {businessName.toUpperCase()}
                        </Typography>
                        <Typography variant={"h2"}>
                            {fCurrency(newValuation)}
                        </Typography>
                    </Stack>
                    <Stack alignItems={"start"}>
                        <Typography color={theme.palette.primary.main} fontSize={15} fontWeight={150}>
                            Approximated Payout
                        </Typography>
                        <Typography color={theme.palette.primary.main} variant={"h2"}>
                            {fCurrency((newValuation - currentVal) * percentCompanyOwned)}
                        </Typography>
                    </Stack>
                </Stack>
            </CardContent>
        </Card>
    );
}