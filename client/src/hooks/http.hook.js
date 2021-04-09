import {useCallback} from 'react';

export const useHttp = () => {
    const request = useCallback( async (url, method = 'GET', body = null, headers = {}) => {
        try {
            if (body) {
                body = JSON.stringify(body);
                headers['Content-Type'] = 'application/json';
            }

            // const res = await fetch(`http://localhost:5000${url}`, {method, body, headers});
            const res = await fetch(`https://kalinaserver.herokuapp.com${url}`, {method, body, headers});
            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.message || 'Something goes wrong');
            }

            return data;
        } catch (e) {
            throw e;
        }
    }, []);
    
    return {request};
} 