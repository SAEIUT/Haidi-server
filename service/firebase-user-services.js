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
 * @param {String} identifier - L'UID ou l'email de l'utilisateur à récupérer.
 * @param {String} type - Type d'utilisateur : 'PMR' ou 'AGENT'.
 * @param {String} field - Le champ à utiliser pour la recherche ('uid' ou 'email').
 * @returns {Promise<Object>} - Les données de l'utilisateur.
 */
async function getUserFromFirestore(identifier, type, field = "uid") {
  try {
    // Choisir Firestore en fonction du type d'utilisateur
    const db = type === "PMR" ? dbFireStorePMR : dbFireStoreAgent;

    let userSnap;

    if (field === "uid") {
      // Référence au document utilisateur par UID
      const userRef = db.collection("users").doc(identifier);
      userSnap = await userRef.get();
    } else if (field === "email") {
      // Rechercher l'utilisateur par email
      const userQuery = await db.collection("users").where("email", "==", identifier).get();
      if (userQuery.empty) {
        throw new Error("Utilisateur non trouvé.");
      }
      userSnap = userQuery.docs[0];
    } else {
      throw new Error("Champ de recherche invalide.");
    }

    if (!userSnap.exists) {
      throw new Error("Utilisateur non trouvé.");
    }

    console.log(`Utilisateur ${identifier} récupéré de Firestore (${type}) via ${field}.`);
    return userSnap.data(); // Renvoie les données de l'utilisateur
  } catch (error) {
    console.error("Erreur lors de la récupération de l'utilisateur dans Firestore :", error);
    throw new Error("Impossible de récupérer l'utilisateur.");
  }
}

module.exports = { saveUserToFirestore,getUserFromFirestore };
