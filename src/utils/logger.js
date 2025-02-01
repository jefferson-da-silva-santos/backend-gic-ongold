import fs from 'fs';
import path from 'path';
import winston from 'winston';
import LogModel from '../models/logs.js';

// Caminho absoluto para a pasta de logs
const logDirectory = path.join(process.cwd(), 'src', 'log');

// Se a pasta não existir, cria automaticamente
if (!fs.existsSync(logDirectory)) {
  fs.mkdirSync(logDirectory, { recursive: true });
}

// Caminho do arquivo de log
const logFilePath = path.join(logDirectory, 'combined.log');

// Criando o logger
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      )
    }),
    new winston.transports.File({
      filename: logFilePath,
      options: { flags: 'a' }, // Garantir que o arquivo seja aberto no modo append
      maxsize: 5242880, // Limite de tamanho para rotação do arquivo (5MB)
      maxFiles: 5, // Número máximo de arquivos de log a serem mantidos
      tailable: true, // Manter o último arquivo de log
    })
  ]
});

// Função para salvar no banco
const saveLogToDatabase = async (level, message) => {
  try {
    await LogModel.create({ level, message });
  } catch (error) {
    console.error('Erro ao salvar log no banco:', error);
  }
};

// Transporte personalizado para salvar logs no banco
class DatabaseTransport extends winston.Transport {
  async log(info, callback) {
    setImmediate(async () => {
      try {
        await saveLogToDatabase(info.level, info.message);
      } catch (error) {
        console.error('Erro ao salvar log no banco:', error);
      }
    });
    callback();
  }
}

// Adicionando o transporte de banco de dados (opcional)
logger.add(new DatabaseTransport());

// Forçar a gravação dos logs no arquivo ao sair da aplicação
process.on('exit', () => {
  logger.end();
});

export default logger;
