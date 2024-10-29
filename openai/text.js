require('dotenv').config();
const OpenAI = require('openai');
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const generateText = async (prompt) => {
  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: 'You are a helpful assistant.' },
        { role: 'user', content: prompt }
      ],
      //max_tokens: 100
    });
    return response.choices[0].message.content.trim();
  } catch (error) {
    console.error('Error generating text:', error);
    throw new Error('Error generating text');
  }
};

module.exports = generateText;
