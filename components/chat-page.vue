<template>
  <div>

    <head>
      <title>OpenAI Quickstart</title>
      <link rel="icon" href="/dog.png" />
    </head>

    <main class="main">
      <img src="/dog.png" class="icon" />
      <h3>chatGPT API 測試</h3>
      <input type="text" name="content" placeholder="輸入訊息" v-model="content" />
      <button @click="onSubmit">發送訊息</button>
      <div class="result">{{ result }}</div>
    </main>
  </div>
</template>

<script>
import { ref } from 'vue';

export default {
  name: "Home",
  setup() {
    const content = ref("");
    const result = ref("");

    async function onSubmit() {
      try {
        const response = await fetch("/api/chat", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ content: content.value }),
        });

        const data = await response.json();
        if (response.status !== 200) {
          throw data.error || new Error(`Request failed with status ${response.status}`);
        }

        result.value = data.result;
        content.value = "";
      } catch (error) {
        // Consider implementing your own error handling logic here
        console.error(error);
        alert(error.message);
      }
    }

    return { content, result, onSubmit };
  },
};
</script>

<style>
@import "assets/index.module.css";
</style>