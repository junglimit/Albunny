import React, {useEffect, useState} from "react";
import styles from "./ScheduleManagePage.module.scss";
import {Link, useNavigate} from "react-router-dom";
import ScheduleCalendarPage from "./ScheduleCalendarPage";
import {useDispatch, useSelector} from "react-redux";
import {AiOutlineMinusCircle} from "react-icons/ai";
import { workplaceActions } from "../../../../store/workplace-slice";
import {BASE_URL} from "../../../../config/host-config";


const ScheduleManagePage = () => {

    const addedSchedule = useSelector(state => state.schedule.addedSchedule);

    const [scheduleData, setScheduleData] = useState([]);
    const [extraScheduleData, setExtraScheduleData] = useState([]);
    const [selectedDate, setSelectedDate] = useState(null);
    const [fetching, setFetching] = useState(false);
    const workplaceId = localStorage.getItem('workplaceId');

    const navigate = useNavigate();

        // 괴도 박성진 다녀감
        const dispatch = useDispatch();
        useEffect(() => {
            dispatch(workplaceActions.setCurrentPage({currentPage: 3}));
        }, [])
        // 괴도 박성진 다녀감

    useEffect(() => {
        const fetchSchedule = async () => {
            if (!selectedDate) return;
            setFetching(true);

            const date = selectedDate;
            const dayOfWeek = new Date(date).getDay();

            const payload = {
                workplaceId: workplaceId,
                date: selectedDate,
                dayOfWeek: dayOfWeek
            };

            console.log('payload: ', payload);

            try {
                const response = await fetch(
                    `${BASE_URL}/detail/schedule-manage?workplaceId=${workplaceId}&date=${date}&dayOfWeek=${dayOfWeek}`);
                if (!response.ok) {
                    throw new Error('네트워크 응답이 올바르지 않습니다.');
                }
                const data1 = await response.json();
                console.log("data1: ", data1);
                setScheduleData(data1);
            } catch (error) {
                console.error('Error: ', error);
            }
        };
        fetchSchedule();
    }, [selectedDate]);

    useEffect(() => {
        const fetchExtraSchedule = async () => {
            if (!selectedDate) return;
            setFetching(true);

            try {
                console.log("extraSchedule getmapping 보내기 확인");
                const response = await fetch(
                    `${BASE_URL}/detail/extraschedule-manage?workplaceId=${workplaceId}&date=${selectedDate}`);
                if (!response.ok) {
                    throw new Error('네트워크 응답이 올바르지 않습니다.');
                }
                const data2 = await response.json();
                console.log("추가근무 확인: ", data2);
                setExtraScheduleData(data2);
            } catch (error) {
                console.error('Error: ', error);
            }
        };
        fetchExtraSchedule();
    }, [addedSchedule, selectedDate]);


    // 시간 포맷팅 함수
    const formatTime = (time) => {
        if (!time) return '';
        const [hours, minutes] = time.split(':');
        return `${hours}:${minutes}`;
    };

    const handleDeleteExtraSchedule = async (id) => {
        const confirmed = window.confirm("정말 삭제하시겠습니까?");
        console.log('삭제버튼 클릭, id: ', id);
        if (confirmed) {
            try {
                const response = await fetch(`${BASE_URL}/detail/extraSchedule-manage?id=${id}`, {
                    method: 'DELETE',
                });

                if (!response.ok) {
                    throw new Error('삭제 요청에 실패했습니다.');
                }
                setExtraScheduleData(prevData => prevData.filter(item => item.id !== id))
            } catch (error) {
                console.error('삭제 중 오류 발생: ', error);
            }
        }
    };

    return (
        <>
            <div className={styles.scheduleTitle}>
                <h1>일정관리</h1>
                <Link to="/detail/schedule-add">
                    <button className={styles.addSchedulebutton}>일정 추가</button>
                </Link>
            </div>
            <div className={styles.schedule}>
                <ScheduleCalendarPage selectedDate={selectedDate}
                                      setSelectedDate={setSelectedDate}/>

                <div className={styles.scheduleList}>

                    <div className={styles.todaySchedule}>
                        <h4>오늘 근무자</h4>
                        <span className={styles.count}>({selectedDate}) 총 {scheduleData.length}명</span>
                        {scheduleData.length === 0 ?

                            <div style={{textAlign: 'center', margin: '20px 0'}}>
                                <br/><br/>오늘 근무자가 없습니다.
                            </div>

                            : <div className={styles.scheduleList}>
                                {scheduleData.map(schedule => (
                                    <div key={schedule.slaveId} className={styles.scheduleItem}>
                                        <div className={styles.scheduleItemName}>
                                            {schedule.slaveName} ({schedule.slavePosition})
                                        </div>
                                        <div className={styles.scheduleItemTime}>
                                            {formatTime(schedule.scheduleStart)} ~ {formatTime(schedule.scheduleEnd)}
                                        </div>
                                    </div>
                                ))}
                            </div>}
                    </div>

                    <div className={styles.extraSchedule}>
                        <h4>추가 근무자</h4>
                        <span className={styles.count}>({selectedDate}) 총 {extraScheduleData.length}명</span>

                        {extraScheduleData.length === 0 ?
                            <div style={{textAlign: 'center', margin: '20px 0'}}>
                                <br/><br/>오늘 추가 근무자가 없습니다.
                            </div>

                            : <div className={styles.scheduleList}>
                                {extraScheduleData.map((extraSchedule, index) => (
                                    <div key={extraSchedule.id || index} className={styles.extraScheduleItem}>
                                        <div
                                            className={styles.extraScheduleItemButton}
                                            onClick={() => handleDeleteExtraSchedule(extraSchedule.id)}
                                        >
                                            <AiOutlineMinusCircle/>
                                        </div>

                                        <div className={styles.scheduleItemName}>
                                            {extraSchedule.slaveName} ({extraSchedule.slavePosition})
                                        </div>
                                        <div className={styles.scheduleItemTime}>
                                            {formatTime(extraSchedule.startTime)} ~ {formatTime(extraSchedule.endTime)}
                                        </div>
                                    </div>
                                ))}
                            </div>}
                        {/*</div>*/}
                    </div>
                </div>
            </div>
        </>
    );
};

export default ScheduleManagePage;
