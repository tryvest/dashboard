import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth'
import {apiTryvestors} from "../../utils/api/api-tryvestors";
import app from '../../firebaseConfig'

const auth = getAuth()

export const signIn = creds => {
  return (dispatch, getState, { getFirebase }) => {

        signInWithEmailAndPassword(auth, creds.email, creds.password)
        .then(async () => {
          apiTryvestors.getByUsername(creds.email).then((fireRes) => {
            console.log(fireRes);
            const data = {
              "username": fireRes[0].username,
              "firstName": fireRes[0].firstName,
              "lastName": fireRes[0].lastName,
              "interests": fireRes[0].interests,
            }
            dispatch({ type: "SIGN_IN", payload: data });
          })

        })
        .catch(err => {
          dispatch({ type: "SIGN_IN_ERR" }, err);
        });
  };
};

export const signOut = () => {
  return (dispatch, getState, { getFirebase }) => {
    const firebase = getFirebase();

    firebase
        .auth()
        .signOut()
        .then(() => {
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

      apiTryvestors.post(data).then(() => console.log("Data in Firestore"))
      dispatch({ type: "SIGN_UP", payload: data });

    })
    .catch(err => {
      dispatch({ type: "SIGN_UP_ERR" }, err);
    });
  };
};