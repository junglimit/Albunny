import React from "react";
import styles from "./BonusModal.module.scss";

const BonusModal = ({ workDate, name, amount, onClose, onSave, setModalData }) => {
    const handleInputChange = (e) => {
        const { value } = e.target;
        setModalData((prevData) => ({
            ...prevData,
            amount: value,
        }));
    };

    return (
        <div className={styles.modal}>
            <div className={styles.modalContent}>
                <h2>급여 수정</h2>
                <div className={styles.field}>
                    <label>근무일:</label>
                    <span>{workDate}</span>
                </div>
                <div className={styles.field}>
                    <label>이름:</label>
                    <span>{name}</span>
                </div>
                <div className={styles.field}>
                    <label>금액:</label>
                    <input
                        type="number"
                        value={amount}
                        onChange={handleInputChange}
                    />
                </div>
                <div className={styles.buttons}>
                    <button className={styles.cancelButton} onClick={onClose}>취소</button>
                    <button className={styles.confirmButton} onClick={onSave}>확인</button>
                </div>
            </div>
        </div>
    );
};

export default BonusModal;
