import React, { useState } from 'react';
import styles from './ConfirmRetireModal.module.scss'; // SCSS 파일 임포트

const ConfirmRetireModal = ({ onClose, onConfirm }) => {
    const [inputValue, setInputValue] = useState('');

    const handleChange = (e) => {
        setInputValue(e.target.value);
    };

    const handleConfirm = () => {
        if (inputValue === '탈퇴하기') {
            onConfirm();
        } else {
            alert('정확한 문구를 입력해주세요.');
        }
    };

    return (
        <div className={styles.modal}>
            <div className={styles.modalContent}>
                <h2>회원 탈퇴 확인</h2>
                <p>회원 탈퇴를 원하시면 "탈퇴하기"를 입력해주세요.</p>
                <input type="text" value={inputValue} onChange={handleChange} />
                <button className={styles.confirmButton} onClick={handleConfirm}>확인</button>
                <button className={styles.cancelButton} onClick={onClose}>취소</button>
            </div>
        </div>
    );
};

export default ConfirmRetireModal;
