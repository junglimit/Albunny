import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import styles from '../pages/commonStyles.module.scss';
import {BASE_URL} from "../../../config/host-config";

const RecoverPage = () => {
    const [email, setEmail] = useState('');
    const [verificationCode, setVerificationCode] = useState('');
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        if (location.state && location.state.email) {
            setEmail(location.state.email);
        }
    }, [location.state]);

    const handleCodeChange = (event) => {
        setVerificationCode(event.target.value);
    };

    const handleSendCode = async () => {
        try {
            const response = await fetch(`${BASE_URL}/api/auth/send-recover-code`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email })
            });

            if (response.ok) {
                setSuccessMessage('인증코드가 이메일로 발송되었습니다.');
                setError('');
            } else {
                const data = await response.json();
                setError(data.message || '인증코드 발송에 실패했습니다.');
            }
        } catch (error) {
            setError('Failed to send verification code');
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
            const response = await fetch(`${BASE_URL}/api/auth/recover-account`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, code: verificationCode })
            });

            if (response.ok) {
                alert("계정 복구가 완료되었습니다.");
                navigate('/login'); // 복구 후 로그인 페이지로 이동
            } else {
                const data = await response.json();
                setError(data.message || '복구에 실패했습니다.');
            }
        } catch (error) {
            setError('Failed to recover account');
        }
    };

    return (
        <div className={styles.fullPageContainer}>
            <div className={styles.signUpContainer}>
                <h1 className={styles.signUpTitle}>계정 복구</h1>
                <form onSubmit={handleSubmit}>
                    <div className={styles.inputContainer}>
                        <label htmlFor="email" className={styles.inputLabel}>이메일</label>
                        <div className={styles.inputWithButton}>
                            <input
                                type="email"
                                id="email"
                                value={email}
                                readOnly
                                className={styles.inputField}
                            />
                            <button type="button" onClick={handleSendCode} className={styles.smallButton}>
                                인증하기
                            </button>
                        </div>
                    </div>
                    <div className={styles.inputContainer}>
                        <label htmlFor="verificationCode" className={styles.inputLabel}>인증 코드</label>
                        <input
                            type="text"
                            id="verificationCode"
                            value={verificationCode}
                            onChange={handleCodeChange}
                            required
                            className={styles.inputField}
                        />
                    </div>
                    {successMessage && <p className={styles.success}>{successMessage}</p>}
                    {error && <p className={styles.error}>{error}</p>}
                    <button type="submit" className={styles.submitButton}>계정 복구</button>
                </form>
            </div>
        </div>
    );
};

export default RecoverPage;
