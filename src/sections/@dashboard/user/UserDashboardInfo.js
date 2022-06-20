import React, {useEffect, useState} from 'react';
import PropTypes from 'prop-types';
// @mui
import {
    Card,
    Stack,
    Divider,
    Checkbox,
    MenuItem,
    IconButton,
    FormControlLabel,
    Accordion,
    AccordionDetails,
    AccordionSummary,
    Typography,
    Box,
    Grid, Chip
} from '@mui/material';
import LinearProgress, {linearProgressClasses} from "@mui/material/LinearProgress";

// components
import styled from "@emotion/styled";
import {useTheme} from "@mui/material/styles";
import Iconify from '../../../components/Iconify';
import MenuPopover from '../../../components/MenuPopover';
import {AppWidgetSummary} from "../app/index";

import ACCOUNT from '../../../_mock/account'
import {fCurrency, fShortenNumber} from "../../../utils/formatNumber";


// ----------------------------------------------------------------------


export default function UserDashboardInfo({title, subheader, userObj}) {
    // let numSharesAwarded = 0
    // let valueSharesAwarded = 0
    // let valueSharesPending = 0
    // const numSharesAwarded = 1
    // const valueSharesAwarded = 1
    // const valueSharesPending = 1
    const [numSharesAwarded, setNumSharesAwarded] = useState(0)
    const [valueSharesAwarded, setValueSharesAwarded] = useState(0)
    const [valueSharesPending, setValueSharesPending] = useState(0)
    const [summarizedInfo, setSummarizedInfo] = useState(false)

    useEffect(() => {
        let numAwarded = 0
        let valueAwarded = 0
        let valuePending = 0
        userObj.businessesRespondedTo.forEach((business) => {
            numAwarded += business.interactionSummaryInfo.numSharesAwarded
            valueAwarded += business.interactionSummaryInfo.numSharesAwarded
                * business.interactionSummaryInfo.valuePerShare
            valuePending += business.interactionSummaryInfo.numSharesPending
                * business.interactionSummaryInfo.valuePerShare
            console.log(business.interactionSummaryInfo.numSharesPending * business.interactionSummaryInfo.valuePerShare)
        })
        setNumSharesAwarded(numAwarded)
        setValueSharesAwarded(valueAwarded)
        setValueSharesPending(valuePending)
        setSummarizedInfo(true)
    },[])

    console.log(userObj)

    return userObj ? (<Card>
        <Grid container spacing={0}>
            <Grid item xs={12} sm={12} md={4}>
                <AppWidgetSummary title="# Shares Awarded" total={summarizedInfo ? fShortenNumber(numSharesAwarded) : "--"} icon={'ph:coins-fill'}
                                  sx={{marginLeft: 6, marginTop: 5, marginRight: 2}}/>
            </Grid>

            <Grid item xs={12} sm={12} md={4}>
                <AppWidgetSummary title="Value of Awarded Shares" total={summarizedInfo ? fCurrency(valueSharesAwarded) : "--"} color="info"
                                  icon={'mdi:hand-coin-outline'}
                                  sx={{marginLeft: 4, marginTop: 5, marginRight: 4}}/>
            </Grid>

            <Grid item xs={12} sm={12} md={4}>
                <AppWidgetSummary title="Value of Pending Shares" total={summarizedInfo ? fCurrency(valueSharesPending) : "--"} color="success"
                                  icon={'mdi:currency-usd'} sx={{marginLeft: 2, marginTop: 5, marginRight: 6}}/>
            </Grid>

        </Grid>
        <Typography variant='h3' sx={{m: 2, mt: 4}}>Your <span
            style={{fontWeight: '300'}}>&nbsp;Businesses</span></Typography>

        <Typography variant='h5' sx={{m: 2, fontWeight: '300'}}>Pending</Typography>
        {userObj.businessesRespondedTo?.map((business) => (business.interactionSummaryInfo.statusOfTasks === 0 &&
            <Business {...business}/>))}
        <Typography variant='h5' sx={{m: 2, fontWeight: '300'}}>Completed</Typography>
        {userObj.businessesRespondedTo?.map((business) => (business.interactionSummaryInfo.statusOfTasks !== 0 &&
            <Business {...business}/>))}
    </Card>) : <div/>;
}

// ----------------------------------------------------------------------
function Business({
                      businessID,
                      name,
                      description,
                      tagline,
                      topics,
                      valuation,
                      totalShares,
                      logo,
                      termDocuments,
                      interactionSummaryInfo
                  }) {

    const [expanded, setExpanded] = React.useState(false);

    const handleChange = (panel) => (event, isExpanded) => {
        setExpanded(isExpanded ? panel : false);
    };

    const theme = useTheme()

    return (<Accordion sx={{marginBottom: '10px', borderRadius: '5px', width: '90%'}}
                       expanded={expanded === 'panel1'} onChange={handleChange('panel1')}>

        <AccordionSummary
            expandIcon={<Iconify icon={'ic:baseline-expand-more'}/>}
            aria-controls="panel1bh-content"
            id="panel1bh-header"
            sx={{justifyContent: 'space-evenly'}}
        >
            <Grid container>
                <Grid item xs={2} md={2} lg={2}>
                    <div style={{marginInline: "10px", borderRadius: "10px", overflow: "hidden"}}>
                        <img src={logo} alt={"company logo"}/>
                    </div>
                </Grid>
                <Grid item xs={6} md={6} lg={6}>
                    <Stack style={{paddingRight: "5px"}}>
                        <Typography fontSize={20} sx={{width: '100%', flexShrink: 0, color: '#444'}}>
                            {name}
                        </Typography>
                        <Typography fontSize={14} sx={{width: '100%', flexShrink: 0}}>
                            {tagline}
                        </Typography>
                        <Typography fontSize={14} sx={{width: '100%', flexShrink: 0, color: theme.palette.primary.main}}>
                            Valuation: {fCurrency(valuation)}
                        </Typography>
                        {/*
                        <Grid container>
                            {topics.map((topic) => {
                                return (
                                <Grid item>
                                    <Chip color={"primary"} size={"small"} label={topic}/>
                                </Grid>
                                )
                            })}
                        </Grid>
                        */}
                    </Stack>
                </Grid>
                <Grid item xs={4} md={4} lg={4}>
                    <Stack>
                        <Typography fontSize={16} sx={{width: '100%', flexShrink: 0, color: '#444'}}>
                            #Shares: {totalShares}
                        </Typography>
                        <Typography fontSize={14} sx={{width: '100%', flexShrink: 0, color: theme.palette.primary.main}}>
                            Awarded Shares: {interactionSummaryInfo.numSharesAwarded}
                        </Typography>
                        <Typography fontSize={14} sx={{width: '100%', flexShrink: 0}}>
                            Pending Shares: {interactionSummaryInfo.numSharesPending}
                        </Typography>
                        <Typography fontSize={14} sx={{width: '100%', flexShrink: 0, color: "red"}}>
                            Rejected Shares: {interactionSummaryInfo.numSharesRejected}
                        </Typography>
                    </Stack>
                </Grid>
            </Grid>
        </AccordionSummary>
        <AccordionDetails>
            <Stack spacing={2}>
                {termDocuments.map((termDoc) => {
                    console.log(termDoc)
                    return <TermDocument {...termDoc}/>
                })}
            </Stack>
        </AccordionDetails>
    </Accordion>);
}

// Term Document React Prop Definition
function TermDocument({termDocumentID, formLink, resultsLink, description, businessID, numSharesAward, termResponse}) {
    const {termResponseID, verificationStatus, tryvestorID} = termResponse;


    const verificationSwitch = (param) => {
        switch(param) {
            case -1:
                return 'Rejected';
            case 1:
                return 'Accepted'
            default:
                return 'Awaiting Approval';
        }
    }

    return (
        <Card>
            <Grid container spacing={1} sx={{padding: "10px"}}>
                <Grid item xs={12} sm={12} md={12}>
                    <Typography>
                        {description}
                    </Typography>
                </Grid>
                <Grid item xs={12} sm={6} md={6}>
                    <Stack>
                        <Typography variant={"h5"}>
                            Number Shares: {verificationStatus === 1 ? numSharesAward : 0}/{numSharesAward}
                        </Typography>
                    </Stack>
                </Grid>
                <Grid>
                    {
                        verificationSwitch(verificationStatus)
                    }
                </Grid>
            </Grid>
        </Card>
    )
}

/*
function TermDocument({formLink, resultsLink, description, businessID, numSharesAward, response}) {
    const {username, termDocID, verificationStatus} = response;

    const [open, setOpen] = useState(null);

    const handleOpenMenu = (event) => {
        setOpen(event.currentTarget);
    };

    const handleCloseMenu = () => {
        setOpen(null);
    };

    const handleMarkComplete = () => {
        handleCloseMenu();
        console.log('MARK COMPLETE', response);
    };

    const handleShare = () => {
        handleCloseMenu();
        console.log('SHARE', response);
    };

    const handleEdit = () => {
        handleCloseMenu();
        console.log('EDIT', response);
    };

    const handleDelete = () => {
        handleCloseMenu();
        console.log('DELETE', response);
    };

    return (
        <Stack
            direction="row"
            sx={{
                px: 2,
                py: 0.75,
                ...(checked && {
                    color: 'text.disabled',
                    textDecoration: 'line-through',
                }),
            }}
        >
            <FormControlLabel
                control={<Checkbox {...getFieldProps('checked')} value={response.id} checked={checked} {...other} />}
                label={response.label}
                sx={{flexGrow: 1, m: 0}}
            />

            <MoreMenuButton
                open={open}
                onClose={handleCloseMenu}
                onOpen={handleOpenMenu}
                actions={
                    <>
                        <MenuItem onClick={handleMarkComplete}>
                            <Iconify icon={'eva:checkmark-circle-2-fill'}/>
                            Mark Complete
                        </MenuItem>

                        <MenuItem onClick={handleEdit}>
                            <Iconify icon={'eva:edit-fill'}/>
                            Edit
                        </MenuItem>

                        <MenuItem onClick={handleShare}>
                            <Iconify icon={'eva:share-fill'}/>
                            Share
                        </MenuItem>

                        <Divider sx={{borderStyle: 'dashed'}}/>

                        <MenuItem onClick={handleDelete} sx={{color: 'error.main'}}>
                            <Iconify icon={'eva:trash-2-outline'}/>
                            Delete
                        </MenuItem>
                    </>
                }
            />
        </Stack>
    );
}
*/


// ----------------------------------------------------------------------
/*
MoreMenuButton.propTypes = {
    actions: PropTypes.node.isRequired,
    onClose: PropTypes.func,
    onOpen: PropTypes.func,
    open: PropTypes.object,
};
 */

/*
function MoreMenuButton({actions, open, onOpen, onClose}) {
    return (
        <>
            <IconButton size="large" color="inherit" sx={{opacity: 0.48}} onClick={onOpen}>
                <Iconify icon={'eva:more-vertical-fill'} width={20} height={20}/>
            </IconButton>

            <MenuPopover
                open={Boolean(open)}
                anchorEl={open}
                onClose={onClose}
                arrow="right-top"
                sx={{
                    mt: -0.5,
                    width: 'auto',
                    '& .MuiMenuItem-root': {
                        px: 1,
                        typography: 'body2',
                        borderRadius: 0.75,
                        '& svg': {mr: 2, width: 20, height: 20},
                    },
                }}
            >
                {actions}
            </MenuPopover>
        </>
    );
}
*/
