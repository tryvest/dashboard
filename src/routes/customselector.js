import { Navigate } from 'react-router-dom';
import {useSelector} from 'react-redux'
import NotFound from '../pages/Page404';
import {BUSINESS, TRYVESTOR} from "../UserTypes";
import {selectUserType} from "../features/userSlice"

export const CustomSelectRouter = (props) => {
    const {businessPage, tryvestorPage, unauthPage} = props
    const userType = useSelector(state => state?.user?.user?.userType);
    if (userType === TRYVESTOR) {
        if (tryvestorPage !== undefined) {
            return tryvestorPage
        }
        return <Navigate to="/404" />
    }
    if (userType === BUSINESS) {
        if (businessPage !== undefined) {
            return businessPage
        }
        return <Navigate to="/404" />
    }
    if (unauthPage !== undefined) {
        return unauthPage
    }
    return <Navigate to="/404" />
}