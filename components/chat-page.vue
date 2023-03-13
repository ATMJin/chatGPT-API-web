<template>
  <div>

    <head>
      <title>OpenAI Quickstart</title>
      <link rel="icon" href="/dog.png" />
    </head>

    <main class="main" style="position: relative;">

      <div class="main" style="padding-top: 0;">
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
      </div>
      <div class="option">
        <label>temperature:
          <input type="text" v-model.number="option_web.temperature">
        </label>
        <label>top_p:
          <input type="text" v-model.number="option_web.top_p">
        </label>
        <label>max_tokens:
          <input type="text" v-model.number="option_web.max_tokens">
        </label>
        <label>n:
          <input type="text" v-model.number="option_web.n">
        </label>
        <label>stop(,):
          <input type="text" v-model="option_web.stop">
        </label>
      </div>
    </main>

  </div>
</template>

<script lang="ts">
import { ref } from 'vue';
import { Option } from '~~/composables/class/db.class';

export default {
  name: "Home",
  setup() {
    const content = ref("");
    const result = ref("");
    const showLoading = ref(false);

    const option_web = ref<Option>({
      temperature: 1,
      top_p: undefined,
      max_tokens: 100,
      n: 1,
      stop: undefined
    });

    const sendTest = async () => {
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
    };

    const goChat = async () => {
      showLoading.value = true;
      const option = option_web.value;
      option.stop = (option_web.value.stop as string)?.split(",");

      try {
        const response = await fetch("/api/chat", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            content: content.value,
            option
          }),
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
    };


    const onInit = async () => {
      console.log("onInit");

      try {
        const response = await fetch("/api/onInit");
        const data = await response.json();
        console.log("data", data);
        const option_DB = data.option;
        option_web.value = option_DB;

      } catch (error: any) {
        console.error(error);
      }
    };

    onInit();

    return { content, result, showLoading, option_web, onInit, goChat, sendTest };
  },
};
</script>

<style>
@import "assets/index.module.css";

.option {
  margin-top: 30px;
}

.option input {
  width: 50px;
}

.option label {
  margin-right: 10px;
}
</style>