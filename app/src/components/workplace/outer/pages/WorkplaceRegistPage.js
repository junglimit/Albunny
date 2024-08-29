import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styles2 from './WorkplaceRegistPage.module.scss';
import styles from '../../../login/pages/commonStyles.module.scss';
import useAuth from '../../../../hooks/useAuth';
import {BASE_URL} from "../../../../config/host-config";

const WorkplaceRegistPage = () => {
    const [businessNo, setBusinessNo] = useState('');
    const [workplaceName, setWorkplaceName] = useState('');
    const [workplaceAddressCity, setWorkplaceAddressCity] = useState('');
    const [workplaceAddressStreet, setWorkplaceAddressStreet] = useState('');
    const [workplaceAddressDetail, setWorkplaceAddressDetail] = useState('');
    const [workplacePassword, setWorkplacePassword] = useState('');
    const [workplaceSize, setWorkplaceSize] = useState(false);
    const [postalCode, setPostalCode] = useState('');
    const [error, setError] = useState('');
    const [isBusinessNoValid, setIsBusinessNoValid] = useState(true);
    const [isDuplicate, setIsDuplicate] = useState(false); // 중복 여부 관리
    
        const userId = useAuth();
    
        const formatBusinessNo = (value) => {
            const numbers = value.replace(/\D/g, '');
            if (numbers.length <= 3) {
                return numbers;
            } else if (numbers.length <= 5) {
                return `${numbers.slice(0, 3)}-${numbers.slice(3)}`;
            } else {
                return `${numbers.slice(0, 3)}-${numbers.slice(3, 5)}-${numbers.slice(5, 10)}`;
            }
        };
    
        const businessNoChangeHandler = (event) => {
            const value = event.target.value;
            const formattedValue = formatBusinessNo(value);
            setBusinessNo(formattedValue);
            checkBusinessNoDuplicate(value); // 포맷팅된 값을 제거한 원본 값으로 체크
        };
    
        const checkBusinessNoDuplicate = async (normalizedBusinessNo) => {
            console.log('Checking business number:', normalizedBusinessNo);
    
            if (normalizedBusinessNo.length !== 12) {
                setIsBusinessNoValid(false);
                setError('사업장 등록번호는 10자리여야 합니다.');
                return;
            }
            setIsBusinessNoValid(true);
    
            try {
                const response = await axios.get(`${BASE_URL}/workplace/checkBusinessNo/${userId}/${normalizedBusinessNo}`);
                if (response.data.exists) {
                    setIsDuplicate(true); // 중복 상태 설정
                    setError('이미 등록된 사업장 등록번호입니다.');
                } else {
                    setIsDuplicate(false); // 중복 상태 해제
                    setError('');
                }
            } catch (error) {
                console.error('Error checking business number:', error.response || error);
                setError('사업장 등록번호 검토 중 오류가 발생했습니다.');
            }
        };
    
        const changeHandler = (setter) => (event) => {
            setter(event.target.value);
        };
    
        const cancelHandler = () => {
            window.location.href = '/workplace';
        };
    
        const submitHandler = async (event) => {
            event.preventDefault();
    
            if (error) { // 중복이면 등록 중단
                alert('사업장 등록번호가 중복되었거나 올바르지 않습니다.');
                return;
            }
    
            try {
                const newWorkplace = {
                    businessNo,
                    workplaceName,
                    workplaceAddressCity,
                    workplaceAddressStreet,
                    workplaceAddressDetail,
                    workplacePassword,
                    workplaceSize,
                    postalCode,
                    masterId: userId
                };
    
                await axios.post(`${BASE_URL}/workplace/register`, newWorkplace);
                window.location.href = '/workplace';
            } catch (error) {
                console.error('Error registering workplace:', error);
                alert('등록에 실패했습니다. 다시 시도해 주세요.');
            }
        };  
    
        useEffect(() => {
            const script = document.createElement('script');
            script.src = "//t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js";
            script.async = true;
            script.onload = () => {
                if (window.daum && window.daum.Postcode) {
                    window.daum.Postcode = window.daum.Postcode || {};
                }
            };
            document.body.appendChild(script);
    
            return () => {
                document.body.removeChild(script);
            };
        }, []);
    
        const openAddressSearch = () => {
            if (window.daum && window.daum.Postcode) {
                new window.daum.Postcode({
                    oncomplete: function(data) {
                        setPostalCode(data.zonecode);
                        setWorkplaceAddressCity(data.sido);
                        setWorkplaceAddressStreet(data.roadAddress);
                        setWorkplaceAddressDetail('');
                        document.getElementById("sample6_detailAddress").focus();
                    }
                }).open();
            } else {
                console.error("Kakao Postcode script not loaded.");
            }
        };
    
        const errorStyle = (message) => {
            if (message === '이미 등록된 사업장 등록번호입니다.') {
                return styles.errorRed;
            }
            return styles.error;
        };
    
        return (
            <div className={styles.fullPageContainer}>
                <form onSubmit={submitHandler} className={styles.signUpContainer2}>
                    <div className={styles.formHeader}>
                        <h1 className={styles.signUpTitle2}>사업장 등록</h1>
                    </div>
        
                    <div className={styles2.formRow}>
                        <div className={styles2.formGroup1}>
                            <label htmlFor="businessNo">사업자 등록번호</label>
                            <input
                            className={styles.inputField}
                                type="text"
                                id="businessNo"
                                value={businessNo}
                                onChange={businessNoChangeHandler}
                                minLength={12}
                                maxLength={12}
                                placeholder="10자리 숫자만 입력하세요."
                                required
                            />
                            {/* 하나의 p 태그 내에서 오류 메시지 표시 */}
                            <p className={`${error === '이미 등록된 사업장 등록번호입니다.' ? styles2.errorRed : styles2.errorBlack}`}>
                                  {error ? error : "\u00A0"}
                            </p>
                        </div>
        
                        <div className={styles2.formGroup2}>
                            <label htmlFor="workplaceName">상호명</label>
                            <input
                            className={styles.inputField}
                                type="text"
                                id="workplaceName"
                                value={workplaceName}
                                placeholder='사업장명'
                                onChange={changeHandler(setWorkplaceName)}
                                required
                            />
                        </div>
                    </div>
        
        <div className={styles2.formRow}>
                    <div className={styles.addressSection}>
                        <label className={styles2.address} htmlFor="sample6_address">주소
                        <button type="button" className={styles2.searchButton} onClick={openAddressSearch}>
                            주소 찾기
                        </button>
                        </label>
                        <input 
                            type="text"
                            id="sample6_address"
                            placeholder="주소"
                            value={workplaceAddressStreet}
                            readOnly
                            className={styles2.addressinput}
                        />
                    </div>
        
                    <div className={styles2.formGroup3}>
                        <label htmlFor="sample6_detailAddress">상세주소</label>
                        <input
                        className={styles.inputField}
                            type="text"
                            id="sample6_detailAddress"
                            placeholder="상세주소"
                            value={workplaceAddressDetail}
                            onChange={changeHandler(setWorkplaceAddressDetail)}
                            required
                        />
                    </div>
        </div>
        
                    <div className={styles2.formRow}>
                        <div className={styles2.formGroup4}>
                            <label className={styles2.address} htmlFor="workplacePassword">간편 비밀번호</label>
                            <input
                                type="text"
                                id="workplacePassword"
                                value={workplacePassword}
                                onChange={changeHandler(setWorkplacePassword)}
                                minLength={4}
                                maxLength={4}
                                placeholder="4자리 숫자를 입력하세요."
                                className={styles2.addressinput}
                                required
                            />
                        </div>
                        <div className={styles2.formGroup5}>
                            <label className={styles.sizeLabel} htmlFor="workplaceSize">사업장 규모</label>
                            <select
                                id="workplaceSize"
                                value={workplaceSize}
                                onChange={e => setWorkplaceSize(e.target.value === 'true')}
                            >
                                <option value={false}>5인 미만</option>
                                <option value={true}>5인 이상</option>
                            </select>
                        </div>
                    </div>
        
                    <div className={styles2.buttonContainer}>
                        <button type="button" className={styles.cancelButton} onClick={cancelHandler}>
                            취소
                        </button>
                        <button type="submit" className={styles.submitButton2}>등록</button>
                    </div>
                </form>
            </div>
        );
        
    };
export default WorkplaceRegistPage;
