import { createSlice } from '@reduxjs/toolkit';

const workplaceSlice = createSlice({
    name: 'workplace',
    initialState: {
        workList: {
            workplaces: [{}], // 초기값 설정
        },
        workplaceId: "",
        currentPage: 0,

    },
    reducers: {
        setWorkList(state, action) {
            state.workList.workplaces = action.payload; // 배열을 직접 설정
        },
        setWorkplaceId(state, action) {
            state.workplaceId = action.payload.workplaceId;
        },
        setCurrentPage(state, action) {
            state.currentPage = action.payload.currentPage;
        }
    },
});

export const workplaceActions = workplaceSlice.actions;
export default workplaceSlice.reducer;
