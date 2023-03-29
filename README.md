# ChatGPT API 測試

用 ChatGPT 官方提供的快速啟動範例，把他的 Next.js 改成 Nuxt.js，並且把 API 改成自己的。
順便利用 ChatGPT + Github Copilot 快速學習 Nuxt.js 和 MongoDB 的使用。

目標是加上控制各種參數的介面，方便在前端控制參數進行調整，不用再直接改程式碼。
還有加上連續對話的功能，目前只有單一問答。
最後是使用 docker 部屬，順便練習 docker 的使用。

## 環境

使用 Vue3 + Nuxt3 + MongoDB

## DB schema

### chat

```ts
{
    // 使用的模型
    model: string,
    // 訊息
    messages: [
        {
            // 角色
            role: string ,
            // 內容
            content: string,
        },
    ],
    // 回覆
    result: string,
    // 建立時間 yyyy-MM-dd HH:mm:ss
    time: string,
    // 參數
    option: {
        temperature: number,
        top_p: number,
        n: number,
        stream: boolean,
        stop: string | string[],
        max_tokens: number,
        presence_penalty: number,
        frequency_penalty: number,
        logit_bias: {
            number: number,
        },
        user: string
    },
    // 結束原因
    finish_reason: string,
    // 使用的 token 數量
    usage: {
        // 上行
        prompt_tokens: number,
        // 下行
        completion_tokens: number,
        // 總共
        total_tokens: number
    },
    // 是否為連續對話
    continuation: boolen,
}
```

### system_setting

```ts
{
  // 類型
  type: string,
  // 訊息
  message: [
    {
      // 角色
      role: string,
      // 內容
      content: string,
    },
  ],
}
```

## Development Server

Start the development server on http://localhost:3000

```bash
npm run dev
```

## Production

Build the application for production:

```bash
npm run build
```

Locally preview production build:

```bash
npm run preview
```

Check out the [deployment documentation](https://nuxt.com/docs/getting-started/deployment) for more information.

## TODO

- [x] docker內連接本機mongoDB
- [x] 頁面輸入框改成 textarea
- [x] 頁面結果輸出框增加因應n值切換輸出內容
- [x] DB的result因應n值儲存成string[]
- [x] 連續輸入模式時加上目前頁面上選擇的結果
- [ ] 連續輸入時 message 的 tokens 太大，刪除最前面的對話，讓 tokens 的大小在範圍內。(或許要在頁面多加一個設定，設定 result 的 tokens，然後 message 的 tokens 就是 max_tokens 減去 result 的 tokens)