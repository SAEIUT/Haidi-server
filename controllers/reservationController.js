// controllers/reservationController.js
const no_sql_db = require('../nosql-database');
const data_manip = require('../service/data-manipulation');
const db = require('../sql-database');

exports.getAllReservations = async (req, res) => {
  try {
    const reservations = await no_sql_db.DataModel.find();
    res.status(200).json(reservations);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getReservationById = async (req, res) => {
  try {
    const reservation = await no_sql_db.DataModel.findOne({ idDossier: req.params.id });
    if (!reservation) {
      return res.status(404).json({ error: "No reservations found for the given idDossier." });
    }
    const updatedReservation = await data_manip.getDataFromAPIs(reservation._doc);
    res.status(200).json(updatedReservation);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deleteReservation = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedReservation = await no_sql_db.DataModel.findOneAndDelete({ idDossier: id });

    if (!deletedReservation) {
      return res.status(404).json({ error: "Réservation non trouvée." });
    }

    res.status(200).json({ message: "Réservation supprimée avec succès." });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.createReservation = async (req, res) => {
  try {
    const data = req.body;
    if (!data || !data.idPMR || !data.sousTrajets || !data.bagage) {
      return res.status(400).json({ error: 'Invalid data format.' });
    }
    data_manip.sendDataToAPIs(data);
    const transformedData = data_manip.transformData(data);
    const newReservation = new no_sql_db.DataModel(transformedData);
    await newReservation.save();
    res.status(201).json(newReservation);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getReservationsByUserId = async (req, res) => {
  try {
    const reservations = await no_sql_db.DataModel.find({ idPMR: req.params.id });
    const updatedReservations = await Promise.all(reservations.map(async (r) => await data_manip.getDataFromAPIs(r._doc)));
    res.status(200).json(updatedReservations);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getReservationsByGoogleId = async (req, res) => {
  try {
      const reservations = await no_sql_db.DataModel.find({ googleId: req.params.id });
      const reservationsData = reservations.map(doc => doc._doc);
      const updatedReservations = await Promise.all(
        reservationsData.map(async (reservation) => {
              return await data_manip.getDataFromAPIs(reservation);
          })
      );

      res.status(200).json(updatedReservations);
  } catch (err) {
      console.error('Error in GET /bygoogleid/:id:', err.message);
      res.status(500).json({ error: err.message });
  }
  };


exports.getTrajet = async (req, res) => {
      try{
        const trajet = await no_sql_db.DataModel.findOne({idDossier:req.params.dossier, "sousTrajets.numDossier":req.params.trajet},
          {
            "sousTrajets.$": 1
          });
        console.log(trajet);
        const updatedTrajet = await data_manip.getTrajetFromAPIs(trajet.sousTrajets[0]);
    
        res.status(200).json(updatedTrajet)
      } catch (err) {
        console.error('Error in GET /:dossier/:trajet', err.message);
        res.status(500).json({ error: err.message });
      }
 };

 exports.setTrajetDone = async (req, res) => {
    no_sql_db.DataModel.updateOne({idDossier:req.params.dossier, "sousTrajets.numDossier":req.params.trajet}, { $set: {"sousTrajets.$.statusValue":2}})
  .then( reservation => {
    res.status(200).send(JSON.stringify(reservation));
  })
  .catch( err => {
    res.status(500).send(JSON.stringify(err));
  });
};

exports.setTrajetOngoing = async (req, res) => {
     no_sql_db.DataModel.updateOne({idDossier:req.params.dossier, "sousTrajets.numDossier":req.params.trajet}, { $set: {"sousTrajets.$.statusValue":1}})
      .then( reservation => {
        res.status(200).send(JSON.stringify(reservation));
      })
      .catch( err => {
        res.status(500).send(JSON.stringify(err));
      });
    };


//req = {idReservations, emailAccompagnant}
//rechercher si accompagnant existe
//si existe ajouter id accompagnant à la reservation
//sinon renvoyer erreur
exports.addAccompagnantToTrajet = async (req, res) => {
  try {
    const { idDossier } = req.params;
    console.log(idDossier);
    const { emailAccompagnant } = req.body; 
    if (!emailAccompagnant) {
      return res.status(400).json({ error: 'Email de l\'accompagnant est requis' });
    }

    const accompagnant = await db.User.findOne({ email: emailAccompagnant });
    if (!accompagnant) {
      return res.status(404).json({ error: 'Accompagnant non trouvé' });
    }
    // Ajouter l'id de l'accompagnant à la réservation
    const reservation = await no_sql_db.DataModel.findOne({ idDossier: idDossier });
    if (!reservation) {
      return res.status(404).json({ error: 'Réservation non trouvée' });
    }
    // Ajouter l'accompagnant à la réservation
    reservation.id_accompagnant = accompagnant.id;
    await reservation.save();
    return res.status(200).json({ message: 'Accompagnant ajouté à la réservation', reservation });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Erreur interne du serveur' });
  }
};

