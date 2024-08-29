import { useState, useEffect } from 'react';
import { getUserId, parseJwt } from '../utils/auth';

const useAuth = () => {
    const [userId, setUserId] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem('jwt') || sessionStorage.getItem('jwt');
        if (token) {
            const parsedToken = parseJwt(token);
            if (parsedToken && parsedToken.sub) {
                setUserId(parsedToken.sub);
            }
        }
    }, []);

    return userId;
};

export default useAuth;
