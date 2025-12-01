# 构建阶段：编译网站
FROM node:20-alpine AS builder
# 在Alpine中安装git
RUN apk add --no-cache git

WORKDIR /app

# 复制依赖文件
COPY package*.json ./
RUN npm ci

# 复制所有源代码
COPY . .


# 设置git配置（避免警告）
RUN git config --global user.email "build@docker.ci" && \
    git config --global user.name "Docker Build Bot"
# 构建VitePress网站
RUN npm run docs:build

# 运行阶段：使用Nginx提供服务
FROM nginx:alpine

# 复制构建好的网站文件
# 注意：输出目录是 doc/.vitepress/dist
COPY --from=builder /app/.vitepress/dist /usr/share/nginx/html

# 可选：添加Nginx配置优化SPA路由
RUN echo 'server { \
    listen 80; \
    root /usr/share/nginx/html; \
    index index.html; \
    location / { \
        try_files $uri $uri/ /index.html; \
    } \
}' > /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]