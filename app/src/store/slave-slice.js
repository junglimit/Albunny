import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    showError: '',
    
    showWhichSlave: 'active', // 보여줄 직원의 종류를 선택하는 표시 (초기값: 전체 직원리스트 표시)

    showSlaveListInfo: [], // 보여줄 서버에서 받아온 직원 목록 정보 표시

    showUpdatedSlaveListInfo: { // 보여줄 가공 후 직원 목록 정보 표시
        slaveList: [], // (초기값: 직원 목록 & 직원정보)
        totalSlaveCount: '', // (초기값: 직원목록의 총 직원 수)
    },

    searchName: '', // 검색한 직원이름

    showAllSlaveInfo : [], // 전체 직원 정보 표시
    showActiveSlaveInfo: { // 근무중인 직원 정보 표시 (초기값: 근무중인 직원리스트 빈배열, 근무중인 직원리스트의 총 직원수 빈값)
        slaveList: [], 
        totalSlaveCount: ''
    },
    showInactiveSlaveInfo: { // 퇴사한 직원 정보 표시 (초기값: 퇴사한 직원리스트 빈배열, 퇴사한 직원리스트의 총 직원수 빈값)
        slaveList: [], 
        totalSlaveCount: ''
    },
    showOneSlaveInfo: {}, // 특정 직원 한 명의 정보 표시 (초기값: 특정 직원의 한 명의 정보를 넣을 빈 배열)
    modifySlaveInfo: {}, // 특정 직원 한 명의 정보 표시 (초기값: 특정 직원의 한 명의 정보를 넣을 빈 배열)
    showSearchSlaveInfo: [], // 검색한 직원의 정보 표시 (초기값: 검색한 직원리스트, 직원)
    showOneSlaveScheduleLogInfo: [],
}

const slaveSlice = createSlice({
    name: 'slave',
    initialState,
    reducers: {
        setShowError (state, action) {
            state.showError = action.payload;
        },
        setShowWhichSlave (state, action) {
            state.showWhichSlave = action.payload;
        },
        setShowSlaveListInfo (state, action) {
            state.showSlaveListInfo = action.payload;
        },
        setShowUpdatedSlaveListInfo (state, action) {
            state.showUpdatedSlaveListInfo = action.payload;
        },
        setSearchName (state, action) {
            state.searchName = action.payload;
        },
        setAllSlaveInfo (state, action) {
            state.showAllSlaveInfo = action.payload;
        },
        setShowActiveSlaveInfo (state, action) {
            state.showActiveSlaveInfo = action.payload;
        },
        setShowInactiveSlaveInfo (state, action) {
            state.showInactiveSlaveInfo = action.payload;
        },
        setShowOneSlaveInfo (state, action) {
            state.showOneSlaveInfo = action.payload;
        },
        setModifySlaveInfo (state, action) {
            state.modifySlaveInfo = action.payload;
        },
        setShowSearchSlaveInfo (state, action) {
            state.modifySlaveInfo = action.payload;
        },
        setShowOneSlaveScheduleLogInfo (state, action) {
            state.showOneSlaveScheduleLogInfo = action.payload;
        }
    }
});

export const slaveActions = slaveSlice.actions; // slaveSlice 의 reducers 에서 정의한 함수들 내보내기
export default slaveSlice.reducer; // React의 index.js에 slaveReducer 제공