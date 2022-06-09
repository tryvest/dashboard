import {ApiCore} from "./core";
import {apiProvider} from "./provider";
import axios from "axios";
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
        .get(`${url}/byUsername`, {params: {username: username}})
        .then(handleResponse)
        .catch(handleError);
}

export {apiTryvestors};