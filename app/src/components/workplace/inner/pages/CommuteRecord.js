import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import styles from './CommuteRecord.module.scss'; // 모듈 스타일을 가져옵니다
import FlipDigit from './FlipDigit';
import {BASE_URL} from "../../../../config/host-config"; // 플립 디지털 시계 컴포넌트를 가져옵니다


const Modal = ({ show, onClose, onConfirm, message }) => {
    if (!show) return null; // 모달이 보이지 않으면 아무것도 렌더링하지 않음

    return (
        <div className={styles.modalBackdrop}>
            <div className={styles.modalContent}>
                <div>{message}</div>
                <div className={styles.modalButtons}>
                    <button onClick={onClose} className={styles.cancelButton}>취소</button>
                    <button onClick={onConfirm} className={styles.confirmButton}>확인</button>
                </div>
            </div>
        </div>
    );
};

const CommuteRecord = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [slaveId, setSlaveId] = useState(null);
    const [logId, setLogId] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [isCheckedIn, setIsCheckedIn] = useState(false);
    const [hasCheckedOut, setHasCheckedOut] = useState(false);
    const [isComplete, setIsComplete] = useState(false);
    const [serverTime, setServerTime] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [modalAction, setModalAction] = useState(null);
    const [checkInTime, setCheckInTime] = useState(null); // 출근 시간을 위한 상태 추가
    const [checkOutTime, setCheckOutTime] = useState(null); // 퇴근 시간을 위한 상태 추가

    useEffect(() => {
        if (location.state && location.state.slaveId) {
            setSlaveId(location.state.slaveId);
        } else {
            navigate('/');
        }
    }, [location.state, navigate]);

    useEffect(() => {
        const fetchCurrentLog = async () => {
            try {
                const response = await fetch(`${BASE_URL}/schedule/current-log?slaveId=${slaveId}`);
                if (response.ok) {
                    const data = await response.json();
                    if (data.id) {
                        setLogId(data.id);
                        setIsCheckedIn(true);
                        setCheckInTime(new Date(data.scheduleLogStart)); // 출근 시간 설정
                        if (data.scheduleLogEnd) {
                            setHasCheckedOut(true);
                            setCheckOutTime(new Date(data.scheduleLogEnd)); // 퇴근 시간 설정
                            setIsComplete(true); // 퇴근 처리가 완료된 상태로 설정
                        }
                    }
                }
            } catch (error) {
                console.error('Failed to fetch current log:', error);
            }
        };

        const fetchServerTime = async () => {
            try {
                const response = await fetch(`${BASE_URL}/schedule/server-time`);
                if (response.ok) {
                    const data = await response.json();
                    setServerTime(new Date(data));
                }
            } catch (error) {
                console.error('Failed to fetch server time:', error);
            }
        };

        if (slaveId) {
            fetchCurrentLog();
        }

        fetchServerTime();
    }, [slaveId]);

    useEffect(() => {
        let interval;
        if (serverTime) {
            interval = setInterval(() => {
                setServerTime(prevTime => new Date(prevTime.getTime() + 1000));
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [serverTime]);

    const handleCheckIn = () => {
        setModalAction('checkIn');
        setShowModal(true);
    };

    const handleCheckOut = () => {
        setModalAction('checkOut');
        setShowModal(true);
    };

    const handleConfirm = async () => {
        setShowModal(false);

        try {
            if (modalAction === 'checkIn') {
                if (!slaveId) {
                    setErrorMessage('Error: slaveId가 설정되지 않았습니다.');
                    return;
                }
                if (isCheckedIn) {
                    setErrorMessage('이미 출근 처리되었습니다.');
                    return;
                }
                const payload = { slaveId };
                const response = await fetch(`${BASE_URL}/schedule/checkin`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload),
                });

                if (response.ok) {
                    const data = await response.json();
                    setLogId(data.id);
                    setIsCheckedIn(true);
                    setCheckInTime(serverTime); // 출근 시간 설정
                    setErrorMessage('');
                    setIsComplete(false); // 출퇴근 처리 완료 상태를 false로 설정
                } else {
                    const errorData = await response.json();
                    throw new Error(errorData.error || '서버 오류');
                }
            } else if (modalAction === 'checkOut') {
                if (!logId) {
                    setErrorMessage('Error: 로그 ID가 설정되지 않았습니다.');
                    return;
                }
                if (hasCheckedOut) {
                    setErrorMessage('이미 퇴근 처리되었습니다.');
                    return;
                }
                const response = await fetch(`${BASE_URL}/schedule/checkout`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ logId })
                });

                if (response.ok) {
                    setLogId('');
                    setIsCheckedIn(false);
                    setHasCheckedOut(true);
                    setCheckOutTime(serverTime); // 퇴근 시간 설정
                    setIsComplete(true); // 출퇴근 처리 완료 상태로 설정
                    setErrorMessage('');
                } else {
                    const errorData = await response.json();
                    throw new Error(errorData.error || '서버 오류');
                }
            }
        } catch (error) {
            setErrorMessage(error.message || '처리 중 오류가 발생했습니다.');
        }
    };

    const handleClose = () => {
        setShowModal(false);
    };

    const getModalMessage = () => {
        if (modalAction === 'checkIn') {
            return (
                <>
                    현재시간: {serverTime ? serverTime.toLocaleTimeString('ko-KR', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' }) : '로딩 중...'} 으로
                    <br />
                     출근하시겠습니까?
                </>
            );
        } else if (modalAction === 'checkOut') {
            return (
                <>
                    현재시간: {serverTime ? serverTime.toLocaleTimeString('ko-KR', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' }) : '로딩 중...'} 으로
                    <br />
                     퇴근하시겠습니까?
                </>
            );
        }
        return '';
    };
    return (
        <div className={styles.contentBox}>
            <div className={styles.title}></div>
            <div className={styles.serverTime}>
                <FlipDigit value={serverTime ? serverTime.getHours() : '00'} />:
                <FlipDigit value={serverTime ? serverTime.getMinutes() : '00'} />:
                <FlipDigit value={serverTime ? serverTime.getSeconds() : '00'} />
            </div>
            <div className={styles.buttonContainer}>
                {isComplete ? (
                    <div className={styles.timeInfoTitle}>
                        <div>
                            출퇴근 처리가 완료되었습니다.
                        </div>
                        <div className={styles.timeInfo}>
                            <span className={styles.timeLabel}>출근 시간:</span> {checkInTime && checkInTime.toLocaleTimeString('ko-KR', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                            <br></br>
                            <span className={styles.timeLabel}>퇴근 시간:</span> {checkOutTime && checkOutTime.toLocaleTimeString('ko-KR', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                        </div>
                    </div>
                ) : (
                    <div className={styles.buttonContainer}>
                        <button onClick={handleCheckIn} disabled={isCheckedIn} className={styles.checkButton}>출근</button>
                        <button onClick={handleCheckOut} disabled={!isCheckedIn || hasCheckedOut} className={styles.checkButton}>퇴근</button>
                        {isCheckedIn && !isComplete && (
                            <div className={styles.timeLabelBox}>
                                <span className={styles.timeLabel}>출근 시간:</span> {checkInTime && checkInTime.toLocaleTimeString('ko-KR', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                            </div>
                        )}
                    </div>
                )}
            </div>
            {errorMessage && <div className={styles.validationMessage}>{errorMessage}</div>}
            <Modal show={showModal} onClose={handleClose} onConfirm={handleConfirm} message={getModalMessage()} />
        </div>
    );
};

export default CommuteRecord;
