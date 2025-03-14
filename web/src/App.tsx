import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import HomeNavbar from './components/HomeNavbar';
import MultimodalTransit from './components/Map/MultimodalTransit';
import MyComponent from './components/Map/MyComponent';
import IndexOne from './index/index-one';
import IndexTwo from './index/index-two';
import IndexThree from './index/index-three';
import IndexFour from './index/index-four';
import IndexFive from './index/index-five';
import IndexSix from './index/index-six';
import Signup from './pages/Signup';
import Login from './pages/Login';
import Home from './pages/Home';
import MapComponent from './components/Map/MapComponent';
import { Place, Journey } from './types/customTypes'; // Importez les types
import MesTrajets from './pages/MesTrajets';
import Profile from './pages/Profile';
import Footer from './components/footer'; // Assurez-vous d'importer le composant Footer

const App: React.FC = () => {
    const location = useLocation();
    const isVitrine = location.pathname === '/'; // Remplacez par le chemin de votre page vitrine si différent

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
        <div className="flex flex-col min-h-screen bg-gray-100">
            {!isVitrine && <HomeNavbar navLight={true} bgLight={true} />}
            <div className="flex-grow pt-16">
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
                    <Route path="/mes-trajets" element={<MesTrajets />} />
                    <Route path="/profile" element={<Profile />} />
                </Routes>
            </div>
            <Footer />
        </div>
    );
};

export default App;
