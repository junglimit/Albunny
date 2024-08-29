
const LOCAL_PORT = 8877; // 백엔드 로컬 서버 포트번호

// 예를들어 지금 요청하는 브라우저의 host가 http://localhost:3000 이라면
// hostname은 localhost만 리턴
// https://www.naver.com => hostname은 www.naver.com만 리턴
const clientHostName = window.location.hostname;

let backendHostName;


if (clientHostName === 'localhost') {
    backendHostName = 'http://localhost:' + LOCAL_PORT;
} else {
    backendHostName = 'http://43.202.122.135:' + LOCAL_PORT;
}

export const BASE_URL = backendHostName;
