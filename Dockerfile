# Usa a imagem oficial do Node.js versão 22
FROM node:22

# Define o diretório de trabalho dentro do container
WORKDIR /app

# Copia apenas os arquivos de dependência primeiro para aproveitar cache
COPY package.json yarn.lock ./

# Instala todas as dependências
RUN yarn install

# Copia o restante dos arquivos do projeto
COPY . .

# Expõe a porta que sua aplicação vai rodar
EXPOSE 3000

# Comando padrão pra rodar a aplicação
CMD ["node", "app.js"]
