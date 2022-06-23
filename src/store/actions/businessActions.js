import {apiTryvestors} from "../../utils/api/api-tryvestors";

export const switchBusiness = newBusinessID => {
    return (dispatch, getState) => {
        try {
            const data = {
                "businessID": newBusinessID
            }
            dispatch({ type: "SWITCH_BUSINESS", payload: data })
        }
        catch{
            dispatch({ type: "SWITCH_BUSINESS_ERR" });

        }
    }
};