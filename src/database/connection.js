import dotenv from 'dotenv';
import { Sequelize } from 'sequelize';
import logger from '../utils/logger.js';
dotenv.config();

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: process.env.DB_DIALECT,
    port: process.env.DB_PORT,
    logging: false // Não permite que os logs sejam exibidos no console
  }
);

sequelize
  .authenticate()
  .then(() => {
    logger.info('Conectado ao banco de dados com sucesso!');
    console.log("Conectado ao banco de dados com sucesso!")
  })
  .catch((error) => {
    logger.error("Erro ao conectar ao banco:", error);
    console.error("Erro ao conectar ao banco:", error)
  });

export default sequelize;
