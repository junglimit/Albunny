import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./commonStyles.module.scss";
import {BASE_URL} from "../../../config/host-config";

const SignUpPage = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [name, setName] = useState("");
    const [verificationCode, setVerificationCode] = useState("");
    const [isEmailVerified, setIsEmailVerified] = useState(false);
    const [isVerificationSent, setIsVerificationSent] = useState(false);
    const [timer, setTimer] = useState(0);
    const [errorMessage, setErrorMessage] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const [passwordValid, setPasswordValid] = useState(true);
    const [passwordMatch, setPasswordMatch] = useState(true);
    const navigate = useNavigate();

    const validatePassword = (password) => {
        return password.length >= 8 && /[!@#$%^&*(),.?":{}|<>]/g.test(password);
    };

    const handleEmailCheck = async () => {
        try {
            const response = await fetch(`${BASE_URL}/api/auth/check-email?email=${email}`, {
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
            } else {
                throw new Error("잘못된 인증코드입니다.");
            }
        } catch (error) {
            setErrorMessage(error.message);
            setSuccessMessage("");
        }
    };

    const handleRegister = async (event) => {
        event.preventDefault();

        if (password !== confirmPassword) {
            setPasswordMatch(false);
            return;
        }

        const userData = {
            email,
            password,
            name,
        };

        try {
            const response = await fetch(`${BASE_URL}/api/auth/register`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(userData),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message);
            }

            const data = await response.json();
            console.log("회원가입 성공:", data);
            // 회원가입 성공 시 로그인 페이지로 이동
            navigate("/login");
        } catch (error) {
            console.error("회원가입 오류:", error);
            setErrorMessage(error.message);
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
                <h1 className={styles.signUpTitle}>회원가입</h1>
                <form onSubmit={handleRegister}>
                    <div className={styles.inputContainer}>
                        <label className={styles.inputLabel}>이메일:</label>
                        <div className={styles.inputWithButton}>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                disabled={isEmailVerified}
                                required
                                className={styles.inputField}
                            />
                            <button type="button" onClick={handleEmailCheck} disabled={isVerificationSent} className={styles.smallButton}>
                                {isVerificationSent ? "인증코드 전송 완료" : "중복 확인"}
                            </button>
                        </div>
                    </div>
                    {isVerificationSent && (
                        <div className={styles.inputContainer}>
                            <label className={styles.inputLabel}>인증코드:</label>
                            <div className={styles.inputWithButton}>
                                <input
                                    type="text"
                                    value={verificationCode}
                                    onChange={(e) => setVerificationCode(e.target.value)}
                                    disabled={isEmailVerified}
                                    required
                                    className={styles.inputField}
                                />
                                <button type="button" onClick={handleVerifyCode} disabled={isEmailVerified} className={styles.smallButton}>
                                    인증코드 확인
                                </button>
                            </div>
                        </div>
                    )}
                    {timer > 0 && (
                        <p className={styles.success}>
                            남은 시간: {Math.floor(timer / 60)}분 {timer % 60}초
                        </p>
                    )}
                    <div className={styles.inputContainer}>
                        <label className={styles.inputLabel}>비밀번호:</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => {
                                setPassword(e.target.value);
                                setPasswordValid(validatePassword(e.target.value));
                            }}
                            required
                            className={styles.inputField}
                        />
                        {!passwordValid && <p className={styles.error}>비밀번호는 8자 이상이며 특수문자를 포함해야 합니다.</p>}
                    </div>
                    <div className={styles.inputContainer}>
                        <label className={styles.inputLabel}>비밀번호 확인:</label>
                        <input
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => {
                                setConfirmPassword(e.target.value);
                                setPasswordMatch(e.target.value === password);
                            }}
                            required
                            className={styles.inputField}
                        />
                        {!passwordMatch && <p className={styles.error}>비밀번호가 일치하지 않습니다.</p>}
                    </div>
                    <div className={styles.inputContainer}>
                        <label className={styles.inputLabel}>이름:</label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                            className={styles.inputField}
                        />
                    </div>
                    <button type="submit" className={styles.submitButton} disabled={!isEmailVerified || !passwordValid || !passwordMatch}>
                        회원가입
                    </button>
                </form>
            </div>
        </div>
    );
};

export default SignUpPage;
