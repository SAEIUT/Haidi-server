var express = require('express');
var router = express.Router();
const userController = require('../controllers/userController');


router.use(express.json());

router.get("/all", userController.getAllUsers);
router.get('/:id', userController.getUserById);
router.post('/', userController.createUser);
router.get('/byGoogleID/:uuid', userController.getUserByGoogleId);
router.post('/:id', userController.updateUser);
router.post('/byGoogleID/:uuid', userController.updateUser);
router.get("/delete/:id", userController.deleteUser);
router.get("/getIfAccompagnantOfPMR/:id", userController.getIfAccompagnantOfPMR);

module.exports = router;
/**
 * @swagger
 * tags:
 *   name: Users
 *   description: User management and operations
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       required:
 *         - firstname
 *         - lastname
 *         - birthdate
 *         - email
 *         - tel
 *         - password
 *       properties:
 *         id:
 *           type: integer
 *           description: The unique ID of the user
 *         firstname:
 *           type: string
 *           description: The firstname of the user
 *         lastname:
 *           type: string
 *           description: The lastname of the user
 *         birthdate:
 *           type: string
 *           format: date
 *           description: The birthdate of the user
 *         email:
 *           type: string
 *           description: The email of the user
 *         tel:
 *           type: integer
 *           description: The phone number of the user
 *         password:
 *           type: string
 *           description: The password of the user
 *         civility:
 *           type: string
 *           description: Civility of the user (e.g., Mr., Ms.)
 *         note:
 *           type: string
 *           description: Additional notes about the user
 *         handicap:
 *           type: integer
 *           description: Foreign key referencing a handicap
 *         googleUUID:
 *           type: string
 *           description: The Google UUID of the user
 *         role:
 *           type: string
 *           description: The role of the user (accompagnant, pmr)
 *         Handicap:
 *           type: object
 *           description: Associated handicap details
 *           $ref: '#/components/schemas/Handicap'
 *     Handicap:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           description: The unique ID of the handicap
 *         code:
 *           type: string
 *           description: The code of the handicap
 */

/**
 * @swagger
 * /api/user/all:
 *   get:
 *     summary: Get all users
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: List of all users
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/user/{id}:
 *   get:
 *     summary: Get a user by ID
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID of the user
 *     responses:
 *       200:
 *         description: User details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/user/:
 *   post:
 *     summary: Create a new user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               firstname:
 *                 type: string
 *               lastname:
 *                 type: string
 *               birthdate:
 *                 type: string
 *                 format: date
 *               email:
 *                 type: string
 *               tel:
 *                 type: integer
 *               password:
 *                 type: string
 *               civility:
 *                 type: string
 *               note:
 *                 type: string
 *               handicap:
 *                 type: integer
 *               googleUUID:
 *                 type: string
 *               role:
 *                 type: string
 *                 description: The role of the user (accompagnant, pmr)
 *     responses:
 *       201:
 *         description: User created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/user/{id}:
 *   post:
 *     summary: Update an existing user
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID of the user to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               firstname:
 *                 type: string
 *               lastname:
 *                 type: string
 *               birthdate:
 *                 type: string
 *                 format: date
 *               email:
 *                 type: string
 *               tel:
 *                 type: integer
 *               password:
 *                 type: string
 *               civility:
 *                 type: string
 *               note:
 *                 type: string
 *               handicap:
 *                 type: integer
 *               role:
 *                 type: string
 *                 description: The role of the user (accompagnant, pmr)
 *     responses:
 *       201:
 *         description: User updated successfully
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/user/delete/{id}:
 *   get:
 *     summary: Delete a user by ID
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID of the user to delete
 *     responses:
 *       200:
 *         description: User deleted successfully
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/user/byGoogleID/{uuid}:
 *   get:
 *     tags: [Users]
 *     summary: Récupérer un utilisateur par Google UUID
 *     description: Retourne un utilisateur en fonction de son Google UUID
 *     parameters:
 *       - name: uuid
 *         in: path
 *         required: true
 *         description: L'UUID de l'utilisateur
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Utilisateur trouvé
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       500:
 *         description: Erreur serveur
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Message d'erreur détaillé"
 */


/**
 * @swagger
 * /api/user/getIfAccompagnantOfPMR/{id}:
 *   get:
 *     tags: [Users]
 *     summary: Vérifie si un utilisateur est accompagnant d'une personne à mobilité réduite (PMR)
 *     description: Recherche dans les réservations si l'ID spécifié correspond à un accompagnant (id_accompagnant ou googleId_accompagnant).
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID ou Google ID de l'utilisateur à vérifier
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Liste des voyages où l'utilisateur est accompagnant
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   idPMR:
 *                     type: string
 *                     description: Identifiant de la personne à mobilité réduite
 *                   idVoyage:
 *                     type: string
 *                     description: Identifiant du voyage
 *       404:
 *         description: Aucune correspondance trouvée
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Aucune correspondance trouvée."
 *       500:
 *         description: Erreur serveur
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Message d'erreur détaillé"
 */



