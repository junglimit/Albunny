import React from 'react';
import styles from "./NoticeModal.module.scss"
import {useDispatch, useSelector} from "react-redux";
import {useNavigate} from "react-router-dom";
import {noticeActions} from "../../../../store/notice-slice";
import useAuth from "../../../../hooks/useAuth";
import {BASE_URL} from "../../../../config/host-config";

const NoticeModal = ({id, title, content, date, isOpen, onClose, refreshNotices}) => {

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const userId = useAuth();
    const currentPage = useSelector(state => state.workplace.currentPage);

    if (!isOpen) return null;

    const editHandler = async e => {
        e.preventDefault();
        dispatch(noticeActions.setCurrentNotice({id, title, content}));
        navigate("/detail/notice-edit");
        dispatch(noticeActions.closeModal());
    };

    const deleteHandler = async e => {
        e.preventDefault();
        const confirmed = window.confirm("정말 삭제하시겠습니까?");
        console.log('삭제 공지 id:', id);
        if (confirmed) {
            try {
                const response = await fetch(`${BASE_URL}/detail/notice/${id}`, {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json',
                    }
                });
                if (response.ok) {
                    dispatch(noticeActions.deleteNotice(id));
                    await refreshNotices();
                    onClose();
                    navigate("/detail/notice");
                } else {
                    throw new Error('삭제 요청에 실패했습니다.');
                }
            } catch (error) {
                console.error('삭제 오류:', error);
            }
        }
    };

    return (
        <div className={styles.modalOverlay}>
            <div className={styles.modal}>
                <h2 className={styles.title}>{title}</h2>
                <span className={styles.date}>{date}</span>
                <p className={styles.content}>{content}</p>
                <div className={styles.buttonContainer}>
                    {currentPage !== 5 && <button className={styles.button} onClick={deleteHandler}>삭제</button>}
                    {currentPage !== 5 && <button className={styles.button} onClick={editHandler}>수정</button>}
                    <button className={styles.button} onClick={onClose}>닫기</button>
                </div>
            </div>
        </div>
    );
};

export default NoticeModal;