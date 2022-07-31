import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { apiTryvestors, } from '../../utils/api/api-tryvestors';
import { api } from '../../utils/api/api';
import { BASE_URL } from '../../utils/api/provider';
import { handleError, handleResponse } from '../../utils/api/response';
import { BUSINESS, TRYVESTOR } from '../../UserTypes';

const auth = getAuth();

export const tryvestorSignIn = (creds, navigate) => {
  return (dispatch, getState, { getFirebase }) => {
    console.log('in: tryvestorSignIn');
    signInWithEmailAndPassword(auth, creds.email, creds.password)
      .then(async (data) => {
        api.getUserType(data.user.uid)
            .then(userType => {
              if (userType !== TRYVESTOR) {
                navigate('/business/login');
              }
              apiTryvestors.getSingle(data.user.uid).then((user) => {
                const payload = { ...user };
                dispatch({ type: 'SIGN_IN_USER', user: payload, userType});
              });
            })
            .catch(handleError);
      })
      .catch((err) => {
        dispatch({ type: 'SIGN_IN_ERR' }, err);
      });
  };
};

export const businessSignIn = (creds) => {
  return (dispatch, getState, { getFirebase }) => {
    const navigate = useNavigate();
    signInWithEmailAndPassword(auth, creds.email, creds.password)
      .then(async (data) => {
        const userType = axios
          .get(`${BASE_URL}/userType?userID=${data.user.uid}`) // .get(`${BASE_URL}/byUsername`, {params: {username}})
          .then((response) => {
            if (response.results === TRYVESTOR) {
              navigate('/tryvestor/login');
            }

            apiTryvestors.getSingle(data.user.uid).then((user) => {
              const payload1 = { ...user };
              dispatch({ type: 'SIGN_IN_BUSINESS', payload1 });

              const userType = BUSINESS;
              dispatch({ type: 'SET_USER_TYPE', userType });
            });
          })
          .catch(handleError);
      })
      .catch((err) => {
        dispatch({ type: 'SIGN_IN_ERR' }, err);
      });
  };
};

export const logOut = (navigate) => {
  return (dispatch, getState, { getFirebase }) => {
    auth.signOut().then(() => {
      dispatch({ type: 'SIGN_OUT' });
      navigate('/')
    });
  };
};

export const signUp = (creds) => {
  return (dispatch, getState, { getFirebase }) => {
    createUserWithEmailAndPassword(auth, creds.email, creds.password)
      .then(async (res) => {
        const data = {
          tryvestorID: res.user.uid,
          username: creds.email,
          firstName: creds.firstName,
          lastName: creds.lastName,
          interests: creds.topics,
        };

        await apiTryvestors.post(data);
        dispatch({ type: 'SIGN_UP', payload: data });
      })
      .catch((err) => {
        dispatch({ type: 'SIGN_UP_ERR' }, err);
      });
  };
};
