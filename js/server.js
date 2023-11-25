const express = require('express');
const cors = require('cors');
const path = require('path');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const { MongoClient } = require('mongodb');
const session = require('express-session');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());

// Use sessions
app.use(session({
  secret: '95f0f21221ed1db9e1d4d5d3b601840f2d3f5a491ac4839cc5437a6800f1fde4',
  resave: false,
  saveUninitialized: true,
}));


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

// Route to register a user
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

// Route to authenticate and login user
app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const collection = client.db('smartdb').collection('users');

    const user = await collection.findOne({ emailId: email });

    if (user) {
      const passwordMatch = await bcrypt.compare(password, user.password);

      if (passwordMatch) {
        // Store user data in session
        req.session.user = { email };
        res.json({ success: true, user: { email: user.email } });
      } else {
        res.json({ success: false, message: 'Invalid email or password' });
      }
    } else {
      res.json({ success: false, message: 'Invalid email or password' });
    }
  } catch (error) {
    console.error('Error during login:', error);
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

app.get('/getSessionUser', async (req, res) => {
  try {
    const currUser = req.session.user;
    const collection = client.db('smartdb').collection('users');
    const user = await collection.findOne({ emailId: currUser.email });

    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ error: 'User not found' });
    }
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});