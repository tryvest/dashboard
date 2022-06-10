import axios from "axios";
import {handleError, handleResponse} from "./response";
import {ApiCore} from "./core";


const url = 'businesses';
const plural = 'businesses';
const single = 'business';

// plural and single may be used for message logic if needed in the ApiCore class.

const apiBusinesses = new ApiCore({
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

apiBusinesses.getTermDocumentResults = (model) => {
    return axios
        .post(`${url}/termDocuments/results`, model)
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