const { dbFireStorePMR, dbFireStoreAgent } = require("../config/firebase-admin-config");

/**
 * Sauvegarde un utilisateur dans Firestore.
 * @param {Object} user - Données de l'utilisateur à enregistrer.
 * @param {String} type - Type d'utilisateur : 'PMR' ou 'AGENT'.
 * @returns {Promise<void>}
 */
async function saveUserToFirestore(user, type) {
  try {
    // Choisir Firestore en fonction du type d'utilisateur
    const db = type === "PMR" ? dbFireStorePMR : dbFireStoreAgent;
    
    // Enregistrer l'utilisateur dans la bonne base de données
    const userRef = db.collection("users").doc(user.uid);
    await userRef.set(user);
    console.log(`Utilisateur ${user.uid} enregistré dans Firestore (${type}).`);
  } catch (error) {
    console.error("Erreur lors de l'enregistrement dans Firestore :", error);
    throw new Error("Impossible d'enregistrer l'utilisateur.");
  }
}

module.exports = { saveUserToFirestore };
