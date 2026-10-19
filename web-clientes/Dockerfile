# Imagem base com Node.js
FROM node:24-alpine

# Diretório da aplicação dentro do container
WORKDIR /app

# Copia os arquivos de dependências
COPY package*.json ./

# Instala somente as dependências de produção
RUN npm ci --omit=dev

# Copia o código da aplicação
COPY --chown=node:node . .

# Configura o ambiente e a porta do servidor
ENV NODE_ENV=production
ENV PORT=8001

# Documenta a porta utilizada pela aplicação
EXPOSE 8001

# Executa com usuário sem privilégios administrativos
USER node

# Inicia a aplicação
CMD ["npm", "start"]