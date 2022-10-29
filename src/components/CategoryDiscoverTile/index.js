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
        <CardContent>
            <CompanyName>
                {`${categoryName.substring(0, 1).toUpperCase()}${categoryName.substring(1)}: `}
            </CompanyName>
            {
                matchingCompanies?.map((data) => {
                    return (
                        <CompanyDiscoverTile businessId={data.businessID} name={data.name} logo={data.logo} slogan={data.tagline} oneLiner={data.description} />
                    )
                })
            }
        </CardContent>
        // <Card variant="outlined" style={{ alignItems: 'center', justifyContent: 'center', height: '220px', marginBottom: '15px' }}>
        //     <CardContent>
        //         <CompanyName>
        //             {categoryName.substring(0, 1).toUpperCase() + categoryName.substring(1)}
        //         </CompanyName>
        //         {
        //             matchingCompanies?.map((data) => {
        //                return (
        //                 <CompanyDiscoverTile name={data.name} logo={data.logo} slogan={data.tagline} oneLiner={data.description} />
        //                ) 
        //             })
        //         }
        //     </CardContent>
        // </Card>
    )
}

export default CategoryDiscoverTile
