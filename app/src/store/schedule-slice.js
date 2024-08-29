import {createSlice} from "@reduxjs/toolkit";

const initialState = {
    addedSchedule: null,
};

const scheduleSlice = createSlice({
    name: 'schedule',
    initialState,
    reducers: {
        setAddedSchedule(state, action) {
            state.addedSchedule = action.payload;
        },
        clearAddedSchedule(state) {
            state.addedSchedule = null;
        },


    }
});

export const scheduleActions = scheduleSlice.actions;
export default scheduleSlice.reducer;