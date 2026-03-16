import { IIssueGroup } from '@/models/county/ICounty'
import { createSlice } from '@reduxjs/toolkit'

export type ReportState = {
    images: string[],
    county: string,
    authorityId: string,
    location: {
        longitude: number,
        latitude: number
    },
    details: {
        type: string,
        details: string,
        iconName: string
    },
    senderInfo: {
        name: string,
        email: string,
        phoneNumber: string,
    },
    isLoading: boolean,
    issueGroups: IIssueGroup[]
}

const initialState: ReportState = {
    images: [],
    county: '',
    authorityId: '',
    location: { latitude: 37.78825, longitude: -122.4324 },
    details: { type: null, details: null, iconName: null },
    senderInfo: { name: null, email: null, phoneNumber: null },
    isLoading: false,
    issueGroups: []
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

        authorityIdUpdated(state, { payload }) {
            state.authorityId = payload;
        },

        issueGroupsUpdated(state, { payload }) {
            state.issueGroups = payload;
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
    authorityIdUpdated,
    issueGroupsUpdated
} = reportSlice.actions

export default reportSlice.reducer;