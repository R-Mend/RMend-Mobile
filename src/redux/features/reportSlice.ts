import { PayloadAction } from '@reduxjs/toolkit';

import { IIssueGroup } from '@/models/county/ICounty';
import IReport, { IReportDetails, IReportImage, IReportLocation } from '@/models/report/IReport';
import { createSlice } from '@reduxjs/toolkit'

export type ReportReducerState = IReport & {
    county: string,
    issueGroups: IIssueGroup[],
    isLoading: boolean
};

const initialState: ReportReducerState = {
    id: '',
    authorityId: '',
    senderId: '',
    timeCreated: '',
    images: [],
    details: {
        description: '',
        iconName: '',
        type: ''
    },
    location: {
        latitude: null,
        longitude: null
    },
    county: '',
    issueGroups: [],
    isLoading: false
};

const reportSlice = createSlice({
    name: 'report',
    initialState,
    reducers: {
        reportReset: () => initialState,

        imageAdded(state, action: PayloadAction<IReportImage>) {
            state.images.push(action.payload);
        },

        imageRemoved(state, action: PayloadAction<number>) {
            state.images = state.images.filter((_, index) => index != action.payload);
        },

        locationUpdated(state, action: PayloadAction<IReportLocation>) {
            state.location = action.payload;
        },

        detailsUpdated(state, action: PayloadAction<IReportDetails>) {
            state.details = action.payload;
        },

        senderIdUpdated(state, action: PayloadAction<string>) {
            state.senderId = action.payload;
        },

        countyUpdated(state, action: PayloadAction<string>) {
            state.county = action.payload;
        },

        authorityIdUpdated(state, action: PayloadAction<string>) {
            state.authorityId = action.payload;
        },

        issueGroupsUpdated(state, action: PayloadAction<IIssueGroup[]>) {
            state.issueGroups = action.payload;
        },

        isLoadingStarted(state) {
            state.isLoading = true;
        },

        isLoadingStopped(state) {
            state.isLoading = false;
        }
    }
});

export const {
    reportReset,
    imageAdded,
    imageRemoved,
    locationUpdated,
    detailsUpdated,
    senderIdUpdated,
    countyUpdated,
    authorityIdUpdated,
    issueGroupsUpdated,
    isLoadingStarted,
    isLoadingStopped
} = reportSlice.actions

export default reportSlice.reducer;