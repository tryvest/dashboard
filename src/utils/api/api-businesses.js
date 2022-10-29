import axios from "axios";
import {ApiCore} from "./core";
import {BASE_URL} from "./provider";
import {handleError, handleResponse} from "./response";


const url = 'businesses';
const plural = 'businesses';
const single = 'business';

// plural and single may be used for message logic if needed in the ApiCore class.

const apiBusinesses = new ApiCore({
    getAll: true,
    getSingle: true,
    post: true,
    put: true,
    patch: false,
    delete: false,
    url,
    plural,
    single
});

apiBusinesses.getCompanyInfoByID = (businessID) => {
    return axios
        .get(`${BASE_URL}/businesses/${businessID}`)
        .then(handleResponse)
        .catch(handleError);
}

apiBusinesses.getMostRecentCampaignInfo = (businessID) => {
    return axios
        .get(`${BASE_URL}/businesses/${businessID}/campaigns?limit=1`)
        .then(handleResponse)
        .catch(handleError);
}

apiBusinesses.getCategoryName = () => {
    return axios
        .get(`${BASE_URL}/categories`)
        .then(handleResponse)
        .catch(handleError);
}

apiBusinesses.getCompanyInfoByCat = () => {
    return axios
        .get(`${BASE_URL}/businesses?sortBy=category`)
        .then(handleResponse)
        .catch(handleError);
}

apiBusinesses.postTermDocument = (model) => {
    return axios
        .post(`${BASE_URL}/businesses/termDocuments`, model)
        .then(handleResponse)
        .catch(handleError);
}

apiBusinesses.postTermDocumentResponse = (model) => {
    return axios
        .post(`${BASE_URL}/businesses/termDocuments/reponses`, model)
        .then(handleResponse)
        .catch(handleError);
}

apiBusinesses.getTermDocumentResponses = (termDocID) => {
    return axios
        .get(`${BASE_URL}/businesses/termDocuments/responses`, {params: {termDocID}})
        .then(handleResponse)
        .catch(handleError);
}

apiBusinesses.getTermDocumentResults = () => {
    return axios
        .get(`${BASE_URL}/businesses/termDocuments/results`)
        .then(handleResponse)
        .catch(handleError);
}

apiBusinesses.putVerifyResponse = (model) => {
    return axios
        .put(`${BASE_URL}/businesses/termDocuments/verifyResponse`, model)
        .then(handleResponse)
        .catch(handleError);
}

apiBusinesses.createAnnouncement = (model) => {
    return axios
        .post(`${BASE_URL}/businesses/announcements`, model)
        .then(handleResponse)
        .catch(handleError);
}

apiBusinesses.updateSingleAnnouncement = (model, announcementID) => {
    return axios
        .post(`${BASE_URL}/businesses/announcements/${announcementID}`, model)
        .then(handleResponse)
        .catch(handleError);
}

export {apiBusinesses};