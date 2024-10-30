const express = require('express');
const cors = require('cors');
const { graphqlHTTP } = require('express-graphql');
require('dotenv').config();
const connectDB = require('./database/db');

const schema = require('./graphql/schema');
const resolvers = require('./graphql/resolvers');
const generateText = require('./openai/text');
const generateAudio = require('./openai/audio');
const generateImage = require('./openai/image.js');

const cloudinary = require('cloudinary').v2;

// Configure Cloudinary with credentials
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const app = express();
app.use(cors());
app.use(express.json());

//MongoDB
app.post('/search', async (req, res) => {
  const { term } = req.body;
  console.log(`Search for ${term}`)

  try {
      // Define a MongoDB search history record
      const timestamp = new Date();

      const collection = await connectDB();
      const existingRecord = await collection.findOne({ term });

      if (existingRecord) {
          console.log(existingRecord);
          // Update count if the term has been searched before
          await collection.updateOne(
              { term },
              {
                  $set: { timestamp },
                  $inc: { count: 1 },
              }
          );
          res.json({
            found: true,
            term,
            audioBuffer: existingRecord.audioBuffer,
            imageUrl: existingRecord.imageUrl,
            termHistory: existingRecord.termHistory,
            example: existingRecord.example,
            count: existingRecord ? existingRecord.count + 1 : 1,
        });
      } else {
        res.json({
          found: false,
          message: `No record found for the term "${term}".`
        });
      }
  } catch (error) {
      console.error(error);
      res.status(500).send("An error occurred during the search from MongoDB.");
  }
});

app.post('/new-search', async (req, res) => {
  const { term, audioBuffer, imageUrl, termHistory, example} = req.body;

  try {
      // Define a MongoDB search history record
      const timestamp = new Date();
      const collection = await connectDB();
      // Insert new record for a new term
      await collection.insertOne({
        term,
        timestamp,
        audioBuffer,
        imageUrl,
        termHistory,
        example,
        count: 1,
    });
  } catch (error) {
      console.error(error);
      res.status(500).send("An error occurred during the search from MongoDB.");
  }
});

// GraphQL Middleware
app.use(
  '/graphql',
  graphqlHTTP({
    schema: schema,
    rootValue: resolvers,
    graphiql: true,
  })
);

app.post('/generate-image', async (req, res) => {
  try {
    const { input } = req.body;
    if (!input) return res.status(400).json({ error: 'Input text is required.' });

    // Generate image URL using your generateImage function
    const imageUrl = await generateImage(input);

    // Upload the image URL to Cloudinary
    const uploadedImage = await cloudinary.uploader.upload(imageUrl, {
      folder: 'generated_images', // Optional folder in Cloudinary
    });

    // Send back the secure Cloudinary URL
    res.json({ imageUrl: uploadedImage.secure_url });
  } catch (error) {
    console.error('Error generating or uploading image:', error);
    res.status(500).json({ error: 'Error generating or uploading image.' });
  }
});

// Text generation route
app.post('/generate-text', async (req, res) => {
  try {
    const { prompt } = req.body;
    if (!prompt) return res.status(400).json({ error: 'Prompt is required' });
    const text = await generateText(prompt);
    res.json({ text });
  } catch (error) {
    res.status(500).json({ error: 'Error generating text' });
  }
});

// Audio generation route
app.post('/generate-audio', async (req, res) => {
  try {
    const { input, voice } = req.body;
    if (!input) return res.status(400).json({ error: 'Input text and voice are required.' });
    const audioBuffer = await generateAudio(input, voice);
    res.set('Content-Type', 'audio/mpeg');
    res.send(audioBuffer);
  } catch (error) {
    res.status(500).json({ error: 'Error generating audio.' });
  }
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
