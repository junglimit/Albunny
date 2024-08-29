import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./commonStyles.module.scss";
import {BASE_URL} from "../../../config/host-config"; // commonStyles.module.scss 파일을 import합니다.

const FindPwPage = () => {
    const [email, setEmail] = useState("");
    const [verificationCode, setVerificationCode] = useState("");
    const [isEmailVerified, setIsEmailVerified] = useState(false);
    const [isVerificationSent, setIsVerificationSent] = useState(false);
    const [timer, setTimer] = useState(0);
    const [errorMessage, setErrorMessage] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const navigate = useNavigate();

    const handleEmailChange = (event) => {
        setEmail(event.target.value);
    };

    const handleVerificationCodeChange = (event) => {
        setVerificationCode(event.target.value);
    };

    const handleEmailCheck = async () => {
        try {
            const response = await fetch(`${BASE_URL}/api/auth/check-email-exists?email=${email}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message);
            }

            setIsVerificationSent(true);
            setSuccessMessage("인증코드가 이메일로 전송되었습니다.");
            setErrorMessage("");
            setTimer(300); // 5분 타이머 설정
        } catch (error) {
            setErrorMessage(error.message);
            setSuccessMessage("");
        }
    };

    const handleVerifyCode = async () => {
        try {
            const response = await fetch(`${BASE_URL}/api/auth/verify-code`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email, code: verificationCode }),
            });

            const result = await response.json();
            if (result) {
                setIsEmailVerified(true);
                setSuccessMessage("이메일 인증이 완료되었습니다.");
                setErrorMessage("");
                setTimer(0); // 인증 완료 시 타이머 종료
                navigate("/login/modify-pw", { state: { email } });
            } else {
                throw new Error("잘못된 인증코드입니다.");
            }
        } catch (error) {
            setErrorMessage(error.message);
            setSuccessMessage("");
        }
    };

    useEffect(() => {
        if (timer > 0) {
            const intervalId = setInterval(() => {
                setTimer((prevTimer) => prevTimer - 1);
            }, 1000);
            return () => clearInterval(intervalId);
        }
    }, [timer]);

    return (
        <div className={styles.fullPageContainer}>
            <div className={styles.signUpContainer}>
                <h1 className={styles.signUpTitle}>비밀번호 찾기</h1>
                <div className={styles.inputContainer}>
                    <label className={styles.inputLabel}>이메일:</label>
                    <div className={styles.inputWithButton}>
                        <input
                            type="email"
                            value={email}
                            onChange={handleEmailChange}
                            disabled={isEmailVerified}
                            required
                            className={styles.inputField}
                        />
                        <button
                            type="button"
                            onClick={handleEmailCheck}
                            disabled={isVerificationSent}
                            className={styles.smallButton}
                        >
                            {isVerificationSent ? "인증코드 전송 완료" : "이메일 확인"}
                        </button>
                    </div>
                    {errorMessage && <p className={styles.error}>{errorMessage}</p>}
                    {successMessage && <p className={styles.success}>{successMessage}</p>}
                </div>
                {isVerificationSent && (
                    <div className={styles.inputContainer}>
                        <label className={styles.inputLabel}>인증코드:</label>
                        <div className={styles.inputWithButton}>
                            <input
                                type="text"
                                value={verificationCode}
                                onChange={handleVerificationCodeChange}
                                disabled={isEmailVerified}
                                required
                                className={styles.inputField}
                            />
                            <button
                                type="button"
                                onClick={handleVerifyCode}
                                disabled={isEmailVerified}
                                className={styles.smallButton}
                            >
                                인증코드 확인
                            </button>
                        </div>
                        {timer > 0 && <p className={styles.timer}>{`남은 시간: ${Math.floor(timer / 60)}분 ${timer % 60}초`}</p>}
                        {timer === 0 && isVerificationSent && !isEmailVerified && (
                            <button
                                type="button"
                                onClick={handleEmailCheck}
                                className={styles.smallButton}
                            >
                                인증코드 재전송
                            </button>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default FindPwPage;
