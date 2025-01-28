import express from 'express';
import 'dotenv/config';
import errorHandler from './utils/errorHandler.js';
import cors from 'cors';

const port = 3000;
const app = express();


app.use(cors());
app.use(express.json());
app.get('/', (req, res) => {
  res.status(200).send('Ok');
})
// Middleware de tratamento de erros
app.use(errorHandler);

app.listen(port, () => {
  console.log(`A API subiu com sucesso na porta ${port}!!`);
});
