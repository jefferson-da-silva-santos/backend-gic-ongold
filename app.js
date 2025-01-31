import express from 'express';
import 'dotenv/config';
import cors from 'cors';
import ItemService from './src/service/Item.js'; // ✅ Certifique-se de que a extensão está correta
import errorHandler from './src/middleware/errorHandler.js';
import routerItems from './src/router/itemRouter.js';

const port = 3000;
const app = express();
const pathDefault = '/api/gic'

app.use(cors());
app.use(express.json());

app.use(pathDefault, routerItems);

app.use(errorHandler);

app.listen(port, () => {
  console.log(`✅ API rodando com sucesso na porta ${port}! 🚀`);
});
