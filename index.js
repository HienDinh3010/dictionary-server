const express = require('express');
const cors = require('cors');
const { graphqlHTTP } = require('express-graphql');

const schema = require('./graphql/schema');
const resolvers = require('./graphql/resolvers');
const generateText = require('./openai/text');
const generateAudio = require('./openai/audio');
const generateImage = require('./openai/image.js')

const app = express();
app.use(cors());
app.use(express.json());

// GraphQL Middleware
app.use(
  '/graphql',
  graphqlHTTP({
    schema: schema,
    rootValue: resolvers,
    graphiql: true,
  })
);

// Image generation route
app.post('/generate-image', async (req, res) => {
  try {
    const { input } = req.body;
    if (!input) return res.status(400).json({ error: 'Input text is required.' });

    // Call the generateImage function to get the image URL
    const imageUrl = await generateImage(input);
    
    // Send the image URL as the response
    res.json({ imageUrl });
  } catch (error) {
    console.error('Error generating image:', error);
    res.status(500).json({ error: 'Error generating image.' });
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
