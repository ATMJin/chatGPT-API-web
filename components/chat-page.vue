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
        <textarea name="content" placeholder="輸入訊息" v-model="content" cols="30" rows="10"></textarea>
        <button @click="goChat">發送訊息</button>
        <!-- <button @click="sendTest">測試</button> -->
        <div class="result_btn_content">
          <button class="change_result_btn" @click="changeResult(-1)"> &lt; </button>
          <button class="change_result_btn" @click="changeResult(1)"> &gt; </button>
        </div>
        <!-- 一個讀取中的圖案 -->
        <div v-if="showLoading" class="loading">
          <img src="~~/assets/loading.gif" />
        </div>
        <p class="result">{{ result[result_index] }}</p>
      </div>
      <div class="option">
        <select name="" id="" v-model="type">
          <option value="" disabled>請選擇設定</option>
          <option v-for="item in type_list" :value="item">{{ item }}</option>
        </select>
        <label v-for="item in option_list">{{ item.label }}
          <input type="text" v-model.number="option_web[item.option]">
        </label>
        <label>連續對話:
          <input type="checkbox" v-model="continuation">
        </label>
        <button @click="restart" style="padding: 12px; margin-right: 0.75rem;">Restart</button>
        <button @click="getLast" style="padding: 12px; margin-right: 0.75rem;">Get Last</button>
      </div>
    </main>

  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import { Option } from '~~/composables/class/db.class';

const content = ref("");
const result = ref<string[]>([""]);
const showLoading = ref(false);
const option_list = ref<{
  label: string;
  option: keyof Option;
}[]>([
  { label: "temperature", option: "temperature" },
  { label: "top_p", option: "top_p" },
  { label: "max_tokens(max 4096)", option: "max_tokens" },
  { label: "n", option: "n" },
  { label: "stop(,)", option: "stop" },
]);

const option_web = ref<Option>({
  temperature: 1,
  top_p: undefined,
  max_tokens: 100,
  n: 1,
  stop: undefined
});
const continuation = ref(false);
const type_list = ref<string[]>([]);
const type = ref("");
const result_index = ref(0);

const sendTest = async () => {
  showLoading.value = true;

  try {
    const response = await fetch("/api/hello", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        content: content.value,
        continuation: continuation.value,
        type: type.value
      }),
    });
    showLoading.value = false;

    const data = await response.json();
    if (response.status !== 200) {
      throw data.error || new Error(`Request failed with status ${response.status}`);
    }

    result.value = Array.isArray(data.result) ? data.result : [data.result];
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
        option,
        continuation: continuation.value,
        type: type.value,
            result_index: result_index.value,
      }),
    });

    showLoading.value = false;
    const data = await response.json();
    if (response.status !== 200) {
      throw data.error || new Error(`Request failed with status ${response.status}`);
    }

    result.value = Array.isArray(data.result) ? data.result : [data.result];
    content.value = "";
    result_index.value = 0;

  } catch (error: any) {
    // Consider implementing your own error handling logic here
    console.error(error);
    alert(error.message);
  }
};


const onInit = async () => {
  console.log("onInit");

  try {
    const response = await fetch("/api/onInit", {
      method: "GET"
    });
    const data = await response.json();
    console.log("data", data);
    const option_DB = data.option;
    option_web.value = option_DB;
    const continuation_DB = data.continuation;
    continuation.value = continuation_DB;
    const type_list_DB = data.type_list;
    type_list.value = type_list_DB;

    console.log("onInit end");
  } catch (error: any) {
    console.error(error);
  }
};

const restart = async () => {
  console.log("restart");
  try {
    const res = await fetch("/api/restart");
    result.value = [""];
    continuation.value = false;
    console.log("restart end");
    console.log(res);
  } catch (error: any) {
    console.error(error);
  }
};

const getLast = async () => {
  console.log("getLast");
  try {
    const res = await fetch("/api/getLast");
    const data = await res.json();
    console.log("data", data);
    result.value = data.result;
    console.log("getLast end");
  } catch (error: any) {
    console.error(error);
  }
};

const changeResult = (num: number) => {
  result_index.value += num;
  if (result_index.value < 0) {
    result_index.value = 0;
  } else if (result_index.value >= result.value.length) {
    result_index.value = result.value.length - 1;
  }
};

onBeforeMount(() => {
  onInit();
});

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