import {useState, useCallback} from 'react';

export const useHttp = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
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

            setLoading(false);

            return data;
        } catch (e) {
            setLoading(false);
            setError(e.message);
            throw e;
        }
    }, []);

    const clearError = useCallback(() => setError(null), []);
    
    return {loading, error, request, clearError};
} 