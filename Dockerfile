FROM node:21-slim AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM node:21-slim
WORKDIR /app
COPY --from=build /app ./
RUN npm install --only=production
EXPOSE 3000
CMD ["npm", "start"]
