// /routes/userRoutes.js

var express = require('express');
const { checkEmailExists, signInUser, createUser,signInAgent,createAgent,getUserByUid,getAgentByUid, updateUser,getUserByEmail,getAgentByEmail } = require('../controllers/firebase-user-controller');
const { get } = require('http');

const router = express.Router();

router.post('/user/check-email', checkEmailExists);

router.post('/user/sign-in', signInUser);

router.post('/user/sign-up', createUser);


router.post('/agent/sign-in', signInAgent);

router.post('/agent/sign-up', createAgent);

router.get('/user/:uid', getUserByUid);
router.get('/agent/:uid', getAgentByUid);

router.post('/user/getByMail', getUserByEmail);
router.post('/agent/getByMail', getAgentByEmail);

router.put('/user/:uid', updateUser);

module.exports = router;


/**
 * @swagger
 * /api/firebase/user/check-email:
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
 * /api/firebase/user/sign-in:
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
 * /api/firebase/user/sign-up:
 *   post:
 *     tags: [Firebase]
 *     summary: Créer un nouvel utilisateur
 *     description: Crée un nouvel utilisateur avec un email, mot de passe et d'autres informations personnelles.
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
 *               firstname:
 *                 type: string
 *                 description: Le prénom de l'utilisateur.
 *                 example: 'John'
 *               lastname:
 *                 type: string
 *                 description: Le nom de famille de l'utilisateur.
 *                 example: 'Doe'
 *               birthdate:
 *                 type: string
 *                 format: date
 *                 description: La date de naissance de l'utilisateur.
 *                 example: '1990-01-01'
 *               civility:
 *                 type: string
 *                 description: La civilité de l'utilisateur.
 *                 example: 'M.'
 *               Tel:
 *                 type: string
 *                 description: Le numéro de téléphone de l'utilisateur.
 *                 example: '0123456789'
 *               Note:
 *                 type: string
 *                 description: Des notes supplémentaires concernant l'utilisateur.
 *                 example: Notes importantes
 *               handicap:
 *                 type: boolean
 *                 description: Indique si l'utilisateur a un handicap.
 *                 example: false
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
 *       400:
 *         description: Erreur de validation, un ou plusieurs champs obligatoires sont manquants.
 *       500:
 *         description: Erreur du serveur.
 */

/**
 * @swagger
 * /api/firebase/agent/sign-up:
 *   post:
 *     tags: [Firebase]
 *     summary: Créer un nouvel agent
 *     description: Crée un nouvel agent avec un email, mot de passe et autres informations professionnelles.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: L'email de l'agent.
 *                 example: 'agent@example.com'
 *               password:
 *                 type: string
 *                 description: Le mot de passe de l'agent.
 *                 example: 'agentpassword123'
 *               entreprise:
 *                 type: string
 *                 description: Le nom de l'entreprise de l'agent.
 *                 example: 'Entreprise XYZ'
 *               civility:
 *                 type: string
 *                 description: La civilité de l'agent.
 *                 example: 'Mme.'
 *               Tel:
 *                 type: string
 *                 description: Le numéro de téléphone de l'agent.
 *                 example: '0987654321'
 *     responses:
 *       200:
 *         description: Agent créé avec succès.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user:
 *                   type: object
 *                   description: Détails de l'agent créé.
 *       400:
 *         description: Erreur de validation, un ou plusieurs champs obligatoires sont manquants.
 *       500:
 *         description: Erreur du serveur.
 */


/**
 * @swagger
 * /api/firebase/agent/sign-in:
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
 * /api/firebase/user/{uid}:
 *   get:
 *     tags: [Firebase]
 *     summary: Récupérer un utilisateur par son UID
 *     description: Retourne les informations d'un utilisateur Firebase en fonction de son UID.
 *     parameters:
 *       - in: path
 *         name: uid
 *         required: true
 *         schema:
 *           type: string
 *         description: L'UID de l'utilisateur.
 *     responses:
 *       200:
 *         description: Informations de l'utilisateur récupérées avec succès.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user:
 *                   type: object
 *                   description: Détails de l'utilisateur.
 *       404:
 *         description: Utilisateur non trouvé.
 *       500:
 *         description: Erreur du serveur.
 */

/**
 * @swagger
 * /api/firebase/agent/{uid}:
 *   get:
 *     tags: [Firebase]
 *     summary: Récupérer un agent par son UID
 *     description: Retourne les informations d'un agent Firebase en fonction de son UID.
 *     parameters:
 *       - in: path
 *         name: uid
 *         required: true
 *         schema:
 *           type: string
 *         description: L'UID de l'agent.
 *     responses:
 *       200:
 *         description: Informations de l'agent récupérées avec succès.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 agent:
 *                   type: object
 *                   description: Détails de l'agent.
 *       404:
 *         description: Agent non trouvé.
 *       500:
 *         description: Erreur du serveur.
 */

/**
 * @swagger
 * /api/firebase/user/{uid}:
 *   put:
 *     tags: [Firebase]
 *     summary: Mettre à jour un utilisateur par son UID
 *     description: Met à jour les informations d'un utilisateur existant dans Firebase.
 *     parameters:
 *       - in: path
 *         name: uid
 *         required: true
 *         schema:
 *           type: string
 *         description: L'UID de l'utilisateur à mettre à jour.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: Le nouvel email de l'utilisateur.
 *                 example: 'updated@example.com'
 *               firstname:
 *                 type: string
 *                 description: Le prénom mis à jour de l'utilisateur.
 *                 example: 'John'
 *               lastname:
 *                 type: string
 *                 description: Le nom mis à jour de l'utilisateur.
 *                 example: 'Doe'
 *               birthdate:
 *                 type: string
 *                 format: date
 *                 description: La date de naissance mise à jour de l'utilisateur.
 *                 example: '1995-05-15'
 *               civility:
 *                 type: string
 *                 description: La civilité mise à jour de l'utilisateur.
 *                 example: 'M.'
 *               Tel:
 *                 type: string
 *                 description: Le numéro de téléphone mis à jour de l'utilisateur.
 *                 example: '0612345678'
 *               Note:
 *                 type: string
 *                 description: Notes supplémentaires mises à jour concernant l'utilisateur.
 *                 example: 'Utilisateur VIP'
 *               handicap:
 *                 type: boolean
 *                 description: Indique si l'utilisateur a un handicap.
 *                 example: false
 *     responses:
 *       200:
 *         description: Utilisateur mis à jour avec succès.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 'Utilisateur mis à jour avec succès.'
 *       400:
 *         description: Erreur de validation, un ou plusieurs champs sont incorrects.
 *       404:
 *         description: Utilisateur non trouvé.
 *       500:
 *         description: Erreur du serveur.
 */

/**
 * @swagger
 * /api/firebase/user/getByMail:
 *   post:
 *     tags: [Firebase]
 *     summary: Récupère un utilisateur PMR par email
 *     description: Permet de récupérer un utilisateur de type PMR en utilisant son adresse email.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: L'email de l'utilisateur PMR à récupérer
 *     responses:
 *       200:
 *         description: Données de l'utilisateur récupérées avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *       404:
 *         description: Utilisateur non trouvé
 *       500:
 *         description: Erreur serveur
 */

/**
 * @swagger
 * /api/firebase/agent/getByMail:
 *   post:
 *     tags: [Firebase]
 *     summary: Récupère un agent par email
 *     description: Permet de récupérer un utilisateur de type agent en utilisant son adresse email.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: L'email de l'agent à récupérer
 *     responses:
 *       200:
 *         description: Données de l'agent récupérées avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *       404:
 *         description: Agent non trouvé
 *       500:
 *         description: Erreur serveur
 */
