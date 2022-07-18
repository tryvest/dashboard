import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from 'firebase/auth'
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {apiTryvestors} from "../../utils/api/api-tryvestors";
import {BASE_URL} from "../../utils/api/provider";
import {handleError, handleResponse} from "../../utils/api/response";

const auth = getAuth()
export const tryvestorSignIn = creds => {
  return (dispatch, getState, { getFirebase }) => {
        const navigate = useNavigate()
        signInWithEmailAndPassword(auth, creds.email, creds.password)
        .then(async (data) => {
          const userType = axios
              .get(`${BASE_URL}/userType?userID=${data.user.uid}`) // .get(`${BASE_URL}/byUsername`, {params: {username}})
              .then((response) => {
                  if (response.results === "business") {
                    navigate('/business/login')
                  }
              })
              .catch(handleError);

          apiTryvestors.getSingle(data.user.uid).then((user) => {
              const payload1 = {...user}
              dispatch({ type: "SIGN_IN_USER", payload1 });

              const userType = "tryvestor"
              dispatch({ type: "SET_USER_TYPE", userType})
          })

        })
        .catch(err => {
          dispatch({ type: "SIGN_IN_ERR" }, err);
        });
  };
};

export const businessSignIn = creds => {
    return (dispatch, getState, { getFirebase }) => {
        const navigate = useNavigate()
        signInWithEmailAndPassword(auth, creds.email, creds.password)
            .then(async (data) => {
                const userType = axios
                    .get(`${BASE_URL}/userType?userID=${data.user.uid}`) // .get(`${BASE_URL}/byUsername`, {params: {username}})
                    .then((response) => {
                        if (response.results === "tryvestor") {
                            navigate('/tryvestor/login')
                        }
                    })
                    .catch(handleError);

                apiTryvestors.getSingle(data.user.uid).then((user) => {
                    const payload1 = {...user}
                    dispatch({ type: "SIGN_IN_BUSINESS", payload1});

                    const userType = "business"
                    dispatch({ type: "SET_USER_TYPE", userType})
                })

            })
            .catch(err => {
                dispatch({ type: "SIGN_IN_ERR" }, err);
            });
    };
};

export const logOut = () => {
  return (dispatch, getState, { getFirebase }) => {

        auth.signOut().then(() => {
          dispatch({ type: "SIGN_OUT" });
        });
  };
};

export const signUp = creds => {
  return (dispatch, getState, { getFirebase }) => {


    createUserWithEmailAndPassword(auth, creds.email, creds.password)
    .then(async (res) => {
      const data = {
        "tryvestorID": res.user.uid,
        "username": creds.email,
        "firstName": creds.firstName,
        "lastName": creds.lastName,
        "interests": creds.topics,
      }

      await apiTryvestors.post(data)
      dispatch({ type: "SIGN_UP", payload: data });

    })
    .catch(err => {
      dispatch({ type: "SIGN_UP_ERR" }, err);
    });
  };
};