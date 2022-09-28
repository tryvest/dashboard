import {useEffect, useState, View} from 'react';
import { CircularProgress } from '@mui/material';
import { apiBusinesses } from '../../utils/api/api-businesses';
import { CompanyName } from './Styles';
import CompanyDiscoverTile from '../../components/CompanyDiscoverTile'
import CategoryDiscoverTile from '../../components/CategoryDiscoverTile'


// ----------------------------------------------------------------------

export default function Discover() {

  const [allBusinessesByCategory, setAllBusinessesByCategory] = useState()
  const [allCategories, setAllCategories] = useState()
  useEffect(() => {
    apiBusinesses.getCompanyInfoByCat().then(companyByCatData => setAllBusinessesByCategory(companyByCatData))
  }, [])

  useEffect(() => {
    apiBusinesses.getCategoryName().then((categoryData) => {
      // setAllCategories(categoryData)
      const categoryToName = {}
      // const categoryIDs = Object.keys(categoryData)
      for (let i = 0; i < categoryData.length; i+=1) {
        const tempCat = categoryData[i]
        categoryToName[tempCat.categoryID] = tempCat.categoryName
      }
      console.log(categoryToName)
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

  const businessDataMapping = (data) => {
    return (
      <CompanyDiscoverTile businessId={data.businessID} name={data.name} logo={data.logo} slogan={data.tagline} oneLiner={data.description} />
    )
  }

  // const sortedBusinesses = () => {
  //   const catKeys = Object.keys(allBusinessesByCategory)
  //   catKeys.map((catKey) => {
  //     return (
  //       <CategoryDiscoverTile categoryName={allCategories[catKey]} matchingCompanies={allBusinessesByCategory[catKey]}/>
  //     )
  //   })
  // }

  return (
    <CompanyName>
      {
        allBusinessesByCategory ? (
          Object.keys(allBusinessesByCategory)?.map((catKey) => {
            return (
              <CategoryDiscoverTile categoryName={allCategories[catKey]} matchingCompanies={allBusinessesByCategory[catKey]}/>
            )
          })
        ) : <CircularProgress />
      }
    </CompanyName>
  );
}
