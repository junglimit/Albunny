import { createSlice } from "@reduxjs/toolkit";

const date = new Date();

const initialState = {
    month: date.getMonth() + 1,
    year: date.getFullYear(),
    salaryAmount: 0,
    logList: [],
    slaveData: {
        slaveId: "",
        slaveName: "",
        wageInsurance: false,
        totalSalary: 0,
        dtoList: [],
    },
    benefit: 0,
}

const wageSlice = createSlice({
    name: 'wage',
    initialState,
    reducers: {
        setMonthByType(state, action) {
            if(action.payload.type === "prev") {
                if (state.month === 1) {
                    state.month = 12;
                    state.year = state.year - 1;
                } else {
                    state.month = state.month - 1;
                }
            } else if(action.payload.type === "next") {
                if (state.month === 12) {
                    state.month = 1;
                    state.year = state.year + 1;
                } else {
                    state.month = state.month + 1;
                }
            }
        }, setSalaryByMonth(state, action) {
            state.salaryAmount = action.payload.amount;
        }, setSalaryLogList(state, action) {
            state.logList = [...action.payload.dtoList];
        }, setSlaveData(state, action) {
            state.slaveData = action.payload.slaveData;
        }, setBenefit(state, action) {
            state.benefit += action.payload.benefit;
        }
    }
})
export const wageActions = wageSlice.actions;
export default wageSlice.reducer;