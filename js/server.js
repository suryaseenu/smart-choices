const express = require('express');
const cors = require('cors');
const path = require('path');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const { MongoClient } = require('mongodb');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());

const uri = 'mongodb+srv://smartchoicesuser:smartchoicespassword@smartchoicescluster.jf5ctae.mongodb.net/?retryWrites=true&w=majority';
let client;

async function connect() {
  try {
    client = await MongoClient.connect(uri);
    console.log("Connected to MongoDB");
    return client;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

async function closeConnection() {
  try {
    if (client) {
      await client.close();
      console.log("MongoDB connection closed");
    }
  } catch (error) {
    console.error("Error closing MongoDB connection:", error);
  }
}

// Serve static files
const staticPath = path.resolve('/Users/surya/Documents/GitHub/se-project/');
app.use(express.static(staticPath));

// Route for the root URL
app.get('/', (req, res) => {
  res.sendFile(path.join(staticPath, 'index.html'));
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

// Connect to MongoDB when the application starts
connect();

// Close the MongoDB connection when the application exits
process.on('SIGINT', async () => {
  await closeConnection();
  process.exit();
});

process.on('SIGTERM', async () => {
  await closeConnection();
  process.exit();
});

app.post('/register', async (req, res) => {
  const userData = req.body;

  try {
    const hashedPassword = await bcrypt.hash(userData.password, 10);
    userData.password = hashedPassword;

    const collection = client.db('smartdb').collection('users');

    collection.insertOne(userData, (err, result) => {
      if (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
      } else {
        console.log(`Inserted ${result.insertedCount} document into the collection`);
        res.json({ success: true });
      }
    });
  } catch (error) {
    console.error('Error hashing password:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});


// Route to get a question from the database
app.get('/question', async (req, res) => {
  try {
    const questionNumber = req.query.questionNumber;

    const collection = client.db('smartdb').collection('questions');
    const question = await collection.findOne({ questionNumber: parseInt(questionNumber) });

    if (question) {
      res.json(question);
    } else {
      res.status(404).json({ error: 'Question not found' });
    }
  } catch (error) {
    console.error('Error fetching question:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});
