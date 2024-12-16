import { useState, useEffect } from "react";
import Cookies from "js-cookie"

const useAuthToken = () => {
    const [authToken, setAuthToken] = useState(Cookies.get('token') || null);

    useEffect(() => {
        const handleCookieChange = () => {
            const newToken = Cookies.get('token');
            setAuthToken(newToken || null);
        }

        const intervalId = setInterval(handleCookieChange, 1500);

        return () => {
            clearInterval(intervalId);
        }
    }, []);

    return authToken;
}

export default useAuthToken;