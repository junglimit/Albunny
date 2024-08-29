import React, { useEffect, useState } from 'react'
import styles from './SlaveModifyFixedDayModal.module.scss';
import { Button } from 'react-bootstrap';

const SlaveModifyFixedDayModal = ({ onFixed, oneSlave }) => {

  // 근무시간선택 --> 고정시간을 선택한 경우 요일 & 시간을 배열(객체{label, 요일선택여부, 시작시간, 종료시간})로 담기
  // 근무요일 (월=1, 화=2, 수=3, 목=4, 금=5, 토=6, 일=7)
  const initialFixedDays = 
                          [
                            { slaveScheduleId: '', scheduleDay: 1, value: '월', select: false, startSchedule: '', endSchedule: '' },
                            { slaveScheduleId: '', scheduleDay: 2, value: '화', select: false, startSchedule: '', endSchedule: '' },
                            { slaveScheduleId: '', scheduleDay: 3, value: '수', select: false, startSchedule: '', endSchedule: '' },
                            { slaveScheduleId: '', scheduleDay: 4, value: '목', select: false, startSchedule: '', endSchedule: '' },
                            { slaveScheduleId: '', scheduleDay: 5, value: '금', select: false, startSchedule: '', endSchedule: '' },
                            { slaveScheduleId: '', scheduleDay: 6, value: '토', select: false, startSchedule: '', endSchedule: '' },
                            { slaveScheduleId: '', scheduleDay: 0, value: '일', select: false, startSchedule: '', endSchedule: '' },
                          ];

  // 고정시간 요일 배열 상태값으로 관리
  const [fixedDays , setFixedDays] = useState(initialFixedDays);

  // 초기 시작시간, 종료시간 상태값으로 관리
  const [inputStartSchedule, setInputStartSchedule] = useState('');
  const [inputEndSchedule, setInputEndSchedule] = useState('');

  function convertToTimeFormat(timeString) {
    // 예시로 주어진 timeString: '20시 21분'
    const timeParts = timeString.match(/(\d{1,2})시\s*(\d{1,2})분/);
    if (timeParts) {
        let hours = timeParts[1];
        let minutes = timeParts[2];

        // 시간을 두 자리로 맞추기 위해 0을 채운다.
        if (hours.length === 1) hours = '0' + hours;
        if (minutes.length === 1) minutes = '0' + minutes;

        return `${hours}:${minutes}`;
    }
    return '';
  }

  useEffect(() => {

    // 로컬스토리지에서 받아온 선택한 직원의 정보에서 급여리스트 정보만 추출하기
    const modifyScheduleList = oneSlave().scheduleList;

    // scheduleType이 true인 경우에만 아래 코드를 실행
    if (modifyScheduleList[0].scheduleType === true) {

        console.log(modifyScheduleList[0].scheduleType === true);

        const updatedFixedDays = fixedDays.map(day => {
          const schedule = modifyScheduleList.find(schedule => schedule.scheduleDay[0] === day.value);
          if (schedule) {
            return {
              ...day,
              slaveScheduleId: schedule.scheduleId,
              select: true,
              startSchedule: convertToTimeFormat(schedule.scheduleStart),
              endSchedule: convertToTimeFormat(schedule.scheduleEnd)
            };
          }
          return day;
        });
        setFixedDays(updatedFixedDays);

        const selectedDay = updatedFixedDays.find(day => day.select);
        if (selectedDay) {
          setInputStartSchedule(selectedDay.startSchedule || '');
          setInputEndSchedule(selectedDay.endSchedule || '');
        }
    }

  }, []);

  // 요일을 선택여부에 따라 select 값 변경하기
  const selectDayHandler = e => {

    setFixedDays((prev) => prev.map((prevDay) => prevDay.value === e.target.value ? {...prevDay, select: !prevDay.select} : {...prevDay}));
  };

  //-------------------------------------------------

  // 시작시간을 입력하면 startSchedule 값 변경하기
  const startTimeHandler = e => {

    const startTime = e.target.value;
    setFixedDays((prev) => prev.map((day) => ({ ...day, startSchedule: startTime })));
  };

  // 종료시간을 입력하면 endSchedule 값 변경하기
  const endTimeHandler = e => {

    const endTime = e.target.value;
    setFixedDays((prev) => prev.map((day) => ({ ...day, endSchedule: endTime })));
  };

  // 배열에서 요일을 선택한 객체만 필터링하기
  useEffect(() => {

    const updatedFixedDays = fixedDays.filter(day => day.select);
    console.log('최종 고정시간', updatedFixedDays);

    // SlaveRegistPage 에서 내려보낸 onFixed 에 updatedFixedDays 전달하기
    onFixed(updatedFixedDays);

  }, [fixedDays]);

  //-------------------------------------------------

  // 선택된 요일 중 첫 번째 요일의 startSchedule을 value로 설정
  const selectedDay = fixedDays.find(day => day.select);
  //-------------------------------------------------

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
            type="time" 
            className={styles['slaveRegistPageInputSchedule-input']} 
            onChange={startTimeHandler}
            value={selectedDay ? selectedDay.startSchedule : ''}  
          />
          부터
        </label>
        
        <label className={styles['slaveRegistPageInputSchedule-label']}>
          <input 
            type="time" 
            className={styles['slaveRegistPageInputSchedule-input']} 
            onChange={endTimeHandler}
            value={selectedDay ? selectedDay.endSchedule : ''}
          />
          까지
        </label>
      </div>
    </>
  )
}

export default SlaveModifyFixedDayModal