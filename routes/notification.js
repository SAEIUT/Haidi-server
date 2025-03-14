var express = require('express');
var router = express.Router();
const db = require('../sql-database');
const {startConsumer, sendMessage, initProducer} = require('../kafka');
const path = require('path');
const { stringify } = require('querystring');

router.use(express.json());

// Initialize Kafka producer
initProducer().catch((err) => {
  console.error('Error initializing Kafka producer:', err);
});

// In-memory storage for notifications (replace with database in production)
const userNotifications = {};

// Route to produce a message
router.post('/produce', async (req, res) => {
  const { message, userId } = req.body;
  try {
    // Send message to Kafka
    await sendMessage(userId, message);
    
    // Also store the message in memory (or database in production)
    if (!userNotifications[userId]) {
      userNotifications[userId] = [];
    }
    
    // Add timestamp to notification
    const notification = {
      message,
      timestamp: new Date().toISOString(),
    };
    
    // Add to the beginning of the array (newest first)
    userNotifications[userId].unshift(notification);
    
    res.status(200).send('Message sent to Kafka');
  } catch (err) {
    console.error('Error producing message', err);
    res.status(500).send('Failed to send message');
  }
});

// Route to get notifications for a user
router.post('/notifications', async (req, res) => {
  const { userId } = req.body;
  
  try {
    // Return notifications for this user, or empty array if none
    res.json(userNotifications[userId] || []);
  } catch (err) {
    console.error('Error fetching notifications', err);
    res.status(500).send('Failed to fetch notifications');
  }
});

// Original SSE consumer endpoint (can be used from web clients that support SSE)
router.post('/consume', async (req, res) => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');

  res.write('data: Consumer started\n\n');

  try {
    // Start the Kafka consumer and push events as messages are consumed
    await startConsumer((message) => {
      // Store the message in memory/database
      const userId = message.userId || req.body.userId;
      if (!userNotifications[userId]) {
        userNotifications[userId] = [];
      }
      
      // Add timestamp if not already present
      if (!message.timestamp) {
        message.timestamp = new Date().toISOString();
      }
      
      // Add to the beginning of the array (newest first)
      userNotifications[userId].unshift(message);
      
      // Send the consumed message to the client in real-time using SSE
      res.write(`data: ${JSON.stringify(message)}\n\n`);
    }, req.body.userId);
  } catch (err) {
    console.error('Error starting the consumer', err);
    res.status(500).send('Failed to start the consumer');
  }
});

module.exports = router;