import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {getUserEmail, removeUserToken} from '../../../utils/auth';
import ConfirmRetireModal from './ConfirmRetireModal';
import styles from '../pages/commonStyles.module.scss';
import useAuth from "../../../hooks/useAuth";
import {BASE_URL} from "../../../config/host-config";

const RetirePage = () => {
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const navigate = useNavigate();

    const handlePasswordChange = (event) => {
        setPassword(event.target.value);
    };

    const userEmail = getUserEmail();
    const handleSubmit = async (event) => {
        event.preventDefault();



        const email =  sessionStorage.getItem('userId') || userEmail ;
        if (!email) {
            setError('No email found in storage');
            return;
        }

        try {
            const response = await fetch(`${BASE_URL}/api/auth/verify-password`, { // 비밀번호 검증 엔드포인트 호출
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, password })
            });

            if (response.ok) {
                setIsModalOpen(true);
            } else {
                const data = await response.json();
                setError(data.message || '비밀번호가 일치하지 않습니다.');
            }
        } catch (error) {
            setError('Failed to verify password');
        }
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    const handleConfirmRetire = async () => {
        const email = localStorage.getItem('userId') || sessionStorage.getItem('userId');
        if (!email) {
            setError('No email found in storage');
            return;
        }

        try {
            const response = await fetch(`${BASE_URL}/api/auth/retire`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, password })
            });

            if (response.ok) {
                alert("회원 탈퇴가 완료되었습니다.");
                removeUserToken();
                navigate('/login'); // 탈퇴 후 로그인 페이지로 이동
            } else {
                const data = await response.json();
                setError(data.message);
            }
        } catch (error) {
            setError('Failed to fetch');
        }
    };

    return (
        <div className={styles.fullPageContainer}>
            <div className={styles.signUpContainer}>
                <h1 className={styles.signUpTitle}>회원 탈퇴</h1>
                <form onSubmit={handleSubmit}>
                    <div className={styles.inputContainer}>
                        <label htmlFor="password" className={styles.inputLabel}>비밀번호</label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={handlePasswordChange}
                            required
                            className={styles.inputField}
                        />
                    </div>
                    {error && <p className={styles.error}>{error}</p>}
                    <button type="submit" className={styles.submitButton}>회원 탈퇴</button>
                </form>
                {isModalOpen && (
                    <ConfirmRetireModal
                        onClose={handleCloseModal}
                        onConfirm={handleConfirmRetire}
                    />
                )}
            </div>
        </div>
    );
};

export default RetirePage;
