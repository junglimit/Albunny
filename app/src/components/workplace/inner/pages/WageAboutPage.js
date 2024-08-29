import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { wageActions } from "../../../../store/wage-slice";
import WageAboutHeader from "../layout/WageAboutHeader";
import WageAboutBody from "../layout/WageAboutBody";
import { Link, useLocation, useNavigate } from "react-router-dom";
import styles from "./WageManagePage.module.scss";
import { IoArrowBackCircleSharp } from "react-icons/io5";
import {BASE_URL} from "../../../../config/host-config";

const WageAboutPage = () => {
    const month = useSelector((state) => state.wage.month);
    const year = useSelector((state) => state.wage.year);
    const dispatch = useDispatch();

    const [slaveName, setSlaveName] = useState("");
    const location = useLocation();
    const [slaveId, setSlaveId] = useState(null);

    const navigate = useNavigate();
    const backHandler = e => {
        navigate("../wage-manage");
    }

    useEffect(() => {
        const state = location.state;
        if (state && state.slaveId) {
            setSlaveId(state.slaveId);
        }
    }, [location]);
    

    useEffect(() => {
        const fetchData = async () => {
            if (!slaveId) return;

            const payload = {
                slaveId: slaveId,
                ym: `${year}-${month < 10 ? "0" + month : month}`,
            };
            try {
                const res = await fetch(`${BASE_URL}/wage/slave`, {
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
                console.log("wageInsuranceTestByJson");
                console.log(json);
                dispatch(wageActions.setSlaveData({ slaveData: json }));
                setSlaveName(json.slaveName);
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        fetchData();
    }, [slaveId, month, year, dispatch]);

    return (
        <>
            <div className={styles.salaryTitle}>
                <h1>{slaveName}님의 급여</h1>
                <button className={styles.backButton} onClick={backHandler}>업장 급여</button>
            </div>
            <div className={styles.salaryBodyContainer}>
                <WageAboutHeader />
                <WageAboutBody />
            </div>
        </>
    );
};

export default WageAboutPage;
