# 建立階段：安裝依賴並 build
FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

# 部署階段：用輕量級映像提供靜態檔案
FROM node:20-alpine

WORKDIR /app

# 安裝 serve 套件（用來提供靜態檔案）
RUN npm install -g serve

# 複製 build 出來的檔案
COPY --from=builder /app/dist ./dist

# Cloud Run 預設 PORT 環境變數
ENV PORT=8080

EXPOSE 8080

# 啟動指令
CMD ["serve", "-s", "dist", "-l", "8080"] 