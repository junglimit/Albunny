import React, { useState, useEffect, useRef } from "react";
import styles from "./InnerMainPage.module.scss";
import axios from "axios";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useDispatch } from "react-redux";
import { workplaceActions } from "../../../../store/workplace-slice";
import {BASE_URL} from "../../../../config/host-config";

const InnerMainPage = () => {
    const [workplaceInfo, setWorkplaceInfo] = useState(null);
    const [loading, setLoading] = useState(true);
    const [currentMonth, setCurrentMonth] = useState(new Date().getMonth() + 1);
    const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
    const [selectedDate, setSelectedDate] = useState(new Date()); // 오늘 날짜로 초기화
    const [workingEmployees, setWorkingEmployees] = useState([]);
    const [notStartedEmployees, setNotStartedEmployees] = useState([]);
    const [offDutyEmployees, setOffDutyEmployees] = useState([]);
    const [miscEmployees, setMiscEmployees] = useState([]); // 기타 직원
    const [estimatedWages, setEstimatedWages] = useState(0); // 총 급여
    const [employeeWages, setEmployeeWages] = useState([]); // 직원별 급여
    const workplaceIdByStore = localStorage.getItem('workplaceId');

        // 괴도 박성진 다녀감
        const dispatch = useDispatch();
        useEffect(() => {
            dispatch(workplaceActions.setCurrentPage({currentPage: 0}));
        }, [])
        // 괴도 박성진 다녀감

    // 날짜 포맷 함수

    const formatDate = (date) => {
        const options = { year: 'numeric', month: 'numeric', day: 'numeric', weekday: 'long' };
        return date.toLocaleDateString('ko-KR', options);
    };

    const datePickerRef = useRef(null);

    useEffect(() => {
        const fetchWorkplaceInfo = async () => {
            try {
                const response = await axios.get(`${BASE_URL}/workplace/${workplaceIdByStore}`);
                const workplace = response.data;
                if (workplace) {
                    setWorkplaceInfo(workplace);
                } else {
                    console.error('업장 아이디를 찾지 못함.');
                    alert('업장 정보를 가져오는데 실패했습니다.');
                }
            } catch (error) {
                console.error('사업장 정보 페치 오류:', error);
                alert('업장 정보를 가져오는데 실패했습니다.');
            } finally {
                setLoading(false);
            }
        };

        const fetchEmployees = async () => {
            try {
                const formattedDate = selectedDate.toISOString().split('T')[0]; // yyyy-mm-dd 형식으로 변환
                // const response = await axios.get(`http://localhost:8877/schedule/employees?workplaceId=${workplaceIdByStore}&date=${formattedDate}`);
                const res = await fetch(`${BASE_URL}/detail/schedule-log-list?workplaceId=${workplaceIdByStore}&date=${formattedDate}`);
                // const employees = response.data;
                const employees = await res.json();
                // const currentTime = new Date(); // 현재 시간
                // const currentDate = new Date().setHours(0, 0, 0, 0); // 오늘 날짜 자정 기준
                // const selectedDateStartOfDay = new Date(selectedDate).setHours(0, 0, 0, 0); // 선택된 날짜 자정 기준
                // const selectedDateEndOfDay = new Date(selectedDate).setHours(23, 59, 59, 999); // 선택된 날짜의 마지막 시간

                
                const beforeWorking = [];
                const working = [];
                const endWorking = [];
                const misc = [];

                for (const employee of employees) {
                    if(employee.dailyAtt === "출근예정") {
                        beforeWorking.push(employee);
                    } else if(employee.dailyAtt === "근무중") {
                        working.push(employee);
                    } else if(employee.dailyAtt === "지각" || employee.dailyAtt === "조퇴" || employee.dailyAtt === "정상근무") {
                        endWorking.push(employee);
                    } else if(employee.dailyAtt === "결근") {
                        misc.push(employee);
                    }
                    // 현재 선택된 날짜에 해당하는 스케줄 로그를 가져옵니다.
                    // const logResponse = await axios.get(`http://localhost:8877/schedule/current-log?slaveId=${employee.id}&date=${formattedDate}`);
                    // const log = logResponse.data;

                    // const startTime = new Date(`${formattedDate}T${employee.scheduleStart}`);
                    // const endTime = new Date(`${formattedDate}T${employee.scheduleEnd}`);

                    // 스케줄 로그의 시작과 끝이 선택된 날짜에 해당하는지 확인
                    // const logStartDate = log ? new Date(log.scheduleLogStart) : null;
                    // const logEndDate = log && log.scheduleLogEnd ? new Date(log.scheduleLogEnd) : null;

                    // if (selectedDateStartOfDay < currentDate) { // 선택된 날짜가 과거일 경우
                    //     if (logStartDate && logEndDate && logEndDate <= selectedDateEndOfDay) {
                    //         endWorking.push(employee); // 과거에 퇴근한 경우
                    //     } else if (logStartDate && !logEndDate && logStartDate <= selectedDateEndOfDay) {
                    //         misc.push({ ...employee, status: '조퇴' }); // 과거에 조퇴한 경우
                    //     } else if (!logStartDate || logStartDate > selectedDateEndOfDay) {
                    //         misc.push({ ...employee, status: '결근' }); // 과거에 결근한 경우
                    //     }
                    // } else if (selectedDateStartOfDay > currentDate) { // 선택된 날짜가 미래일 경우
                    //     beforeWorking.push(employee); // 출근 전 (미래에는 로그가 없으므로)
                    // } else { // 선택된 날짜가 오늘인 경우
                    //     if (logStartDate && !logEndDate) {
                    //         working.push(employee); // 근무 중
                    //     } else if (!logStartDate && currentTime < startTime) {
                    //         beforeWorking.push(employee); // 출근 전
                    //     } else if (logEndDate && logEndDate < endTime) {
                    //         misc.push({ ...employee, status: '조퇴' }); // 조퇴
                    //     } else if (logEndDate) {
                    //         endWorking.push(employee); // 퇴근
                    //     } else if (!logStartDate) {
                    //         misc.push({ ...employee, status: '결근' }); // 결근
                    //     }
                    // }
                }

                setWorkingEmployees(working);
                setNotStartedEmployees(beforeWorking);
                setOffDutyEmployees(endWorking);
                setMiscEmployees(misc);
            } catch (error) {
                console.error('직원 정보 페치 오류:', error);
                alert('직원 정보를 가져오는데 실패했습니다.');
            }
        };





        const fetchWageData = async () => {
            const payload = {
                workplaceId: workplaceIdByStore,
                ym: `${currentYear}-${currentMonth < 10 ? "0" + currentMonth : currentMonth}`,
            };
            try {
                const res = await fetch(`${BASE_URL}/wage/workplace`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(payload),
                });

                if (!res.ok) {
                    throw new Error("Network response was not ok");
                }

                const json = await res.json();
                setEstimatedWages(json.salaryAmount);
                setEmployeeWages(json.logList);
            } catch (error) {
                console.error("Error fetching wage data:", error);
            }
        };

        if (workplaceIdByStore) {
            fetchWorkplaceInfo();
            fetchEmployees();
            fetchWageData();
        }
    }, [workplaceIdByStore, selectedDate, currentMonth, currentYear]);

    if (!workplaceInfo) {
        return <div>사업장 정보를 가져오는데 실패했습니다.</div>;
    }

    const handleNextMonth = () => {
        if (currentMonth === 12) {
            setCurrentMonth(1);
            setCurrentYear((prevYear) => prevYear + 1);
        } else {
            setCurrentMonth((prevMonth) => prevMonth + 1);
        }
    };

    const handlePrevMonth = () => {
        if (currentMonth === 1) {
            setCurrentMonth(12);
            setCurrentYear((prevYear) => prevYear - 1);
        } else {
            setCurrentMonth((prevMonth) => prevMonth - 1);
        }
    };

    const handleDateChange = (date) => {
        setSelectedDate(date);
    };

    const formattedMonth = `${currentYear}년 ${currentMonth}월`;

    return (
        <div className={styles.innerMainContainer}>
            <div className={styles.leftPanel}>
                <div className={styles.workplaceInfo}>
                    <div className={styles.monthNavigation}>
                        <img src={`${process.env.PUBLIC_URL}/images/left-arrow.png`}
                             alt={"좌측화살표"}
                             className={styles.arrowButton}
                             onClick={handlePrevMonth}></img>
                        <span className={styles.monthText}>{formattedMonth}</span>
                        <img src={`${process.env.PUBLIC_URL}/images/right-arrow.png`}
                             className={styles.arrowButton}
                             onClick={handleNextMonth}></img>
                    </div>
                    <div className={styles.monthDetails}>
                        <p className={styles.estimatedWages}>예상 급여 : {estimatedWages.toLocaleString()} 원</p>
                        <p className={styles.totalEmployees}>총 직원 수 : {workplaceInfo.workplaceTotalSlaveSize}명</p>
                    </div>
                </div>

                <div className={styles.employeeSection}>
                    <p className={styles.employeeTitle}>직원별 월 급여</p>
                    <div className={styles.employeeWages}>
                        {employeeWages.map((employee) => (
                            <div key={employee.slaveId} className={styles.employeeWage}>
                                {employee.slaveName} ({employee.slavePosition}) : {employee.totalAmount.toLocaleString()} 원
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className={styles.rightPanel}>
                <div className={styles.scheduleSection}>
                    <div className={styles.datePickerContainer}>
                        <img
                            src={`${process.env.PUBLIC_URL}/images/calendar-icon.png`}
                            alt="달력 아이콘"
                            className={styles.calendarIcon}
                            onClick={() => datePickerRef.current.setOpen(true)} // 달력 아이콘 클릭 시 DatePicker 열기
                        />
                        <DatePicker
                            ref={datePickerRef}
                            selected={selectedDate}
                            onChange={handleDateChange}
                            dateFormat="yyyy년 MM월 dd일"
                            customInput={<h2 className={styles.dateText}>{formatDate(selectedDate)}</h2>}
                        />
                    </div>
                    <div className={styles.scheduleTable}>
                        <div className={styles.scheduleColumn}>
                            <p className={styles.columnTitle}>출근전 ({notStartedEmployees.length})</p>
                            {notStartedEmployees.map((employee, index) => (
                                <p key={notStartedEmployees.length - index} className={styles.scheduleEntry}>
                                    {employee.slaveName} ({employee.slavePosition})<br/> {employee.scheduleStart} ~ {employee.scheduleEnd}
                                </p>
                            ))}
                        </div>
                        <div className={styles.scheduleColumn}>
                            <p className={styles.columnTitle}>근무중 ({workingEmployees.length})</p>
                            {workingEmployees.map((employee, index) => (
                                <p key={workingEmployees.length - index} className={styles.scheduleEntry}>
                                    {employee.slaveName} ({employee.slavePosition})<br/> {employee.scheduleLogStart} 출근
                                </p>
                            ))}
                        </div>
                        <div className={styles.scheduleColumn}>
                            <p className={styles.columnTitle}>퇴근 ({offDutyEmployees.length})</p>
                            {offDutyEmployees.map((employee, index) => (
                                <p key={offDutyEmployees.length - index} className={styles.scheduleEntry}>
                                    {employee.slaveName} ({employee.slavePosition}) <span style={{ color: 'red' }}>{employee.dailyAtt}</span>
                                </p>
                            ))}
                        </div>
                        <div className={styles.scheduleColumn}>
                            <p className={styles.columnTitle}><span style={{color: 'red'}}>결근({miscEmployees.length})</span></p>
                            {miscEmployees.map((employee, index) => (
                                <p key={miscEmployees.length - index} className={styles.scheduleEntry}>
                                    {employee.slaveName} ({employee.slavePosition}) 
                                </p>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            <div
                className={styles.backgroundImage}
                style={{
                    backgroundImage: `url(${process.env.PUBLIC_URL}/images/background.png)`,
                }}
            ></div>
        </div>
    );
};

export default InnerMainPage;
