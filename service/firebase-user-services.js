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

/**
 * Récupère un utilisateur depuis Firestore.
 * @param {String} uid - L'UID de l'utilisateur à récupérer.
 * @param {String} type - Type d'utilisateur : 'PMR' ou 'AGENT'.
 * @returns {Promise<Object>} - Les données de l'utilisateur.
 */
async function getUserFromFirestore(uid, type) {
  try {
    // Choisir Firestore en fonction du type d'utilisateur
    const db = type === "PMR" ? dbFireStorePMR : dbFireStoreAgent;

    // Référence au document utilisateur
    const userRef = db.collection("users").doc(uid);

    // Récupérer l'utilisateur depuis Firestore
    const userSnap = await userRef.get();

    if (!userSnap.exists) {
      throw new Error("Utilisateur non trouvé.");
    }

    console.log(`Utilisateur ${uid} récupéré de Firestore (${type}).`);
    return userSnap.data(); // Renvoie les données de l'utilisateur
  } catch (error) {
    console.error("Erreur lors de la récupération de l'utilisateur dans Firestore :", error);
    throw new Error("Impossible de récupérer l'utilisateur.");
  }
}


module.exports = { saveUserToFirestore,getUserFromFirestore };
