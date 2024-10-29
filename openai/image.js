require('dotenv').config();
const OpenAI = require('openai');
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const generateImage = async (prompt) => {
  try {
    const response = await openai.images.generate({
      prompt: prompt,
      n: 1,             // Number of images to generate
      size: '512x512' // Image resolution
    });
    
    // Assuming the response contains URLs of generated images
    return response.data[0].url;
  } catch (error) {
    console.error('Error generating image:', error);
    throw new Error('Error generating image');
  }
};

module.exports = generateImage;
