// src/components/DataComponent.tsx
import React, { useEffect, useState } from 'react';
import { fetchData } from '../services/apiService';

const DataComponent = () => {
    const [data, setData] = useState(null);

    useEffect(() => {
        fetchData().then(setData);
    }, []);

    return (
        <div>
            {data ? <pre>{JSON.stringify(data, null, 2)}</pre> : 'Chargement...'}
        </div>
    );
};

export default DataComponent;