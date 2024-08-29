import React, {useEffect, useState} from "react";
import styles from "./ScheduleCalendarPage.module.scss";
import { MdKeyboardArrowLeft, MdKeyboardArrowRight } from "react-icons/md";

const ScheduleCalendarPage = ({selectedDate, setSelectedDate, dateClick}) => {

    const [currentDate, setCurrentDate] = useState(new Date());
    const [days, setDays] = useState([]);

    // 페이지 로드 시 오늘 날짜 렌더링
    useEffect(() => {
        const today = new Date();
        const todayFormatted = today.toISOString().split('T')[0];
        setSelectedDate(todayFormatted); // 기본값으로 오늘 날짜 설정
    }, []);

    useEffect(() => {
        createCalendar(currentDate);
    }, [currentDate]);

    const createCalendar = (date) => {
        const year = date.getFullYear();
        const month = date.getMonth();

        const firstDayOfMonth = new Date(year, month, 1).getDay();
        const lastDayOfMonth = new Date(year, month + 1, 0).getDate();

        const daysArray = [];
        for (let i = 0; i < firstDayOfMonth; i++) {
            daysArray.push(null);
        }
        for (let date = 1; date <= lastDayOfMonth; date++) {
            daysArray.push(date);
        }
        setDays(daysArray);
    };

    const handlePrevMonth = (e) => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
    };

    const handleNextMonth = (e) => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
    };

    const dateClickHandler = (day) => {
        if (day !== null) {
            const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
            const formattedDate = date.toLocaleDateString('en-CA');
            setSelectedDate(formattedDate);
        }
        console.log('클릭 날짜 : ', day);
    };

    const monthName = currentDate.toLocaleString('default', {month: 'long'});
    const year = currentDate.getFullYear();

    return (
        <>
            <div className={styles.calendar}>
                <div className={styles.calendarHeader}>
                    <button onClick={handlePrevMonth} className={styles.arrowButton}>
                        <MdKeyboardArrowLeft />
                    </button>
                    <h2>{monthName} {year}</h2>
                    <button onClick={handleNextMonth} className={styles.arrowButton}>
                        <MdKeyboardArrowRight />
                    </button>
                </div>
                <div className={styles.calendarBody}>
                    {['일', '월', '화', '수', '목', '금', '토'].map(day => (
                        <div key={day} className={styles.dayOfWeek}>{day}</div>
                    ))}
                    {days.map((day, index) => (
                        <div
                            key={index}
                            className={`${styles.day} ${day === new Date(selectedDate).getDate() ? styles.daySelected : ''}`}
                            onClick={() => dateClickHandler(day)}>
                            {day}
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
};

export default ScheduleCalendarPage;
