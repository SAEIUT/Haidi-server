import React, { useState } from 'react';
import { X, CreditCard, Check, AlertCircle, CalendarClock, Shield, Plane, Train, Bus, Car } from 'lucide-react';
import { Journey, Segment } from '../types/customTypes';
import { formatDuration, formatPrice, formatTime } from '../lib/formatters';

// Interface for the props passed to the ReservationModal component
interface ReservationModalProps {
    journey: Journey;
    isOpen: boolean;
    onClose: () => void;
    onConfirm: (reservationData: ReservationData) => void;
}

// Export the ReservationData interface so it can be imported elsewhere
export interface ReservationData {
    journeyId: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    passengers: number;
    paymentMethod: 'card' | 'paypal' | 'bank';
    acceptTerms: boolean;
    preferences: {
        seatingPreference?: 'window' | 'aisle' | 'no_preference';
        mealPreference?: 'standard' | 'vegetarian' | 'vegan' | 'gluten_free' | 'none';
        assistance: boolean;
    };
    // Security information
    securityInfo?: {
        identityDocument?: 'passport' | 'id_card' | 'driving_license';
        identityDocumentNumber?: string;
        birthDate?: string;
        nationality?: string;
        emergencyContact?: string;
        emergencyPhone?: string;
    };
    // Airplane-specific information
    flightInfo?: {
        baggage?: 'none' | 'cabin' | 'checked' | 'both';
        seatClass?: 'economy' | 'business' | 'first';
        freqTravelerNumber?: string;
        specialBaggage?: boolean;
        specialBaggageDescription?: string;
    };
    // Train-specific information
    trainInfo?: {
        seatPreference?: 'window' | 'aisle' | 'facing' | 'not_facing' | 'lower_deck' | 'upper_deck';
        carPreference?: 'quiet_car' | 'family_car' | 'standard';
        largeLuggage?: boolean;
    };
    // Bus-specific information
    busInfo?: {
        luggageSize?: 'small' | 'medium' | 'large';
    };
    // Car-specific information
    carInfo?: {
        driverLicense?: string;
        driverExperience?: 'less_2years' | '2_5years' | 'more_5years';
    };
}

// Type for error messages
interface ErrorMessages {
    [key: string]: string;
}

const ReservationModal: React.FC<ReservationModalProps> = ({ journey, isOpen, onClose, onConfirm }) => {
    const [currentStep, setCurrentStep] = useState<number>(1);
    const hasTrain = journey.segments.some(s => s.mode.toLowerCase() === 'train');
    const hasPlane = journey.segments.some(s => s.mode.toLowerCase() === 'plane');
    const hasBus = journey.segments.some(s => s.mode.toLowerCase() === 'bus');
    const hasCar = journey.segments.some(s => s.mode.toLowerCase() === 'car');
    
    // Determine total steps based on transport modes
    const totalSteps = 4 + (hasPlane || hasTrain ? 1 : 0); // 5 steps if plane or train, otherwise 4
    
    const [reservationData, setReservationData] = useState<ReservationData>({
        journeyId: journey.id || '',
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        passengers: 1,
        paymentMethod: 'card',
        acceptTerms: false,
        preferences: {
            seatingPreference: 'no_preference',
            mealPreference: 'standard',
            assistance: false
        },
        // Initialize security info if needed
        securityInfo: hasPlane ? {
            identityDocument: 'id_card',
            identityDocumentNumber: '',
            birthDate: '',
            nationality: '',
            emergencyContact: '',
            emergencyPhone: ''
        } : undefined,
        // Initialize flight-specific info if needed
        flightInfo: hasPlane ? {
            baggage: 'cabin',
            seatClass: 'economy',
            freqTravelerNumber: '',
            specialBaggage: false
        } : undefined,
        // Initialize train-specific info if needed
        trainInfo: hasTrain ? {
            seatPreference: 'window',
            carPreference: 'standard',
            largeLuggage: false
        } : undefined,
        // Initialize bus-specific info if needed
        busInfo: hasBus ? {
            luggageSize: 'medium'
        } : undefined,
        // Initialize car-specific info if needed
        carInfo: hasCar ? {
            driverLicense: '',
            driverExperience: 'more_5years'
        } : undefined
    });
    const [errors, setErrors] = useState<ErrorMessages>({});

    const validateStep = (step: number): boolean => {
        const newErrors: ErrorMessages = {};
        
        if (step === 1) {
            if (!reservationData.firstName) newErrors.firstName = "Le prénom est requis";
            if (!reservationData.lastName) newErrors.lastName = "Le nom est requis";
            if (!reservationData.email) {
                newErrors.email = "L'email est requis";
            } else if (!/\S+@\S+\.\S+/.test(reservationData.email)) {
                newErrors.email = "Format d'email invalide";
            }
            if (!reservationData.phone) newErrors.phone = "Le téléphone est requis";
        } else if (step === 3 && (hasPlane || hasTrain)) {
            // Validation for security information (step 3 if plane or train)
            if (hasPlane) {
                if (!reservationData.securityInfo?.identityDocumentNumber) {
                    newErrors["securityInfo.identityDocumentNumber"] = "Le numéro de document d'identité est requis pour les vols";
                }
                if (!reservationData.securityInfo?.birthDate) {
                    newErrors["securityInfo.birthDate"] = "La date de naissance est requise pour les vols";
                }
                if (!reservationData.securityInfo?.nationality) {
                    newErrors["securityInfo.nationality"] = "La nationalité est requise pour les vols";
                }
                if (!reservationData.securityInfo?.emergencyContact) {
                    newErrors["securityInfo.emergencyContact"] = "Un contact d'urgence est requis pour les vols";
                }
            }
            
            if (hasTrain && hasCar) {
                if (!reservationData.carInfo?.driverLicense) {
                    newErrors["carInfo.driverLicense"] = "Le numéro de permis de conduire est requis pour les trajets en voiture";
                }
            }
        } else if ((hasPlane || hasTrain) ? step === 4 : step === 3) {
            // Payment is either at step 4 (with security questions) or step 3 (without security questions)
            if (!reservationData.acceptTerms) {
                newErrors.acceptTerms = "Vous devez accepter les conditions générales";
            }
        }
        
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target;
        
        if (type === 'checkbox') {
            const checkbox = e.target as HTMLInputElement;
            if (name.startsWith('preferences.')) {
                const prefName = name.split('.')[1];
                setReservationData({
                    ...reservationData,
                    preferences: {
                        ...reservationData.preferences,
                        [prefName]: checkbox.checked
                    }
                });
            } else if (name.startsWith('securityInfo.')) {
                const secInfoName = name.split('.')[1];
                setReservationData({
                    ...reservationData,
                    securityInfo: {
                        ...reservationData.securityInfo,
                        [secInfoName]: checkbox.checked
                    }
                });
            } else if (name.startsWith('flightInfo.')) {
                const flightInfoName = name.split('.')[1];
                setReservationData({
                    ...reservationData,
                    flightInfo: {
                        ...reservationData.flightInfo,
                        baggage: reservationData.flightInfo?.baggage || 'cabin',
                        [flightInfoName]: checkbox.checked
                    }
                });
            } else if (name.startsWith('trainInfo.')) {
                const trainInfoName = name.split('.')[1];
                setReservationData({
                    ...reservationData,
                    trainInfo: {
                        ...reservationData.trainInfo,
                        [trainInfoName]: checkbox.checked
                    }
                });
            } else {
                setReservationData({
                    ...reservationData,
                    [name]: checkbox.checked
                });
            }
        } else if (name.startsWith('preferences.')) {
            const prefName = name.split('.')[1];
            setReservationData({
                ...reservationData,
                preferences: {
                    ...reservationData.preferences,
                    [prefName]: value
                }
            });
        } else if (name.startsWith('securityInfo.')) {
            const secInfoName = name.split('.')[1];
            setReservationData({
                ...reservationData,
                securityInfo: {
                    ...reservationData.securityInfo,
                    [secInfoName]: value
                }
            });
        } else if (name.startsWith('flightInfo.')) {
            const flightInfoName = name.split('.')[1];
            setReservationData({
                ...reservationData,
                flightInfo: {
                    ...reservationData.flightInfo,
                    baggage: reservationData.flightInfo?.baggage || 'cabin',
                    [flightInfoName]: value
                }
            });
        } else if (name.startsWith('trainInfo.')) {
            const trainInfoName = name.split('.')[1];
            setReservationData({
                ...reservationData,
                trainInfo: {
                    ...reservationData.trainInfo,
                    [trainInfoName]: value
                }
            });
        } else if (name.startsWith('busInfo.')) {
            const busInfoName = name.split('.')[1];
            setReservationData({
                ...reservationData,
                busInfo: {
                    ...reservationData.busInfo,
                    [busInfoName]: value
                }
            });
        } else if (name.startsWith('carInfo.')) {
            const carInfoName = name.split('.')[1];
            setReservationData({
                ...reservationData,
                carInfo: {
                    ...reservationData.carInfo,
                    [carInfoName]: value
                }
            });
        } else {
            setReservationData({
                ...reservationData,
                [name]: value
            });
        }
    };

    const nextStep = () => {
        if (validateStep(currentStep)) {
            setCurrentStep(currentStep + 1);
        }
    };

    const prevStep = () => {
        setCurrentStep(currentStep - 1);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (validateStep(currentStep)) {
            onConfirm(reservationData);
        }
    };

    if (!isOpen) return null;

    const departureTime = new Date(journey.departureTime);
    const arrivalTime = new Date(journey.arrivalTime);

    return (
        <div className="fixed inset-0 z-50 overflow-auto bg-black bg-opacity-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg shadow-lg max-w-2xl w-full max-h-[90vh] overflow-auto">
                <div className="p-4 border-b flex justify-between items-center bg-blue-50">
                    <h2 className="text-xl font-bold">Réservation de transport</h2>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
                        <X className="h-6 w-6" />
                    </button>
                </div>

                {/* Journey summary */}
                <div className="p-4 bg-gray-50 border-b">
                    <div className="flex justify-between">
                        <div>
                            <div className="font-medium text-lg">
                                {formatTime(departureTime)} - {formatTime(arrivalTime)}
                            </div>
                            <div className="text-gray-600">
                                Durée: {formatDuration(journey.duration)}
                                {journey.distance && ` • ${(journey.distance / 1000).toFixed(1)} km`}
                            </div>
                            <div className="font-medium text-blue-600 mt-1">
                                {formatPrice(journey.price)}
                            </div>
                        </div>
                        <div>
                            <div className="text-sm font-medium">
                                {journey.segments.map((segment, index) => (
                                    <div key={index} className="text-gray-600">
                                        {segment.mode.toUpperCase()}: {segment.from.name} → {segment.to.name}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Reservation Steps */}
                <div className="p-4 border-b">
                    <div className="flex justify-between">
                        <div className={`text-center flex-1 ${currentStep >= 1 ? 'text-blue-600' : 'text-gray-400'}`}>
                            <div className={`rounded-full h-8 w-8 mx-auto flex items-center justify-center ${currentStep >= 1 ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}>1</div>
                            <div className="text-sm mt-1">Informations</div>
                        </div>
                        <div className={`text-center flex-1 ${currentStep >= 2 ? 'text-blue-600' : 'text-gray-400'}`}>
                            <div className={`rounded-full h-8 w-8 mx-auto flex items-center justify-center ${currentStep >= 2 ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}>2</div>
                            <div className="text-sm mt-1">Préférences</div>
                        </div>
                        {(hasPlane || hasTrain) && (
                            <div className={`text-center flex-1 ${currentStep >= 3 ? 'text-blue-600' : 'text-gray-400'}`}>
                                <div className={`rounded-full h-8 w-8 mx-auto flex items-center justify-center ${currentStep >= 3 ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}>3</div>
                                <div className="text-sm mt-1">Sécurité</div>
                            </div>
                        )}
                        <div className={`text-center flex-1 ${currentStep >= (hasPlane || hasTrain ? 4 : 3) ? 'text-blue-600' : 'text-gray-400'}`}>
                            <div className={`rounded-full h-8 w-8 mx-auto flex items-center justify-center ${currentStep >= (hasPlane || hasTrain ? 4 : 3) ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}>{hasPlane || hasTrain ? 4 : 3}</div>
                            <div className="text-sm mt-1">Paiement</div>
                        </div>
                        <div className={`text-center flex-1 ${currentStep >= (hasPlane || hasTrain ? 5 : 4) ? 'text-blue-600' : 'text-gray-400'}`}>
                            <div className={`rounded-full h-8 w-8 mx-auto flex items-center justify-center ${currentStep >= (hasPlane || hasTrain ? 5 : 4) ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}>{hasPlane || hasTrain ? 5 : 4}</div>
                            <div className="text-sm mt-1">Confirmation</div>
                        </div>
                    </div>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="p-6">
                        {/* Step 1: Personal Information */}
                        {currentStep === 1 && (
                            <div className="space-y-4">
                                <h3 className="font-medium text-lg">Informations personnelles</h3>
                                
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Prénom</label>
                                        <input
                                            type="text"
                                            name="firstName"
                                            value={reservationData.firstName}
                                            onChange={handleChange}
                                            className={`w-full p-2 border rounded-lg ${errors.firstName ? 'border-red-500' : 'border-gray-300'}`}
                                            placeholder="Jean"
                                        />
                                        {errors.firstName && <p className="text-red-500 text-xs mt-1">{errors.firstName}</p>}
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Nom</label>
                                        <input
                                            type="text"
                                            name="lastName"
                                            value={reservationData.lastName}
                                            onChange={handleChange}
                                            className={`w-full p-2 border rounded-lg ${errors.lastName ? 'border-red-500' : 'border-gray-300'}`}
                                            placeholder="Dupont"
                                        />
                                        {errors.lastName && <p className="text-red-500 text-xs mt-1">{errors.lastName}</p>}
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={reservationData.email}
                                        onChange={handleChange}
                                        className={`w-full p-2 border rounded-lg ${errors.email ? 'border-red-500' : 'border-gray-300'}`}
                                        placeholder="jean.dupont@exemple.com"
                                    />
                                    {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Téléphone</label>
                                    <input
                                        type="tel"
                                        name="phone"
                                        value={reservationData.phone}
                                        onChange={handleChange}
                                        className={`w-full p-2 border rounded-lg ${errors.phone ? 'border-red-500' : 'border-gray-300'}`}
                                        placeholder="+33 6 12 34 56 78"
                                    />
                                    {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Nombre de passagers</label>
                                    <select
                                        name="passengers"
                                        value={reservationData.passengers}
                                        onChange={handleChange}
                                        className="w-full p-2 border border-gray-300 rounded-lg"
                                    >
                                        {[1, 2, 3, 4, 5, 6].map(num => (
                                            <option key={num} value={num}>{num}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        )}

                        {/* Step 2: Preferences */}
                        {currentStep === 2 && (
                            <div className="space-y-4">
                                <h3 className="font-medium text-lg">Préférences de voyage</h3>
                                
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Préférence de siège</label>
                                    <select
                                        name="preferences.seatingPreference"
                                        value={reservationData.preferences.seatingPreference}
                                        onChange={handleChange}
                                        className="w-full p-2 border border-gray-300 rounded-lg"
                                    >
                                        <option value="window">Fenêtre</option>
                                        <option value="aisle">Couloir</option>
                                        <option value="no_preference">Pas de préférence</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Préférence de repas</label>
                                    <select
                                        name="preferences.mealPreference"
                                        value={reservationData.preferences.mealPreference}
                                        onChange={handleChange}
                                        className="w-full p-2 border border-gray-300 rounded-lg"
                                    >
                                        <option value="standard">Standard</option>
                                        <option value="vegetarian">Végétarien</option>
                                        <option value="vegan">Végan</option>
                                        <option value="gluten_free">Sans gluten</option>
                                        <option value="none">Pas de repas</option>
                                    </select>
                                </div>

                                <div className="flex items-center">
                                    <input
                                        type="checkbox"
                                        id="assistance"
                                        name="preferences.assistance"
                                        checked={reservationData.preferences.assistance}
                                        onChange={handleChange}
                                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                    />
                                    <label htmlFor="assistance" className="ml-2 block text-sm text-gray-700">
                                        J'ai besoin d'une assistance spéciale
                                    </label>
                                </div>

                                {journey.segments.some(s => s.mode.toLowerCase() === 'train' || s.mode.toLowerCase() === 'plane') && (
                                    <div className="bg-blue-50 p-4 rounded-lg mt-4">
                                        <div className="flex items-start">
                                            <CalendarClock className="h-5 w-5 text-blue-500 mt-0.5 mr-2" />
                                            <div>
                                                <h4 className="font-medium text-blue-700">Conseil pour votre voyage</h4>
                                                <p className="text-sm text-blue-600">
                                                    Pour les segments en train ou avion, nous vous recommandons d'arriver au moins 30 minutes avant le départ.
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Step 3: Security Information (only for plane or train) */}
                        {(hasPlane || hasTrain) && currentStep === 3 && (
                            <div className="space-y-4">
                                <h3 className="font-medium text-lg flex items-center">
                                    <Shield className="h-5 w-5 mr-2 text-blue-500" />
                                    Informations de sécurité et vérifications
                                </h3>
                                
                                {hasPlane && (
                                    <div className="bg-blue-50 p-4 rounded-lg mb-6">
                                        <div className="flex items-start">
                                            <Plane className="h-5 w-5 text-blue-500 mt-0.5 mr-2" />
                                            <div>
                                                <h4 className="font-medium text-blue-700">Informations requises pour le vol</h4>
                                                <p className="text-sm text-blue-600">
                                                    Pour les trajets en avion, des informations supplémentaires sont nécessaires pour vous enregistrer et assurer votre sécurité.
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                )}
                                
                                {hasTrain && (
                                    <div className="bg-blue-50 p-4 rounded-lg mb-6">
                                        <div className="flex items-start">
                                            <Train className="h-5 w-5 text-blue-500 mt-0.5 mr-2" />
                                            <div>
                                                <h4 className="font-medium text-blue-700">Informations pour le voyage en train</h4>
                                                <p className="text-sm text-blue-600">
                                                    Ces informations nous permettent de vous offrir un voyage plus confortable et sécurisé.
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                )}
                                
                                <div className="space-y-4">
                                    <h4 className="font-medium text-gray-800">Document d'identité</h4>
                                    
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Type de document</label>
                                        <select
                                            name="securityInfo.identityDocument"
                                            value={reservationData.securityInfo?.identityDocument}
                                            onChange={handleChange}
                                            className="w-full p-2 border border-gray-300 rounded-lg"
                                        >
                                            <option value="id_card">Carte d'identité</option>
                                            <option value="passport">Passeport</option>
                                            <option value="driving_license">Permis de conduire</option>
                                        </select>
                                    </div>
                                    
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Numéro de document
                                            {hasPlane && <span className="text-red-500">*</span>}
                                        </label>
                                        <input
                                            type="text"
                                            name="securityInfo.identityDocumentNumber"
                                            value={reservationData.securityInfo?.identityDocumentNumber || ''}
                                            onChange={handleChange}
                                            className={`w-full p-2 border rounded-lg ${errors["securityInfo.identityDocumentNumber"] ? 'border-red-500' : 'border-gray-300'}`}
                                            placeholder="Numéro de document d'identité"
                                        />
                                        {errors["securityInfo.identityDocumentNumber"] && 
                                            <p className="text-red-500 text-xs mt-1">{errors["securityInfo.identityDocumentNumber"]}</p>
                                        }
                                    </div>
                                    
                                    {hasPlane && (
                                        <>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                                    Date de naissance
                                                    <span className="text-red-500">*</span>
                                                </label>
                                                <input
                                                    type="date"
                                                    name="securityInfo.birthDate"
                                                    value={reservationData.securityInfo?.birthDate || ''}
                                                    onChange={handleChange}
                                                    className={`w-full p-2 border rounded-lg ${errors["securityInfo.birthDate"] ? 'border-red-500' : 'border-gray-300'}`}
                                                />
                                                {errors["securityInfo.birthDate"] && 
                                                    <p className="text-red-500 text-xs mt-1">{errors["securityInfo.birthDate"]}</p>
                                                }
                                            </div>
                                            
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                                    Nationalité
                                                    <span className="text-red-500">*</span>
                                                </label>
                                                <input
                                                    type="text"
                                                    name="securityInfo.nationality"
                                                    value={reservationData.securityInfo?.nationality || ''}
                                                    onChange={handleChange}
                                                    className={`w-full p-2 border rounded-lg ${errors["securityInfo.nationality"] ? 'border-red-500' : 'border-gray-300'}`}
                                                    placeholder="Nationalité"
                                                />
                                                {errors["securityInfo.nationality"] && 
                                                    <p className="text-red-500 text-xs mt-1">{errors["securityInfo.nationality"]}</p>
                                                }
                                            </div>
                                        </>
                                    )}
                                    
                                    <h4 className="font-medium text-gray-800 pt-2">Contact d'urgence</h4>
                                    
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Nom du contact d'urgence
                                            {hasPlane && <span className="text-red-500">*</span>}
                                        </label>
                                        <input
                                            type="text"
                                            name="securityInfo.emergencyContact"
                                            value={reservationData.securityInfo?.emergencyContact || ''}
                                            onChange={handleChange}
                                            className={`w-full p-2 border rounded-lg ${errors["securityInfo.emergencyContact"] ? 'border-red-500' : 'border-gray-300'}`}
                                            placeholder="Nom et prénom"
                                        />
                                        {errors["securityInfo.emergencyContact"] && 
                                            <p className="text-red-500 text-xs mt-1">{errors["securityInfo.emergencyContact"]}</p>
                                        }
                                    </div>
                                    
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Téléphone d'urgence
                                        </label>
                                        <input
                                            type="tel"
                                            name="securityInfo.emergencyPhone"
                                            value={reservationData.securityInfo?.emergencyPhone || ''}
                                            onChange={handleChange}
                                            className="w-full p-2 border border-gray-300 rounded-lg"
                                            placeholder="+33 6 12 34 56 78"
                                        />
                                    </div>
                                </div>
                                
                                {hasPlane && (
                                    <div className="space-y-4 mt-6">
                                        <h4 className="font-medium text-gray-800">Informations de vol</h4>
                                        
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Bagages</label>
                                            <select
                                                name="flightInfo.baggage"
                                                value={reservationData.flightInfo?.baggage}
                                                onChange={handleChange}
                                                className="w-full p-2 border border-gray-300 rounded-lg"
                                            >
                                                <option value="none">Aucun bagage</option>
                                                <option value="cabin">Bagage cabine uniquement</option>
                                                <option value="checked">Bagage en soute uniquement</option>
                                                <option value="both">Bagage cabine et en soute</option>
                                            </select>
                                        </div>
                                        
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Classe</label>
                                            <select
                                                name="flightInfo.seatClass"
                                                value={reservationData.flightInfo?.seatClass}
                                                onChange={handleChange}
                                                className="w-full p-2 border border-gray-300 rounded-lg"
                                            >
                                                <option value="economy">Économique</option>
                                                <option value="business">Business</option>
                                                <option value="first">Première classe</option>
                                            </select>
                                        </div>
                                        
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Numéro de voyageur fréquent (optionnel)</label>
                                            <input
                                                type="text"
                                                name="flightInfo.freqTravelerNumber"
                                                value={reservationData.flightInfo?.freqTravelerNumber || ''}
                                                onChange={handleChange}
                                                className="w-full p-2 border border-gray-300 rounded-lg"
                                                placeholder="Numéro de voyageur fréquent"
                                            />
                                        </div>
                                        
                                        <div className="flex items-center">
                                            <input
                                                type="checkbox"
                                                id="specialBaggage"
                                                name="flightInfo.specialBaggage"
                                                checked={reservationData.flightInfo?.specialBaggage || false}
                                                onChange={handleChange}
                                                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                            />
                                            <label htmlFor="specialBaggage" className="ml-2 block text-sm text-gray-700">
                                                J'ai un bagage spécial (équipement sportif, instrument de musique, etc.)
                                            </label>
                                        </div>
                                        
                                        {reservationData.flightInfo?.specialBaggage && (
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Description du bagage spécial</label>
                                                <textarea
                                                    name="flightInfo.specialBaggageDescription"
                                                    value={reservationData.flightInfo?.specialBaggageDescription || ''}
                                                    onChange={handleChange}
                                                    className="w-full p-2 border border-gray-300 rounded-lg"
                                                    placeholder="Décrivez votre bagage spécial (dimensions, poids, etc.)"
                                                    rows={3}
                                                />
                                            </div>
                                        )}
                                        
                                        <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200 mt-4">
                                            <div className="flex items-start">
                                                <AlertCircle className="h-5 w-5 text-yellow-500 mt-0.5 mr-2" />
                                                <div>
                                                    <h4 className="font-medium text-yellow-700">Rappel important</h4>
                                                    <p className="text-sm text-yellow-600">
                                                        Pour les vols, arrivez à l'aéroport au moins 2 heures avant le départ. N'oubliez pas vos documents d'identité originaux.
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                                
                                {hasTrain && (
                                    <div className="space-y-4 mt-6">
                                        <h4 className="font-medium text-gray-800">Préférences pour le train</h4>
                                        
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Préférence de siège</label>
                                            <select
                                                name="trainInfo.seatPreference"
                                                value={reservationData.trainInfo?.seatPreference}
                                                onChange={handleChange}
                                                className="w-full p-2 border border-gray-300 rounded-lg"
                                            >
                                                <option value="window">Côté fenêtre</option>
                                                <option value="aisle">Côté couloir</option>
                                                <option value="facing">Face à la marche</option>
                                                <option value="not_facing">Dos à la marche</option>
                                                <option value="lower_deck">Niveau inférieur</option>
                                                <option value="upper_deck">Niveau supérieur</option>
                                            </select>
                                        </div>
                                        
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Préférence de voiture</label>
                                            <select
                                                name="trainInfo.carPreference"
                                                value={reservationData.trainInfo?.carPreference}
                                                onChange={handleChange}
                                                className="w-full p-2 border border-gray-300 rounded-lg"
                                            >
                                                <option value="standard">Standard</option>
                                                <option value="quiet_car">Voiture silencieuse</option>
                                                <option value="family_car">Espace famille</option>
                                            </select>
                                        </div>
                                        
                                        <div className="flex items-center">
                                            <input
                                                type="checkbox"
                                                id="largeLuggage"
                                                name="trainInfo.largeLuggage"
                                                checked={reservationData.trainInfo?.largeLuggage || false}
                                                onChange={handleChange}
                                                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                            />
                                            <label htmlFor="largeLuggage" className="ml-2 block text-sm text-gray-700">
                                                J'ai des bagages volumineux
                                            </label>
                                        </div>
                                        
                                        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200 mt-4">
                                            <div className="flex items-start">
                                                <AlertCircle className="h-5 w-5 text-blue-500 mt-0.5 mr-2" />
                                                <div>
                                                    <h4 className="font-medium text-blue-700">Information</h4>
                                                    <p className="text-sm text-blue-600">
                                                        Pour les trajets en train, arrivez en gare au moins 30 minutes avant le départ. Le numéro de votre voiture et de votre siège vous sera communiqué par email.
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                                
                                {hasCar && (
                                    <div className="space-y-4 mt-6">
                                        <h4 className="font-medium text-gray-800">Informations pour la conduite</h4>
                                        
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Numéro de permis de conduire
                                                <span className="text-red-500">*</span>
                                            </label>
                                            <input
                                                type="text"
                                                name="carInfo.driverLicense"
                                                value={reservationData.carInfo?.driverLicense || ''}
                                                onChange={handleChange}
                                                className={`w-full p-2 border rounded-lg ${errors["carInfo.driverLicense"] ? 'border-red-500' : 'border-gray-300'}`}
                                                placeholder="Numéro de permis de conduire"
                                            />
                                            {errors["carInfo.driverLicense"] && 
                                                <p className="text-red-500 text-xs mt-1">{errors["carInfo.driverLicense"]}</p>
                                            }
                                        </div>
                                        
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Expérience de conduite</label>
                                            <select
                                                name="carInfo.driverExperience"
                                                value={reservationData.carInfo?.driverExperience}
                                                onChange={handleChange}
                                                className="w-full p-2 border border-gray-300 rounded-lg"
                                            >
                                                <option value="less_2years">Moins de 2 ans</option>
                                                <option value="2_5years">Entre 2 et 5 ans</option>
                                                <option value="more_5years">Plus de 5 ans</option>
                                            </select>
                                        </div>
                                        
                                        <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200 mt-4">
                                            <div className="flex items-start">
                                                <Car className="h-5 w-5 text-yellow-500 mt-0.5 mr-2" />
                                                <div>
                                                    <h4 className="font-medium text-yellow-700">Important</h4>
                                                    <p className="text-sm text-yellow-600">
                                                        Pour les trajets en voiture, n'oubliez pas de vous munir de votre permis de conduire original. Une caution pourrait être demandée lors de la prise du véhicule.
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Payment Step (step 4 with security or 3 without security) */}
                        {currentStep === ((hasPlane || hasTrain) ? 4 : 3) && (
                            <div className="space-y-4">
                                <h3 className="font-medium text-lg flex items-center">
                                    <CreditCard className="h-5 w-5 mr-2 text-blue-500" />
                                    Paiement
                                </h3>
                                
                                <div>
                                    <p className="text-gray-600 font-medium mb-4">
                                        Montant total à payer: {formatPrice(journey.price * reservationData.passengers)}
                                    </p>
                                    
                                    <div className="space-y-4">
                                        <h4 className="font-medium text-gray-800">Méthode de paiement</h4>
                                        
                                        <div className="space-y-2">
                                            <div className="flex items-center">
                                                <input
                                                    type="radio"
                                                    id="payment_card"
                                                    name="paymentMethod"
                                                    value="card"
                                                    checked={reservationData.paymentMethod === 'card'}
                                                    onChange={handleChange}
                                                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                                                />
                                                <label htmlFor="payment_card" className="ml-2 block text-sm text-gray-700">
                                                    Carte bancaire
                                                </label>
                                            </div>
                                            <div className="flex items-center">
                                                <input
                                                    type="radio"
                                                    id="payment_paypal"
                                                    name="paymentMethod"
                                                    value="paypal"
                                                    checked={reservationData.paymentMethod === 'paypal'}
                                                    onChange={handleChange}
                                                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                                                />
                                                <label htmlFor="payment_paypal" className="ml-2 block text-sm text-gray-700">
                                                    PayPal
                                                </label>
                                            </div>
                                            <div className="flex items-center">
                                                <input
                                                    type="radio"
                                                    id="payment_bank"
                                                    name="paymentMethod"
                                                    value="bank"
                                                    checked={reservationData.paymentMethod === 'bank'}
                                                    onChange={handleChange}
                                                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                                                />
                                                <label htmlFor="payment_bank" className="ml-2 block text-sm text-gray-700">
                                                    Virement bancaire
                                                </label>
                                            </div>
                                        </div>
                                        
                                        {reservationData.paymentMethod === 'card' && (
                                            <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                                                <h5 className="font-medium text-gray-800 mb-3">Informations de carte</h5>
                                                <div className="space-y-3">
                                                    <div>
                                                        <label className="block text-sm font-medium text-gray-700 mb-1">Numéro de carte</label>
                                                        <input
                                                            type="text"
                                                            className="w-full p-2 border border-gray-300 rounded-lg"
                                                            placeholder="1234 5678 9012 3456"
                                                        />
                                                    </div>
                                                    <div className="grid grid-cols-2 gap-4">
                                                        <div>
                                                            <label className="block text-sm font-medium text-gray-700 mb-1">Date d'expiration</label>
                                                            <input
                                                                type="text"
                                                                className="w-full p-2 border border-gray-300 rounded-lg"
                                                                placeholder="MM/AA"
                                                            />
                                                        </div>
                                                        <div>
                                                            <label className="block text-sm font-medium text-gray-700 mb-1">CVV</label>
                                                            <input
                                                                type="text"
                                                                className="w-full p-2 border border-gray-300 rounded-lg"
                                                                placeholder="123"
                                                            />
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <label className="block text-sm font-medium text-gray-700 mb-1">Nom sur la carte</label>
                                                        <input
                                                            type="text"
                                                            className="w-full p-2 border border-gray-300 rounded-lg"
                                                            placeholder="Jean Dupont"
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                    
                                    <div className="mt-6">
                                        <div className="flex items-center">
                                            <input
                                                type="checkbox"
                                                id="acceptTerms"
                                                name="acceptTerms"
                                                checked={reservationData.acceptTerms}
                                                onChange={handleChange}
                                                className={`h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded ${errors.acceptTerms ? 'border-red-500' : ''}`}
                                            />
                                            <label htmlFor="acceptTerms" className={`ml-2 block text-sm ${errors.acceptTerms ? 'text-red-500' : 'text-gray-700'}`}>
                                                J'accepte les conditions générales de vente et la politique de confidentialité
                                            </label>
                                        </div>
                                        {errors.acceptTerms && <p className="text-red-500 text-xs mt-1">{errors.acceptTerms}</p>}
                                    </div>
                                </div>
                                
                                <div className="bg-blue-50 p-4 rounded-lg mt-6">
                                    <div className="flex items-start">
                                        <Shield className="h-5 w-5 text-blue-500 mt-0.5 mr-2" />
                                        <div>
                                            <h4 className="font-medium text-blue-700">Paiement sécurisé</h4>
                                            <p className="text-sm text-blue-600">
                                                Toutes vos informations de paiement sont chiffrées et sécurisées. Nous n'enregistrons pas les données de votre carte.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Confirmation Step (step 5 with security or 4 without security) */}
                        {currentStep === ((hasPlane || hasTrain) ? 5 : 4) && (
                            <div className="space-y-4">
                                <div className="flex flex-col items-center text-center py-4">
                                    <div className="rounded-full bg-green-100 p-3 mb-3">
                                        <Check className="h-8 w-8 text-green-600" />
                                    </div>
                                    <h3 className="text-xl font-bold text-green-600">Réservation confirmée</h3>
                                    <p className="text-gray-600 mt-2">
                                        Votre réservation a bien été enregistrée. Un email de confirmation a été envoyé à {reservationData.email}.
                                    </p>
                                </div>

                                <div className="bg-gray-50 p-4 rounded-lg border mt-4">
                                    <h4 className="font-medium mb-2">Récapitulatif de la réservation</h4>
                                    <table className="w-full text-sm">
                                        <tbody>
                                            <tr>
                                                <td className="py-1 text-gray-600">Référence:</td>
                                                <td className="py-1 font-medium">{`REF-${Math.floor(100000 + Math.random() * 900000)}`}</td>
                                            </tr>
                                            <tr>
                                                <td className="py-1 text-gray-600">Voyageur:</td>
                                                <td className="py-1">{reservationData.firstName} {reservationData.lastName}</td>
                                            </tr>
                                            <tr>
                                                <td className="py-1 text-gray-600">Passagers:</td>
                                                <td className="py-1">{reservationData.passengers}</td>
                                            </tr>
                                            <tr>
                                                <td className="py-1 text-gray-600">Date:</td>
                                                <td className="py-1">{new Date(journey.departureTime).toLocaleDateString()}</td>
                                            </tr>
                                            <tr>
                                                <td className="py-1 text-gray-600">Heure:</td>
                                                <td className="py-1">{formatTime(new Date(journey.departureTime))}</td>
                                            </tr>
                                            <tr>
                                                <td className="py-1 text-gray-600">Total payé:</td>
                                                <td className="py-1 font-medium text-blue-600">{formatPrice(journey.price * reservationData.passengers)}</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                                
                                {/* Display mode-specific information */}
                                {hasPlane && (
                                    <div className="bg-gray-50 p-4 rounded-lg border mt-4">
                                        <h4 className="font-medium mb-2 flex items-center">
                                            <Plane className="h-4 w-4 mr-2 text-blue-500" />
                                            Informations de vol
                                        </h4>
                                        <table className="w-full text-sm">
                                            <tbody>
                                                <tr>
                                                    <td className="py-1 text-gray-600">Document:</td>
                                                    <td className="py-1">{
                                                        reservationData.securityInfo?.identityDocument === 'passport' ? 'Passeport' :
                                                        reservationData.securityInfo?.identityDocument === 'id_card' ? "Carte d'identité" :
                                                        'Permis de conduire'
                                                    }</td>
                                                </tr>
                                                <tr>
                                                    <td className="py-1 text-gray-600">Bagages:</td>
                                                    <td className="py-1">{
                                                        reservationData.flightInfo?.baggage === 'none' ? 'Aucun' :
                                                        reservationData.flightInfo?.baggage === 'cabin' ? 'Cabine uniquement' :
                                                        reservationData.flightInfo?.baggage === 'checked' ? 'Soute uniquement' :
                                                        'Cabine et soute'
                                                    }</td>
                                                </tr>
                                                <tr>
                                                    <td className="py-1 text-gray-600">Classe:</td>
                                                    <td className="py-1">{
                                                        reservationData.flightInfo?.seatClass === 'economy' ? 'Économique' :
                                                        reservationData.flightInfo?.seatClass === 'business' ? 'Business' :
                                                        'Première classe'
                                                    }</td>
                                                </tr>
                                                {reservationData.flightInfo?.specialBaggage && (
                                                    <tr>
                                                        <td className="py-1 text-gray-600">Bagage spécial:</td>
                                                        <td className="py-1">Oui</td>
                                                    </tr>
                                                )}
                                            </tbody>
                                        </table>
                                    </div>
                                )}
                                
                                {hasTrain && (
                                    <div className="bg-gray-50 p-4 rounded-lg border mt-4">
                                        <h4 className="font-medium mb-2 flex items-center">
                                            <Train className="h-4 w-4 mr-2 text-blue-500" />
                                            Informations de train
                                        </h4>
                                        <table className="w-full text-sm">
                                            <tbody>
                                                <tr>
                                                    <td className="py-1 text-gray-600">Siège:</td>
                                                    <td className="py-1">{
                                                        reservationData.trainInfo?.seatPreference === 'window' ? 'Côté fenêtre' :
                                                        reservationData.trainInfo?.seatPreference === 'aisle' ? 'Côté couloir' :
                                                        reservationData.trainInfo?.seatPreference === 'facing' ? 'Face à la marche' :
                                                        reservationData.trainInfo?.seatPreference === 'not_facing' ? 'Dos à la marche' :
                                                        reservationData.trainInfo?.seatPreference === 'lower_deck' ? 'Niveau inférieur' :
                                                        'Niveau supérieur'
                                                    }</td>
                                                </tr>
                                                <tr>
                                                    <td className="py-1 text-gray-600">Voiture:</td>
                                                    <td className="py-1">{
                                                        reservationData.trainInfo?.carPreference === 'quiet_car' ? 'Voiture silencieuse' :
                                                        reservationData.trainInfo?.carPreference === 'family_car' ? 'Espace famille' :
                                                        'Standard'
                                                    }</td>
                                                </tr>
                                                {reservationData.trainInfo?.largeLuggage && (
                                                    <tr>
                                                        <td className="py-1 text-gray-600">Bagages volumineux:</td>
                                                        <td className="py-1">Oui</td>
                                                    </tr>
                                                )}
                                            </tbody>
                                        </table>
                                    </div>
                                )}

                                <div className="bg-blue-50 p-4 rounded-lg mt-4">
                                    <div className="flex items-start">
                                        <AlertCircle className="h-5 w-5 text-blue-500 mt-0.5 mr-2" />
                                        <div>
                                            <h4 className="font-medium text-blue-700">Prochaines étapes</h4>
                                            <p className="text-sm text-blue-600">
                                                Vous recevrez votre billet électronique et tous les détails du voyage par email. Vous pouvez également consulter votre réservation dans votre espace personnel.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                    
                    {/* Navigation buttons */}
                    <div className="p-4 border-t flex justify-between">
                        {currentStep > 1 && currentStep < (hasPlane || hasTrain ? 5 : 4) ? (
                            <button 
                                type="button" 
                                onClick={prevStep}
                                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                            >
                                Précédent
                            </button>
                        ) : (
                            <div></div>
                        )}
                        
                        {currentStep < (hasPlane || hasTrain ? 5 : 4) ? (
                            <button 
                                type="button" 
                                onClick={nextStep}
                                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                            >
                                {currentStep === ((hasPlane || hasTrain) ? 4 : 3) ? "Confirmer et payer" : "Suivant"}
                            </button>
                        ) : (
                            <button 
                                type="button" 
                                onClick={onClose}
                                className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                            >
                                Terminer
                            </button>
                        )}
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ReservationModal;