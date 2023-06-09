// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  vite: {
    // logLevel: 'info',
  },
  runtimeConfig: {
    private: {
      apiKey: process.env.OPENAI_API_KEY || '',
      mongo_uri: process.env.MONGODB_URI || '',
    },
  }
});
