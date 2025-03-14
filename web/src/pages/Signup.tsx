import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Footer from '../components/footer';
import Navbar from '../components/navbar';
import { auth } from '../firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { API_CONFIG } from '../constants/API_CONFIG';


const Signup = () => {
    // États pour les champs du formulaire
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [birthdate, setBirthdate] = useState('');
    const [civility, setCivility] = useState('');
    const [tel, setTel] = useState('');
    const [note, setNote] = useState('');
    const [handicap, setHandicap] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    // Hook pour la navigation
    const navigate = useNavigate();

    // Fonction pour formater la date de naissance au format ISO
    const formatISOBirthdate = (date: string) => {
        return new Date(date).toISOString().split('T')[0]; // Format : YYYY-MM-DD
    };

    // Fonction pour vérifier si l'email existe déjà
    const checkEmailExists = async (email: string): Promise<boolean> => {
        try {
            const response = await fetch(`${API_CONFIG.BASE_URL}/firebase/user/check-email`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email }),
            });

            if (!response.ok) {
                console.warn(`Erreur API: ${response.status} - ${await response.text()}`);
                return false; // On continue si le service n'est pas disponible
            }

            const data = await response.json();
            return data.exists;
        } catch (error) {
            console.error("Erreur lors de la vérification de l'email :", error);
            // En cas d'erreur de fetch, on continue plutôt que de bloquer
            return false;
        }
    };

    // Fonction pour gérer la soumission du formulaire
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            // Validation des champs obligatoires
            if (!civility || !firstName || !lastName || !birthdate || !email || !tel || !password || !confirmPassword) {
                alert('Veuillez remplir tous les champs obligatoires.');
                setIsLoading(false);
                return;
            }

            // Vérification que les mots de passe correspondent
            if (password !== confirmPassword) {
                alert('Les mots de passe ne correspondent pas.');
                setIsLoading(false);
                return;
            }

            // Vérification de la longueur du mot de passe
            if (password.length < 8) {
                alert('Le mot de passe doit contenir au moins 8 caractères.');
                setIsLoading(false);
                return;
            }

            try {
                // Vérification si l'email existe déjà
                const emailExists = await checkEmailExists(email);
                if (emailExists) {
                    alert('Un compte avec cet email existe déjà.');
                    setIsLoading(false);
                    return;
                }
            } catch (error) {
                console.warn("Impossible de vérifier l'email, on continue:", error);
                // Si la vérification d'email échoue, on continue quand même
            }
            
            // Méthode 1: Utiliser Firebase Auth directement
            try {
                // Création de l'utilisateur avec Firebase Auth directement
                const userCredential = await createUserWithEmailAndPassword(auth, email, password);
                const user = userCredential.user;
                
                // 2. Envoyer les données à l'API
                const response = await fetch(`http://${API_CONFIG.ipaddress}/api/user`, {
                    method: 'POST',
                    headers: {
                        Accept: 'application/json',
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        firstname: firstName,
                        lastname: lastName,
                        birthdate: formatISOBirthdate(birthdate),
                        email,
                        tel,
                        password,
                        civility,
                        note,
                        handicap: handicap ? 1 : 0,
                        googleUUID: user.uid,
                    }),
                });

                if (!response.ok) {
                    console.error(`Erreur API: ${response.status} - ${await response.text()}`);
                    throw new Error("Erreur lors de l'envoi des données à l'API.");
                }

                // Si tout est réussi
                console.log('Utilisateur enregistré avec succès et ajouté à l\'API !');
                alert('Inscription réussie !');
                navigate('/login'); // Rediriger vers la page de connexion
                return;
            } catch (firebaseError: any) {
                // Si Firebase Auth échoue directement, on essaie la méthode avec l'API
                console.warn("Inscription Firebase directe échouée:", firebaseError.message);
                
                // On ne lance pas d'alerte ici et on essaie la méthode 2
            }

            // Méthode 2: Utiliser l'API pour Firebase Auth
            try {
                // 1. Créer un utilisateur avec Firebase Auth via l'API
                const firebaseResponse = await fetch(`${API_CONFIG.BASE_URL}/firebase/user/sign-up`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        email,
                        password,
                        firstname: firstName,
                        lastname: lastName,
                        birthdate,
                        civility,
                        Tel: tel,
                        Note: note || "",
                        handicap: handicap ? 1 : 0,
                    }),
                });

                if (!firebaseResponse.ok) {
                    const errorText = await firebaseResponse.text();
                    console.error(`Erreur Firebase API: ${firebaseResponse.status} - ${errorText}`);
                    let errorData;
                    try {
                        errorData = JSON.parse(errorText);
                    } catch {
                        errorData = { error: "Format de réponse invalide" };
                    }
                    throw new Error(errorData.error || "Une erreur s'est produite lors de l'inscription Firebase.");
                }

                const firebaseData = await firebaseResponse.json();
                const firebaseUID = firebaseData.user?.uid || firebaseData.uid;

                // 2. Envoyer les données à l'API pour création dans la base de données
                const userResponse = await fetch(`${API_CONFIG.BASE_URL}/user`, {
                    method: 'POST',
                    headers: {
                        Accept: 'application/json',
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        firstname: firstName,
                        lastname: lastName,
                        birthdate: formatISOBirthdate(birthdate),
                        email,
                        tel,
                        password,
                        civility,
                        note,
                        handicap: handicap ? 1 : 0,
                        googleUUID: firebaseUID,
                    }),
                });

                // Vérifier la réponse de l'API
                if (!userResponse.ok) {
                    const errorText = await userResponse.text();
                    console.error(`Erreur User API: ${userResponse.status} - ${errorText}`);
                    let errorData;
                    try {
                        errorData = JSON.parse(errorText);
                    } catch {
                        errorData = { error: "Format de réponse invalide" };
                    }
                    throw new Error(errorData.error || "Une erreur s'est produite lors de la création de l'utilisateur.");
                }

                // Si tout est réussi
                console.log('Utilisateur enregistré avec succès et ajouté à l\'API !');
                alert('Inscription réussie !');
                navigate('/login'); // Rediriger vers la page de connexion
            } catch (apiError: any) {
                throw apiError; // On propage l'erreur au catch externe
            }
        } catch (error: any) {
            // Gérer les erreurs Firebase ou API
            console.error('Erreur lors de l\'inscription :', error);
            
            // Déterminer le message d'erreur à afficher
            let errorMessage = "Une erreur s'est produite lors de l'inscription.";
            
            if (error.code === 'auth/email-already-in-use') {
                errorMessage = "Cet e-mail est déjà utilisé.";
            } else if (error.code === 'auth/invalid-email') {
                errorMessage = "Format d'e-mail invalide.";
            } else if (error.code === 'auth/weak-password') {
                errorMessage = "Mot de passe trop faible.";
            } else if (error.code === 'auth/network-request-failed') {
                errorMessage = "Problème de connexion réseau. Vérifiez votre connexion Internet.";
            } else if (error.message) {
                errorMessage = `Erreur: ${error.message}`;
            }
            
            alert(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex flex-col min-h-screen">
            {/* Navbar */}
            <Navbar navLight={false} playBtn={false} bgLight={false} navCenter={false} />

            {/* Contenu principal centré */}
            <main className="flex-grow flex items-center justify-center p-4 mt-8">
                <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-2xl">
                    <h1 className="text-2xl font-bold mb-6 text-center">Inscription</h1>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        {/* Civilité */}
                        <div className="flex justify-start">
                            <div className="w-64">
                                <label className="block text-sm font-medium text-gray-700">Civilité</label>
                                <select
                                    value={civility}
                                    onChange={(e) => setCivility(e.target.value)}
                                    className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm"
                                    required
                                >
                                    <option value="">Aucun</option>
                                    <option value="Monsieur">Monsieur</option>
                                    <option value="Madame">Madame</option>
                                </select>
                            </div>
                        </div>

                        {/* Nom et Email */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="w-64">
                                <label className="block text-sm font-medium text-gray-700">Nom</label>
                                <input
                                    type="text"
                                    value={lastName}
                                    onChange={(e) => setLastName(e.target.value)}
                                    className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm"
                                    required
                                />
                            </div>

                            <div className="w-64">
                                <label className="block text-sm font-medium text-gray-700">Email</label>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm"
                                    required
                                />
                            </div>
                        </div>

                        {/* Prénom et Mot de passe */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="w-64">
                                <label className="block text-sm font-medium text-gray-700">Prénom</label>
                                <input
                                    type="text"
                                    value={firstName}
                                    onChange={(e) => setFirstName(e.target.value)}
                                    className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm"
                                    required
                                />
                            </div>

                            <div className="w-64">
                                <label className="block text-sm font-medium text-gray-700">Mot de passe</label>
                                <div className="relative">
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm"
                                        required
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute inset-y-0 right-0 px-3 py-2"
                                    >
                                        {showPassword ? 'Masquer' : 'Afficher'}
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Date de naissance et Confirmation du mot de passe */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="w-64">
                                <label className="block text-sm font-medium text-gray-700">Date de naissance</label>
                                <input
                                    type="date"
                                    value={birthdate}
                                    onChange={(e) => setBirthdate(e.target.value)}
                                    className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm"
                                    required
                                />
                            </div>

                            <div className="w-64">
                                <label className="block text-sm font-medium text-gray-700">Confirmer le mot de passe</label>
                                <div className="relative">
                                    <input
                                        type={showConfirmPassword ? 'text' : 'password'}
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm"
                                        required
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        className="absolute inset-y-0 right-0 px-3 py-2"
                                    >
                                        {showConfirmPassword ? 'Masquer' : 'Afficher'}
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Handicap et Téléphone */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="w-64">
                                <label className="block text-sm font-medium text-gray-700">Quel est votre handicap ?</label>
                                <select
                                    value={handicap}
                                    onChange={(e) => setHandicap(e.target.value)}
                                    className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm"
                                    required
                                >
                                    <option value="">Aucun</option>
                                    <option value="Visuel">Visuel</option>
                                    <option value="Auditif">Auditif</option>
                                    <option value="Moteur">Moteur</option>
                                    <option value="Mental">Mental</option>
                                    <option value="Autre">Autre</option>
                                </select>
                            </div>

                            <div className="w-64">
                                <label className="block text-sm font-medium text-gray-700">Téléphone</label>
                                <input
                                    type="tel"
                                    value={tel}
                                    onChange={(e) => setTel(e.target.value)}
                                    className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm"
                                    required
                                />
                            </div>
                        </div>

                        {/* Note */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Note</label>
                            <textarea
                                value={note}
                                onChange={(e) => setNote(e.target.value)}
                                className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm"
                            />
                        </div>

                        {/* Bouton de soumission */}
                        <div className="flex justify-center">
                            <button
                                type="submit"
                                disabled={isLoading}
                                className={`w-1/2 ${isLoading ? 'bg-gray-300' : 'bg-gray-400 hover:bg-gray-500'} text-white p-2 rounded-md`}
                            >
                                {isLoading ? 'Chargement...' : 'S\'inscrire'}
                            </button>
                        </div>
                    </form>
                </div>
            </main>

            {/* Footer */}
            <Footer />
        </div>
    );
};

export default Signup;