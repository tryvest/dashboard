import {useEffect, useState, View} from 'react';
import { CircularProgress } from '@mui/material';
import { apiBusinesses } from '../../utils/api/api-businesses';
import { CompanyName } from './Styles';
import CompanyDiscoverTile from '../../components/CompanyDiscoverTile'
import CategoryDiscoverTile from '../../components/CategoryDiscoverTile'
import LandingNav from "../general/LandingNav";


// ----------------------------------------------------------------------

const Discover = (props) => {

  const [allBusinessesByCategory, setAllBusinessesByCategory] = useState()
  const [allCategories, setAllCategories] = useState()

  useEffect(() => {
    apiBusinesses.getBusinessInfoByCat().then((companyByCatData) => {
      setAllBusinessesByCategory(companyByCatData)
    })
  }, [])

  useEffect(() => {
    apiBusinesses.getCategoryNames().then((categoryData) => {
      // setAllCategories(categoryData)
      const categoryToName = {}
      // const categoryIDs = Object.keys(categoryData)
      for (let i = 0; i < categoryData.length; i+=1) {
        const tempCat = categoryData[i]
        categoryToName[tempCat.categoryID] = tempCat.categoryName
      }
      setAllCategories(categoryToName)
    })
  }, [])

  // useEffect(() => {
  //   apiBusinesses.getCategoryName().then(categoryData => setAllCategories(categoryData))
  // }, [allCategories])

  // useEffect(() => {
  //   apiBusinesses.getAll().then(data => setAllBusinesses(data))
  // }, [allBusinesses])

  // const matchCompToCat = () => {
  //   for (i = 1; i < 4; seti(i+1)) {
  //     for (j = 1; j < 4; setj(j+1)) {
  //       if (allBusinesses[j].categoryID === allCategories[i].categoryID) {
  //         console.log(`${allBusinesses[j]} is from category: ${allCategories[i]}`)
  //       }
  //     }
  //   }
  // }

  // const businessDataMapping = (data) => {
  //   return (
  //     <CompanyDiscoverTile businessId={data.businessID} name={data.name} logo={data.logo} slogan={data.tagline} oneLiner={data.description} />
  //   )
  // }

  // const sortedBusinesses = () => {
  //   const catKeys = Object.keys(allBusinessesByCategory)
  //   catKeys.map((catKey) => {
  //     return (
  //       <CategoryDiscoverTile categoryName={allCategories[catKey]} matchingCompanies={allBusinessesByCategory[catKey]}/>
  //     )
  //   })
  // }

  useEffect(() => {
    console.log(props)
  }, [props])

  return (
      <div>
        {props.nav && (<LandingNav/>)}
        <CompanyName>
          <div style={{margin: "15px"}}>
            {
              (allBusinessesByCategory && allCategories) ? (
                  Object.keys(allBusinessesByCategory)?.map((catKey) => {
                    const catName = allCategories[catKey]
                    const company = allBusinessesByCategory[catKey]
                    return (
                        <div>
                          <CategoryDiscoverTile categoryName={catName} matchingCompanies={company}/>
                          <hr style={{marginBottom: "5px"}}/>
                        </div>
                    )
                  })
              ) : <CircularProgress />
            }
          </div>
        </CompanyName>
      </div>
  );
}

export default Discover

