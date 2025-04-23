// index.js
import { createVertex } from '@ai-sdk/google-vertex/edge'
import { generateText } from 'ai'

const vertex = createVertex({
  project: process.env.GCP_PROJECT_ID,
  location: 'us-central1',
  googleCredentials: {
    clientEmail: process.env.CLIENT_EMAIL,
    privateKey: process.env.PRIVATE_KEY.replace(/\\n/g, '\n'),
    privateKeyId: process.env.PRIVATE_KEY_ID
  }
})

const result = await generateText({
  model: vertex('gemini-2.0-flash-exp'),
  providerOptions: {
    google: {
      responseModalities: ['TEXT', 'IMAGE']
    }
  },
  messages: [
    {
      role: 'user',
      content: 'Generate an image of a flying bear'
    }
  ]
})

console.log(result.files)