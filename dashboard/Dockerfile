FROM node:22-alpine AS builder

WORKDIR /app

COPY package*.json .npmrc ./

RUN npm ci

COPY . .

# Skip tsc type-check in Docker — vite build alone is enough
RUN npx vite build

# Production stage with nginx
FROM nginx:alpine

# Copy built files
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
