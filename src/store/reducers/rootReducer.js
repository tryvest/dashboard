import { combineReducers } from 'redux'
import { firestoreReducer } from 'redux-firestore';
import { firebaseReducer } from 'react-redux-firebase'
import authReducer from './authReducer'
import businessReducer from './businessReducer'

const rootReducer = combineReducers({
  auth: authReducer,
  business: businessReducer,
  firestore: firestoreReducer,
  firebase: firebaseReducer
});

export default rootReducer

// the key name will be the data property on the state object