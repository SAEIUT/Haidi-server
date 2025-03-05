import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import MultimodalTransit from './components/MultimodalTransit';
import MyComponent from './components/MyComponent';
import IndexOne from './index/index-one';
import IndexTwo from './index/index-two';
import IndexThree from './index/index-three';
import IndexFour from './index/index-four';
import IndexFive from './index/index-five';
import IndexSix from './index/index-six';
import Signup from './pages/Signup';
import Login from './pages/Login';
import Home from './pages/Home';
import MapComponent from './components/MapComponent';
import { Place, Journey } from './types/customTypes'; // Importez les types


const App: React.FC = () => {
    const location = useLocation();

    // Récupérer les données de l'état de la route (si elles existent)
    const { selectedDeparture, selectedArrival, selectedJourney } = location.state as {
        selectedDeparture: Place | null;
        selectedArrival: Place | null;
        selectedJourney: Journey | null;
    } || {
        selectedDeparture: null,
        selectedArrival: null,
        selectedJourney: null,
    };

    return (
        <Routes>
            <Route path="/" element={<IndexOne />} />
            <Route path="/index-two" element={<IndexTwo />} />
            <Route path="/index-three" element={<IndexThree />} />
            <Route path="/index-four" element={<IndexFour />} />
            <Route path="/index-five" element={<IndexFive />} />
            <Route path="/index-six" element={<IndexSix />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/login" element={<Login />} />
            <Route path="/home" element={<Home />} />
            <Route path="/multimodal-transit" element={<MultimodalTransit />} />
            <Route path="/stations" element={<MyComponent />} />
            <Route
                path="/map"
                element={
                    <MapComponent
                        selectedDeparture={selectedDeparture}
                        selectedArrival={selectedArrival}
                        selectedJourney={selectedJourney}
                    />
                }
            />
        </Routes>
    );
};

export default App;