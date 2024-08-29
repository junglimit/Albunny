import React, { useState } from "react";
import styles from "./SalaryBody.module.scss";
import SalaryList from "./SalaryList";
import { useDispatch, useSelector } from "react-redux";
import { wageActions } from "../../../../store/wage-slice";
import { formatMonth } from "./SalaryHeader";
import SalaryDetailList from "./SalaryDetailList";

const WageAboutBody = () => {
    const month = useSelector((state) => state.wage.month);
    const slaveData = useSelector((state) => state.wage.slaveData);
    
    
    
  return (
    <>
        {/* <h2>{slaveData.slaveName}님의 일별 급여</h2> */}
        <div className={styles.salaryBody}>
            {slaveData.dtoList.map((dto, index) => (
                <SalaryDetailList 
                key={slaveData.dtoList.length - index}
                workingTime={dto.workingTime}
                workDate={dto.scheduleLogDate}
                salary={dto.salary}
                slaveName={slaveData.slaveName}
                slaveId={slaveData.slaveId}
                bonusAmount={dto.bonusAmount}
                />
            ))

            }
        </div>
    </>
  );
};

export default WageAboutBody;
