import React, { useCallback, useEffect, useState } from 'react'
import styles from './SlaveRegisterScheduleList.module.scss';
import SlaveRegisterFixedDayModal from './SlaveRegisterFixedDayModal';
import SlaveRegisterVariableDayModal from './SlaveRegisterVariableDayModal';

const SlaveRegisterScheduleList = ({ onSchedules }) => {
  
  // 근무정보리스트 기본 배열 설정하기
  // 근무타입(ScheduleType): true, 1 --> 고정시간 / false, 0 --> 변동시간
  // 근무요일(ScheduleDay): 1--> 월 / 2--> 화 / 3--> 수 / 4--> 목 / 5--> 금 / 6--> 토 / 0--> 일
                                // 근무타입,               근무리스트     
  const initialScheduleList = [{ slaveScheduleType: null, slaveScheduleList: [] }];

  // 근무리스트 상태값으로 관리하기
  const [scheduleList, setScheduleList] = useState(initialScheduleList);

    // 근무방식선택에 따른 버튼 스타일 변경
    const getScheduleTypeClassName = (type) => {

        if (type === '') {
            return styles.nonScheduleType;
        } else if (type === 'fixed') {
            return scheduleList[0].slaveScheduleType === true ? styles.scheduleType : styles.nonScheduleType;

        } else if (type === 'variable') {
            return scheduleList[0].slaveScheduleType === false ? styles.scheduleType : styles.nonScheduleType;
        }
    };

    // 고정시간 버튼 클릭이벤트 
    const fixedDayHandler = e => {

        // 이미 고정시간(true)이 클릭된 상태인 경우 재클릭이기 때문에 선택 초기화 (근무타입)
        if (scheduleList[0].slaveScheduleType === true) {
            setScheduleList(initialScheduleList);
            
            // 아무것도 클릭을 안했었거나, 변동시간(false)이 클릭됐었던 경우 근무타입 고정시간(true) 으로 변경
        } else {
            setScheduleList([{...scheduleList[0], slaveScheduleType: true }]);
        }
    };

    //-------------------------------------------------

    // 변동시간 버튼 클릭이벤트
    const variableDayHandler = e => {

        // 이미 변동시간(false)이 클릭된 상태인 경우 재클릭이기 때문에 선택 초기화 (근무타입)
        if (scheduleList[0].slaveScheduleType === false) {
            setScheduleList(initialScheduleList);

            // 아무것도 클릭을 안했었거나, 고정시간(true)이 클릭됐었던 경우 근무타입 변동시간(false) 으로 변경
        } else {
            setScheduleList([{...scheduleList[0], slaveScheduleType: false }]);
        }
    };

    //-------------------------------------------------

    // 고정시간 모달창으로 함수 내려보내 고정시간 정보 받아오기 & 상태관리하기
    const onFixedDay = useCallback((fixedDay) => {
        setScheduleList(prev => ([{...prev[0], slaveScheduleList: fixedDay}]));
    }, [scheduleList]);


    // 변동시간 모달창으로 함수 내려보내 변동시간 정보 받아오기 & 상태관리하기
    const onVariableDay = useCallback((variableDay) => { 
        setScheduleList(prev => ([{...prev[0], slaveScheduleList: variableDay}]));
    }, [scheduleList]);

    //-------------------------------------------------

    // 직원등록에서 내려온 함수에 근무리스트 담아서 올려보내기
    useEffect(() => {
    const activeStyle = {
        backgroundColor: '#ff8803',
        color: '#fff',
        border: '0',
        // boxShadow: 'inset 2px 2px 2px 0px rgba(255,255,255,.5), 7px 7px 20px 0px rgba(0,0,0,.1), 4px 4px 5px 0px rgba(0,0,0,.1)',
        width: '10.8rem',
        height: '2.5rem',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        fontWeight: '600',
    };

    const inactiveStyle = {
        backgroundColor: '#ccc',
        color: '#fff',
        border: '0',
        // boxShadow: 'inset 2px 2px 2px 0px rgba(255,255,255,.5), 7px 7px 20px 0px rgba(0,0,0,.1), 4px 4px 5px 0px rgba(0,0,0,.1)',
        width: '10.8rem',
        height: '2.5rem',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        fontWeight: '600',
    };

      onSchedules(scheduleList);

    }, [scheduleList]);

    //-------------------------------------------------

  return (
    <>
        <div className={styles['slaveRegistPageSchedule-box']} >
            <div className={styles['slaveRegistPageInput-title']} > 근무시간선택 </div>

            <div className={styles['slaveRegistPageSchedule-notice']} >
                <div>* 고정시간 - 일하는 요일만 다르고 시간은 고정일 때 선택</div>
                <div>* 변동시간 - 일하는 요일, 시간 모두 다를 때 선택 </div>
            </div>

            <div className={styles['slaveRegistPageInputScheduleTitle-box']} >

                <label htmlFor="fixed" className={getScheduleTypeClassName('fixed')} >
                    고정시간
                    <input id="fixed" onClick={fixedDayHandler} type="checkbox" style={{ display: 'none' }} />
                </label>

                <label htmlFor="variable" className={getScheduleTypeClassName('variable')} >
                    변동시간
                    <input id="variable" onClick={variableDayHandler} type="checkbox" style={{ display: 'none' }} />
                </label>

            </div>


            <div className={styles['slaveRegistPageInputScheduleContent-box']} >
                {scheduleList[0].slaveScheduleType === true && <SlaveRegisterFixedDayModal onFixed={onFixedDay} />}
                {scheduleList[0].slaveScheduleType === false && <SlaveRegisterVariableDayModal onVariable={onVariableDay} />}
            </div>
        </div>
    </>
  )
}

export default SlaveRegisterScheduleList
