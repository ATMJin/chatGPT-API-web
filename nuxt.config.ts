// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  runtimeConfig: {
    private: {
      apiKey: process.env.OPENAI_API_KEY,
    },
  }
});
