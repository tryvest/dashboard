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
      .get(`${BASE_URL}/userType?userID=${uid}`)
      .then(handleResponse)
      .catch(handleError);
}

api.createPlaidLinkToken = (tryvestorID) => {
  const model = {"tryvestorID" : tryvestorID}
  return axios
      .post(`${BASE_URL}/plaid/createLinkToken`, model)
      .then(handleResponse)
      .catch(handleError);
}

api.createPlaidIDVLinkToken = (tryvestorID) => {
  const model = {"tryvestorID" : tryvestorID}
  return axios
      .post(`${BASE_URL}/plaid/idv/createLinkToken`, model)
      .then(handleResponse)
      .catch(handleError);
}

api.createPlaidIDVPrepopulated = (tryvestorID) => {
  const model = {"tryvestorID" : tryvestorID}
  return axios
      .post(`${BASE_URL}/plaid/idv/prepopulate`, model)
      .then(handleResponse)
      .catch(handleError);
}

api.updateIdentityVerificationStatus = (tryvestorID, plaidIdentityVerificationID) => {
  const model = {
    "tryvestorID": tryvestorID,
    "plaidIdentityVerificationID": plaidIdentityVerificationID
  }
  return axios
      .post(`${BASE_URL}/plaid/idv/updateIdentityVerificationStatus`, model)
      .then(handleResponse)
      .catch(handleError);

}


api.exchangePublicTokenForAccessToken = (model) => {
  return axios
      .post(`${BASE_URL}/plaid/exchangePublicToken`, model)
      .then(handleResponse)
      .catch(handleError);
}

api.getInstitution = (institutionID) => {
  return axios
      .get(`${BASE_URL}/institution/${institutionID}`)
      .then(handleResponse)
      .catch(handleError);
}


export {api};