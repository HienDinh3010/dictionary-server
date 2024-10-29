require('dotenv').config();
const OpenAI = require('openai');
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const generateAudio = async (input) => {
  try {
    const mp3 = await openai.audio.speech.create({
      model: 'tts-1',
      voice: 'nova',
      input: input
    });
    const buffer = await mp3.arrayBuffer();
    return Buffer.from(buffer); // Convert arrayBuffer to Buffer
  } catch (error) {
    console.error('Error generating audio:', error);
    throw new Error('Error generating audio');
  }
};

module.exports = generateAudio;
