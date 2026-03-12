import { configureStore } from '@reduxjs/toolkit'

import reportReducer from './reducers/reportReducer';
import authReducer from './reducers/authReducer';

// Automatically adds the thunk middleware and the Redux DevTools extension
const store = configureStore({
    // Automatically calls `combineReducers`
    reducer: {
        report: reportReducer,
        user: authReducer,
    }
});

export default store;