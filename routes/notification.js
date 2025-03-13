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

router.post('/consume', async (req, res) => {
  console.log('Request body', req.body);
  const { userId } = req.body;

  if (!userId) {
      return res.status(400).send('User ID is required');
  }

  console.log(`Request to consume messages for user ${userId}`);

  // Check if the consumer already exists for this user
  let client = global.clients.find(c => c.userId === userId.toString());

  if (client) {
    // If the user is already being consumed, send the accumulated messages
    console.log(`User ${userId} already has an active consumer.`);
    res.status(200).json(client.messagesBuffer);
    client.messagesBuffer = []; // Clear buffer after sending
    return;
  }

  // Otherwise, create a new consumer for this user
  client = { userId: userId.toString(), messagesBuffer: [] };
  global.clients.push(client);
  console.log(`Consumer started for user ${userId}`);

  try {
    // Start the Kafka consumer and push events to the client's message buffer
    await startConsumer((message) => {
      console.log(`Received message for user ${userId}`, message);
      client.messagesBuffer.push(message);  // Store messages in the client's buffer
    }, userId);

    // Immediately send back an empty list, consumer will keep running
    res.status(200).json([]);
  } catch (err) {
    console.error('Error starting the consumer', err);
    global.clients = global.clients.filter(c => c.userId !== userId.toString()); // Remove client on failure
    res.status(500).send('Failed to start the consumer');
  }
});


// Start consumer only once at application startup
startConsumer((message) => {
    // This will be used later for sending messages to SSE clients
    if (global.clients) {
        global.clients.forEach(client => {
            if (client.userId === message.userId) {
                client.res.write(`data: ${JSON.stringify(message)}\n\n`);
            }
        });
    }
}).catch(console.error);
module.exports = router;