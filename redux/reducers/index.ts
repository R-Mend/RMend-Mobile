import { combineReducers } from 'redux';
import reportReducer from './reportReducer';
import authReducer from './authReducer';

export default combineReducers({
  report: reportReducer,
  user: authReducer,
});
