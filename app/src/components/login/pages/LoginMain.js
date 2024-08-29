import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { saveUserToken, saveUserId, getUserIdFromStorage, getUserId } from '../../../utils/auth';
import 'bootstrap/dist/css/bootstrap.min.css'; // 부트스트랩 CSS 임포트
import styles from './LoginMain.module.scss';
import {BASE_URL} from "../../../config/host-config";

const LoginMain = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [rememberMe, setRememberMe] = useState(false);
    const [autoLogin, setAutoLogin] = useState(false);
    const [error, setError] = useState('');
    const [showRecoverButton, setShowRecoverButton] = useState(false); // 복구하기 버튼 표시 상태

    const navigate = useNavigate();

    useEffect(() => {
        const storedUserId = getUserIdFromStorage();
        if (storedUserId) {
            setEmail(storedUserId);
            setRememberMe(true);
        }

        const userId = getUserId();
        if (userId) {
            navigate('/workplace'); // 이미 로그인된 상태라면 /workplace로 이동
        }
    }, [navigate]);

    const handleChange = (setter) => (event) => {
        setter(event.target.value);
    };

    const handleCheckboxChange = (setter) => (event) => {
        setter(event.target.checked);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
            const response = await fetch(`${BASE_URL}/api/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
                credentials: 'include'
            });

            if (response.ok) {
                const data = await response.json();
                const token = data.token; // 서버가 반환하는 토큰을 가져옴
                saveUserToken(token, autoLogin); // autoLogin이 true면 로컬스토리지에 저장, false면 세션스토리지에 저장
                sessionStorage.setItem('userId',email);
                if (rememberMe) {
                    saveUserId(email); // 아이디 저장 체크한 경우에만 이메일 저장
                }

                navigate('/workplace'); // 로그인 성공 시 /workplace로 이동
            } else {
                const data = await response.json();
                setError(data.message);

                // 탈퇴한 회원인 경우 복구하기 버튼 표시
                if (data.message === "탈퇴한 회원입니다.") {
                    setShowRecoverButton(true);
                }
            }
        } catch (error) {
            setError('Failed to fetch');
        }
    };

    const handleSignUp = () => {
        navigate('/login/sign-up');
    };

    const handleFindPassword = () => {
        navigate('/login/find-pw');
    };

    const handleRecover = () => {
        // 복구 페이지로 이동
        navigate('/login/recover', { state: { email } });
    };

    // 체크박스 스타일을 상태에 따라 설정
    const checkboxStyle = (isChecked) => ({
        border: isChecked ? '0' : '2px solid #ccc', // 체크가 안된 경우 테두리를 추가
        backgroundColor: isChecked ? '#ff8803' : '#fff', // 체크된 경우 배경색 변경
        width: '20px',
        height: '20px',
        display: 'inline-block',
        cursor: 'pointer',
    });

    return (
        <div className={styles.fullPageContainer}>
            <div className={styles.loginContainer}>
                <h1 className={styles.loginTitle}>로그인</h1>
                <form onSubmit={handleSubmit}>
                    <div className={styles.inputContainer}>
                        <label htmlFor="email" className={styles.inputLabel}>아이디</label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={handleChange(setEmail)}
                            required
                            className={styles.inputField}
                        />
                    </div>
                    <div className={styles.inputContainer}>
                        <label htmlFor="password" className={styles.inputLabel}>비밀번호</label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={handleChange(setPassword)}
                            required
                            className={styles.inputField}
                        />
                    </div>
                    <div className={styles.checkboxContainer}>
                        <div className="form-check">
                            <input
                                className="form-check-input"
                                type="checkbox"
                                checked={rememberMe}
                                onChange={handleCheckboxChange(setRememberMe)}
                                id="rememberMe"
                                style={checkboxStyle(rememberMe)}
                            />
                            <label className="form-check-label" htmlFor="rememberMe">
                                아이디 저장
                            </label>
                        </div>
                        <div className="form-check">
                            <input
                                className="form-check-input"
                                type="checkbox"
                                checked={autoLogin}
                                onChange={handleCheckboxChange(setAutoLogin)}
                                id="autoLogin"
                                style={checkboxStyle(autoLogin)}
                            />
                            <label className="form-check-label" htmlFor="autoLogin">
                                자동 로그인
                            </label>
                        </div>
                    </div>
                    <button type="submit" className={styles.submitButton}>확인</button>
                    {error && <p className={styles.error}>{error}</p>}
                    {showRecoverButton && (
                        <button onClick={handleRecover} className={styles.recoverButton}>
                            복구하기
                        </button>
                    )}
                </form>
                <div className={styles.additionalLinks}>
                    <button onClick={handleSignUp} className={styles.linkButton}>회원가입</button>
                    <button onClick={handleFindPassword} className={styles.linkButton}>비밀번호찾기</button>
                </div>
            </div>
        </div>
    );
};

export default LoginMain;
