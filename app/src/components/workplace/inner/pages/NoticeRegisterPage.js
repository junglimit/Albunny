import React, {useEffect, useState} from "react";
import styles from "./NoticeRegistPage.module.scss"
import {Form, Link, useNavigate} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {noticeActions} from "../../../../store/notice-slice";
import {BASE_URL} from "../../../../config/host-config";

const NoticeRegisterPage = () => {

    const [currentDate, setCurrentDate] = useState("");

    const workplaceId = localStorage.getItem('workplaceId');

    const navigate = useNavigate();
    const dispatch = useDispatch();

    useEffect(() => {
        const today = new Date();
        const yyyy = today.getFullYear();
        const mm = String(today.getMonth() + 1).padStart(2, '0');
        const dd = String(today.getDate()).padStart(2, '0');
        setCurrentDate(`${yyyy}-${mm}-${dd}`);
    }, []);


    const submitHandler = async (e) => {
        e.preventDefault();
        console.log('form 제출');

        const formData = new FormData(e.target);
        const title = formData.get('title');
        const content = formData.get('content');
        console.log('form: ', formData.get('title'));

        // 제목과 내용이 비어 있는지 확인
        if (!title || !content) {
            alert('제목과 내용을 모두 입력해주세요.');
            return; // 내용이 없으면 제출을 중단
        }

        const payload = {
            title: title,
            content: content,
            workplaceId: workplaceId
        };

        console.log('payload: ', payload);

        const response = await fetch(`${BASE_URL}/detail/notice-register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload)
        });

        if (response.ok) {
            // console.log("ok인지 확인");
            // const data = await response.json();
            // console.log('응답 데이터: ', data);
            // dispatch(noticeActions.addNotice(data.noticeList));

            navigate("/detail/notice");
        }
    };

    return (
        <Form method='POST' onSubmit={submitHandler} noValidate>
            <div className={styles.notice}>
                <h1>공지사항 등록</h1>
            </div>
            <div className={styles.write}>
                <p>
                    <label htmlFor="title">제목</label>
                    <input
                        id="title"
                        type="text"
                        name="title"
                        maxLength={30}
                        required/>
                </p>
                <p>
                    <label htmlFor="content">내용</label>
                    <textarea
                        id="content"
                        name="content"
                        rows="5"
                        required/>
                </p>

                <div className={styles.info}>

                    <p className={styles.hidden}>
                        <label htmlFor="date">작성일</label>
                        <span>{currentDate}</span>
                        <input type="hidden" id="date" name="date" value={currentDate}/>
                    </p>
                </div>

            </div>
            <div className={styles.actions}>
                <Link to="/detail/notice">
                    <button type="button"> 취소</button>
                </Link>
                <button>등록</button>
            </div>
        </Form>
    );
};

export default NoticeRegisterPage;