import axios from "axios";
import {ApiCore} from "./core";

import {BASE_URL} from "./provider";
import {handleError, handleResponse} from "./response";

const url = '';
const plural = '';
const single = '';

// plural and single may be used for message logic if needed in the ApiCore class.

const api = new ApiCore({
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

api.getUserType = (uid) => {
  return axios
      .get(`${BASE_URL}/userType?userID=${uid}`) // .get(`${BASE_URL}/byUsername`, {params: {username}})
      .then(handleResponse)
      .catch(handleError);
}

api.createPlaidLinkToken = () => {
  return axios
      .post(`${BASE_URL}/plaid/create_link_token`) // .get(`${BASE_URL}/byUsername`, {params: {username}})
      .then(handleResponse)
      .catch(handleError);
}


export {api};