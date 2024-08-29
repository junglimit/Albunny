import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import styles from './commonStyles.module.scss';
import {BASE_URL} from "../../../config/host-config";

const ModifyPwPage = () => {
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const location = useLocation();
    const navigate = useNavigate();
    const email = location.state?.email;

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (password !== confirmPassword) {
            setErrorMessage("비밀번호가 일치하지 않습니다.");
            return;
        }

        const userData = {
            email,
            password,
        };

        try {
            const response = await fetch(`${BASE_URL}/api/auth/reset-password`, {
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
            console.log("비밀번호 변경 성공:", data);
            setSuccessMessage("비밀번호가 성공적으로 변경되었습니다.");
            setErrorMessage("");
            navigate("/login");
        } catch (error) {
            console.error("비밀번호 변경 오류:", error);
            setErrorMessage(error.message);
        }
    };

    return (
        <div className={styles.fullPageContainer}>
            <div className={styles.signUpContainer}>
                <h1 className={styles.signUpTitle}>비밀번호 변경</h1>
                <form onSubmit={handleSubmit}>
                    <div className={styles.inputContainer}>
                        <label className={styles.inputLabel}>새 비밀번호:</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className={styles.inputField}
                        />
                    </div>
                    <div className={styles.inputContainer}>
                        <label className={styles.inputLabel}>비밀번호 확인:</label>
                        <input
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                            className={styles.inputField}
                        />
                        {password !== confirmPassword && (
                            <p style={{ color: "red" }}>비밀번호가 일치하지 않습니다.</p>
                        )}
                    </div>
                    {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
                    {successMessage && <p style={{ color: "green" }}>{successMessage}</p>}
                    <button type="submit" disabled={!email} className={styles.submitButton}>비밀번호 변경</button>
                </form>
            </div>
        </div>
    );
};

export default ModifyPwPage;
