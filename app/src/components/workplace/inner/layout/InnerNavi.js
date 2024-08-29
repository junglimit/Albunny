import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import styles from "./InnerNavi.module.scss";
import { useSelector } from "react-redux";
import {BASE_URL} from "../../../../config/host-config";

const InnerNavi = () => {
  const workplaceId = localStorage.getItem("workplaceId");
  const [workplaceData, setWorkplaceData] = useState({});
  const currentPage = useSelector((state) => state.workplace.currentPage);
  const navigate = useNavigate();

  // useEffect(() => {
  //   const fetchData = async () => {
  //     const response = await fetch(
  //       `${BASE_URL}/workplace/${workplaceId}`
  //     );
  //     const json = await response.json();
  //     setWorkplaceData(json);
  //   };
  //   fetchData();
  // }, []);

  useEffect(() => {
    const fetchData = async () => {
      if (workplaceId) {  // workplaceId가 존재할 때만 요청 !
        try {
          const response = await fetch(`${BASE_URL}/workplace/${workplaceId}`);
          if (!response.ok) { 
            return;
          }
          const json = await response.json();
          setWorkplaceData(json);
      } catch (error) {
        }
      } else {
      }
    };
    fetchData();
  }, [workplaceId]); // 사업장 아이디 담아와야 /detail 페이지로 접근시 막을 수 있음
  

  const detailHandler = (e) => {
    e.preventDefault();
    if (currentPage !== 5) {
      navigate("/detail");
    } else {
      localStorage.setItem("action", "detail");
      navigate("/workplace/pwdverify");
    }
  };
  const slaveHandler = (e) => {
    e.preventDefault();
    if (currentPage !== 5) {
      navigate("slave-manage");
    } else {
      localStorage.setItem("action", "slave");
      navigate("/workplace/pwdverify");
    }
  };
  const wageHandler = (e) => {
    e.preventDefault();
    if (currentPage !== 5) {
      navigate("wage-manage");
    } else {
      localStorage.setItem("action", "wage");
      navigate("/workplace/pwdverify");
    }
  };
  const scheduleHandler = (e) => {
    e.preventDefault();
    if (currentPage !== 5) {
      navigate("schedule-manage");
    } else {
      localStorage.setItem("action", "schedule");
      navigate("/workplace/pwdverify");
    }
  };
  const noticeHandler = (e) => {
    e.preventDefault();
    if (currentPage !== 5) {
      navigate("notice");
    } else {
      localStorage.setItem("action", "notice");
      navigate("/workplace/pwdverify");
    }
  };
  const commuteHandler = (e) => {
    e.preventDefault();
    navigate("commute-manage", { replace: true });
  };
  return (
    <div className={styles.fullScreen}>
      <a
        className={`${styles["link-text"]} ${styles["logo-box"]}`}
        onClick={detailHandler}
      >
        <img
          src={`${process.env.PUBLIC_URL}/images/albunny_logo.png`}
          alt="Albunny Logo"
        />
      </a>
      <li className={styles["profile-box"]}>
        <div className={styles.workplaceName}>
          {" "}
          {workplaceData.workplaceName}{" "}
        </div>
        {/*<div> 안녕하세요. </div>*/}
        <div className={styles.workplaceAddress}>
          {" "}
          {workplaceData.workplaceAddressStreet}{" "}
          {workplaceData.workplaceAddressDetail}
        </div>
      </li>

      <a
        className={`${styles["link-text"]} ${styles["leftMenu-box"]} ${
          currentPage == 1 && styles["active"]
        }`}
        onClick={slaveHandler}
      >
        <img src={`${process.env.PUBLIC_URL}/images/slave.png`} alt="Example" />
        직원관리
      </a>

      <a
        className={`${styles["link-text"]} ${styles["leftMenu-box"]} ${
          currentPage == 2 && styles["active"]
        }`}
        onClick={wageHandler}
      >
        <img src={`${process.env.PUBLIC_URL}/images/wage.png`} alt="Example" />
        급여관리
      </a>

      <a
        className={`${styles["link-text"]} ${styles["leftMenu-box"]} ${
          currentPage == 3 && styles["active"]
        }`}
        onClick={scheduleHandler}
      >
        <img
          src={`${process.env.PUBLIC_URL}/images/schedule.png`}
          alt="Example"
        />
        일정관리
      </a>

      <a
        className={`${styles["link-text"]} ${styles["leftMenu-box"]} ${
          currentPage == 4 && styles["active"]
        }`}
        onClick={noticeHandler}
      >
        <img
          src={`${process.env.PUBLIC_URL}/images/notice.png`}
          alt="Example"
        />
        공지사항
      </a>

      <a
        className={`${styles["link-text"]} ${styles["leftMenu-box"]} ${
          currentPage == 5 && styles["active"]
        }`}
        onClick={commuteHandler}
      >
        <img
          src={`${process.env.PUBLIC_URL}/images/commute.png`}
          alt="Example"
        />
        <span className={styles.linkSpan}>출퇴근관리</span>
      </a>
    </div>
  );
};

export default InnerNavi;
