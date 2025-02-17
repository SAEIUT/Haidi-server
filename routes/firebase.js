// /routes/userRoutes.js

var express = require('express');
const { checkEmailExists, signInUser, createUser,signInAgent,createAgent } = require('../controllers/firebase-user-controller');

const router = express.Router();

router.post('/user/check-email', checkEmailExists);

router.post('/user/sign-in', signInUser);

router.post('/user/sign-up', createUser);


router.post('/agent/sign-in', signInAgent);

router.post('/agent/sign-up', createAgent);

module.exports = router;


/**
 * @swagger
 * /api/user/check-email:
 *   post:
 * 
 *     summary: Vérifier si un email existe
 *     tags: [Firebase]
 *     description: Vérifie si un email est déjà utilisé pour un compte utilisateur.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: L'email à vérifier.
 *                 example: 'example@example.com'
 *     responses:
 *       200:
 *         description: L'email existe ou n'existe pas.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 exists:
 *                   type: boolean
 *                   description: Indique si l'email existe.
 *                   example: true
 *       400:
 *         description: L'email est invalide.
 *       500:
 *         description: Erreur du serveur.
 */

/**
 * @swagger
 * /api/user/sign-in:
 *   post:
 *     tags: [Firebase]
 *     summary: Se connecter avec un email et un mot de passe
 *     description: Permet à un utilisateur de se connecter avec ses identifiants.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: L'email de l'utilisateur.
 *                 example: 'user@example.com'
 *               password:
 *                 type: string
 *                 description: Le mot de passe de l'utilisateur.
 *                 example: 'password123'
 *     responses:
 *       200:
 *         description: Connexion réussie.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user:
 *                   type: object
 *                   description: Détails de l'utilisateur connecté.
 *       500:
 *         description: Erreur du serveur.
 */

/**
 * @swagger
 * /api/user/sign-up:
 *   post:
 *     tags: [Firebase]
 *     summary: Créer un nouvel utilisateur
 *     description: Crée un nouvel utilisateur avec un email et un mot de passe.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: L'email de l'utilisateur.
 *                 example: 'newuser@example.com'
 *               password:
 *                 type: string
 *                 description: Le mot de passe de l'utilisateur.
 *                 example: 'password123'
 *     responses:
 *       200:
 *         description: Utilisateur créé avec succès.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user:
 *                   type: object
 *                   description: Détails de l'utilisateur créé.
 *       500:
 *         description: Erreur du serveur.
 */

/**
 * @swagger
 * /api/agent/sign-in:
 *   post:
 *     tags: [Firebase]
 *     summary: Se connecter avec un email et un mot de passe
 *     description: Permet à un utilisateur de se connecter avec ses identifiants.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: L'email de l'utilisateur.
 *                 example: 'user@example.com'
 *               password:
 *                 type: string
 *                 description: Le mot de passe de l'utilisateur.
 *                 example: 'password123'
 *     responses:
 *       200:
 *         description: Connexion réussie.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user:
 *                   type: object
 *                   description: Détails de l'utilisateur connecté.
 *       500:
 *         description: Erreur du serveur.
 */

/**
 * @swagger
 * /api/agent/sign-up:
 *   post:
 *     tags: [Firebase]
 *     summary: Créer un nouvel utilisateur
 *     description: Crée un nouvel utilisateur avec un email et un mot de passe.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: L'email de l'utilisateur.
 *                 example: 'newuser@example.com'
 *               password:
 *                 type: string
 *                 description: Le mot de passe de l'utilisateur.
 *                 example: 'password123'
 *     responses:
 *       200:
 *         description: Utilisateur créé avec succès.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user:
 *                   type: object
 *                   description: Détails de l'utilisateur créé.
 *       500:
 *         description: Erreur du serveur.
 */