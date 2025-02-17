const admin = require('firebase-admin');
require('dotenv').config();

// Convertir la variable d'environnement en JSON
const serviceAccount = JSON.parse(Buffer.from(process.env.FIREBASE_ADMIN_CREDENTIALS, 'base64').toString('utf-8'));


// Initialiser Firebase Admin
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

const adminAuth = admin.auth();

module.exports = { adminAuth };
