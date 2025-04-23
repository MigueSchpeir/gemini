const express = require('express');
const bodyParser = require('body-parser');
const { VertexAI } = require('@google-cloud/vertexai');

const app = express();
app.use(bodyParser.json({ limit: '25mb' }));

const vertexAI = new VertexAI({
  project: process.env.GCP_PROJECT_ID,
  location: 'us-central1'
});

vertexAI.useKeyFile('./credentials.json');

const generativeModel = vertexAI.getGenerativeModel({
  model: 'gemini-2.0-flash-exp',
  generationConfig: { responseMimeType: ['image/png'] }
});

app.post('/edit-image', async (req, res) => {
  try {
    const { prompt, base64Image } = req.body;

    const result = await generativeModel.generateContent({
      contents: [
        {
          role: 'user',
          parts: [
            { text: prompt },
            {
              inlineData: {
                mimeType: 'image/png',
                data: base64Image
              }
            }
          ]
        }
      ]
    });

    const file = result.response.candidates[0].content.parts[0].fileData;
    res.json({ image: file.data });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Something went wrong.' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Running on port ${PORT}`));