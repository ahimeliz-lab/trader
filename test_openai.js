require("dotenv").config();
const OpenAI = require("openai");

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

(async () => {
  const r = await client.embeddings.create({
    model: "text-embedding-3-large",
    input: "test"
  });
  console.log("OK, dim =", r.data[0].embedding.length);
})();
