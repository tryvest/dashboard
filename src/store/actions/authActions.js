import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from 'firebase/auth'
import {apiTryvestors} from "../../utils/api/api-tryvestors";

const auth = getAuth()

export const signIn = creds => {
  return (dispatch, getState, { getFirebase }) => {

        signInWithEmailAndPassword(auth, creds.email, creds.password)
        .then(async () => {
          apiTryvestors.getByUsername(creds.email).then((fireRes) => {
            const data = {
              "username": fireRes.username,
              "firstName": fireRes.firstName,
              "lastName": fireRes.lastName,
              "interests": fireRes.interests,
              "uid": fireRes.tryvestorID,
            }
            dispatch({ type: "SIGN_IN", payload: data });
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
    console.log("inside creds");
    console.log(creds);

    createUserWithEmailAndPassword(auth, creds.email, creds.password)
    .then(async (res) => {
      const data = {
        "uid": res.user.uid,
        "username": creds.email,
        "firstName": creds.firstName,
        "lastName": creds.lastName,
        "interests": creds.topics,
      }

      apiTryvestors.post(data)
      dispatch({ type: "SIGN_UP", payload: data });

    })
    .catch(err => {
      dispatch({ type: "SIGN_UP_ERR" }, err);
    });
  };
};