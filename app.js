import express from 'express';
import 'dotenv/config';
import morgan from 'morgan';
import logger from './src/utils/logger.js'; // Importando o logger configurado
import cors from 'cors';
import cron from 'node-cron';
import errorHandler from './src/middleware/errorHandler.js';
import routerItems from './src/router/itemRouter.js';
import routerCfops from './src/router/cfopRouter.js';
import routerNcms from './src/router/ncmRouter.js';
import routerCsts from './src/router/cstRouter.js';
import routerReport from './src/router/reportRouter.js';
import ItemService from './src/service/ItemService.js';

const port = 3000;
const app = express();
const pathDefault = '/api/gic';

// Configuração do Morgan para logar requisições HTTP no banco e arquivo
app.use(morgan('combined', { stream: { write: msg => logger.info(msg.trim()) } }));

// Agenda para excluír itens da lixeira todos os dias de meia noite
cron.schedule('0 0 * * *', async () => {
  ItemService.deleteItemAfter30Days();
})

app.use(cors());
app.use(express.json());
app.use(pathDefault, routerItems);
app.use(pathDefault, routerCfops);
app.use(pathDefault, routerNcms);
app.use(pathDefault, routerCsts);
app.use(pathDefault, routerReport);

app.use(errorHandler);

app.listen(port, () => {
  logger.info(`API rodando com sucesso na porta ${port}`)
  console.log(`✅ API rodando com sucesso na porta ${port}! 🚀`);
});
