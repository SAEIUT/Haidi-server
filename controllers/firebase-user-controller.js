// firebaseController.js
const { signInWithEmailAndPassword, createUserWithEmailAndPassword, fetchSignInMethodsForEmail } = require('firebase/auth');
const { authPMR, authAGENT } = require('../config/firebase-config');
const {adminAuth} = require('../config/firebase-admin-config');

// Vérification de l'existence de l'email
exports.checkEmailExists = async (req, res) => {
  const { email } = req.body;
  const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;

  if (!emailRegex.test(email)) {
    return res.status(400).send({ error: 'Email invalide' });
  }

  try {
    await adminAuth.getUserByEmail(email);
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
  const { email, password } = req.body;

  try {
    const userCredential = await createUserWithEmailAndPassword(authPMR, email, password);
    return res.status(200).json({ user: userCredential.user });
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
  const { email, password } = req.body;

  try {
    const userCredential = await createUserWithEmailAndPassword(authAGENT, email, password);
    return res.status(200).json({ user: userCredential.user });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};