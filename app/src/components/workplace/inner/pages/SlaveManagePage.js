import React, { useEffect, useState } from 'react'
import styles from './SlaveManagePage.module.scss';
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import SlaveManagePageSlaveList from "./slave/SlaveManagePage/SlaveManagePageSlaveList";
import { useDispatch, useSelector } from 'react-redux';
import { slaveActions } from '../../../../store/slave-slice';
import { workplaceActions } from '../../../../store/workplace-slice';
import {BASE_URL} from "../../../../config/host-config";

// const initialslaveList = 
// [
//   { slaveId: 1, slaveName: '바니', slavePosition: '토끼직원', slaveCreatedAt: '', slaveFiredDate: '', workPlaceNumber: 1,
//     slaveWageList: [{slaveWageId: 1, slaveWageType: 1, slaveWageAmount: 9860, slaveWageInsurance: 0, wageUpdateDate: '', wageEndDate: ''},], 
//     slaveScheduleList: [{ScheduleId: 1, scheduleDay: 1, scheduleStart: '', scheduleEnd: '', scheduleEndDate: ''},],
//   },
// ];

const SlaveManagePage = () => {

  // redux store 에서 상태값 변경하는 action hook 불러오기
  const dispatch = useDispatch();

  // 해당 사업장의 모든 직원 목록을 불러오기 위해 로컬스토리지에 저장된 사업장 불러오기
  const workplaceIdByStore = localStorage.getItem('workplaceId');

  //-------------------------------------------------
  
  // 괴도 박성진 다녀감
  useEffect(() => {
      dispatch(workplaceActions.setCurrentPage({currentPage: 1}));
  }, []);
  // 괴도 박성진 다녀감

  //-------------------------------------------------

  // 요일의 순서
  const daysOrder = ["월요일", "화요일", "수요일", "목요일", "금요일", "토요일", "일요일"];

  useEffect(() => {

    // 서버에서 직원 목록을 가져오기
    const fetchSlaveList = async () => {

      try {
        const response = await fetch(`${BASE_URL}/detail/slaveList/${workplaceIdByStore}`)

        if (!response.ok) {
          throw new Error(`서버 오류: ${response.status} - ${response.statusText}`);
        }

        const fetchSlaveList = await response.json(); // 서버에서 받아온 정보

        if (fetchSlaveList.status === "error") {
          throw new Error(fetchSlaveList.message || '직원 정보 받아오기 실패');
        }

        const sortedSlaveList = fetchSlaveList.map(slave => {
          // 요일을 정렬한 slaveScheduleList 생성
          const sortedScheduleList = [...slave.slaveScheduleList].sort((a, b) => {
            return daysOrder.indexOf(a.scheduleDay) - daysOrder.indexOf(b.scheduleDay);
          });
        
          // 새로운 slave 객체 반환
          return {
            ...slave,
            slaveScheduleList: sortedScheduleList
          };
        });

        dispatch(slaveActions.setShowSlaveListInfo(sortedSlaveList )); // 서버에서 받아온 직원 정보
        dispatch(slaveActions.setShowUpdatedSlaveListInfo({slaveList: sortedSlaveList , totalSlaveCount: sortedSlaveList .length})); // 가공 후 직원 정보
        
      } catch (error) {
        console.error('직원 정보 받아오기 오류 발생')
      }
    };

    fetchSlaveList();

  }, [workplaceIdByStore]);

  // redux store 에서 보여줄 직원의 종류를 선택하는 상태값 불러오기 (초기값: 전체 직원 리스트)
  const showWhichSlave = useSelector((state) => state.slave.showWhichSlave);

  // redux store 에서 보여줄 서버에서 받아온 직원 목록과 총 직원 수를 보여주는 상태값 불러오기 (초기값: 전체 직원 리스트 & 총 직원 수)
  const showSlaveListInfo = useSelector((state) => state.slave.showSlaveListInfo);

  // redux store 에서 보여줄 가공 후 직원 목록과 총 직원 수를 보여주는 상태값 불러오기 (초기값: 전체 직원 리스트 & 총 직원 수)
  const showUpdatedSlaveListInfo = useSelector((state) => state.slave.showUpdatedSlaveListInfo);

  // redux store 에서 검색한 정보를 표시하는 상태값 불러오기 (초기값: 전체 직원 리스트)
  const searchName = useSelector((state) => state.slave.searchName);

  //-------------------------------------------------

  // 검색창에 입력받은 검색어 처리
  const searchHandler = e => {

    dispatch(slaveActions.setSearchName(e.target.value));
  };

  // 버튼 클릭 시 보여줄 직원 목록 종류 변경 처리
  const allSlaveListHandler = () => {

    dispatch(slaveActions.setShowWhichSlave('all'));
  };

  const activeSlaveListHandler = () => {

    dispatch(slaveActions.setShowWhichSlave('active'));
  };

  const inactiveSlaveListHandler = () => {

    dispatch(slaveActions.setShowWhichSlave('inactive'));
  };

  const searchSlaveListHandler = () => {
    // search 상태일 때 다시 search 하면 상태가 바뀌지 않으므로 임의로 상태 변경하기

    dispatch(slaveActions.setShowWhichSlave('')); // 임시로 'all'로 설정
    setTimeout(() => {
      dispatch(slaveActions.setShowWhichSlave('search')); // 다시 'search'로 설정
    }, 100); 

  };

  const searchSlaveListEnterHandler = e => {
    if (e.key === 'Enter') {
      searchSlaveListHandler();
    }
  }

  //-------------------------------------------------

  // useEffect(() => {
  //   dispatch(slaveActions.setShowWhichSlave('all'));
  // }, [dispatch]);

  useEffect(() => {
    switch (showWhichSlave) {
      case 'all':

        dispatch(slaveActions.setShowUpdatedSlaveListInfo({
          slaveList: showSlaveListInfo,
          totalSlaveCount: showSlaveListInfo.length
        }));
        break;
  
      case 'active':

        const activeSlaveList = showSlaveListInfo.filter(slave => slave.slaveFiredDate == null);
        dispatch(slaveActions.setShowUpdatedSlaveListInfo({
          slaveList: activeSlaveList,
          totalSlaveCount: activeSlaveList.length
        }));

        break;
  
      case 'inactive':

        const inactiveSlaveList = showSlaveListInfo.filter(slave => slave.slaveFiredDate !== null);
        dispatch(slaveActions.setShowUpdatedSlaveListInfo({
          slaveList: inactiveSlaveList,
          totalSlaveCount: inactiveSlaveList.length
        }));

        break;

      case 'search':

        const searchSlaveList = showSlaveListInfo.filter(slave => slave.slaveName.toLowerCase().includes(searchName.toLowerCase()));
        dispatch(slaveActions.setShowUpdatedSlaveListInfo({
          slaveList: searchSlaveList,
          totalSlaveCount: searchSlaveList.length
        }));

        break;

      default:
        break;
    }
  }, [showSlaveListInfo, showWhichSlave]);
  

  // useEffect(()=> {

  //   console.log("서버에서 가져온 직원리스트", showSlaveListInfo);
    
  // }, [showSlaveListInfo]);

  //-------------------------------------------------

  return (
    <>
      <div className={styles['content-box']}>
        <div className={styles['slaveManagementHeader-box']}>
          
          <h1 className={styles['slaveManagementHeader-title']}> 
            직원관리
          </h1>

          <Link to="/detail/slave-regist" className={styles['link-text']}> 
            <button className={styles['headerButton']} > 직원등록 </button>
          </Link>

        </div>
        
        <div className={styles['slaveManagementTitle-box']}>

          <div onClick={allSlaveListHandler} className={showWhichSlave === 'all' ? styles.slaveListSelectType : styles.slaveListType} > 
            <div>전체직원 </div>
            {/* <div className={styles.slaveListCount} > ( 총 직원수 : {showUpdatedSlaveListInfo.totalSlaveCount ? showUpdatedSlaveListInfo.totalSlaveCount : 0} 명 ) </div> */}
          </div>

          <div onClick={activeSlaveListHandler} className={showWhichSlave === 'active' ? styles.slaveListSelectType : styles.slaveListType} > 
            <div>재직직원 </div>
            {/* <div className={styles.slaveListCount} > ( 총 직원수 : {showUpdatedSlaveListInfo.totalSlaveCount ? showUpdatedSlaveListInfo.totalSlaveCount : 0} 명 ) </div> */}
          </div>

          <div onClick={inactiveSlaveListHandler} className={showWhichSlave === 'inactive' ? styles.slaveListSelectType : styles.slaveListType} > 
            <div>퇴직직원 </div>
            {/* <div className={styles.slaveListCount}> ( 총 직원수 : {showUpdatedSlaveListInfo.totalSlaveCount ? showUpdatedSlaveListInfo.totalSlaveCount : 0} 명 ) </div>  */}
          </div>

          <div className={styles['slaveManagementTitle-searchbox']}>
            <input className={styles['slaveManagementTitle-search']} value={searchName} placeholder="이름으로 검색" onChange={searchHandler} onKeyDown={searchSlaveListEnterHandler}/>
            <FontAwesomeIcon icon={faSearch} className={styles['slaveManagementList-question']} onClick={searchSlaveListHandler}/>
          </div>

        </div>

        {/* 직원 목록 틀 */}
        <SlaveManagePageSlaveList />

      </div>
    </>
  );
};

export default SlaveManagePage;
