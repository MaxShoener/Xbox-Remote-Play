# ---- Build stage ----
FROM node:22-bullseye AS build

# Install system packages required for wrtc native build
RUN apt-get update && apt-get install -y \
  python3 make g++ libxi-dev libxtst-dev libx11-dev \
  && rm -rf /var/lib/apt/lists/*

# Create app dir
WORKDIR /app

# Copy root package.json + install deps
COPY package*.json ./
RUN npm install

# Copy frontend source and build it
COPY frontend ./frontend
RUN cd frontend && npm install && npm run build

# Copy server and other files
COPY . .

# ---- Runtime stage ----
FROM node:22-bullseye
WORKDIR /app

# Install runtime system libs for wrtc
RUN apt-get update && apt-get install -y \
  libxi-dev libxtst-dev libx11-dev \
  && rm -rf /var/lib/apt/lists/*

# Copy built app from previous stage
COPY --from=build /app /app

EXPOSE 8080
CMD ["npm", "start"]