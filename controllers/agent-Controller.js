const db = require('../sql-database');
const data_manip = require('../service/data-manipulation');

const API_MAPPING = data_manip.API_MAPPING;

exports.getAllAgents = async (req, res) => {
  try {
    const agents = await db.Agent.findAll();
    res.status(200).json(agents);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getAgentById = async (req, res) => {
  try {
    const agent = await db.Agent.findByPk(req.params.id);
    if (!agent) {
      res.status(404).json({ error: "Agent non trouvé." });
    }
    if(agent.entreprise!=null){
      
      API_MAPPING[entreprise] + "/agent/"

    }
    res.status(200).json(agent);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.createAgent = async (req, res) => {
  try {
    const agent = await db.Agent.create({
      email: req.body.email,
      password: req.body.password,
      entreprise: req.body.entreprise,
      googleUUID: req.body.googleUUID,
      tel: req.body.tel
    });
    res.status(200).json(agent);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deleteAgent = async (req, res) => {
  try {
    await db.Agent.destroy({ where: { id: req.params.id } });
    res.status(200).json({ message: "Agent supprimé avec succès." });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getTrajetsFromAgent = async (req, res) => {
  try {
    const agent = await db.Agent.findByPk(req.params.id);
    const voyages = await data_manip.getTrajetsForPlace(agent);
    res.status(200).json(voyages);
  } catch (err) {
    console.error('Error in GET /getTrajetsFromAgent/:id', err.message);
    res.status(500).json({ error: err.message });
  }
};

exports.getTrajetsFromUuid = async (req, res) => {
  try {
    const agent = await db.Agent.findOne({ where: { googleUUID: req.params.uuid } });
    console.log(agent);
    const voyages = await data_manip.getTrajetsForPlace(agent);
    console.log(voyages);
    res.status(200).json(voyages);
  } catch (err) {
    console.error('Error in GET /getTrajetsFromUuid/:uuid', err.message);
    res.status(500).json({ error: err.message });
  }
};
