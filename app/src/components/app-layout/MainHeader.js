import React from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { removeUserToken, getUserId } from "../../utils/auth";
import styles from "./MainHeader.module.scss";

const MainHeader = ({ isHome }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const userId = getUserId();

    const navigateToMainHandler = () => {
        navigate('/');
    }

    const handleLogout = () => {
        removeUserToken();
        navigate('/login');
    };

    const handleRetire = () => {
        navigate('/login/retire');
    };

    // 현재 페이지가 로그인 페이지인지 확인
    const isLoginPage = location.pathname === '/login';

    return (
        <>
            <div className={styles.homeHeader}>
                <div className={styles.homeHeaderLine}>
                    <div className={styles.homeHeaderContent}>
                        <button className={styles.homeButton} onClick={navigateToMainHandler}>
                            <img
                                src={process.env.PUBLIC_URL + '/images/albunny_logo.png'}
                                alt="홈"
                                className={styles.homeImage}
                            />
                        </button>
                        {/* 링크들을 우측에 정렬 */}
                        <div className={styles.linkContainer}>
                            {!isLoginPage && (
                                userId ? (
                                    <>
                                        <button className={styles.retireLink} onClick={handleRetire}>회원 탈퇴</button>
                                        <button className={styles.logoutLink} onClick={handleLogout}>LOGOUT</button>
                                    </>
                                ) : (
                                    <Link to="/login" className={styles.homeLoginLink}>LOGIN</Link>
                                )
                            )}
                        </div>
                    </div>
                </div>
            </div>
            <div className={styles.headerPlaceholder} /> {/* 헤더 높이만큼의 공간을 추가 */}
        </>
    );
};

export default MainHeader;
