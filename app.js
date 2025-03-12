var express = require('express');
var path = require('path');
const cors = require('cors');
const listEndpoints = require('express-list-endpoints');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./swagger');

const vite = require('vite');

var userRouter = require('./routes/user');
var firebaseRouter = require('./routes/firebase');
var agentRouter = require('./routes/agent');
var handicapRouter = require('./routes/handicap');
var reservationRouter = require('./routes/reservation');
var notificationRouter = require('./routes/notification');;
var textRecognitionRouter = require('./routes/textrecognition'); // Nouvelle ligne
var bagageRouter = require('./routes/bagage')


var app = express();
app.use(express.json());
const db = require('./sql-database');

db.sequelize.sync({ alter: true })
  .then(() => {
    console.log('Database synchronized');
  })
  .catch(err => {
    console.error('Error synchronizing the database:', err);
  });

  
  const allowedOrigins = ['http://localhost:8081', 'http://localhost:8000','http://localhost:8082', 'http://localhost:19006', 'http://localhost:3000','http://localhost','http://localhost:80', 'http://4.233.60.46:8081', 'http://4.233.60.46:8082', 'http://4.233.60.46:19006', 'http://4.233.60.46:3000', 'http://4.233.60.46', 'http://4.233.60.46:8000', 'http://4.233.60.46:80',];
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'] ,
}));

app.options('*', cors());




app.use('/api/user/', userRouter);
app.use('/api/firebase/', firebaseRouter);

app.use('/api/agent/', agentRouter);
app.use('/api/handicap/', handicapRouter);
app.use('/api/reservation/', reservationRouter);
app.use('/api/notification/', notificationRouter);
app.use('/api/textrecognition/', textRecognitionRouter); // Nouvelle ligne
app.use('/api/bagage/', bagageRouter);


app.get('/list-routes', (req, res) => {
  res.json(listEndpoints(app));
});
app.use('/api/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

console.log(__dirname);
app.use(express.static(path.join(__dirname, '/web/build'))); // Serve les fichiers générés par Vite

// Correction du chemin avec path.join
app.get('/', (req, res, next) => {
  // Utilisation du chemin relatif correct sans /opt/app
  const filePath = path.join(__dirname, 'web', 'build', 'index.html');
  res.sendFile(filePath, (err) => {
    if (err) {
      if (err.code === 'ENOENT') {
        console.error(`Erreur : Fichier introuvable à l'emplacement ${filePath}`);
        return res.status(404).json({ error: 'Fichier index.html non trouvé.' });
      } else {
        console.error('Erreur lors de la tentative d\'envoi du fichier index.html:', err);
        return next(err);
      }
    }
  });
});

module.exports = app;