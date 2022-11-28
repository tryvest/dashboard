import React, { useContext } from 'react'
import { ThemeContext } from 'styled-components'
import {
    Card,
    CardContent, Stack, Button, Grid
} from '@mui/material';
import {useNavigate} from "react-router-dom";
import ArrowRight from '../../images/DiscoverTileArrow.png'
import { CompanyTileBox, CompanyName, ButtonBox, SloganText, OneLinerText, CompanyLogo, QuickInfo, ButtonGroup, Stockback, SizedBox } from './styles'
import CompanyDiscoverTile from '../CompanyDiscoverTile'

const CategoryDiscoverTile = (props) => {
    const { categoryName, matchingCompanies, selectBusinessForCategory, selectedBusinessPerCategory, categoryID} = props
    const theme = useContext(ThemeContext)
    return (
        <div style={{ alignItems: 'center', justifyContent: 'center', height: '220px', marginBottom: '5px' }}>
            <div>
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
            </div>
        </div>
    )
}

export const CategoryDiscoverTileLight = (props) => {
    const { categoryName, matchingCompanies, selectBusinessForCategory, selectedBusinessPerCategory, categoryID} = props
    return (
        <CardContent>
            <CompanyName>
                {`${categoryName.substring(0, 1).toUpperCase()}${categoryName.substring(1)}: `}
            </CompanyName>
            <Grid container>
                {
                    selectedBusinessPerCategory && matchingCompanies?.map((data) => {
                        const isSelected = selectedBusinessPerCategory[categoryID] === data.businessID
                        return (
                            <Grid item sm={12} md={6} lg={6}>
                                <CompanyDiscoverTileLight selectBusinessForCategory={selectBusinessForCategory} categoryID={categoryID} businessID={data.businessID} isSelected={isSelected} name={data.name} logo={data.logo} slogan={data.tagline} />
                            </Grid>
                        )
                    })
                }
            </Grid>
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

const CompanyDiscoverTileLight = (props) => {
    const navigate = useNavigate()
    const {logo, name, slogan, businessID, categoryID, selectBusinessForCategory, isSelected} = props
    const theme = useContext(ThemeContext)
    return (
        <Card style={{ alignItems: 'center', justifyContent: 'center', height: '145px', marginBottom: '15px', marginTop: '20px' }}>
            <CardContent sx={{cursor: "pointer"}}>
                <Stack direction="row">
                    <CompanyLogo onClick={() => {navigate(`/businesses/${businessID}`)}}>
                        <img src={logo} alt="Company Logo"/>
                    </CompanyLogo>
                    <QuickInfo>
                        <CompanyName onClick={() => {navigate(`/businesses/${businessID}`)}}>
                            {name}
                        </CompanyName>
                        <SloganText onClick={() => {navigate(`/businesses/${businessID}`)}}>
                            {slogan}
                        </SloganText>
                        <Button onClick={() => selectBusinessForCategory(categoryID, businessID)} variant={'contained'} disabled={isSelected}>
                            {isSelected ? "Selected" : "Select Loyalty"}
                        </Button>
                    </QuickInfo>
                </Stack>
            </CardContent>
        </Card>
    )
}

export default CategoryDiscoverTile
