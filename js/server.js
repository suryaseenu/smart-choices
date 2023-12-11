const express = require('express');
const cors = require('cors');
const path = require('path');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const { MongoClient, ObjectId } = require('mongodb');
const session = require('express-session');

const app = express();
const PORT = process.env.PORT || 3000;

//app.use(cors());

app.use(cors({
  origin: ['https://smartchoices.netlify.app/', 'http://localhost:3000'],
  optionsSuccessStatus: 200
}));
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

async function getLastQuestionNumber() {
  try {
    const collection = client.db('smartdb').collection('questions');
    const lastQuestion = await collection.find().sort({ questionNumber: -1 }).limit(1).toArray();

    return lastQuestion[0].questionNumber;
  } catch (error) {
    console.error('Error fetching last question number:', error);
    throw error;
  }
}

// Serve static files
const staticPath = path.resolve(__dirname, '..'); // __dirname is the directory of the current script
app.use(express.static(staticPath));
//const staticPath = path.resolve('/Users/shafinazyasin/Desktop/GITHUB/SmartSimple');
//app.use(express.static(staticPath));

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
    req.session.lastQuestionNumber = await getLastQuestionNumber();

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

app.post('/saveResponse', async (req, res) => {
  try {
    const responseData = req.body;

    const collection = client.db('smartdb').collection('responses');
    await collection.insertOne(responseData);

    res.json({ success: true });
  } catch (error) {
    console.error('Error saving response:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/getSessionLastQuestionNumber', async (req, res) => {
  try {
    const lastQuestionNum = await getLastQuestionNumber();
    req.session.lastQuestionNumber = lastQuestionNum;
    res.json({ lastQuestionNum });
  } catch (error) {
    console.error('Error fetching session lastQuestionNumber:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Route to get responses for a specific user
app.get('/getUserResponses', async (req, res) => {
  try {
    const userId = req.query.userId;

    const collection = client.db('smartdb').collection('responses');
    const userResponses = await collection.find({ userId }).toArray();

    res.json(userResponses);
  } catch (error) {
    console.error('Error fetching user responses:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Route to handle user logout
app.get('/logout', async (req, res) => {
  try {
    const currUser = req.session.user;
    const userCollection = client.db('smartdb').collection('users');
    const user = await userCollection.findOne({ emailId: currUser.email });

    const collection = client.db('smartdb').collection('responses');

    const userIdString = user._id.toString();
    await collection.deleteMany({ userId: userIdString});

    req.session.destroy();

    res.redirect('/');
  } catch (error) {
    console.error('Error during logout:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Route to get decision details based on decision style
app.get('/getDecisionDetails', async (req, res) => {
  try {
    const decisionStyle = req.query.decisionStyle;

    const collection = client.db('smartdb').collection('decisions');
    const decisionDetails = await collection.findOne({ name: decisionStyle });

    if (decisionDetails) {
      res.json(decisionDetails);
    } else {
      res.status(404).json({ error: 'Decision details not found' });
    }
  } catch (error) {
    console.error('Error fetching decision details:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Route for the redirect URL
app.get('/html/startSurvey', (req, res) => {
  res.sendFile(path.join(staticPath, 'html/startSurvey.html'));
});

// Route for the Re-attempt button
app.get('/reattempt', async (req, res) => {
  try {
    const currUser = req.session.user;
    const userCollection = client.db('smartdb').collection('users');
    const user = await userCollection.findOne({ emailId: currUser.email });

    const collection = client.db('smartdb').collection('responses');

    const userIdString = user._id.toString();
    await collection.deleteMany({ userId: userIdString});

    res.redirect('/html/startSurvey');
  } catch (error) {
    console.error('Error during reattempt:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Route to save attempt result
app.post('/saveAttemptResult', async (req, res) => {
  try {
    const { userId, result, date } = req.body;

    const collection = client.db('smartdb').collection('attempts');
    await collection.insertOne({ userId, result, date });

    res.json({ success: true });
  } catch (error) {
    console.error('Error saving attempt result:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});
app.post('/addquestions', async (req, res) => {
  const questions = req.body;

  try {
    const { userId, questions } = req.body;

    const collection = client.db('smartdb').collection('questions');
    await array.forEach(element => {
       collection.insertOne({ question });
    });

    res.json({ success: true });
  } catch (error) {
    console.error('Error adding new question:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});
