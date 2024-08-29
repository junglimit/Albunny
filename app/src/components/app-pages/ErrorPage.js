import React from "react";
import MainHeader from "../app-layout/MainHeader";
import { Link, useRouteError } from "react-router-dom";

const ErrorPage = () => {
    const error = useRouteError();

    let errorMessage = "서버와의 연결이 원활하지 않습니다.";

    if (error.status === 400) {
        errorMessage = error.data.message;
    }

    if (error.status === 404) {
        errorMessage = "페이지를 찾을 수 없습니다. URL을 확인하세요!";
    }

    return (
        <>
            <main>
                <h1>에러가 발생했습니다!</h1>
                <p>{errorMessage}</p>
                <Link to="/">홈</Link>
            </main>
        </>
    );
};

export default ErrorPage;
