import { combineReducers } from 'redux';

import problemsReducer from './problemsReducer';
import userReducer from './userReducer';
export default combineReducers({
  problems: problemsReducer,
  user: userReducer,
});