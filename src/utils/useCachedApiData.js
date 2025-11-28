import { useEffect, useState } from 'react';

import {
    CACHE_KEY,
    CACHE_EXPIRY_KEY,
    EXPIRY_DURATION_DAYS
} from '../constants/apiConstants'

// import jsonData from '../../public/data/static_data';

const isCacheExpired = () => {
    const expiry = localStorage.getItem(CACHE_EXPIRY_KEY);
    if (!expiry) return true;

    const now = new Date().getTime();
    return now > parseInt(expiry, 10);
};

const storeDataWithExpiry = (data) => {
    localStorage.setItem(CACHE_KEY, JSON.stringify(data));
    const now = new Date().getTime();
    const expiryTime = now + EXPIRY_DURATION_DAYS * 24 * 60 * 60 * 1000;
    localStorage.setItem(CACHE_EXPIRY_KEY, expiryTime.toString());
};

const useCachedApiData = (apiUrl) => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const cachedData = localStorage.getItem(CACHE_KEY);
                if (cachedData && !isCacheExpired()) {
                    setData(JSON.parse(cachedData));
                    setLoading(false);
                    return;
                }

                const response = await fetch(apiUrl);
                const result = await response.json();
                console.log("Data fetched")
                setData(result);
                storeDataWithExpiry(result);
                setLoading(false);
            } catch (error) {
                console.error('API fetch failed:', error);
                // // Fallback to static jsonData if API fetch fails
                // setData(jsonData);
                setLoading(false);
            }
        };

        fetchData();
    }, [apiUrl]);

    return { data, loading };
};

export default useCachedApiData;
