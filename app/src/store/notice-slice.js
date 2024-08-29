import {createSlice} from "@reduxjs/toolkit";

const initialState = {
    noticeList: [],
    currentNotice: null,
    count: 0,
    selectedNotice: null,
    isModalOpen: false,
    closeModal: true,
};

const noticeSlice = createSlice({
    name: 'notice',
    initialState,
    reducers: {
        setNotices(state, action) {
            state.noticeList = action.payload;
        },
        addNotice(state, action) {
            const newNotice = action.payload;
            console.log('newNotice: ', newNotice);
            if (newNotice) {
                state.noticeList.push(newNotice);
                state.count += 1;
            }
        },
        setCurrentNotice(state, action) {
            state.currentNotice = action.payload;
        },
        updateNotice(state, action) {
            const index = state.noticeList.findIndex(notice => notice.id === action.payload.id);
            if (index !== -1) {
                state.noticeList[index] = action.payload;
            }
        },
        deleteNotice(state, action) {
            const noticeId = action.payload;
            console.log('noticeId: ', noticeId);
            state.noticeList = state.noticeList.filter(notice => notice.id !== noticeId);
            state.count -= 1;
        },
        setSelectedNotice(state, action) {
            state.selectedNotice = action.payload;
        },
        openModal(state) {
            state.isModalOpen = true;
        },
        closeModal(state) {
            state.isModalOpen = false;
            state.selectedNotice = null;
        }

    }
});

export const noticeActions = noticeSlice.actions;
export default noticeSlice.reducer;