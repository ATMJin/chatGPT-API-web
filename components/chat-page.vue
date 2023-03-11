<template>
  <div>

    <head>
      <title>OpenAI Quickstart</title>
      <link rel="icon" href="/dog.png" />
    </head>

    <main class="main" style="position: relative;">

      <img src="/dog.png" class="icon" />
      <h3>chatGPT API 測試</h3>
      <input type="text" name="content" placeholder="輸入訊息" v-model="content" />
      <button @click="goChat">發送訊息</button>
      <button @click="sendTest">測試</button>
      <div class="result">{{ result }}</div>
      <!-- 一個讀取中的圖案 -->
      <div v-if="showLoading" class="loading">
        <img src="~~/assets/loading.gif" />
      </div>
    </main>

  </div>
</template>

<script lang="ts">
import { ref } from 'vue';

export default {
  name: "Home",
  setup() {
    const content = ref("");
    const result = ref("");
    const showLoading = ref(false);

    async function sendTest() {
      showLoading.value = true;

      try {
        const response = await fetch("/api/hello", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ content: content.value }),
        });
        showLoading.value = false;

        const data = await response.json();
        if (response.status !== 200) {
          throw data.error || new Error(`Request failed with status ${response.status}`);
        }

        result.value = data.result;
        content.value = "";
      } catch (error: any) {
        // Consider implementing your own error handling logic here
        console.error(error);
        alert(error.message);
      }
    }

    async function goChat() {
      showLoading.value = true;
      try {
        const response = await fetch("/api/chat", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ content: content.value }),
        });

        showLoading.value = false;
        const data = await response.json();
        if (response.status !== 200) {
          throw data.error || new Error(`Request failed with status ${response.status}`);
        }

        result.value = data.result;
        content.value = "";
      } catch (error: any) {
        // Consider implementing your own error handling logic here
        console.error(error);
        alert(error.message);
      }
    }

    return { content, result, showLoading, goChat, sendTest };
  },
};
</script>

<style>
@import "assets/index.module.css";
</style>