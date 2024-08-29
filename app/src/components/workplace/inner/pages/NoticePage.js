import React, {useCallback, useEffect, useState} from "react";
import styles from "./NoticePage.module.scss"
import {Link, useNavigate} from "react-router-dom";
import NoticeModal from "./NoticeModal";
import {useDispatch, useSelector} from "react-redux";
import {noticeActions} from "../../../../store/notice-slice";
import useAuth from "../../../../hooks/useAuth";
import { workplaceActions } from "../../../../store/workplace-slice";
import {BASE_URL} from "../../../../config/host-config";

const NoticePage = () => {

    const [error, setError] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedNotice, setSelectedNotice] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [isLoading, setIsLoading] = useState(true);

    const dispatch = useDispatch();
    const notices = useSelector((state) => state.notice.noticeList || []);

    const navigate = useNavigate();
    const userId = useAuth();

    const workplaceId = localStorage.getItem('workplaceId');
        // 괴도 박성진 다녀감
        useEffect(() => {
            dispatch(workplaceActions.setCurrentPage({currentPage: 4}));
        }, [])
        // 괴도 박성진 다녀감

    const fetchNotices = useCallback(async () => {
        setIsLoading(true);
        try {
            const response = await fetch(`${BASE_URL}/detail/notice?workplaceId=${workplaceId}&page=${currentPage}`);
            if (!response.ok) {
                throw new Error('네트워크 응답이 올바르지 않습니다.');
            }
            const data = await response.json();
            console.log("data:", data);
            dispatch(noticeActions.setNotices(data.noticeList));
            console.log("Fetched data:", data.noticeList);
            setTotalPages(data.totalPages);
        } catch (error) {
            setError(error.message);
        }
        setIsLoading(false);
    }, [dispatch, currentPage, workplaceId]);

    useEffect(() => {
        fetchNotices();
    }, [fetchNotices]);


    const openModal = (notice) => {
        setSelectedNotice(notice);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedNotice(null);
    };

    if (error) return <div>Error: {error}</div>;  // 오류 발생 시 표시할 내용
    // if (isLoading) return <div>로딩 중...</div>;  // 로딩 상태 표시

    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= totalPages) {
            setCurrentPage(newPage);
        }
    };

    return (
        <>

            <div className={styles.noticeBoard}>
                <h1>공지사항</h1>

                <div className={styles.actions}>
                    <Link to="/detail/notice-register">
                        <button type="button">작성</button>
                    </Link>
                </div>
            </div>


            <div className={styles.noticeList}>
                {!isLoading &&
                    (<ul>
                        {notices.length > 0 ? (
                            notices.map(notice => (
                                <li key={notice.id} onClick={() => openModal(notice)} className="notice">
                                    <h3>{notice.title}</h3>
                                    <span>{notice.date}</span>
                                </li>
                            ))
                        ) : (
                            <li>등록된 공지사항이 없습니다.</li>
                        )}
                    </ul>)}
            </div>

            <div className={styles.pagination}>
                {currentPage !== 1 && <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                >
                    이전
                </button>}
                <span className={styles.page}> {currentPage} / {totalPages == 0 ? 1 : totalPages}</span>
                {currentPage !== totalPages && <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                >
                    다음
                </button>}
            </div>


            {selectedNotice && (
                <NoticeModal
                    isOpen={isModalOpen}
                    onClose={closeModal}
                    id={selectedNotice.id}
                    title={selectedNotice.title}
                    content={selectedNotice.content}
                    date={selectedNotice.date}
                    refreshNotices={fetchNotices}
                />
            )}

        </>
    );
};

export default NoticePage;
