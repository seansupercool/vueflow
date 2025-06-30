# 建立階段：安裝依賴並 build
FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

# 部署階段：用 nginx 提供靜態檔案
FROM nginx:alpine

# 複製打包好的 dist 到 nginx 的預設網站目錄下的 icp-dashboard 子目錄
COPY --from=builder /app/dist /usr/share/nginx/html/icp-dashboard

# 複製自訂 nginx 配置（稍後需要你提供 nginx.conf）
COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 8080

CMD ["nginx", "-g", "daemon off;"]
