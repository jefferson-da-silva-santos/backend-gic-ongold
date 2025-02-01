import express from 'express';
import 'dotenv/config';
import morgan from 'morgan';
import logger from './src/utils/logger.js'; // Importando o logger configurado
import cors from 'cors';
import errorHandler from './src/middleware/errorHandler.js';
import routerItems from './src/router/itemRouter.js';
import routerCfops from './src/router/cfopRouter.js';
import routerNcms from './src/router/ncmRouter.js';
import routerCsts from './src/router/cstRouter.js';

const port = 3000;
const app = express();
const pathDefault = '/api/gic';

// Configuração do Morgan para logar requisições HTTP no banco e arquivo
app.use(morgan('combined', { stream: { write: msg => logger.info(msg.trim()) } }));

app.use(cors());
app.use(express.json());
app.use(pathDefault, routerItems);
app.use(pathDefault, routerCfops);
app.use(pathDefault, routerNcms);
app.use(pathDefault, routerCsts);
app.use(errorHandler);

app.listen(port, () => {
  logger.info(`API rodando com sucesso na porta ${port}`)
  console.log(`✅ API rodando com sucesso na porta ${port}! 🚀`);
});
