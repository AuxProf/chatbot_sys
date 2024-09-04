# base node image
FROM node:18-bullseye-slim as base


# Install openssl for Prisma
RUN apt-get update && apt-get install -y openssl

# Set the working directory in the container
WORKDIR /chatbot_sys

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code to the working directory
COPY . .

# Build the application
RUN npm run build

# Expose port 8080
EXPOSE 3030

# Define the command to run the application
CMD ["npm", "start"]
