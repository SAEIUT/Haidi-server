// src/services/apiService.ts
import { API_CONFIG } from '../constants/API_CONFIG';

export const fetchData = async () => {
    const response = await fetch('https://api.example.com/data', {
        headers: {
            'Authorization': `Bearer ${API_CONFIG.mapbox}`
        }
    });
    return response.json();
};