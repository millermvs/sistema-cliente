# Instala no container uma imagem do Node 22
# necessária para executar o projeto
FROM node:22-alpine

# Cria uma pasta dentro do container
WORKDIR /app

# Copia os arquivos package*.json do projeto
# para dentro da pasta /app do container
COPY package*.json ./

# Instalando as bibliotecas do projeto
RUN npm ci --omit=dev

# Copiar os demais arquivos (códigos)
# do projeto para dentro do container
COPY . .

# Definindo a porta que a aplicação irá rodar
EXPOSE 3000

# Comando Node para rodar o projeto
CMD ["npm", "start"]