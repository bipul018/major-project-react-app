# Use the official Node.js image as a base
FROM node:22-alpine

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json first to take advantage of Docker cache
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Build the React app for production
RUN npm run build

# Expose port 3000 for the frontend
EXPOSE 8000

# Serve the built React app using a simple HTTP server
# CMD ["npx", "serve", "build", "--port", ""]
CMD ["npm", "run", "dev"]
