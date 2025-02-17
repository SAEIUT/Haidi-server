const { initializeApp } = require('firebase/app');
const { getAuth } = require('firebase/auth');
require('dotenv').config();


const firebaseConfigPMR = {
    apiKey: process.env.FIREBASE_PMR_API_KEY,
    authDomain: process.env.FIREBASE_PMR_AUTH_DOMAIN,
    projectId: process.env.FIREBASE_PMR_PROJECT_ID,
    storageBucket: process.env.FIREBASE_PMR_STORAGE_BUCKET,
    messagingSenderId: process.env.FIREBASE_PMR_MESSAGING_SENDER_ID,
    appId: process.env.FIREBASE_PMR_APP_ID,
    measurementId: process.env.FIREBASE_PMR_MEASUREMENT_ID,
  };

const firebaseConfigAgent = {
    apiKey: process.env.FIREBASE_AGENT_API_KEY,
    authDomain: process.env.FIREBASE_AGENT_AUTH_DOMAIN,
    projectId: process.env.FIREBASE_AGENT_PROJECT_ID,
    storageBucket: process.env.FIREBASE_AGENT_STORAGE_BUCKET,
    messagingSenderId: process.env.FIREBASE_AGENT_MESSAGING_SENDER_ID,
    appId: process.env.FIREBASE_AGENT_APP_ID,
    measurementId: process.env.FIREBASE_AGENT_MEASUREMENT_ID,
  };

// Initialisation de Firebase pour le client
const appPMR = initializeApp(firebaseConfigPMR, "PMR");
const authPMR = getAuth(appPMR);

const appAGENT = initializeApp(firebaseConfigAgent, "AGENT");
const authAGENT = getAuth(appAGENT);

module.exports = { authPMR, authAGENT };
