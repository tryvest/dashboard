import axios from "axios";
import {ApiCore} from "./core";

import {BASE_URL} from "./provider";
import {handleError, handleResponse} from "./response";

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


export {apiTryvestors};