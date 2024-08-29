import React from "react";
import { createBrowserRouter } from "react-router-dom";
import RootLayout from "../components/app-layout/RootLayout";
import ErrorPage from "../components/app-pages/ErrorPage";
import Home from "../components/app-pages/Home";
import Login from "../components/login/pages/Login";
import LoginMain from "../components/login/pages/LoginMain";
import SignUpPage from "../components/login/pages/SignUpPage";
import FindPwPage from "../components/login/pages/FindPwPage";
import ModifyPwPage from "../components/login/pages/ModifyPwPage";
import WorkplaceListPage from "../components/workplace/outer/pages/WorkplaceListPage";
import Workplace from "../components/workplace/outer/pages/Workplace";
import WorkplaceModifyPage from "../components/workplace/outer/pages/WorkplaceModifyPage";
import WorkplaceRegistPage from "../components/workplace/outer/pages/WorkplaceRegistPage";
import FullScreenGrayBackground from "../components/workplace/inner/layout/FullScreenGrayBackground";
import InnerMainPage from "../components/workplace/inner/pages/InnerMainPage";
import SlaveRegistPage from "../components/workplace/inner/pages/SlaveRegistPage";
import SlaveInfoPage from "../components/workplace/inner/pages/SlaveInfoPage";
import SlaveModifyPage from "../components/workplace/inner/pages/SlaveModifyPage";
import SlaveManagePage from "../components/workplace/inner/pages/SlaveManagePage";
import WageManagePage from "../components/workplace/inner/pages/WageManagePage";
import WageAboutPage from "../components/workplace/inner/pages/WageAboutPage";
import ScheduleManagePage from "../components/workplace/inner/pages/ScheduleManagePage";
import NoticePage from "../components/workplace/inner/pages/NoticePage";
import ScheduleAddPage from "../components/workplace/inner/pages/ScheduleAddPage";
import NoticeRegisterPage from "../components/workplace/inner/pages/NoticeRegisterPage";
import CommuteManage from "../components/workplace/inner/pages/CommuteManage";
import CommuteRecord from "../components/workplace/inner/pages/CommuteRecord";
import NoticeEditPage from "../components/workplace/inner/pages/NoticeEditPage";
import RetirePage from "../components/login/pages/RetirePage";
import WorkplacePwdVerify from "../components/workplace/outer/pages/WorkplacePwdVerify";
import RecoverPage from "../components/login/pages/RecoverPage";

const loginRouter = [
    {
        // 로그인 페이지
        index: true,
        element: <LoginMain />,
    },
    {
        // 회원가입 페이지
        path: "sign-up",
        element: <SignUpPage />,
    },
    {
        // 비밀번호 찾기 페이지
        path: "find-pw",
        element: <FindPwPage />,
    },
    {
        // 비밀번호 수정 페이지
        path: "modify-pw",
        element: <ModifyPwPage />,
    },
    {
        // 회원탈퇴 페이지
        path: "retire",
        element: <RetirePage />,
    },
    {
        // 회원복구 페이지
        path: "recover",
        element: <RecoverPage />,
    }
];

const workplaceRouter = [
    {
        // 업장리스트 페이지
        index: true,
        element: <WorkplaceListPage />,
    },
    {
        // 업장정보수정 페이지
        path: "modify",
        element: <WorkplaceModifyPage />,
    },
    {
        // 업장 등록 페이지
        path: "regist",
        element: <WorkplaceRegistPage />,
    },
        // 업장 간편비밀번호 인증 페이지 
    {
        path: "pwdverify",
        element: <WorkplacePwdVerify />,
    },
];

const detailRouter = [
    {   // 업장관리 시작점
        index: true,
        element: <InnerMainPage />
    },
    {   // 직원관리 페이지
        path: "slave-manage",
        element: <SlaveManagePage />,
    },
    {   // 직원상세정보 페이지
        path: "slave-info",
        element: <SlaveInfoPage />,
    },
    {   // 직원등록 페이지
        path: "slave-regist",
        element: <SlaveRegistPage />,
    },
    {   // 직원수정 페이지
        path: "slave-modify",
        element: <SlaveModifyPage />,
    },
    {   // 급여관리 페이지
        path: "wage-manage",
        element: <WageManagePage />,
    },
    {   // 직원별급여 페이지
        path: "wage-about",
        element: <WageAboutPage />,
    },
    {   // 일정관리 페이지
        path: "schedule-manage",
        element: <ScheduleManagePage />,
    },
    {   // 일정추가 페이지
        path: "schedule-add",
        element: <ScheduleAddPage />,
    },
    {   // 공지사항 게시판 페이지
        path: "notice",
        element: <NoticePage />,
    },
    {   // 공지사항 등록화면
        path: "notice-register",
        element: <NoticeRegisterPage />,
    },
    {   // 공지사항 수정화면
        path: "notice-edit",
        element: <NoticeEditPage />,
    },
    {   // 출퇴근 관리 페이지
        path: "commute-manage",
        element: <CommuteManage />,
    },
    {
        path: "commute-record",
        element: <CommuteRecord />,
    },
];

export const router = createBrowserRouter([
    {
        path: "/",
        element: <RootLayout />,
        errorElement: <ErrorPage />,
        children: [
            {
                // 설명충 페이지
                path: "/",
                element: <Home />,
            },
            {
                // 로그인 관련 페이지
                path: "/login",
                element: <Login />,
                children: loginRouter,
            },
            {
                // 업장 관련 페이지
                path: "/workplace",
                element: <Workplace />,
                children: workplaceRouter,
            },
            {   // 업장관리 페이지
                path: "/detail",
                element: <FullScreenGrayBackground />,
                children: detailRouter,
            },
        ],
    },
]);
