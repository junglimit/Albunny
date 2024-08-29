import React, { useEffect, useState } from 'react';
import axios from 'axios';
import styles from '../../../login/pages/commonStyles.module.scss';
import { Link, useNavigate } from 'react-router-dom';
import MainHeader from "../../../app-layout/MainHeader";
import { removeUserToken } from "../../../../utils/auth";
import useAuth from '../../../../hooks/useAuth';
import styles2 from './WorkplaceListPage.module.scss'
import {BASE_URL} from "../../../../config/host-config";

const WorkplaceListPage = () => {
    const navigate = useNavigate();

    // 사장 아이디
    const userId = useAuth();
    const [workplaces, setWorkplaces] = useState([]);
    const [allWorkplaces, setAllWorkplaces] = useState([]); // 검색 기능을 위해 모든 사업장을 저장할 상태 추가

    // 페이징 처리
    const [totalPages, setTotalPage] = useState(0); // 총 페이지 수
    const [currentPage, setCurrentPage] = useState(1); // 현재 페이지 번호
    const workplacesPerPage = 3; // 한 페이지에 보여줄 사업장 수
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    // 검색창 상태 +
    const [searchWorkplace, setSearchWorkplace] = useState('');

    // 모든 사업장을 불러오는 함수
    const fetchAllWorkplaces = async () => {
        if (userId) {
            try {
                const response = await axios.get(`${BASE_URL}/workplace/list/${userId}`, {
                    params: {
                        page: 0, // 사업장 전체를 불러오기 위해 페이지 번호는 0부터
                        size: 1000 
                    }
                });
                setAllWorkplaces(response.data.workplaces);
            } catch (error) {
                console.error('Error fetching all workplaces:', error);
            }
        }
    };

    // 현재 페이지의 사업장을 불러오는 함수 
    const fetchWorkplaces = async (page) => {
        if (userId) { // userId가 존재할 때만 요청
            try {
                const response = await axios.get(`${BASE_URL}/workplace/list/${userId}`, {
                    params: {
                        page: page - 1, // 페이지 번호는 0부터 시작하므로 -1
                        size: workplacesPerPage
                    }
                });
                    // JSON 응답이 제대로 되었는지 확인
            if (response.data && response.data.workplaces) {
                setWorkplaces(response.data.workplaces);
                setTotalPage(response.data.totalPages);
            } else {
                console.error('Invalid JSON response:', response.data);
                // 필요 시 사용자에게 오류 메시지를 표시하거나 기본 값을 설정
            }
            } catch (error) {
                    console.error('Error fetching workplace data:', error);
                    if (error.response && error.response.data) {
                        // 서버 응답이 있는 경우 처리
                        console.error('Server responded with:', error.response.data);
                    } else {
                        // 네트워크 또는 다른 문제로 인한 예외 처리
                        console.error('Network or parsing error:', error.message);
                    }
            }
        }
    };

    useEffect(() => {
        if (searchWorkplace) {
            fetchAllWorkplaces(); // 검색어가 있을 때 모든 사업장을 불러옴
        } else {
            fetchWorkplaces(currentPage); // 검색어가 없을 때는 페이징을 적용한 기존 사업장 리스트 
        }
    }, [userId, currentPage, searchWorkplace]);

    // 페이지 번호를 변경된 현재 페이지 번호로 상태 변경하는 함수 +
    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    // 특정 업장에 메인페이지로 or 수정 페이지에 따라 액션 부여
    const handleWorkplaceSelect = (id) => {
        console.log("로컬스토리지 사업장 아이디: ", id);
        localStorage.setItem('workplaceId', id);
        localStorage.setItem('action', 'view');
        navigate('/workplace/pwdverify');
      };
    
    const handleModifyClick = (id) => {
        localStorage.setItem('workplaceId', id);
        localStorage.setItem('action', 'modify');
        navigate('/workplace/pwdverify');
      };

      const deleteHandler = async (id, name) => {
        // 사업장 이름 입력받기
        const inputName = window.prompt(`[${name}] 사업장을 삭제하시려면, 사업장 이름을 정확히 입력하세요:`);
    
        // 입력한 이름이 실제 사업장 이름과 일치하는지 확인
        if (inputName === name) {
            const confirmed = window.confirm(`[${name}] 사업장을 정말로 삭제합니다.`);
            if (confirmed) {
                try {
                    await axios.delete(`${BASE_URL}/workplace/delete/${id}`);
                    if (searchWorkplace) {
                        fetchAllWorkplaces(); // 삭제 후 검색어가 있을 때 전체 불러오기
                    } else {
                        fetchWorkplaces(currentPage); // 삭제 후 페이징 적용된 데이터 불러오기
                    }
                } catch (error) {
                    console.error('Error deleting workplace:', error);
                }
            }
        } else {
            alert('사업장 이름이 일치하지 않습니다. 삭제를 취소합니다.');
        }
    };

    // 검색창에서 필터링된 사업장 목록 조회 ! - 검색된 사업장이 참이면 전체사업장에서 필터링되어 검색값에 포함된 사업장 조회
    const filteredWorkplaces = searchWorkplace ?
               allWorkplaces.filter(workplace => workplace.workplaceName.toLowerCase().includes(searchWorkplace.toLowerCase())) : workplaces;

    // const setIdHandler = (workplaceId, e) => {
    //     console.log("bind함수 확인용: ", workplaceId);
    //     dispatch(workplaceActions.setWorkplaceId({workplaceId}));
    // }

    // 새로고침 이슈로 로컬스토리지 가져오는 걸로 정정
    // const setIdHandler = (workplaceId, e) => {
    //     console.log("로컬스토리지 사업장 아이디: ", workplaceId);
    //     localStorage.setItem('workplaceId', workplaceId);
    //     localStorage.setItem('action', 'modify');   // action을 modify 수정 페이지로 설정
    //     navigate('/workplace/pwdverify'); // 간편비밀번호 입력 페이지로 이동
    // };

    return (
        <div className={styles2.container}>

            <div className={styles2.workplaceWrap}>

                <h1 className={styles.signUpTitle}>사업장 목록</h1>

                <div className={styles2.header}>
                    {/* 사업장 검색창 추가 */}
                <div className={styles2.searchContainer}>
                    <input
                        type="text"
                        placeholder="사업장 검색"
                        className={styles2.searchInput}
                        value={searchWorkplace}
                        onChange={(e) => setSearchWorkplace(e.target.value)}
                    />
                </div>
                <Link to="regist">
                    <button className={styles2.registerButton}>사업장 등록</button>
                </Link>
                </div>

                {filteredWorkplaces.length === 0 ? (
                    <p className={styles2.notworkplace}>등록된 사업장이 존재하지 않습니다 😣</p>
                ) : (
                    <ul className={styles2.list}>
                        {filteredWorkplaces.map(workplace => (
                            <li key={workplace.id} className={styles2.listItem}>
                                <Link to="#" className={styles2.link} onClick={() => handleWorkplaceSelect(workplace.id)}>
                                    <h2 className={styles2.name}>{workplace.workplaceName}</h2>
                                    <p><strong>주소: </strong>{`${workplace.workplaceAddressStreet} ${workplace.workplaceAddressDetail}`}</p>
                                    <p><strong>사업장 규모: </strong>{workplace.workplaceSize ? '5인 이상' : '5인 미만'}</p>
                                    {/* <div className={styles.wrap}> */}
                                    <p className={styles2.date}><strong>등록일: </strong>{new Date(workplace.workplaceCreatedAt).toLocaleDateString()}</p>
                                </Link>
                                <div className={styles2.buttonGroup}>
                                    <button className={styles.cancelButton}
                                        onClick={(e) => {
                                            e.preventDefault(); 
                                            deleteHandler(workplace.id, workplace.workplaceName)}}>
                                          사업장 삭제
                                    </button>
                                    <button className={styles.submitButton2}
                                        onClick={() => handleModifyClick(workplace.id)}>
                                           사업장 수정
                                    </button>
                                </div>
                            </li>
                        ))}
                    </ul>
                )}

            {/* 사업장 목록 페이징 버튼 */}
                <div className={styles2.pagination}>
                    {Array.from({ length: totalPages }, (_, index) => (
                        <button
                            key={index + 1}
                            className={`${styles2.pageButton} ${currentPage === index + 1 ? styles2.activePage : ''}`}
                            onClick={() => handlePageChange(index + 1)}
                        >
                            {index + 1}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default WorkplaceListPage;
