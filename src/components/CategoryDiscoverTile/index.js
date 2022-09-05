import React, { useContext } from 'react'
import { ThemeContext } from 'styled-components'
import {
    Card,
    CardContent
} from '@mui/material';
import Button from '../Button'
import ArrowRight from '../../images/DiscoverTileArrow.png'
import { CompanyTileBox, CompanyName, ButtonBox, SloganText, OneLinerText, CompanyLogo, QuickInfo, ButtonGroup, Stockback, SizedBox } from './styles'
import CompanyDiscoverTile from '../CompanyDiscoverTile'

const CategoryDiscoverTile = (props) => {
    const { categoryName, matchingCompanies } = props
    const theme = useContext(ThemeContext)
    return (
        <Card style={{ alignItems: 'center', justifyContent: 'center', height: '200px', marginBottom: '15px' }}>
            <CardContent>
                <CompanyName>
                    {categoryName}
                </CompanyName>
                {
                    matchingCompanies?.map((data) => {
                       return (
                        <CompanyDiscoverTile name={data.name} logo={data.logo} slogan={data.tagline} oneLiner={data.description} />
                       ) 
                    })
                }
            </CardContent>
        </Card>
    )
}

export default CategoryDiscoverTile
