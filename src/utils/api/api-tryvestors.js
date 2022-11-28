import axios from "axios";
import {ApiCore} from "./core";

import {BASE_URL} from "./provider";
import {handleError, handleResponse} from "./response";
import {api} from "./api";

const url = 'tryvestors';
const plural = 'tryvestors';
const single = 'tryvestor';

// plural and single may be used for message logic if needed in the ApiCore class.

const apiTryvestors = new ApiCore({
    getAll: true,
    getSingle: true,
    post: true,
    put: false,
    patch: false,
    delete: false,
    url,
    plural,
    single
});

apiTryvestors.getByUsername = (username) => {
    return axios
        .get(`${BASE_URL}/${url}/byUsername?username=${username}`) // .get(`${BASE_URL}/byUsername`, {params: {username}})
        .then(handleResponse)
        .catch(handleError);
}

apiTryvestors.patchSingleUser = (uid, model) => {
    return axios
        .patch(`${BASE_URL}/${url}/${uid}`, model)
        .then(handleResponse)
        .catch(handleError);
}

apiTryvestors.changeLoyalty = (tryvestorID, businessID, categoryID) => {
    const model = {
        "businessID": businessID,
        "categoryID": categoryID
    }

    return axios
        .post(`${BASE_URL}/${url}/${tryvestorID}/loyalties`, model)
        .then(handleResponse)
        .catch(handleError);
}

apiTryvestors.updateLoyaltyStatus = (tryvestorID, newLoyaltyStatus) => {
    const model = {
        "newLoyaltyStatus": newLoyaltyStatus
    }

    return axios
        .patch(`${BASE_URL}/${url}/${tryvestorID}/loyalties/updateLoyaltyStatus`, model)
        .then(handleResponse)
        .catch(handleError);
}

apiTryvestors.getUserItems = (tryvestorID) => {
    return axios
        .get(`${BASE_URL}/${url}/${tryvestorID}/userItems`)
        .then(handleResponse)
        .catch(handleError);
}

apiTryvestors.disableUserItem = (tryvestorID, userItemID) => {
    return axios
        .patch(`${BASE_URL}/${url}/${tryvestorID}/userItems/${userItemID}`)
        .then(handleResponse)
        .catch(handleError);
}

apiTryvestors.deleteUserAccountFromItem = (tryvestorID, userItemID, userAccountID) => {
    return axios
        .delete(`${BASE_URL}/${url}/${tryvestorID}/userItems/${userItemID}/${userAccountID}`)
        .then(handleResponse)
        .catch(handleError);
}

apiTryvestors.setDefaultAccountAndItem = (tryvestorID, userItemID, userAccountID) => {
    return axios
        .patch(`${BASE_URL}/${url}/${tryvestorID}/userItems/${userItemID}/${userAccountID}`)
        .then(handleResponse)
        .catch(handleError);
}

export {apiTryvestors};