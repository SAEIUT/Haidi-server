// firebaseController.js
const { signInWithEmailAndPassword, createUserWithEmailAndPassword } = require('firebase/auth');
const { authPMR, authAGENT } = require('../config/firebase-config');
const {adminAuthPMR, adminAuthAgent, dbFireStoreAgent,dbFireStorePMR} = require('../config/firebase-admin-config');
const { doc, getDoc } = require('firebase/firestore');
const { saveUserToFirestore,getUserFromFirestore } = require("../service/firebase-user-services");

// Vérification de l'existence de l'email
exports.checkEmailExists = async (req, res) => {
  const { email } = req.body;
  const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;

  if (!emailRegex.test(email)) {
    return res.status(400).send({ error: 'Email invalide' });
  }

  try {
    await adminAuthPMR.getUserByEmail(email);
    res.send({ exists: true });
  } catch (error) {
    if (error.code === 'auth/user-not-found') {
      res.send({ exists: false });
    } else {
      console.error(error);
      res.status(500).send({ error: error.message });
    }
  }
};


// Fonction pour se connecter avec un email et un mot de passe
exports.signInUser = async (req, res) => {

  try {
    const { email, password } = req.body;
    const userCredential = await signInWithEmailAndPassword(authPMR, email, password);
    return res.status(200).json({ user: userCredential.user });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

// Fonction pour créer un utilisateur avec un email et un mot de passe
exports.createUser = async (req, res) => {
  const { email, password, firstname, lastname, birthdate, civility, Tel, Note, handicap } = req.body;

  // Vérification de chaque champ et renvoi d'un message d'erreur détaillant lequel est vide
  if (!email) {
    return res.status(400).json({ error: "Le champ 'email' est obligatoire." });
  }
  if (!password) {
    return res.status(400).json({ error: "Le champ 'password' est obligatoire." });
  }
  if (!firstname) {
    return res.status(400).json({ error: "Le champ 'firstname' est obligatoire." });
  }
  if (!lastname) {
    return res.status(400).json({ error: "Le champ 'lastname' est obligatoire." });
  }
  if (!birthdate) {
    return res.status(400).json({ error: "Le champ 'birthdate' est obligatoire." });
  }
  if (!civility) {
    return res.status(400).json({ error: "Le champ 'civility' est obligatoire." });
  }
  if (!Tel) {
    return res.status(400).json({ error: "Le champ 'Tel' est obligatoire." });
  }
  if (!Note) {
    return res.status(400).json({ error: "Le champ 'note' est obligatoire." });
  }
  if (!handicap) {
    return res.status(400).json({ error: "Le champ 'handicap' est obligatoire." });
  }
  try {
    const userCredential = await createUserWithEmailAndPassword(authPMR, email, password);
    const user = userCredential.user;

    // Enregistrement dans Firestore pour PMR
    await saveUserToFirestore({
      uid: user.uid,
      firstname,
      lastname,
      birthdate,
      email,
      civility,
      Tel,
      Note,
      handicap,
    }, 'PMR');

    return res.status(200).json({ user });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};



// Fonction pour se connecter avec un email et un mot de passe
exports.signInAgent = async (req, res) => {

  try {
    const { email, password } = req.body;
    const userCredential = await signInWithEmailAndPassword(authAGENT, email, password);
    return res.status(200).json({ user: userCredential.user });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

// Fonction pour créer un utilisateur avec un email et un mot de passe
exports.createAgent = async (req, res) => {
  const { email, password, entreprise, civility, Tel } = req.body;
  if (!email) {
    return res.status(400).json({ error: "Le champ 'email' est obligatoire." });
  }
  if (!password) {
    return res.status(400).json({ error: "Le champ 'password' est obligatoire." });
  }
  if (!entreprise) {
    return res.status(400).json({ error: "Le champ 'entreprise' est obligatoire." });
  }
  if (!civility) {
    return res.status(400).json({ error: "Le champ 'civility' est obligatoire." });
  }
  if (!Tel) {
    return res.status(400).json({ error: "Le champ 'Tel' est obligatoire." });
  }
  try {
    const userCredential = await createUserWithEmailAndPassword(authAGENT, email, password);
    const user = userCredential.user;

    // Enregistrement dans Firestore pour AGENT
    await saveUserToFirestore({
      uid: user.uid, 
      email,
      entreprise,
      civility,
      Tel,
    }, 'AGENT');

    return res.status(200).json({ user });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

exports.getUserByUid = async (req, res) => {
  const { uid } = req.params;

  if (!uid) {
    return res.status(400).json({ error: "Le champ 'uid' est obligatoire." });
  }

  try {
    // Récupérer l'utilisateur depuis Firestore en fonction du type PMR
    const user = await getUserFromFirestore(uid, "PMR");

    // Si l'utilisateur est trouvé
    return res.status(200).json({ user });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: error.message });
  }
};

exports.getAgentByUid = async (req, res) => {
  const { uid } = req.params;

  if (!uid) {
    return res.status(400).json({ error: "Le champ 'uid' est obligatoire." });
  }

  try {
    // Récupérer l'agent depuis Firestore en fonction du type AGENT
    const agent = await getUserFromFirestore(uid, "AGENT");

    // Si l'agent est trouvé
    return res.status(200).json({ agent });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: error.message });
  }
};

exports.updateUser = async (req, res) => {
  const { uid } = req.params;
  const updatedData = req.body;  // Assurez-vous que les clés correspondent bien à celles du document Firestore
  try {
    const userRef = dbFireStorePMR.collection('users').doc(uid);
    await userRef.update(updatedData);
    // Optionnel : récupérer le document mis à jour pour le renvoyer
    const updatedUser = await userRef.get();
    res.status(200).json({ message: 'Mise à jour réussie', user: updatedUser.data() });
  } catch (error) {
    console.error('Erreur lors de la mise à jour de l’utilisateur Firebase :', error);
    res.status(500).json({ error: error.message });
  }
};
