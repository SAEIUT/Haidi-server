import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { API_CONFIG } from '../constants/API_CONFIG'; // Importation de la configuration API

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        if (!email || !password) {
            setError('Veuillez remplir tous les champs');
            setLoading(false);
            return;
        }

        try {
            // Appel API d'authentification (inspiré du code mobile)
            const response = await fetch(`${API_CONFIG.BASE_URL}/firebase/user/sign-in`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });
            
            const data = await response.json();
            
            if (response.ok && data.user && data.user.uid) {
                // Stocker l'ID utilisateur dans localStorage (équivalent web de AsyncStorage)
                localStorage.setItem('userUid', data.user.uid);
                
                // Rediriger vers la page d'accueil
                navigate('/home');
            } else {
                setError('Identifiants incorrects. Veuillez réessayer.');
            }
        } catch (error) {
            setError('Impossible de se connecter. Vérifiez votre connexion internet.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col min-h-screen">

            {/* Contenu de la page de connexion */}
            <main className="flex-grow flex items-center justify-center p-4">
                <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
                    <h2 className="text-2xl font-bold mb-6 text-center">Connexion</h2>

                    {/* Afficher les erreurs */}
                    {error && <p className="text-red-500 text-center mb-4">{error}</p>}

                    {/* Formulaire de connexion */}
                    <form onSubmit={handleLogin} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Email</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Adresse email"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Mot de passe</label>
                            <div className="relative">
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="Mot de passe"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute inset-y-0 right-0 px-3 py-2 text-sm font-medium text-gray-500 hover:text-gray-700"
                                >
                                    {showPassword ? 'Masquer' : 'Afficher'}
                                </button>
                            </div>
                        </div>

                        {/* Lien mot de passe oublié (ajouté depuis la version mobile) */}
                        <div className="flex justify-end">
                            <Link to="/forgot-password" className="text-sm text-blue-500 hover:text-blue-600">
                                Mot de passe oublié ?
                            </Link>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-[#9ca3af] text-white p-1.5 rounded-md hover:bg-[#7f8a9a] focus:outline-none focus:ring-2 focus:ring-[#9ca3af] disabled:bg-[#7f8a9a] text-sm"
                        >
                            {loading ? 'Chargement...' : 'Se connecter'}
                        </button>
                    </form>

                    {/* Lien vers la page d'inscription */}
                    <div className="mt-4 text-center">
                        <p>
                            Vous n'avez pas de compte ?{' '}
                            <Link to="/signup" className="text-blue-500 hover:text-blue-600">
                                Inscrivez-vous ici
                            </Link>
                        </p>
                    </div>
                </div>
            </main>

        </div>
    );
};

export default Login;