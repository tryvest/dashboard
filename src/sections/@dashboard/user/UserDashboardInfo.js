import React, {useState} from 'react';
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
import {fCurrency} from "../../../utils/formatNumber";


// ----------------------------------------------------------------------


export default function UserDashboardInfo({title, subheader, userObj}) {

    console.log(userObj)

    return userObj ? (<Card>
        <Grid container spacing={0}>
            <Grid item xs={12} sm={12} md={4}>
                <AppWidgetSummary title="Total Coins" total={ACCOUNT.totalCoins} icon={'ph:coins-fill'}
                                  sx={{marginLeft: 6, marginTop: 5, marginRight: 2}}/>
            </Grid>

            <Grid item xs={12} sm={12} md={4}>
                <AppWidgetSummary title="Outstanding Coins" total={ACCOUNT.outstandingCoins} color="info"
                                  icon={'mdi:hand-coin-outline'}
                                  sx={{marginLeft: 4, marginTop: 5, marginRight: 4}}/>
            </Grid>

            <Grid item xs={12} sm={12} md={4}>
                <AppWidgetSummary title="Equity Paid Out" total={ACCOUNT.equityPaidOut} color="success"
                                  icon={'mdi:currency-usd'} sx={{marginLeft: 2, marginTop: 5, marginRight: 6}}/>
            </Grid>

        </Grid>
        <Typography variant='h3' sx={{m: 2, mt: 4}}>Your <span
            style={{fontWeight: '300'}}>&nbsp;Businesses</span></Typography>

        <Typography variant='h5' sx={{m: 2, fontWeight: '300'}}>Pending Tasks</Typography>
        {userObj.businessesRespondedTo?.map((business) => (business.interactionSummaryInfo.statusOfTasks === 0 &&
            <Business {...business}/>))}
        <Typography variant='h5' sx={{m: 2, fontWeight: '300'}}>Completed Tasks</Typography>
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
                <Grid item xs={8} md={8} lg={8}>
                    <Stack style={{paddingRight: "5px"}}>
                        <Typography fontSize={20} sx={{width: '100%', flexShrink: 0, color: '#444'}}>
                            {name}
                        </Typography>
                        <Typography fontSize={14} sx={{width: '100%', flexShrink: 0}}>
                            {tagline}
                        </Typography>
                        <Typography fontSize={14} sx={{width: '100%', flexShrink: 0, color: 'green'}}>
                            Valuation: {fCurrency(valuation)}
                        </Typography>
                        <Grid container>
                            {topics.map((topic) => {
                                return (
                                <Grid item>
                                    <Chip color={"primary"} size={"small"} label={topic}/>
                                </Grid>
                                )
                            })}
                        </Grid>
                    </Stack>
                </Grid>
                <Grid item xs={4} md={4} lg={4}>
                    <Stack>
                        <Typography fontSize={16} sx={{width: '100%', flexShrink: 0, color: '#444'}}>
                            #Shares: {totalShares}
                        </Typography>
                        <Typography fontSize={14} sx={{width: '100%', flexShrink: 0, color: "green"}}>
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
                <div style={{paddingTop: "5px"}}>
                    {description}
                </div>
            </Stack>
        </AccordionDetails>
    </Accordion>);
}

/*
function TermDocument({formLink, resultsLink, description, businessID, numSharesAward, response}) {
    const {getFieldProps} = formik;

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
