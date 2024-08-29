import React, {useEffect, useRef, useState} from "react";
import styles from './InnerHeader.module.scss';
import {Link, useNavigate} from "react-router-dom";
import {removeUserToken} from '../../../../utils/auth';
import {useDispatch, useSelector} from "react-redux";
import {noticeActions} from "../../../../store/notice-slice";
import NoticeModal from "../pages/NoticeModal";
import {BASE_URL} from "../../../../config/host-config";

const InnerHeader = () => {

    const noticeList = useSelector(state => state.notice.noticeList);
    const isModalOpen = useSelector(state => state.notice.isModalOpen);
    const [notices, setNotices] = useState([]);
    const [latestNoticeTitle, setLatestNoticeTitle] = useState('공지사항 없음');
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const currentPage = useSelector(state => state.workplace.currentPage);

    const workplaceId = localStorage.getItem('workplaceId');

    // 최신 공지사항 제목 가져오기
    useEffect(() => {
        const fetchNotice = async () => {
            const response = await fetch(`${BASE_URL}/detail/notice?workplaceId=${workplaceId}`);
            if (!response.ok) {
                throw new Error('네트워크 응답이 올바르지 않습니다.');
            }
            const data = await response.json();
            console.log("data:", data);
            setLatestNoticeTitle(data.noticeList.length > 0 ? data.noticeList[0].title : "공지사항 없음");
            setNotices(data.noticeList);
        }
        fetchNotice();
    }, [workplaceId, noticeList]);

    const handleLogout = () => {
        removeUserToken();
        navigate('/login');
    };

    const NoticeModalHandler = e => {
        // console.log('최근 공지 클릭');
        if (notices.length > 0) {
            dispatch(noticeActions.setSelectedNotice(notices[0]));
            dispatch(noticeActions.openModal());
        }
    };

    const handleCloseModal = () => {
        dispatch(noticeActions.closeModal()); // 모달 닫기
    };


    return (
        <div className={styles['headerButton-box']}>
            <div className={styles['headerNotice']}>
                <img className={styles['headerNoticeImg']} src={`${process.env.PUBLIC_URL}/images/master_notice.png`}
                     alt="Example"/>
                <p className={styles['headerNoticeText']} onClick={NoticeModalHandler}>{latestNoticeTitle}</p>
            </div>
            {(currentPage !== 5) && <Link to="/workplace" className={styles['link-text']}>
                <button className={styles['headerButton']}>사업장변경</button>
            </Link>}
            {(currentPage !== 5) && <button className={styles['headerButton']} onClick={handleLogout}>로그아웃</button>}

            {/* 모달 컴포넌트 추가 */}
            {isModalOpen && (
                <NoticeModal
                    isOpen={isModalOpen}
                    onClose={handleCloseModal}
                    id={notices[0].id}
                    title={notices[0].title}
                    content={notices[0].content}
                    date={notices[0].date}
                    refreshNotices={() => {
                    }}
                />
            )}

        </div>
    );
};

export default InnerHeader;
