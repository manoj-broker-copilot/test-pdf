# Stage 1: Base dependencies
FROM node:20.16.0-alpine as base
WORKDIR /app
COPY package*.json ./

# Stage 2: Development
FROM base as development
RUN npm install
COPY . .
CMD ["npm", "run", "start:dev"]

# Stage 3: Build (for production)
FROM base as build
RUN npm ci
COPY . .
RUN npm run build

# Stage 4: Production image
FROM node:20.16.0-alpine as production
WORKDIR /app
COPY package*.json ./
RUN npm ci --omit=dev
COPY --from=build /app/dist ./dist
EXPOSE 3000
CMD ["node", "dist/main.js"]
