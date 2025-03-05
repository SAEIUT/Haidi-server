var express = require('express');
var router = express.Router();
const agentController = require('../controllers/agent-Controller');


router.use(express.json());

router.get("/all",agentController.getAllAgents);

router.get('/:id', agentController.getAgentById);

router.post('/', agentController.createAgent);

router.get("/delete/:id", agentController.deleteAgent);

router.get('/getTrajetsFromAgent/:id',agentController.getTrajetsFromAgent)

router.get('/getTrajetsFromUuid/:uuid',agentController.getTrajetsFromUuid)


module.exports = router;

/**
 * @swagger
 * tags:
 *   name: Agents
 *   description: Agent management and operations
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Agent:
 *       type: object
 *       required:
 *         - email
 *         - password
 *         - entreprise
 *       properties:
 *         id:
 *           type: integer
 *           description: The unique ID of the agent
 *         email:
 *           type: string
 *           description: The email of the agent
 *         password:
 *           type: string
 *           description: The password of the agent
 *         entreprise:
 *           type: string
 *           description: The enterprise associated with the agent
 */

/**
 * @swagger
 * /api/agent/all:
 *   get:
 *     summary: Get all agents
 *     tags: [Agents]
 *     responses:
 *       200:
 *         description: List of all agents
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Agent'
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/agent/{id}:
 *   get:
 *     summary: Get an agent by ID
 *     tags: [Agents]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID of the agent
 *     responses:
 *       200:
 *         description: Agent details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Agent'
 *       404:
 *         description: Agent not found
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/agent/:
 *   post:
 *     summary: Create a new agent
 *     tags: [Agents]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: The email of the agent
 *                 example: agent@example.com
 *               password:
 *                 type: string
 *                 description: The password of the agent
 *                 example: securepassword
 *               entreprise:
 *                 type: string
 *                 description: The enterprise associated with the agent
 *                 example: TechCorp
 *     responses:
 *       201:
 *         description: Agent created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Agent'
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/agent/delete/{id}:
 *   get:
 *     summary: Delete an agent by ID
 *     tags: [Agents]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID of the agent to delete
 *     responses:
 *       200:
 *         description: Agent deleted successfully
 *       404:
 *         description: Agent not found
 *       500:
 *         description: Internal server error
 */
