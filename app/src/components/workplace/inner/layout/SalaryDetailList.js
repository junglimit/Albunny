import React, { useState } from "react";
import styles from "./SalaryDetailList.module.scss";
import BonusModal from "./BonusModal";
import { useDispatch } from "react-redux";
import { wageActions } from "../../../../store/wage-slice";
import { IoMdAddCircleOutline } from "react-icons/io";
import {BASE_URL} from "../../../../config/host-config";

const SalaryDetailList = ({
    workingTime,
    workDate,
    salary,
    slaveName,
    slaveId,
    bonusAmount,
}) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalData, setModalData] = useState({
        amount: 0,
    });
    const dispatch = useDispatch();

    const openModal = () => {
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setModalData((prevData) => ({
            ...prevData,
            amount: 0,
        }));
    };

    const handleSave = async () => {
        const payload = {
            slaveId,
            workDate,
            amount: modalData.amount,
        };
        try {
            const res = await fetch(`${BASE_URL}/wage/bonus`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(payload),
            });

            if (!res.ok) {
                throw new Error("Network response was not ok");
            }

            const json = await res.json();
            dispatch(wageActions.setSlaveData({ slaveData: json }));
        } catch (error) {
            console.error("Error fetching data:", error);
        }
        closeModal();
    };

    return (
        <>
            <div className={styles.container}>
                <div className={styles.info}>
                    <div className={styles.header}>
                        <span className={styles.name}>근무일: {workDate}</span>
                    </div>
                    <div className={styles.details}>
                        근무시간: {workingTime}
                    </div>
                </div>
                <div className={styles.salary}>
                    <span className={styles.amount}>
                        {salary.toLocaleString("ko-KR")}원
                    </span>
                    <span className={styles.amount}>
                        (추가수당: {bonusAmount.toLocaleString("ko-KR")}원)
                        <span className={styles.addButton} onClick={openModal}>
                            <IoMdAddCircleOutline />
                        </span>
                    </span>
                </div>
            </div>

            {isModalOpen && (
                <BonusModal
                    workDate={workDate}
                    name={slaveName}
                    amount={modalData.amount}
                    onClose={closeModal}
                    onSave={handleSave}
                    setModalData={setModalData}
                />
            )}
        </>
    );
};

export default SalaryDetailList;
