const admin = require('firebase-admin');
require('dotenv').config();

// Convertir les variables d'environnement en JSON
const serviceAccountPMR = JSON.parse(
  Buffer.from(process.env.FIREBASE_ADMIN_PMR_CREDENTIALS, "base64").toString("utf-8")
);
const serviceAccountAgent = JSON.parse(
  Buffer.from(process.env.FIREBASE_ADMIN_AGENT_CREDENTIALS, "base64").toString("utf-8")
);

// Initialiser Firebase Admin pour PMR
const adminAppPMR = admin.initializeApp(
  {
    credential: admin.credential.cert(serviceAccountPMR),
  },
  "PMR"
);

// Initialiser Firebase Admin pour AGENT
const adminAppAgent = admin.initializeApp(
  {
    credential: admin.credential.cert(serviceAccountAgent),
  },
  "AGENT"
);

// Authentification et Firestore pour PMR
const adminAuthPMR = adminAppPMR.auth();
const dbFireStorePMR = adminAppPMR.firestore();

// Authentification et Firestore pour AGENT
const adminAuthAgent = adminAppAgent.auth();
const dbFireStoreAgent = adminAppAgent.firestore();

module.exports = { adminAuthPMR, dbFireStorePMR, adminAuthAgent, dbFireStoreAgent };
