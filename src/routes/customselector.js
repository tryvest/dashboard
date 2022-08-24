import { Navigate } from 'react-router-dom';
import {useSelector} from "react-redux";
import {BUSINESS, TRYVESTOR} from "../UserTypes";

export const CustomSelectRouter = (businessPage, tryvestorPage, unauthPage) => {
    const userType = useSelector(state => state.auth?.userType)
    if (userType === TRYVESTOR) {
        return tryvestorPage === null ? <Navigate to="/404" /> : tryvestorPage
    }
    if (userType === BUSINESS) {
        return businessPage === null ? <Navigate to="/404" /> : businessPage
    }
    return unauthPage === null ? <Navigate to="/" /> : unauthPage
}