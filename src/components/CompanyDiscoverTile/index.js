import React, { useContext } from 'react'
import { ThemeContext } from 'styled-components'
import {
    Card,
    CardContent,
    Button,
    Stack,
} from '@mui/material';
import {useNavigate} from "react-router-dom";
import ArrowRight from '../../images/DiscoverTileArrow.png'
import { CompanyName, ButtonBox, SloganText, OneLinerText, CompanyLogo, QuickInfo, ButtonGroup, Stockback } from './styles'

const CompanyDiscoverTile = (props) => {
    const navigate = useNavigate()
    const {logo, name, slogan, oneLiner, businessId} = props
    const theme = useContext(ThemeContext)
    return (
        <Card style={{ alignItems: 'center', marginInline: "10px", justifyContent: 'center', height: '145px', marginBottom: '15px', marginTop: '20px' }} onClick={() => {navigate(`/dashboard/businesses/${businessId}`)}}>
            <CardContent>
                <Stack alignItems={"center"} marginInline={"10px"} direction="row" justifyContent={"space-between"}>
                    <CompanyLogo>
                        <img src={logo} alt="Company Logo"/>
                    </CompanyLogo>
                    <QuickInfo>
                        <CompanyName>
                            {name}
                        </CompanyName>
                        <SloganText>
                            {slogan}
                        </SloganText>
                    </QuickInfo>
                    <OneLinerText>
                        {oneLiner}
                    </OneLinerText>
                    <Stack direction={"row"}>
                        <Button style={{ width: "150px", height: "30px", backgroundColor: "#042534", fontSize: "14px", color: "#fff" }}>
                            Invest Capital
                        </Button>
                        <div style={{ marginLeft: "5px" }}>
                            <img src={ArrowRight} alt="Arrow Right"/>
                        </div>
                    </Stack>
                </Stack>
            </CardContent>
        </Card>
    )
}


export default CompanyDiscoverTile
