import React, { useEffect, useState } from 'react'
import styles from './SlaveRegisterFixedDayModal.module.scss';
import { Button } from 'react-bootstrap';

const SlaveRegisterFixedDayModal = ({ onFixed }) => {
    const initialFixedDays = [
        { scheduleDay: 1, value: '월', select: false, startSchedule: '', endSchedule: '' },
        { scheduleDay: 2, value: '화', select: false, startSchedule: '', endSchedule: '' },
        { scheduleDay: 3, value: '수', select: false, startSchedule: '', endSchedule: '' },
        { scheduleDay: 4, value: '목', select: false, startSchedule: '', endSchedule: '' },
        { scheduleDay: 5, value: '금', select: false, startSchedule: '', endSchedule: '' },
        { scheduleDay: 6, value: '토', select: false, startSchedule: '', endSchedule: '' },
        { scheduleDay: 0, value: '일', select: false, startSchedule: '', endSchedule: '' },
    ];

    const [fixedDays, setFixedDays] = useState(initialFixedDays);

    const selectDayHandler = (e) => {
        setFixedDays((prev) =>
            prev.map((prevDay) =>
                prevDay.value === e.target.value ? { ...prevDay, select: !prevDay.select } : { ...prevDay }
            )
        );
    };

    const startTimeHandler = (e) => {
        const startTime = e.target.value;
        setFixedDays((prev) => prev.map((day) => ({ ...day, startSchedule: startTime })));
    };

    const endTimeHandler = (e) => {
        const endTime = e.target.value;
        setFixedDays((prev) => prev.map((day) => ({ ...day, endSchedule: endTime })));
    };

    useEffect(() => {
        const updatedFixedDays = fixedDays.filter((day) => day.select);
        console.log('최종 고정시간', updatedFixedDays);
        onFixed(updatedFixedDays);
    }, [fixedDays]);

    return (
        <>
            <div className={styles['slaveRegistPageScheduleModal-title']} > 요일을 선택해주세요 </div>
      
            <div className={styles['slaveRegistPageScheduleModal-content']} >
                {fixedDays.map((day) => (
                  <Button 
                    key={day.scheduleDay} 
                    id={day.scheduleDay} 
                    className={day.select ? styles.selectedDaySchedule : styles.nonDaySchedule }
                    value={day.value}
                    onClick={selectDayHandler} 
                    aria-pressed={day.select}
                  >
                    {day.value}
                  </Button>

                ))}
            </div>
  
            <div className={styles['slaveRegistPageScheduleModal-title']} > 시간선택 </div>
                
            <div className={styles['slaveRegistPageScheduleModalInput-box']} >
                <label className={styles['slaveRegistPageInputSchedule-label']} >
                    <input
                      value={fixedDays.startSchedule}
                      type="time" 
                      className={styles['slaveRegistPageInputSchedule-input']} 
                      onChange={startTimeHandler}
                    />
                    부터
                </label>
                
                <label className={styles['slaveRegistPageInputSchedule-label']}>
                    <input 
                      value={fixedDays. endSchedule}
                      type="time" 
                      className={styles['slaveRegistPageInputSchedule-input']} 
                      onChange={endTimeHandler}
                    />
                    까지
                </label>
            </div>
      </>
    );
};

export default SlaveRegisterFixedDayModal;
