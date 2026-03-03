import { SIGN_IN, SIGN_OUT, GET_USER_INFO } from '../actions/types';

const INITIAL_STATE = {
  isSignedIn: false,
  displayName: null,
  email: null,
  phoneNumber: null,
  authCode: null,
};

const authReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case SIGN_IN:
      return { ...state, isSignedIn: true };
    case GET_USER_INFO:
      return { ...state, ...action.payload };
    case SIGN_OUT:
      return INITIAL_STATE;
    default:
      return state;
  }
};

export default authReducer;
