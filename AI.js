const OpenAI = require('openai');
const Configuration = OpenAI.Configuration;
const OpenAIApi = OpenAI.OpenAIApi;

const ai = async function(prompt) {
  const configuration = new Configuration({
      apiKey: process.env.OPENAI_API_KEY
  });

  const openai = new OpenAIApi(configuration);
  return openai.createCompletionFromModel({
      model: process.env.OPENAI_ENGINE_ID,
      prompt: prompt,
      max_tokens: Number(process.env.OPENAI_MAX_TOKENS),
      temperature: Number(process.env.OPENAI_TEMPERATURE),
      presence_penalty: Number(process.env.OPENAI_PRESENCE),
      frequency_penalty: Number(process.env.OPENAI_FREQUENCY),
      stop: process.env.OPENAI_STOP.split(","),
    }
  );
}

module.exports = ai;
