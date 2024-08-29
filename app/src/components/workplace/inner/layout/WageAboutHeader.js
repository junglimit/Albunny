import React, { useEffect, useState } from "react";
import styles from "./SalaryHeader.module.scss";
import { useDispatch, useSelector } from "react-redux";
import { wageActions } from "../../../../store/wage-slice";
import { formatMonth } from "./SalaryHeader";
import { MdKeyboardArrowLeft, MdKeyboardArrowRight } from "react-icons/md";
const WageAboutHeader = () => {
    const month = useSelector((state) => state.wage.month);
    const year = useSelector((state) => state.wage.year);
    const slaveData = useSelector((state) => state.wage.slaveData);

    const dispatch = useDispatch();

    const handlePreviousMonth = () => {
        dispatch(wageActions.setMonthByType({ type: "prev" }));
    };

    const handleNextMonth = () => {
        dispatch(wageActions.setMonthByType({ type: "next" }));
    };

    return (
        <>
            {/* <h2>{slaveData.slaveName}님의 급여</h2> */}
            <div className={styles.container}>
                <div className={styles.salaryHeader}>
                    <div
                        onClick={handlePreviousMonth}
                        className={styles.buttonWrapper}
                    >
                        <button className={styles.button}>
                        <MdKeyboardArrowLeft />
                        </button>
                    </div>
                    <span className={styles.salaryText}>
                        {year}년 {formatMonth(month)}월 누적급여
                    </span>
                    <div
                        onClick={handleNextMonth}
                        className={styles.buttonWrapper}
                    >
                        <button className={styles.button}>
                        <MdKeyboardArrowRight />
                        </button>
                    </div>
                </div>
                <div className={styles.salaryBox}>
                    <span className={styles.salaryAmount}>
                        {slaveData.totalSalary.toLocaleString("ko-KR")}원
                    </span>
                </div>
            </div>
        </>
    );
};

export default WageAboutHeader;
