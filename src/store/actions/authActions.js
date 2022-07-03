import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from 'firebase/auth'
import {apiTryvestors} from "../../utils/api/api-tryvestors";

const auth = getAuth()

export const signIn = creds => {
  return (dispatch, getState, { getFirebase }) => {

        signInWithEmailAndPassword(auth, creds.email, creds.password)
        .then(async (data) => {

          apiTryvestors.getSingle(data.user.uid).then((user) => {

            const payload = {...user}
            dispatch({ type: "SIGN_IN", payload });
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