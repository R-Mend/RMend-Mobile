import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    images: [],
    county: '',
    authority: { name: '', type: '' },
    location: { latitude: 37.78825, longitude: -122.4324 },
    details: { type: null, details: null, iconName: null },
    senderInfo: { name: null, email: null, phoneNumber: null },
    isLoading: false,
};

const reportSlice = createSlice({
    name: 'report',
    initialState,
    reducers: {
        resetReport: () => initialState,

        addImage(state, { payload }) {
            state.images.push(payload);
        },

        removeImage(state, { payload }) {
            state.images = state.images.filter((_, index) => index != payload);
        },

        updateLocation(state, { payload }) {
            state.location = payload;
        },

        updateDetails(state, { payload }) {
            state.details = payload;
        },

        updateSenderInfo(state, { payload }) {
            state.senderInfo = payload;
        },

        updateCounty(state, { payload }) {
            state.county = payload;
        },

        updateAuthority(state, { payload }) {
            state.authority = payload;
        }
    }
});

export const {
    resetReport,
    addImage,
    removeImage,
    updateLocation,
    updateDetails,
    updateSenderInfo,
    updateCounty,
    updateAuthority
} = reportSlice.actions

export default reportSlice.reducer;