<template>
  <div>

    <head>
      <title>OpenAI Quickstart</title>
      <link rel="icon" href="/dog.png" />
    </head>

    <main class="main">
      <img src="/dog.png" class="icon" />
      <h3>chatGPT API 測試</h3>
      <form @submit.prevent="onSubmit">
        <input type="text" name="animal" placeholder="Enter an animal" v-model="animalInput" />
        <input type="submit" value="Generate names" />
      </form>
      <div class="result">{{ result }}</div>
    </main>
  </div>
</template>

<script>
import { ref } from 'vue';

export default {
  name: "Home",
  setup() {
    const animalInput = ref("");
    const result = ref("");

    async function onSubmit() {
      try {
        const response = await fetch("/api/chat2", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ animal: animalInput.value }),
        });

        const data = await response.json();
        if (response.status !== 200) {
          throw data.error || new Error(`Request failed with status ${response.status}`);
        }

        result.value = data.result;
        animalInput.value = "";
      } catch (error) {
        // Consider implementing your own error handling logic here
        console.error(error);
        alert(error.message);
      }
    }

    return { animalInput, result, onSubmit };
  },
};
</script>

<style>
@import "/index.module.css";
</style>