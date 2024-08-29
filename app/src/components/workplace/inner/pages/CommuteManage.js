import React, { useState, useEffect, useRef } from "react";
import styles from './CommuteManage.module.scss';
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { workplaceActions } from "../../../../store/workplace-slice";
import {BASE_URL} from "../../../../config/host-config";

const CommuteManage = () => {
    const [inputValue, setInputValue] = useState("");
    const [validationMessage, setValidationMessage] = useState("");
    const [employees, setEmployees] = useState([]);
    const [showInput, setShowInput] = useState(false); // 인풋창 표시 여부 상태
    const [selectedEmployee, setSelectedEmployee] = useState(null); // 선택된 직원 상태
    const inputTimeoutRef = useRef(null); // 타이머를 저장할 ref
    const navigate = useNavigate();
    const workplaceId = localStorage.getItem('workplaceId');

    // 괴도 박성진 다녀감
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(workplaceActions.setCurrentPage({currentPage: 5}));
    }, [])
    // 괴도 박성진 다녀감

    useEffect(() => {
        const fetchEmployees = async () => {
            try {
                const response = await fetch(`${BASE_URL}/schedule/employees?workplaceId=${workplaceId}`);
                const data = await response.json();
                setEmployees(data);
            } catch (error) {
                console.error("Failed to fetch employees:", error);
                setValidationMessage("서버와의 통신 중 오류가 발생했습니다.");
            }
        };

        fetchEmployees();
    }, [workplaceId]);

    const handleInputChange = (event) => {
        setInputValue(event.target.value);

        // 인풋창이 사라지지 않도록 타이머 리셋
        if (inputTimeoutRef.current) {
            clearTimeout(inputTimeoutRef.current);
        }
    };

    const handleCheck = async () => {
        if (!inputValue.trim()) {
            setValidationMessage("전화번호를 입력해 주세요.");
            return;
        }
    
        if (!selectedEmployee) {
            setValidationMessage("직원을 선택해 주세요.");
            return;
        }
    
        try {
            const response = await fetch(`${BASE_URL}/schedule/verify-phone-number?phoneNumber=${inputValue}&workplaceId=${workplaceId}`);
            const data = await response.json(); // JSON으로 응답을 처리
    
            if (response.ok) {
                if (data.slaveId === selectedEmployee.id) { // 서버에서 받은 slaveId와 비교
                    setValidationMessage("검증 성공!");
                    navigate('/detail/commute-record', { state: { slaveId: data.slaveId } });
                } else {
                    setValidationMessage("해당 근무자의 번호가 아닙니다.");
                }
            } else {
                setValidationMessage(data.message || "서버에서 오류가 발생했습니다.");
            }
        } catch (error) {
            setValidationMessage("올바른 전화번호를 입력해 주세요.");
        }
    };

    const handleEmployeeClick = (employee) => {
        setSelectedEmployee(employee); // 클릭한 직원 정보 저장
        setShowInput(true); // 인풋창 표시

        // 인풋창을 5초 후에 숨기지만, 기존 타이머는 리셋
        if (inputTimeoutRef.current) {
            clearTimeout(inputTimeoutRef.current);
        }

        inputTimeoutRef.current = setTimeout(() => {
            setShowInput(false);
            setSelectedEmployee(null); // 인풋창이 숨겨지면 선택된 직원 정보 초기화
        }, 5000);
    };

    const handleInputFocus = () => {
        // 인풋 필드에 포커스하면 타이머를 멈춤
        if (inputTimeoutRef.current) {
            clearTimeout(inputTimeoutRef.current);
        }
    };

    const handleInputBlur = () => {
        // 인풋 필드에서 포커스가 벗어나면 타이머 재시작
        inputTimeoutRef.current = setTimeout(() => {
            setShowInput(false);
            setSelectedEmployee(null); // 인풋창이 숨겨지면 선택된 직원 정보 초기화
        }, 5000);
    };

    const handleKeyDown = (event) => {
        if (event.key === 'Enter') {
            handleCheck();
        }
    };

    return (
        <div>
            <div className={styles['title']}><h1>출퇴근 관리</h1></div>
            <div className={styles['content-box']}>
                <div className={styles['employee-list-title']}>직원목록</div> {/* 스타일이 적용된 제목 */}
                <div className={styles['employee-list-container']}>
                    <div className={styles['employee-list']}>
                        <div className={styles['employee-item-header']}>
                            <div className={styles['employee-item-name']}>이름 & 직책</div>
                            <div className={styles['employee-item-time']}>근무시간</div>
                        </div>
                        {employees.length > 0 ? (
                            employees.map(employee => (
                                <div 
                                    key={employee.id} 
                                    className={styles['employee-item']}
                                    onClick={() => handleEmployeeClick(employee)} // 클릭 시 직원 정보 전달
                                >
                                    <div className={styles['employee-item-name']}>
                                        {employee.slaveName} ({employee.slavePosition})
                                    </div>
                                    <div className={styles['employee-item-time']}>
                                        {employee.scheduleStart} ~ {employee.scheduleEnd}
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div>근무자 정보가 없습니다.</div>
                        )}
                    </div>
                    {showInput && ( // showInput 상태에 따라 인풋창을 조건부로 렌더링
                        <div className={styles['input-section']}>
                            {selectedEmployee && (
                                <div className={styles['selected-employee']}>
                                    선택된 직원: {selectedEmployee.slaveName}
                                </div>
                            )}
                            <input
                                type="text"
                                value={inputValue}
                                onChange={handleInputChange}
                                onFocus={handleInputFocus} // 포커스 시 타이머 중지
                                onBlur={handleInputBlur} // 포커스 해제 시 타이머 재시작
                                onKeyDown={handleKeyDown} // 엔터 키 이벤트 처리
                                placeholder="전화번호 입력"
                                className={styles['input-field']}
                            />
                            <button onClick={handleCheck} className={styles['check-button']}>확인</button>
                            {validationMessage && <div className={styles['validation-message']}>{validationMessage}</div>}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CommuteManage;
