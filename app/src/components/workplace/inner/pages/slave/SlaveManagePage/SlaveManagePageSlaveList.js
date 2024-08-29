import React from "react";
import styles from './SlaveManagePageSlaveList.module.scss';
import SlaveManagePageSlaveStatusList from './SlaveManagePageSlaveStatusList';
import { useSelector } from "react-redux";

const SlaveManagePageSlaveList = () => {

  // redux store 에서 보여줄 가공 후 직원 목록과 총 직원 수를 보여주는 상태값 불러오기 (초기값: 전체 직원 리스트 & 총 직원 수)
  const showUpdatedSlaveListInfo = useSelector((state) => state.slave.showUpdatedSlaveListInfo);
  return (
    <>
      <div className={styles['slaveManagementList-title']}>
        <div className={styles['slaveManagementList-titleCount']}>
          <span> 총 직원 수 </span>
          <span style={{ fontSize: '15px' }}> ( {showUpdatedSlaveListInfo.totalSlaveCount} 명 ) </span>
        </div>
        <div className={styles['slaveManagementList-titleName']}> 이름 & 직책 </div>
        <div className={styles['slaveManagementList-titleWage']}> 
          <span>급여정보 </span>
          <span style={{ fontSize: '15px' }}> ( 급여타입 / 금액 / 4대보험적용여부 ) </span>
        </div>
        <div className={styles['slaveManagementList-titleSchedule']}>
          <span>근무정보 </span>
          <span style={{ fontSize: '15px' }}> ( 요일 / 시작시간 / 종료시간 ) </span>
        </div>
        <div className={styles['slaveManagementList-titleJoin']}> 입사일자 </div>
      </div>

      <div className={styles['slaveManagementList-content']}>
        <div className={styles['slaveManagementList-box']}>

          <SlaveManagePageSlaveStatusList />
          
        </div>
      </div>
    </>
  )
}

export default SlaveManagePageSlaveList