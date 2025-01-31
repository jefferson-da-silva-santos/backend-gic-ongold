import dotenv from 'dotenv';
dotenv.config();

import { Sequelize } from 'sequelize';

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: process.env.DB_DIALECT,
    port: process.env.DB_PORT,
    logging: false, // Para não poluir o console com logs SQL
  }
);

sequelize
  .authenticate()
  .then(() => console.log("Conectado ao banco de dados com sucesso!"))
  .catch((error) => console.error("Erro ao conectar ao banco:", error));

export default sequelize;
