FROM node:18.20.3

WORKDIR /chatbot_sys/src/App

# Copy the package.json file into our app directory
COPY . /chatbot_sys/src/App/

# Install any needed packages specified in package.json
RUN npm install

RUN ls /usr/src/app
RUN ls /usr/src/app/public


EXPOSE 8080

CMD ["npm", "start"]
