# Stage 1: Building the app
FROM node:20-bookworm as builder

WORKDIR /usr/src/app

# Copy package.json and package-lock.json (if available)
COPY package*.json ./

# Install all dependencies
RUN npm install

# Copy the rest of your app's source code
COPY . .

# Build your app (if necessary)
# RUN npm run build

# Stage 2: Run the app
FROM node:slim

WORKDIR /usr/src/app

# Copy only necessary files from the builder stage
COPY --from=builder /usr/src/app .

# If you have a build step and separate source and build directories,
# you should only copy the necessary directories (e.g., dist, node_modules)

# Expose port 3000
EXPOSE 3000

# Start the app
CMD ["npm", "start"]
