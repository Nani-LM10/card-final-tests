import { useEffect, useState } from 'react';

import {
    PLAYER_CACHE_KEY,
    PLAYER_CACHE_EXPIRY_KEY,
    PLAYER_EXPIRY_DURATION_DAYS
} from '../constants/apiConstants'


const isCacheExpired = () => {
    const expiry = localStorage.getItem(PLAYER_CACHE_EXPIRY_KEY);
    if (!expiry) return true;

    const now = new Date().getTime();
    return now > parseInt(expiry, 10);
};


const storeDataWithExpiry = (data) => {
    localStorage.setItem(PLAYER_CACHE_KEY, JSON.stringify(data));
    const now = new Date().getTime();
    const expiryTime = now + PLAYER_EXPIRY_DURATION_DAYS * 24 * 60 * 60 * 1000;
    localStorage.setItem(PLAYER_CACHE_EXPIRY_KEY, expiryTime.toString());
};


const playerApiData = (apiUrl) => {
    const [readyCarddata, setReadyCardData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const cachedData = localStorage.getItem(PLAYER_CACHE_KEY);
                if (cachedData && !isCacheExpired()) {
                    setReadyCardData(JSON.parse(cachedData));
                    setLoading(false);
                    return;
                }

                const response = await fetch(apiUrl);
                const result = await response.json();
                console.log("player card Data fetched")
                setReadyCardData(result);
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

    return { readyCarddata, loading };
};

export default playerApiData;
