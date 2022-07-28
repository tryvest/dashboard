import React, {useEffect, useState} from 'react';
import {useSelector} from "react-redux";
import {
    Button,
    Card,
    CardContent,
    Chip,
    Grid,
    Stack,
    Typography,
    SvgIcon,
    Box,
    TextField
} from "@mui/material";
import Carousel from "better-react-carousel";
import ReactPlayer from "react-player";
import {useTheme} from "@mui/material/styles";
import {useNavigate} from "react-router-dom";
import rehypeSanitize from "rehype-sanitize";
import MDEditor from '@uiw/react-md-editor';
import ModeEditOutlineRoundedIcon from '@mui/icons-material/ModeEditOutlineRounded';
import {apiBusinesses} from "../../utils/api/api-businesses";
import Page from "../../components/Page";
import {fCurrency} from "../../utils/formatNumber";
import {BUSINESS} from "../../UserTypes";

function BusinessHomePage(props) {
    const theme = useTheme();
    // const [userObj, setUserObj] = useState(null)
    const [businessObj, setBusinessObj] = useState(null)
    const navigate = useNavigate()
    const [editMode, setEditMode] = useState(false)
    const user = useSelector((state) => state.auth?.user)
    const userType = useSelector((state) => state.auth?.userType)

    // Editable Fields
    const [wasChanged, setWasChanged] = useState(false)
    const [description, setDescription] = useState()
    const [businessName, setBusinessName] = useState()
    const [tags, setTags] = useState()
    const [targetMarket, setTargetMarket] = useState()
    const [tagline, setTagline] = useState()


    useEffect(() => {
        if(userType === BUSINESS && user){
            apiBusinesses.getSingle(user.uid).then((data) => {
                setBusinessObj(data)
                setDescription(data.description)
                setBusinessName(data.name)
                setTags(data.tags)
                setTagline(data.tagline)
                setTargetMarket(data.targetMarket)
            })
        }
    }, [user])

    useEffect(() => {
        setWasChanged(true)
    }, [description, businessName, tags, targetMarket, tagline])

    function turnOnEdit() {
        setEditMode(true)
    }

    function turnOffEdit() {
        if (wasChanged){
            // saving edits to firebase
            const newBusinessInfo = {
                'businessID': businessObj.businessID,
                'tags': tags,
                'name': businessName,
                'description': description,
                'targetMarket': targetMarket,
                'tagline': tagline
            }
            apiBusinesses.put(newBusinessInfo).then(r => console.log(r))
            setWasChanged(false)
            console.log('edit was recorded')
        }

        // edit mode off
        setEditMode(false)
    }

    const editTextVariant = 'outlined';

    return (
        <Page title="Company Overview">
            {
                (businessObj) ? (
                <div>
                    <Grid container spacing={1} style={{margin: "5px"}}>
                        <Grid item xs={12} sm={12} md={9}>
                            <Card>
                                <CardContent>
                                    <Stack spacing={1}>
                                        <Box marginTop={"-25px"} marginX={"-25px"} padding={"20px"} display={"flex"} alignItems={"center"} bgcolor={"#E4E4E4"}>
                                            <Stack paddingY={"10px"} spacing={1} direction={"row"} alignItems={"center"} style={{marginInline: "auto"}}>
                                                <img style={{height: "60px", width: "60px"}} src={businessObj.logo} alt="Business Logo"/>
                                                {
                                                    editMode ? (
                                                        <div style={{color: 'white'}}>
                                                            <TextField
                                                                value={businessName}
                                                                onChange={(event) => {setBusinessName(event.target.value)}}
                                                                style={{margin:'10px 0px 10px 0px'}}
                                                                variant={editTextVariant}
                                                                label={'Business Name'}
                                                                multiline
                                                            />
                                                        </div>
                                                    ) : (
                                                        <Stack alignItems={'center'} spacing={1} direction={'row'}>
                                                            <Typography fontSize={"50px"} fontWeight={"900"}>
                                                                {businessName}
                                                            </Typography>
                                                            { !editMode &&
                                                                <Button size={'large'} onClick={() => turnOnEdit()} color={'secondary'} style={{
                                                                    padding: '5px',
                                                                }}>
                                                                    <ModeEditOutlineRoundedIcon/>
                                                                </Button>
                                                            }
                                                        </Stack>
                                                    )
                                                }
                                            </Stack>
                                        </Box>
                                        <div>
                                            <Stack alignItems={'center'} spacing={1} direction={'row'}>
                                                <Typography variant={"h3"} fontWeight={"1000"}>
                                                    {businessName}
                                                </Typography>
                                                { !editMode &&
                                                    <Button onClick={() => turnOnEdit()} color={'secondary'} style={{
                                                        padding: '5px',
                                                        minWidth: '40px',
                                                        maxHeight: '40px'
                                                    }}>
                                                        <ModeEditOutlineRoundedIcon/>
                                                    </Button>
                                                }
                                            </Stack>
                                            {
                                                editMode ? (
                                                    <TextField
                                                        value={tagline}
                                                        onChange={(event) => {setTagline(event.target.value)}}
                                                        style={{width: '100%', margin:'10px 0px 10px 0px'}}
                                                        variant={editTextVariant}
                                                        label={'Business Tagline'}

                                                    />
                                                ) : (
                                                    <Typography fontWeight={"400"} color={"rgba(37,39,51,0.87)"} fontStyle={"italic"}>
                                                        {tagline}
                                                    </Typography>
                                                )
                                            }
                                            <Stack direction={"row"} display={"flex"} flexWrap={"wrap"} style={{marginBottom: "20px"}}>
                                                {businessObj.topics.map((topic) => {
                                                    return (
                                                        <Chip style={{marginBottom: "3px",
                                                            backgroundColor: theme.palette.primary.main,
                                                            color: theme.palette.primary.dark, fontWeight: 200, fontSize: "12px", marginRight: "5px"}}
                                                              size={"small"} label={topic}
                                                        />
                                                    )
                                                })}
                                            </Stack>
                                        </div>
                                        <div style={{marginInline: "-18px", marginTop: "-5px"}}>
                                            {businessObj.media.length ?
                                                (<Carousel loop scrollSnap>
                                                    {businessObj.media.map((imgLink) => {
                                                        if (imgLink.includes('jpg') || imgLink.includes('png')) {
                                                            return (
                                                                <Carousel.Item>
                                                                    <img src={imgLink} alt="imageyay"/>
                                                                </Carousel.Item>)
                                                        }

                                                        if (imgLink.includes('mp4')) {
                                                            return (
                                                                <Carousel.Item>
                                                                    <ReactPlayer controls url={imgLink}
                                                                                 width={"100%"}/>
                                                                </Carousel.Item>)
                                                        }
                                                        return <div/>
                                                    })}
                                                </Carousel>) : (<div/>)
                                            }
                                        </div>
                                        <Stack style={{marginTop: "10px"}}>
                                            <Typography fontWeight={"800"} fontSize={"25px"}>
                                                About {businessName}
                                            </Typography>
                                            <div>
                                                {/*
                                                <ul style={{marginLeft: "15px"}}>
                                                    {businessObj.description.split(".").map((sentence) => {
                                                        const trimmedSent = sentence.trim()
                                                        if(trimmedSent.length > 0){
                                                            return <li>
                                                                {trimmedSent}
                                                            </li>
                                                        }
                                                        return <div/>
                                                    })}
                                                </ul>
                                                */}
                                                {
                                                    editMode ? (
                                                        <div data-color-mode={"light"}>
                                                            <MDEditor
                                                                value={description}
                                                                onChange={setDescription}
                                                                minHeight={200}
                                                                maxHeight={600}
                                                                preview={"edit"}
                                                                previewOptions={{
                                                                    rehypePlugins: [[rehypeSanitize]],
                                                                }}
                                                            />
                                                        </div>
                                                    ) : (
                                                        <div data-color-mode={'light'}>
                                                            <MDEditor.Markdown source={description} style={{ whiteSpace: 'pre-wrap' }} />
                                                        </div>
                                                    )

                                                }
                                            </div>
                                        </Stack>
                                        <Grid container justifyContent={"center"} style={{marginTop: "15px"}}>
                                            <Button style={{borderRadius: "14px", padding: "10px", backgroundColor: theme.palette.primary.dark}} variant={"contained"}>
                                                <SvgIcon>
                                                    <svg width="26" height="23" viewBox="0 0 26 23" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                        <path d="M24.1247 4.74792C21.2745 4.75123 18.5418 5.91426 16.5264 7.98186C14.5109 10.0495 13.3772 12.8528 13.374 15.7768V21.0762C13.3846 21.5793 13.5868 22.0582 13.9375 22.4103C14.2881 22.7623 14.7592 22.9594 15.2497 22.9594C15.7403 22.9594 16.2114 22.7623 16.562 22.4103C16.9126 22.0582 17.1149 21.5793 17.1255 21.0762V15.7768C17.1275 13.8731 17.8656 12.048 19.1778 10.7019C20.49 9.35574 22.269 8.59855 24.1247 8.59643C24.6152 8.58559 25.082 8.3781 25.4252 8.01841C25.7683 7.65872 25.9605 7.17546 25.9605 6.67218C25.9605 6.16889 25.7683 5.68563 25.4252 5.32594C25.082 4.96625 24.6152 4.75876 24.1247 4.74792" fill="white"/>
                                                        <path d="M23.4776 3.8485C23.9681 3.83767 24.4349 3.63017 24.7781 3.27049C25.1212 2.9108 25.3134 2.42754 25.3134 1.92425C25.3134 1.42097 25.1212 0.937703 24.7781 0.578016C24.4349 0.218329 23.9681 0.0108364 23.4776 5.45531e-07C21.5242 -0.000650693 19.5905 0.401907 17.7919 1.18371C15.9932 1.96551 14.3662 3.11058 13.0079 4.55075C11.6494 3.10625 10.0203 1.95848 8.21834 1.17644C6.41643 0.394392 4.47897 -0.00577231 2.52244 5.45531e-07C2.03196 0.0108364 1.56513 0.218329 1.22199 0.578016C0.878842 0.937703 0.68668 1.42097 0.68668 1.92425C0.68668 2.42754 0.878842 2.9108 1.22199 3.27049C1.56513 3.63017 2.03196 3.83767 2.52244 3.8485C4.07897 3.84363 5.61808 4.18444 7.03407 4.84753C8.45006 5.51061 9.70937 6.48026 10.7255 7.68987C10.5307 8.04679 10.35 8.41174 10.1836 8.78472C9.17651 7.52275 7.90876 6.506 6.47195 5.80789C5.03514 5.10978 3.46513 4.74775 1.87531 4.74794C1.38483 4.75878 0.918004 4.96627 0.574858 5.32596C0.231712 5.68565 0.0395508 6.16891 0.0395508 6.67219C0.0395508 7.17548 0.231712 7.65874 0.574858 8.01843C0.918004 8.37812 1.38483 8.58561 1.87531 8.59645C3.73054 8.59928 5.50896 9.35677 6.82056 10.7028C8.13217 12.0489 8.86989 13.8736 8.87196 15.7768V21.0762C8.88253 21.5794 9.08479 22.0583 9.4354 22.4103C9.78602 22.7623 10.2571 22.9595 10.7477 22.9595C11.2383 22.9595 11.7094 22.7623 12.06 22.4103C12.4106 22.0583 12.6128 21.5794 12.6234 21.0762V15.7768C12.6234 15.5859 12.6188 15.3961 12.6095 15.2075C12.6185 15.1323 12.6232 15.0566 12.6234 14.9809C12.6266 12.0289 13.7713 9.19889 15.8062 7.11181C17.8412 5.02472 20.6001 3.8511 23.4776 3.8485" fill="white"/>
                                                    </svg>
                                                </SvgIcon>
                                                <Typography style={{marginLeft: "8px", fontSize: "13px"}}>
                                                    Start Tryvesting
                                                </Typography>
                                            </Button>
                                        </Grid>
                                    </Stack>
                                </CardContent>
                            </Card>
                        </Grid>
                        <Grid item xs={12} sm={12} md={3}>
                            <Stack spacing={3}>
                                <Card style={{padding: "15px", backgroundColor: theme.palette.primary.dark}}>
                                    <Stack>
                                        <Typography fontWeight={500} fontSize={20} color={"white"}>
                                            Target Market
                                        </Typography>
                                        {
                                            editMode ? (
                                                <div style={{color: 'white'}}>
                                                    <TextField
                                                        value={targetMarket}
                                                        sx={{backgroundColor: 'white'}}
                                                        fullWidth
                                                        onChange={(event) => {setTargetMarket(event.target.value)}}
                                                        style={{margin:'10px 0px 10px 0px'}}
                                                        variant={editTextVariant}
                                                        multiline
                                                    />
                                                </div>
                                            ) : (
                                                <Stack>
                                                    {
                                                        <Typography color={'white'} fontSize={15}>
                                                            {tagline?.charAt(0).toUpperCase() + tagline?.slice(1)}
                                                        </Typography>
                                                    }
                                                </Stack>
                                            )
                                        }
                                    </Stack>
                                </Card>
                                <Card style={{padding: "15px"}}>
                                    <Stack spacing={1}>
                                        <Typography fontWeight={800} fontSize={20}>
                                            Financial Details
                                        </Typography>
                                        <Stack>
                                            <Typography fontWeight={800} fontSize={16}>
                                                Valuation:
                                            </Typography>
                                            <Typography fontWeight={400} fontSize={15}>
                                                {fCurrency(businessObj.valuation)}
                                            </Typography>
                                        </Stack>
                                        <Stack>
                                            <Typography fontWeight={800} fontSize={16}>
                                                Amount Raised:
                                            </Typography>
                                            <Typography fontWeight={400} fontSize={15}>
                                                {fCurrency(businessObj.funding)}
                                            </Typography>
                                        </Stack>
                                        <Stack>
                                            <Typography fontWeight={800} fontSize={16}>
                                                Current Investors:
                                            </Typography>
                                            {businessObj.investors.map((investor) => (
                                                    <Typography fontWeight={400} fontSize={15}>
                                                        {investor}
                                                    </Typography>
                                                )
                                            )}
                                        </Stack>
                                    </Stack>
                                </Card>
                                <Card style={{padding: "15px"}}>
                                    <Stack spacing={1}>
                                        <Typography fontWeight={800} fontSize={20}>
                                            Tasks
                                        </Typography>
                                        <Stack spacing={1}>
                                            {businessObj.termDocuments.map((termDocument, num) => (
                                                    <Stack direction={"row"} spacing={1}>
                                                        <div style={{display: "flex", flexShrink: 0, alignItems: "center", justifyContent: "center", width: "30px", height: "30px", backgroundColor: "#D9D9D9", borderRadius: "50%"}}>
                                                            {num + 1}
                                                        </div>
                                                        <Typography fontSize={15}>
                                                            {termDocument.title}
                                                        </Typography>
                                                    </Stack>
                                                )
                                            )}
                                        </Stack>
                                    </Stack>
                                </Card>
                            </Stack>
                        </Grid>
                    </Grid>
                    {editMode &&
                        <div style={{bottom: '15px', position: 'fixed', right: '15px'}}>
                            <Button size={'large'} variant={'contained'} onClick={() => turnOffEdit()}>
                                <Typography fontSize={24}>
                                    Save Edits
                                </Typography>
                            </Button>
                        </div>
                    }
                </div>
                ) : (
                    <div>
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
                    </div>
                )
            }
        </Page>
    );
}

export default BusinessHomePage;