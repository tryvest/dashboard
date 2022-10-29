import { combineReducers } from 'redux'
import authReducer from './authReducer'
import businessReducer from './businessReducer'

const rootReducer = combineReducers({
  auth: authReducer,
  business: businessReducer,
});

export default rootReducer

// the key name will be the data property on the state object