import React, { useEffect, useState } from 'react'
import styles from './SlaveRegisterVariableDayModal.module.scss';
import { Button } from 'react-bootstrap';

const SlaveRegisterVariableDayModal = ({ onVariable }) => {

    const initialVariableDays = [
        { scheduleDay: 1, value: '월', select: false, startSchedule: '', endSchedule: '' },
        { scheduleDay: 2, value: '화', select: false, startSchedule: '', endSchedule: '' },
        { scheduleDay: 3, value: '수', select: false, startSchedule: '', endSchedule: '' },
        { scheduleDay: 4, value: '목', select: false, startSchedule: '', endSchedule: '' },
        { scheduleDay: 5, value: '금', select: false, startSchedule: '', endSchedule: '' },
        { scheduleDay: 6, value: '토', select: false, startSchedule: '', endSchedule: '' },
        { scheduleDay: 0, value: '일', select: false, startSchedule: '', endSchedule: '' },
    ];

    const [variableDays, setVariableDays] = useState(initialVariableDays);

    const selectDayHandler = (e) => {
        const selectDays = variableDays.map((day) =>
            day.value === e.target.value ? { ...day, select: !day.select } : { ...day }
        );
        setVariableDays(selectDays);
    };

    const startTimeHandler = (label, value) => {
        const inputStartTime = variableDays.map((day) =>
            day.scheduleDay === label ? { ...day, startSchedule: value } : { ...day }
        );
        setVariableDays(inputStartTime);
    };

    const endTimeHandler = (label, value) => {
        const inputEndTime = variableDays.map((day) =>
            day.scheduleDay === label ? { ...day, endSchedule: value } : { ...day }
        );
        setVariableDays(inputEndTime);
    };

    useEffect(() => {
        const updatedVariableDays = variableDays.filter((day) => day.select);
        console.log('최종 변동시간', updatedVariableDays);
        onVariable(updatedVariableDays);
    }, [variableDays]);

    return (
        <>
        <div className={styles['slaveRegistPageScheduleModal-title']} > 요일을 선택해주세요 </div>
  
        {variableDays.map((day) => (
        <div className={styles['slaveRegistPageScheduleModal-content']} key={day.scheduleDay} >

          <Button 
            id={day.scheduleDay} 
            className={day.select ? styles.selectedDaySchedule : styles.nonDaySchedule } 
            value={day.value}
            onClick={selectDayHandler} 
            aria-pressed={day.select}
          >
            {day.value}
          </Button>

          <label htmlFor={`${day.scheduleDay}-startTime`} className={styles['slaveRegistPageInputSchedule-label']} >
            <input 
              type="time" 
              id={`${day.scheduleDay}-startTime`} 
              value={day.startSchedule} 
              className={styles['slaveRegistPageInputSchedule-input']} 
              onChange={ e => {startTimeHandler(day.scheduleDay, e.target.value)}}
              disabled={!day.select} // 요일 선택되지 않으면 비활성화
            />
            부터
          </label>
  
          <label htmlFor={`${day.scheduleDay}-EndTime`} className={styles['slaveRegistPageInputSchedule-label']}>
            <input 
              type="time" 
              id={`${day.scheduleDay}-EndTime`} 
              value={day.endSchedule} 
              className={styles['slaveRegistPageInputSchedule-input']} 
              onChange={ e => {endTimeHandler(day.scheduleDay, e.target.value)}}
              disabled={!day.select} // 요일 선택되지 않으면 비활성화
            />
            까지
          </label>

        </div>
        ))}
      </>
    );
};

export default SlaveRegisterVariableDayModal;
