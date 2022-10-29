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
    const {logo, name, slogan, oneLiner, stock, businessId} = props
    const theme = useContext(ThemeContext)
    return (
        <Card style={{ alignItems: 'center', justifyContent: 'center', height: '145px', marginBottom: '15px', marginTop: '20px' }} onClick={() => {navigate(`/businesses/${businessId}`)}}>
            <CardContent>
                <Stack direction="row">
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
                            <Button style={{ width: "150px", height: "30px", backgroundColor: "#042534", fontSize: "14px", color: "#fff" }}>
                                2.5% back in stock
                            </Button>
                            <div style={{ marginLeft: "5px" }}>
                                <img src={ArrowRight} alt="Arrow Right"/>
                            </div>
                </Stack>
            </CardContent>
        </Card>
    )
}

export default CompanyDiscoverTile
