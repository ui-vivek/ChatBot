# Use the official Node.js image as the base
FROM node:18-alpine

# Set the working directory within the container
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Build the NestJS application for production
RUN npm run build

# Expose the port your NestJS app runs on (adjust if needed)
EXPOSE 3000

# Start the NestJS application
CMD [ "node", "dist/main" ]
