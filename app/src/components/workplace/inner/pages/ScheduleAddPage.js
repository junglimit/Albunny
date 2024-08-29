import React, {useEffect, useState} from "react";
import styles from "./ScheduleAddPage.module.scss";
import ScheduleCalendarPage from "./ScheduleCalendarPage";
import {Form, Link, useNavigate} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {scheduleActions} from "../../../../store/schedule-slice";
import {BASE_URL} from "../../../../config/host-config";

const ScheduleAddPage = () => {

    const [selectedDate, setSelectedDate] = useState("");
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedSlave, setSelectedSlave] = useState("");
    const [startTime, setStartTime] = useState("");
    const [endTime, setEndTime] = useState("");
    const [slaves, setSlaves] = useState([]);
    const [errorMessage, setErrorMessage] = useState("");

    const workplaceId = localStorage.getItem('workplaceId');

    const dispatch = useDispatch();

    useEffect(() => {
        const fetchSlave = async () => {
            const payload = {
                workplaceId: workplaceId
            };

            console.log('payload: ', payload);

            const response = await fetch(`${BASE_URL}/detail/schedule-add?workplaceId=${workplaceId}`)
            const data = await response.json();
            console.log("data: ", data);
            setSlaves(data);
        };
        fetchSlave();
    }, []);

    const navigate = useNavigate();


    const dateClickHandler = (day) => {
        if (day !== null) {
            const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
            const formattedDate = date.toLocaleDateString('en-CA');
            setSelectedDate(formattedDate);
        }
        console.log('클릭 날짜 : ', day);
    };

    const handleSlaveChange = (e) => {
        setSelectedSlave(e.target.value);
    };

    const handleStartTimeChange = (e) => {
        setStartTime(e.target.value);
    };

    const handleEndTimeChange = (e) => {
        setEndTime(e.target.value);
    };

    const submitHandler = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        // console.log('form: ', formData.get('startTime'));

        const payload = {
            slaveId: formData.get('slaveId'),
            date: selectedDate,
            startTime: formData.get('startTime'),
            endTime: formData.get('endTime'),
        }
        console.log('payload: ', payload);

        const response = await fetch(`${BASE_URL}/detail/schedule-add`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload)
        });

        if (response.ok) {
            console.log('확인 ');
            // const data = await response.json();
            // console.log('응답 데이터: ', data);
            dispatch(scheduleActions.setAddedSchedule(payload));

            navigate("/detail/schedule-manage");
        } else {
            const errorText = await response.text();
            console.log('errorText: ', errorText);
            alert(errorText);
            // setErrorMessage(errorText);
        }

    };

    return (
        <Form method='POST' onSubmit={submitHandler}>
            <div className={styles.scheduleTitle}>
                <h1>일정관리</h1>
            </div>
            <div className={styles.schedule}>
                <ScheduleCalendarPage selectedDate={selectedDate}
                                      setSelectedDate={setSelectedDate}
                                      dateClick={dateClickHandler}/>

                <div className={styles.modifySchedule}>
                    <h2>일정 추가</h2>

                    {errorMessage && (
                        <div className={styles.errorMessage}>{errorMessage}</div>
                    )}

                    <div className={styles.formGroup}>
                        <label htmlFor="slaveSelect">직원 선택:</label>
                        <div className={styles.selectWrapper}>
                            <select id="slaveSelect" name="slaveId"
                                    value={selectedSlave}
                                    onChange={handleSlaveChange}
                                    required
                            >
                                <option value="">직원을 선택하세요</option>
                                {slaves.map(slave => (
                                    <option key={slave.slaveId} value={slave.slaveId}>
                                        {slave.slaveName} ({slave.slavePosition})
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className={styles.formGroup}>
                        <label htmlFor="daySelect">추가 날짜:</label>
                        <div id="daySelect" name="day" className={styles.date}>
                            {selectedDate ? selectedDate : "날짜를 선택하세요"}
                        </div>
                    </div>

                    <div className={styles.formGroup}>
                        <label htmlFor="startTime">시작 시간:</label>
                        <div className={styles.timeInputWrapper}>
                            <input type="time" id="startTime" name="startTime"
                                   value={startTime}
                                   onChange={handleStartTimeChange}
                                   required
                            />
                        </div>
                    </div>

                    <div className={styles.formGroup}>
                        <label htmlFor="endTime">종료 시간:</label>
                        <div className={styles.timeInputWrapper}>
                            <input type="time" id="endTime" name="endTime"
                                   value={endTime}
                                   onChange={handleEndTimeChange}
                                   required
                            />
                        </div>
                    </div>

                    <div className={styles.button}>
                        <Link to="/detail/schedule-manage">
                            <button className={styles.cancelButton}>취소</button>
                        </Link>
                        <button className={styles.addButton}>추가</button>
                    </div>

                </div>
            </div>
        </Form>
    );
};

export default ScheduleAddPage;
