var express = require('express');
var router = express.Router();
const reservationController = require('../controllers/reservationController');

router.use(express.json());

router.get('/all', reservationController.getAllReservations);

router.get('/:id', reservationController.getReservationById);

router.post('/',reservationController.createReservation);

router.get('/deleteReservation/:id',reservationController.deleteReservation);

router.get('/byuserid/:id',reservationController.getReservationsByUserId);

router.get('/bygoogleid/:id', reservationController.getReservationsByGoogleId);

router.get('/:dossier/:trajet', reservationController.getTrajet);

router.get('/setDone/:dossier/:trajet', reservationController.setTrajetDone);

router.get('/setOngoing/:dossier/:trajet', reservationController.setTrajetOngoing);

router.post('/addAccompagnant/:idDossier', reservationController.addAccompagnantToTrajet);


module.exports = router;

/**
 * @swagger
 * tags:
 *   name: Reservations
 *   description: API for managing reservations and sousTrajets
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     SousTrajet:
 *       type: object
 *       properties:
 *         BD:
 *           type: string
 *           description: The type of booking or transport (e.g., AF, SNCF)
 *         numDossier:
 *           type: integer
 *           description: Sub-reservation dossier number
 *         statusValue:
 *           type: integer
 *           description: Status of the sousTrajet (0 = pending, 1 = ongoing, 2 = done)
 *         departure:
 *           type: string
 *           description: Departure location
 *         arrival:
 *           type: string
 *           description: Arrival location
 *         departureTime:
 *           type: string
 *           format: date-time
 *           description: Departure time
 *         arrivalTime:
 *           type: string
 *           format: date-time
 *           description: Arrival time
 *     Bagage:
 *       type: object
 *       properties:
 *         bagagesList:
 *           type: array
 *           items:
 *             type: integer
 *           description: List of baggage IDs
 *         specialBagage:
 *           type: string
 *           description: Special baggage type (e.g., oversized baggage)
 *     SpecialAssistance:
 *       type: object
 *       properties:
 *         wheelchair:
 *           type: boolean
 *           description: Whether wheelchair assistance is required
 *         visualAssistance:
 *           type: boolean
 *           description: Whether visual assistance is required
 *         hearingAssistance:
 *           type: boolean
 *           description: Whether hearing assistance is required
 *         otherAssistance:
 *           type: string
 *           description: Other types of assistance required
 *     Security:
 *       type: object
 *       properties:
 *         validDocuments:
 *           type: boolean
 *           description: Whether the documents are valid
 *         documentsExpiry:
 *           type: string
 *           description: Expiry date of documents
 *         dangerousItems:
 *           type: array
 *           items:
 *             type: string
 *           description: List of dangerous items
 *         liquidVolume:
 *           type: string
 *           description: Volume of liquid items
 *         medicalEquipment:
 *           type: string
 *           description: Medical equipment carried
 *         securityQuestions:
 *           type: object
 *           properties:
 *             packedOwn:
 *               type: boolean
 *               description: Whether the passenger packed their own luggage
 *             leftUnattended:
 *               type: boolean
 *               description: Whether luggage was left unattended
 *             acceptedItems:
 *               type: boolean
 *               description: Whether all accepted items were included
 *             receivedItems:
 *               type: boolean
 *               description: Whether received items match the original list
 *             dangerousGoods:
 *               type: boolean
 *               description: Whether dangerous goods are declared
 *         declarations:
 *           type: object
 *           properties:
 *             weaponsFirearms:
 *               type: boolean
 *               description: Whether weapons or firearms are declared
 *             explosives:
 *               type: boolean
 *               description: Whether explosives are declared
 *             flammableMaterials:
 *               type: boolean
 *               description: Whether flammable materials are declared
 *             radioactiveMaterials:
 *               type: boolean
 *               description: Whether radioactive materials are declared
 *             toxicSubstances:
 *               type: boolean
 *               description: Whether toxic substances are declared
 *             compressedGases:
 *               type: boolean
 *               description: Whether compressed gases are declared
 *             illegalDrugs:
 *               type: boolean
 *               description: Whether illegal drugs are declared
 *     Reservation:
 *       type: object
 *       properties:
 *         idDossier:
 *           type: integer
 *           description: Reservation dossier ID
 *         idPMR:
 *           type: integer
 *           description: PMR (Person with Reduced Mobility) ID
 *         googleId:
 *           type: string
 *           description: Google UUID associated with the reservation
 *         enregistre:
 *           type: boolean
 *           description: Registration status
 *         Assistance:
 *           type: integer
 *           description: Assistance required status
 *         sousTrajets:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/SousTrajet'
 *         bagage:
 *           $ref: '#/components/schemas/Bagage'
 *         specialAssistance:
 *           $ref: '#/components/schemas/SpecialAssistance'
 *         security:
 *           $ref: '#/components/schemas/Security'
 *         additionalInfo:
 *           type: object
 *           properties:
 *             emergencyContact:
 *               type: string
 *               description: Emergency contact information
 *             medicalInfo:
 *               type: string
 *               description: Medical information for the passenger
 *             dietaryRestrictions:
 *               type: string
 *               description: Dietary restrictions for the passenger
 */

/**
 * @swagger
 * /api/reservation/all:
 *   get:
 *     summary: Get all reservations
 *     tags: [Reservations]
 *     responses:
 *       200:
 *         description: List of all reservations
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Reservation'
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/reservation/{id}:
 *   get:
 *     summary: Get a reservation by dossier ID
 *     tags: [Reservations]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The dossier ID of the reservation
 *     responses:
 *       200:
 *         description: Reservation details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Reservation'
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/reservation/:
 *   post:
 *     summary: Create a new reservation
 *     tags: [Reservations]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Reservation'
 *     responses:
 *       200:
 *         description: Reservation created successfully
 *       400:
 *         description: Invalid data format
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/reservation/byuserid/{id}:
 *   get:
 *     summary: Get reservations by PMR ID
 *     tags: [Reservations]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The PMR ID to filter reservations
 *     responses:
 *       200:
 *         description: List of reservations for the given PMR ID
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Reservation'
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/reservation/bygoogleid/{id}:
 *   get:
 *     summary: Get reservations by Google ID
 *     tags: [Reservations]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The Google UUID to filter reservations
 *     responses:
 *       200:
 *         description: List of reservations for the given Google ID
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Reservation'
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/reservation/setDone/{dossier}/{trajet}:
 *   get:
 *     summary: Set a sousTrajet status to "done"
 *     tags: [Reservations]
 *     parameters:
 *       - in: path
 *         name: dossier
 *         required: true
 *         schema:
 *           type: integer
 *         description: The dossier ID
 *       - in: path
 *         name: trajet
 *         required: true
 *         schema:
 *           type: integer
 *         description: The trajet ID to update
 *     responses:
 *       200:
 *         description: SousTrajet status updated to "done"
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/reservation/setOngoing/{dossier}/{trajet}:
 *   get:
 *     summary: Set a sousTrajet status to "ongoing"
 *     tags: [Reservations]
 *     parameters:
 *       - in: path
 *         name: dossier
 *         required: true
 *         schema:
 *           type: integer
 *         description: The dossier ID
 *       - in: path
 *         name: trajet
 *         required: true
 *         schema:
 *           type: integer
 *         description: The trajet ID to update
 *     responses:
 *       200:
 *         description: SousTrajet status updated to "ongoing"
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/reservation/addAccompagnant/{reservationId}:
 *   post:
 *     summary: Add an accompagnant to a reservation
 *     tags: [Reservations]
 *     parameters:
 *       - in: path
 *         name: reservationId
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the reservation to which the accompagnant should be added
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               emailAccompagnant:
 *                 type: string
 *                 description: Email of the accompagnant
 *     responses:
 *       200:
 *         description: Accompagnant added successfully
 *       400:
 *         description: Invalid data format
 *       500:
 *         description: Internal server error
 */
/**
 * @swagger
 * /api/reservation/deleteReservation/{id}:
 *   post:
 *     summary: Delete a reservation by dossier ID
 *     tags: [Reservations]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The dossier ID of the reservation to be deleted
 *     responses:
 *       200:
 *         description: Reservation deleted successfully
 *       404:
 *         description: Reservation not found
 *       500:
 *         description: Internal server error
 */
