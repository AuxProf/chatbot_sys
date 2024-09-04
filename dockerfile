FROM node:18.20.3

WORKDIR /chatbot_sys

COPY package.json .

RUN npm install

COPY . .

# Verifique os arquivos copiados
RUN ls -R /chatbot_sys/src

EXPOSE 8080

CMD ["npm", "start"]
