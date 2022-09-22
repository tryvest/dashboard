import { Navigate } from 'react-router-dom';
import {useSelector} from "react-redux";
import {BUSINESS, TRYVESTOR} from "../UserTypes";
import { Landing } from '../pages/general/Landing';

export const CustomSelectRouter = (props) => {
    const {businessPage, tryvestorPage, unauthPage} = props
    const userType = useSelector(state => state.auth?.userType)
    if (userType === TRYVESTOR) {
        if (tryvestorPage !== undefined) {
            console.log("tryvestor page is not null")
            return tryvestorPage
        }
        console.log("tryvestor page is null")
        return <Navigate to="/404" />
    }
    if (userType === BUSINESS) {
        if (businessPage !== undefined) {
            console.log("business page is not null")
            return businessPage
        }
        console.log("business page is null")
        return <Navigate to="/404" />
    }
    if (unauthPage !== undefined) {
        console.log("unauth page is not null")
        return unauthPage
    }
    console.log("unauth page is null")
    return <Navigate to="/" replace/>
}