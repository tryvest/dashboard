import axios from "axios";
import {ApiCore} from "./core";
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

apiBusinesses.postTermDocument = (model) => {
    return axios
        .post(`${url}/termDocuments`, model)
        .then(handleResponse)
        .catch(handleError);
}

apiBusinesses.postTermDocumentResponse = (model) => {
    return axios
        .post(`${url}/termDocuments/reponses`, model)
        .then(handleResponse)
        .catch(handleError);
}

apiBusinesses.getTermDocumentResponses = (termDocID) => {
    return axios
        .get(`${url}/termDocuments/responses`, {params: {termDocID}})
        .then(handleResponse)
        .catch(handleError);
}

apiBusinesses.getTermDocumentResults = () => {
    return axios
        .get(`${url}/termDocuments/results`)
        .then(handleResponse)
        .catch(handleError);
}

apiBusinesses.putVerifyResponse = (model) => {
    return axios
        .put(`${url}/termDocuments/verifyResponse`, model)
        .then(handleResponse)
        .catch(handleError);
}

export {apiBusinesses};