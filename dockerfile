# Use the official Node.js image as a parent image
FROM node:18.20.3

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code to the working directory
COPY . .

# Build the application
RUN npm run build

# Expose port 8080
EXPOSE 8080

# Define the command to run the application
CMD ["npm", "start"]
