# --- Stage 1: Build & Dependencies ---
FROM node:20-alpine AS builder

WORKDIR /app

# Install compilation tools needed for native node modules
RUN apk add --no-cache python3 make g++

COPY package*.json ./

# Install all dependencies (including devDependencies if needed for builds)
RUN npm install

# --- Stage 2: Final Runtime ---
FROM node:20-alpine

WORKDIR /app

# Copy only the installed node_modules and package files from the builder stage
COPY --from=builder /app/node_modules ./node_modules
COPY package*.json ./

# Copy the rest of your application source code
COPY . .

EXPOSE 8000

CMD ["node", "server.js"]
