import React, { useEffect, useState } from "react";
import styles from "./SalaryList.module.scss";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useDispatch, useSelector } from "react-redux";
import { wageActions } from "../../../../store/wage-slice";

const SalaryList = ({
    name,
    role,
    hourlyWage,
    wageType,
    totalSalary,
    insurance,
    slaveId,
    log,
}) => {
    const navigate = useNavigate();
    const detailHandler = (e) => {
        navigate(`../wage-about`, { state: { slaveId } });
    };
    const [benefit, setBenefit] = useState(0);
    const dispatch = useDispatch();
    useEffect(() => {
        setBenefit(0);
        if (log.first) {
            setBenefit(
                (prev) => (prev += (log.firstWorkingTime * hourlyWage) / 5)
            );
        }
        if (log.second) {
            setBenefit(
                (prev) => (prev += (log.secondWorkingTime * hourlyWage) / 5)
            );
        }
        if (log.third) {
            setBenefit(
                (prev) => (prev += (log.thirdWorkingTime * hourlyWage) / 5)
            );
        }
        if (log.fourth) {
            setBenefit(
                (prev) => (prev += (log.fourthWorkingTime * hourlyWage) / 5)
            );
        }
        if (log.fifth) {
            setBenefit(
                (prev) => (prev += (log.fifthWorkingTime * hourlyWage) / 5)
            );
        }
        dispatch(wageActions.setBenefit({ benefit: benefit }));
    }, []);

    return (
        <div className={styles.container}>
            <div className={styles.info}>
                <div className={styles.header}>
                    <span className={styles.name}>{name}</span>
                    <span className={styles.role}>{role}</span>
                </div>

                <div className={styles.details}>
                    {wageType ? (
                        <span>시급 {hourlyWage.toLocaleString("ko-KR")}원</span>
                    ) : (
                        <span>월급 {hourlyWage.toLocaleString("ko-KR")}원</span>
                    )}
                </div>
            </div>
            {wageType ? <div className={styles.insurance}>
                주휴수당: {Math.floor(benefit).toLocaleString("ko-KR")}원
            </div> : <div className={styles.insurance}></div>}
            <div className={styles.insurance}>
                <span className={styles.details}>
                    4대보험{insurance ? "O " : "X"}
                </span>
                <div>
                    {insurance && (
                        <span className={styles.details}>
                            근로자 부담금:{" "}
                            {Math.floor(
                                ((totalSalary + benefit) / 100) * 9.39
                            ).toLocaleString("ko-KR")}
                            원{" "}
                        </span>
                    )}
                </div>
                <div>
                    {insurance && (
                        <span className={styles.details}>
                            고용자 부담금:{" "}
                            {Math.floor(
                                ((totalSalary + benefit) / 100) * 10.6
                            ).toLocaleString("ko-KR")}
                            원{" "}
                        </span>
                    )}
                </div>
                <div>
                    {insurance && (
                        <span className={styles.realAmount}>
                            실급여:{" "}
                            {Math.floor(
                                ((totalSalary + benefit) / 100) * 90.61
                            ).toLocaleString("ko-KR")}
                            원
                        </span>
                    )}
                </div>
            </div>
            <div className={styles.salary}>
                <span className={styles.amount}>
                    {Math.floor(totalSalary + benefit).toLocaleString("ko-KR")}
                    원
                </span>
                {wageType && (
                    <span className={styles.daily} onClick={detailHandler}>
                        일별급여보기
                    </span>
                )}
            </div>
        </div>
    );
};

export default SalaryList;
