// userController.js
const db = require('../sql-database');
const dbMongo = require('../nosql-database');

// Récupérer tous les utilisateurs
exports.getAllUsers = (req, res) => {
  db.User.findAll()
    .then(users => res.status(200).json(users))
    .catch(err => res.status(500).json({ error: err.message }));
};

// Récupérer un utilisateur par ID
exports.getUserById = (req, res) => {
  db.User.findByPk(req.params.id)
    .then(user => {
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
      res.status(200).json(user);
    })
    .catch(err => res.status(500).json({ error: err.message }));
};

// Créer un nouvel utilisateur
exports.createUser = (req, res) => {
  const { firstname, lastname, birthdate, email, tel, password, civility, note, handicap, googleUUID } = req.body;
  console.log(req.body);
  db.User.create({
    firstname,
    lastname,
    birthdate,
    email,
    tel,
    password,
    civility,
    note,
    handicap,
    googleUUID
  })
  .then(user => res.status(201).json(user))
  .catch(err => res.status(500).json({ error: err.message }));
};

// Récupérer un utilisateur par Google UUID
exports.getUserByGoogleId = (req, res) => {
  db.User.findOne({ where: { googleUUID: req.params.uuid } })
    .then(user => {
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
      res.status(200).json(user);
    })
    .catch(err => res.status(500).json({ error: err.message }));
};

// Modifier un utilisateur
exports.updateUser = (req, res) => {
  const { firstname, lastname, email, tel, password, civility, note, handicap } = req.body;
  db.User.update({
    firstname,
    lastname,
    email,
    tel,
    password,
    civility,
    note,
    handicap
  }, {
    where: { id: req.params.id }
  })
  .then(([affectedRows]) => {
    if (affectedRows === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.status(200).json({ message: 'User updated successfully' });
  })
  .catch(err => res.status(500).json({ error: err.message }));
};

// Supprimer un utilisateur
exports.deleteUser = (req, res) => {
  db.User.destroy({ where: { id: req.params.id } })
    .then(deletedRows => {
      if (deletedRows === 0) {
        return res.status(404).json({ error: 'User not found' });
      }
      res.status(200).json({ message: 'User deleted successfully' });
    })
    .catch(err => res.status(500).json({ error: err.message }));
};


//Recherche dans reservation si l'id indiqué est déjà indiqué soit id_accompagnant ou soit googleId_accompagnant
//Si existe renvoie un dico avec id du pmr et id voyage [{idPMR: idPMR, idVoyage: idVoyage},{idPMR: idPMR, idVoyage: idVoyage}]
  exports.getIfAccompagnantOfPMR = async (req, res) => {
    try {
      const { id } = req.params; // Récupération de l'ID ou Google ID depuis l'URL
  
      // Recherche dans les réservations où l'utilisateur est accompagnant
      const reservations = await dbMongo.Reservation.find({
        $or: [{ id_accompagnant: id }, { googleId_accompagnant: id }]
      });
  
      if (!reservations.length) {
        return res.status(404).json({ error: "Aucune correspondance trouvée." });
      }
  
      // Extraction des données pertinentes
      const result = reservations.map(reservation => ({
        idPMR: reservation.idPMR,
        idVoyage: reservation.idDossier
      }));
  
      res.status(200).json(result);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  };
  