# Use the official Node.js image as the base
FROM node:18-alpine as build

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Build the Angular application for production
RUN npm run build

# Use a smaller Nginx image for serving the built frontend
FROM nginx:stable-alpine

# Copy the built Angular app from the build stage
COPY --from=build /app/dist/bot-frontend /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf 