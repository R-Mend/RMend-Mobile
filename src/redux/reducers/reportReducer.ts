import {
  ADD_IMAGE,
  REMOVE_IMAGE,
  UPDATE_LOCATION,
  UPDATE_DETAILS,
  UPDATE_SENDER_INFO,
  UPDATE_AUTHORITY,
  RESET_REPORT,
  START_UPLOAD,
  UPDATE_COUNTY,
  STOP_UPLOAD,
} from '../actions/types';

const INITIAL_STATE = {
  images: [],
  county: '',
  authority: { authCode: '', name: '', type: '' },
  location: { latitude: 37.78825, longitude: -122.4324 },
  details: { type: null, details: null, iconName: null },
  senderInfo: { name: null, email: null, phoneNumber: null },
  isLoading: false,
};

const reportReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case RESET_REPORT:
      return {
        ...INITIAL_STATE,
      };
    case ADD_IMAGE:
      return {
        ...state,
        images: [...state.images, action.payload],
      };
    case REMOVE_IMAGE:
      return {
        ...state,
        images: state.images.filter((image, index) => index != action.payload),
      };
    case UPDATE_LOCATION:
      return {
        ...state,
        location: action.payload,
      };
    case UPDATE_DETAILS:
      return {
        ...state,
        details: action.payload,
      };
    case UPDATE_SENDER_INFO:
      return {
        ...state,
        senderInfo: action.payload,
      };
    case UPDATE_COUNTY:
      return {
        ...state,
        county: action.payload,
      };
    case UPDATE_AUTHORITY:
      return {
        ...state,
        authority: action.payload,
      };
    case START_UPLOAD:
      return {
        ...state,
        isLoading: true,
      };
    case STOP_UPLOAD:
      return {
        ...state,
        isLoading: false,
      };
    default:
      return state;
  }
};

export default reportReducer;
