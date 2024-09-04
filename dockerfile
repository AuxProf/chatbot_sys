# Use a imagem base do Node.js
FROM node:18.20.3

# Defina o diretório de trabalho dentro do container
WORKDIR /chatbot_sys/src/App

# Copie apenas os arquivos package.json e package-lock.json
COPY package*.json ./

# Instale as dependências necessárias
RUN npm install

# Copie o restante dos arquivos da aplicação
COPY . .

# Desabilitar a variável de ambiente CI durante o build
ENV CI=false

# Executa o build da aplicação
RUN npm run build -- --max-warnings=0

# Exponha a porta em que a aplicação será servida
EXPOSE 8080

# Comando para iniciar a aplicação
CMD ["npm", "start"]
