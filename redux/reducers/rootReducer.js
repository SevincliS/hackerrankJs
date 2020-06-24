import { combineReducers } from 'redux';

import problemsReducer from './problemsReducer';
import userReducer from './userReducer';
import consentReducer from './consentReducer';
export default combineReducers({
  problems: problemsReducer,
  user: userReducer,
  consent: consentReducer,
});