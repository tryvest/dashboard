import React, { useContext } from 'react'
import { ThemeContext } from 'styled-components'
import {
    Card,
    CardContent
} from '@mui/material';
import Button from '../Button'
import ArrowRight from '../../images/DiscoverTileArrow.png'
import { CompanyName, ButtonBox, SloganText, OneLinerText, CompanyLogo, QuickInfo, ButtonGroup, Stockback } from './styles'

const CompanyDiscoverTile = (props) => {
    const {logo, name, slogan, oneLiner, stock} = props
    const theme = useContext(ThemeContext)
    return (
        <Card style={{ alignItems: 'center', justifyContent: 'center', height: '145px', marginBottom: '15px' }}>
            <CardContent>
                <ButtonBox>
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
                    <ButtonGroup>
                        <Stockback>
                            <Button width="150px" height="30px" bgColor="#042534" radius="8px" text="2.5% back in stock" fontSize="14px"/>
                            <img src={ArrowRight} alt="Arrow Right"/>
                        </Stockback>
                    </ButtonGroup>
                </ButtonBox>
            </CardContent>
        </Card>
    )
}

export default CompanyDiscoverTile
