// jwt 유틸리티 함수
export const parseJwt = (token) => {
    try {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(
            atob(base64)
                .split('')
                .map((c) => {
                    return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
                })
                .join('')
        );
        return JSON.parse(jsonPayload);
    } catch (error) {
        console.error("Failed to parse JWT:", error);
        return null;
    }
};

// jwt 토큰에서 유저 ID를 추출
export const getUserId = () => {
    const token = localStorage.getItem('jwt') || sessionStorage.getItem('jwt');
    console.log("Token retrieved:", token); // 토큰 확인용 로그
    if (!token) return null;
    const parsedToken = parseJwt(token);
    console.log("Parsed Token:", parsedToken); // 파싱된 토큰 로그
    return parsedToken ? parsedToken.sub : null;
};
// jwt 토큰에서 이메일을 추출
export const getUserEmail = () => {
    const token = localStorage.getItem('jwt') || sessionStorage.getItem('jwt');
    if (!token) return null;

    const parsedToken = parseJwt(token); // 토큰을 파싱하여 JSON 객체로 변환
    return parsedToken ? parsedToken.email : null; // 'email' 클레임 반환
};


// jwt 토큰 저장
export const saveUserToken = (token, rememberMe) => {
    console.log("Saving token:", token); // 토큰 확인용 로그
    if (rememberMe) {
        localStorage.setItem('jwt', token);
    } else {
        sessionStorage.setItem('jwt', token);
    }
    console.log("Token saved successfully"); // 저장 완료 로그
};

// jwt 토큰 삭제
export const removeUserToken = () => {
    console.log("Removing token"); // 토큰 삭제 로그
    localStorage.removeItem('jwt');
    sessionStorage.removeItem('jwt');
};

// 유저 ID 저장
export const saveUserId = (id) => {
    console.log("Saving user ID:", id); // 유저 ID 저장 로그
    localStorage.setItem('userId', id);
};

// 유저 ID 가져오기
export const getUserIdFromStorage = () => {
    const userId = localStorage.getItem('userId');
    console.log("User ID retrieved:", userId); // 유저 ID 가져오기 로그
    return userId;
};

// 유저 ID 삭제
export const removeUserId = () => {
    console.log("Removing user ID"); // 유저 ID 삭제 로그
    localStorage.removeItem('userId');
};
