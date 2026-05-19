FROM node:22-alpine as build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build
FROM node:22-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --omit=dev
COPY .env ./
COPY --from=build /app/dist ./dist 
ENV NODE_ENV=test
ENV PORT=3000
CMD ["node", "dist/index.js"]
