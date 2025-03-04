var express = require('express');
var router = express.Router();
const db = require('../sql-database');
const {startConsumer,sendMessage, initProducer} = require('../kafka')
const path = require('path');
const { stringify } = require('querystring');

router.use(express.json());

initProducer().catch((err) => {
  console.error('Error initializing Kafka producer:', err);
});


// Route to produce a message
router.post('/produce', async (req, res) => {
  const { message, userId } = req.body;
  try {
    await sendMessage(userId, message);
    res.status(200).send('Message sent to Kafka');
  } catch (err) {
    console.error('Error producing message', err);
    res.status(500).send('Failed to send message');
  }
});

global.clients = [];

router.post('/consume', (req, res) => {
  const { userId } = req.body;
  if (!userId) {
      return res.status(400).send('User ID is required');
  }

  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.flushHeaders();

  // Store client connection
  const client = { userId: userId.toString(), res };
  global.clients.push(client);

  console.log(`Client connected: ${userId}`);

  res.write('data: Connected to consumer\n\n');

  // Handle client disconnect
  req.on('close', () => {
      global.clients = global.clients.filter(c => c !== client);
      console.log(`Client disconnected: ${userId}`);
  });
});
module.exports = router;