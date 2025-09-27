# --- Build stage ---
FROM node:20 AS build

WORKDIR /app
COPY package*.json ./
RUN npm install --legacy-peer-deps
COPY . .

# Only copy .env if you actually have one
# COPY .env .env

RUN npm run build   # creates dist/

# --- Production stage ---
FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
