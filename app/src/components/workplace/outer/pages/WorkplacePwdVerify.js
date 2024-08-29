import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import styles from '../../../login/pages/commonStyles.module.scss';
import {BASE_URL} from "../../../../config/host-config";


const WorkplacePwdVerify = () => {
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();
    const workplaceId = localStorage.getItem("workplaceId");

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post(
                `${BASE_URL}/workplace/verify/${workplaceId}`,
                { password }
            );
            const { valid } = response.data;

            if (valid) {
                // 검증 완료 후 상태를 로컬 스토리지에 저장
                localStorage.setItem("passwordVerified", "true");
                // 이동할 페이지 결정할 액션 불러오기 !
                const action = localStorage.getItem("action");
                navigate(action, { replace: true });

                // 비밀번호 검증 후 페이지 이동 조건문
                if (action === "modify") {
                    navigate("/workplace/modify", { replace: true }); // 수정 페이지로 이동
                } else if (action === "view") {
                    navigate("/detail", { replace: true }); // 기본 업장 메인페이지로 이동
                } else if (action === "detail") {
                    navigate("../../detail", { replace: true });
                } else if (action === "slave") {
                    navigate("../../detail/slave-manage", { replace: true });
                } else if (action === "wage") {
                    navigate("../../detail/wage-manage", { replace: true });
                } else if (action === "schedule") {
                    navigate("../../detail/schedule-manage", { replace: true });
                } else if (action === "notice") {
                    navigate("../../detail/notice", { replace: true });
                }

                // 비밀번호 검증 페이지 방문 기록 삭제
                localStorage.removeItem("action");
            } else {
                setError('간편 비밀번호가 틀렸습니다.');

            }
        } catch (error) {
            console.error("Error verifying password:", error);
            setError("비밀번호 검증 중 오류가 발생했습니다.");
        }
    };

    const cancelHandler = () => {
        const action = localStorage.getItem("action");
        if (action === "modify" || action === "view") {
            navigate("../../workplace");
        } else {
            navigate("../../detail/commute-manage");
        }
    };

    return (
        <div className={styles.fullPageContainer}>
            <div className={styles.signUpContainer}>
                <h1 className={styles.signUpTitle}>간편 비밀번호</h1>
                <form onSubmit={handleSubmit}>
                    <div className={styles.inputContainer}>
                        <label className={styles.inputLabel} htmlFor="password">간편 비밀번호</label>
                        <input
                            className={styles.inputField}
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    {error && <p className={styles.error}>{error}</p>}
                    <div className={styles.buttonContainer}>
                        <button type="button" onClick={cancelHandler} className={styles.cancelButton}>취소</button>
                        <button type="submit" className={styles.submitButton2}>확인</button>

                    </div>
                </form>
            </div>
        </div>
    );
};

export default WorkplacePwdVerify;
