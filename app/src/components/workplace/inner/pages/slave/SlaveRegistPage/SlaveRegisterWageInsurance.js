import React, { useEffect, useState } from 'react'
import styles from './SlaveRegisterWageInsurance.module.scss';

const SlaveRegisterWageInsurance = ({ onApply }) => {

  // 4대보험 적용여부선택 --> 적용 or 미적용 체크박스 상태값 관리
  const [slaveWageInsurance, setSlaveWageInsurance] = useState('');

  // 4대보험 적용버튼 클릭이벤트
  const appliedHandler = e => {

      // 이미 적용으로 체크된 경우 재클릭이기 때문에 선택 초기화 
      if (slaveWageInsurance === true) {
        setSlaveWageInsurance('');
        
        // 아무것도 체크되지 않았을 경우 또는 미적용이 클릭됐었던 경우 적용으로 변경
      } else {
        setSlaveWageInsurance(true);
      };
  };

  // 4대보험 미적용버튼 클릭이벤트
  const notAppliedHandler = e => {

      // 이미 미적용으로 체크된 경우 재클릭이기 때문에 선택 초기화 
      if (slaveWageInsurance === false) {
        setSlaveWageInsurance('');

        // 아무것도 체크되지 않았을 경우 또는 적용이 클릭됐었던 경우 미적용으로 변경
      } else {
        setSlaveWageInsurance(false);
      };
  };

  //-------------------------------------------------

  // 4대보험 적용여부 체크박스 상태값이 업데이트될 때 마다 확인하기
  useEffect (() => {

    // 급여리스트에서 내려온 함수에 4대보험 적용여부 담아서 올려보내기
    onApply(slaveWageInsurance);
  
  }, [slaveWageInsurance, onApply]);

  //-------------------------------------------------

  return (
    <>
      <div className={styles['slaveRegistPageWageInsurance-box']} >
        <div className={styles['slaveRegistPageWageInsurance-title']} > 4대보험여부 </div>
        <div className={styles['slaveRegistPageWageInsurance-contentBox']} >
          <label htmlFor="applied" className={styles['slaveRegistPageWageInsurance-content']} >
            적용
            <input type="checkbox" checked={slaveWageInsurance === true} className={styles['slaveRegistPageWageInsurance-input']} onChange={appliedHandler} />
          </label>

          <label htmlFor="notApplied" className={styles['slaveRegistPageWageInsurance-content']} >
            적용안함
            <input type="checkbox" checked={slaveWageInsurance === false} className={styles['slaveRegistPageWageInsurance-input']} onChange={notAppliedHandler} />
          </label>
        </div>
      </div>
    </>
  )
}

export default SlaveRegisterWageInsurance