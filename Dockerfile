# 使用 Node.js 官方映像檔作為基本映像檔
FROM node:16-alpine AS builder

# 創建一個名為 chatGPT-API 的目錄
RUN mkdir -p /chatGPT-API

# 設定工作目錄
WORKDIR /chatGPT-API

# 複製專案檔案
COPY . .

# 安裝套件
RUN npm install -g pnpm
RUN pnpm install

# 執行 pnpm run build 構建生產環境的應用程式
RUN pnpm run build

# ========================================

# 基於 keymetrics/pm2:16-alpine 映像檔構建 Docker 映像檔
FROM keymetrics/pm2:16-alpine

# 創建一個名為 /chatGPT-API/.output 的目錄
RUN mkdir -p /chatGPT-API/.output

# 設置當前工作目錄為 /chatGPT-API/.output
WORKDIR /chatGPT-API/.output

# 從之前的 builder 階段中複製 /chatGPT-API/.output 目錄到當前目錄中
COPY --from=builder /chatGPT-API/.output .

# 將本地的 ecosystem.config.js 文件複製到 /chatGPT-API 目錄中
COPY ./ecosystem.config.js /chatGPT-API

# 設置 NUXT_HOST 環境變量
ENV NUXT_HOST=0.0.0.0

# 設置 NUXT_PORT 環境變量
ENV NUXT_PORT=3000

# 對外開放 3000 端口
EXPOSE 3000 

# 設置 Docker 容器的入口點為 pm2-runtime，並執行 start 命令
# ecosystem.config.js 指定了 pm2-runtime 運行的應用程式和相關配置
ENTRYPOINT ["pm2-runtime", "start", "/chatGPT-API/ecosystem.config.js"]
