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

  
const allowedOrigins = ['http://localhost:8081', 'http://localhost:8082', 'http://localhost:19006', 'http://localhost:3000','http://localhost','http://localhost:80'];
app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
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

app.get('/list-routes', (req, res) => {
  res.json(listEndpoints(app));
});
app.use('/api/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));


app.use(express.static(path.join(__dirname, 'web/dist'))); // Serve les fichiers générés par Vite

// Si aucune route API n'est trouvée, redirige vers l'app React
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'web/dist/index.html'));
});
module.exports = app;