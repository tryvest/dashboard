import React, {useEffect, useState} from 'react';
import {
    Badge,
    Button,
    Card,
    CardContent,
    CircularProgress,
    Collapse,
    Grid,
    IconButton,
    Stack,
    Typography
} from "@mui/material";
import {useSelector} from "react-redux";
import CardActions from "@mui/material/CardActions";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { styled } from '@mui/material/styles';
import {useNavigate} from "react-router-dom";
import {DarkLogo} from "../../components/Logo";
import PlaidBankingButton from "../../utils/plaid/plaid-banking-button";
import {apiTryvestors} from "../../utils/api/api-tryvestors";
import {api} from "../../utils/api/api";

const iff = (condition, then, otherwise) => {
    if(condition){
        return then
    }
    return otherwise
}


const ExpandMore = styled((props) => {
    const { expand, ...other } = props;
    return <IconButton {...other} />;
})(({ theme, expand }) => ({
    transform: !expand ? 'rotate(0deg)' : 'rotate(180deg)',
    marginLeft: 'auto',
    transition: theme.transitions.create('transform', {
        duration: theme.transitions.duration.shortest,
    }),
}));

const BankItemCard = (props) => {
    const {itemData, defaultItemID, defaultAccountID, setNewDefaults} = props
    const {userItemID, itemIsActive, userAccountIDs, plaidInstitutionID} = itemData
    const [ins, setIns] = useState()
    const uid = useSelector(state => state.user.user.uid)
    const isDefaultItem = defaultItemID === itemData.userItemID

    useEffect(() => {
        api.getInstitution(plaidInstitutionID).then(insData => {
            setIns(insData)
            console.log(insData)
        }) // Here we notice that insDocRef in firebase is same as plaidInstitutionID
    }, [])

    const [expanded, setExpanded] = React.useState(false);

    const handleExpandClick = () => {
        setExpanded(!expanded);
    };

    const disableItem = () => {
        apiTryvestors.disableUserItem(uid, userItemID)
        window.location.reload()
        // refreshUserData()
    }

    const disableAccount = (userAccountID) => {
        apiTryvestors.deleteUserAccountFromItem(uid, userItemID, userAccountID)
        window.location.reload()
        // refreshUserData()
    }

    const setAccountAndItemAsDefault = (userAccountID) => {
        apiTryvestors.setDefaultAccountAndItem(uid, userItemID, userAccountID).then(
            () => {
                // setNewDefaults(userItemID, userAccountID)
                window.location.reload()
                // refreshUserData()
            }
        )
    }

    return (
        <Badge badgeContent={"Default"} color={"primary"} invisible={!isDefaultItem}>
            <Card onClick={handleExpandClick} sx={{ width: 240, borderRadius: 0, paddingInline: "10px", paddingTop: "10px", paddingBottom: "3px"}}>
                <Stack direction={"row"} spacing={1} alignItems={"center"}>
                    <img style={{width: "30px", height: "30px"}} src={ins?.institutionImageURL} alt={"logo of bank"} />
                    <Typography fontWeight={800} fontSize={"17px"}>
                        {ins?.plaidInstitutionName}
                    </Typography>
                </Stack>
                <Stack marginTop={"5px"} direction={"row"} justifyContent={"space-between"}>
                    <Stack direction={"row"} spacing={1}>
                        <Button size={"small"} disabled={!itemIsActive || isDefaultItem} color={"secondary"} onClick={disableItem}>
                            {iff(!isDefaultItem, itemIsActive ? "Disable" : "Disabled", "Cannot Disable Default")}
                        </Button>
                    </Stack>
                    {itemIsActive && <ExpandMore
                        expand={expanded}
                        onClick={handleExpandClick}
                        aria-expanded={expanded}
                        aria-label="show more"
                    >
                        <ExpandMoreIcon />
                    </ExpandMore>}
                </Stack>
                <Collapse in={expanded} timeout="auto" unmountOnExit>
                    {
                        itemData.userAccountIDs.map((acct) => {
                            const acctID = acct.plaidAccountID
                            const accountIsActive = acct.accountIsActive
                            const isDefaultAcct = acctID === defaultAccountID
                            return (
                                <Stack spacing={1}>
                                    <hr style={{marginTop: "3px"}}/>
                                    <Stack direction={"row"} spacing={1} justifyContent={"space-between"} alignItems={"center"}>
                                        <Stack>
                                            <Typography fontSize={"14px"}>
                                                {acct.plaidAccountName}
                                            </Typography>
                                            <Typography fontSize={"16px"}>
                                                xxxx{acct.plaidAccountMask}
                                            </Typography>
                                        </Stack>
                                        <Stack spacing={0.5}>
                                            {
                                                !accountIsActive ? (
                                                    <Button style={{maxHeight: "30px"}} disabled size={"small"} variant={"contained"} color={"warning"}>
                                                        Inactive
                                                    </Button>
                                                ) : (
                                                    <Button disabled={isDefaultAcct} onClick={() => disableAccount(acctID)} size={"small"} variant={"contained"} color={"warning"}>
                                                        {isDefaultAcct ? "Cannot Deactivate Default Account" : "Deactivate"}
                                                    </Button>
                                                )

                                            }
                                            {
                                                iff(accountIsActive,
                                                isDefaultAcct ? (
                                                    // <Button style={{maxHeight: "30px"}} disabled size={"small"} variant={"contained"} color={"secondary"}>
                                                    //     Is Default
                                                    // </Button>
                                                    <div/>
                                                ) : (
                                                    <Button onClick={() => setAccountAndItemAsDefault(acctID)} style={{maxHeight: "30px"}} size={"small"} variant={"contained"} color={"primary"}>
                                                        Default
                                                    </Button>
                                                ), <div/>)

                                            }
                                        </Stack>
                                    </Stack>
                                </Stack>
                            )
                        })
                    }
                </Collapse>
            </Card>
        </Badge>
    );

}


const TryvestorBanking = () => {
    const uid = useSelector(state => state.user?.user.uid)
    const defaultItemIDRedux = useSelector(state => state.user?.user.data.defaultItemID)
    const [defaultItemID, setDefaultItemID] = useState(defaultItemIDRedux)
    const defaultAccountIDRedux = useSelector(state => state.user?.user.data.defaultAccountID)
    const [defaultAccountID, setDefaultAccountID] = useState(defaultAccountIDRedux)
    const [linkedItems, setLinkedItems] = useState()
    const emptyText = "No accounts linked yet! Click the button on the top right to add your account."
    const navigate = useNavigate();


    useEffect(() => {
        apiTryvestors.getUserItems(uid).then(data => setLinkedItems(data))
    }, [])

    const setNewDefaults = (item, acct) => {
        setDefaultItemID(item)
        setDefaultAccountID(acct)
    }

    return linkedItems ? (
        <div>
            <Stack spacing={3} paddingX={"25px"}>
                <Card style={{ padding: '30px', borderRadius: 0}}>
                    <DarkLogo/>
                    <Typography fontSize={"33px"} fontWeight={"800"}>
                        Connect Your Bank Accounts
                    </Typography>
                    <Typography color={"rgba(37,39,51,0.87)"} fontWeight={500} fontSize={"17px"} fontStyle={"italic"}>
                        We will verify transactions completed on your selected company automatically through linked cards and secure Plaid transaction data. Be sure to use the same cards in order to receive your rewards.
                    </Typography>
                </Card>
                <Card style={{ padding: '30px', borderRadius: 0}}>
                    <Stack spacing={1}>
                        <Stack direction={"row"} justifyContent={"space-between"}>
                            <Typography fontSize={"25px"} fontWeight={"800"}>
                                Your Linked Bank Accounts
                            </Typography>
                            <PlaidBankingButton/>
                        </Stack>
                        <Grid container spacing={4}>
                            {linkedItems.length === 0 ? (
                                <Typography color={"rgba(37,39,51,0.87)"} fontWeight={500} fontSize={"14px"} fontStyle={"italic"}>
                                    {emptyText}
                                </Typography>
                            ) : (
                                linkedItems?.map((itemData) => {
                                    return (
                                        <Grid item>
                                            <BankItemCard setNewDefaults={setNewDefaults} itemData={itemData} defaultItemID={defaultItemID} defaultAccountID={defaultAccountID}/>
                                        </Grid>
                                    )
                                })
                            )}
                        </Grid>
                    </Stack>
                </Card>
                <Button onClick={() => navigate("/", {replace: true})} style={{ width: '175px', padding: '8px', fontWeight: '200', borderRadius: '35px' }} size="medium" variant="contained">
                    Back to Dashboard
                </Button>
            </Stack>
        </div>
    ) : (
        <CircularProgress/>
    )
}

export default TryvestorBanking;