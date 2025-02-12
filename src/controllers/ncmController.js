import NcmService from "../service/Ncm.js";
import logger from "../utils/logger.js";
import { codNcmShema } from "../utils/shemasValidate.js";

// Controlador que retorna todos os NCMs do banco
export const getAll = async (req, res, next) => {
  logger.info('Início da requisição para obter todos os NCMs', { method: req.method, url: req.originalUrl });

  try {
    const result = await NcmService.getAllNcms();

    if (result && result.length > 0) {
      logger.info('NCMs encontrados com sucesso', { ncmCount: result.length });
      return res.status(200).json(result);
    } else {
      logger.error('Erro: nenhum NCM encontrado no banco de dados.');
      return res.status(404).json({ error: "Nenhum NCM encontrado no banco de dados." });
    }

  } catch (error) {
    logger.error('Erro ao buscar NCMs', { error: error.message, stack: error.stack });
    next(error);
  }
};


export const getAllFilter = async (req, res, next) => {
  logger.info('Início da requisição para obter todos os NCMs', { method: req.method, url: req.originalUrl });

  try {
    const {error, value} = codNcmShema.validate(req.params);
    
    if (error) {
      logger.error('Erro de na busca de NCM com filtro', { error: error.details[0].message });
      return res.status(400).json({ error: error.details[0].message });
    }
    const result = await NcmService.getAllNcmsFilterCod(value.cod);

    if (result && result.length > 0) {
      logger.info('NCMs (com filtragem) encontrados com sucesso', { ncmCount: result.length });
      return res.status(200).json(result);
    } else {
      logger.error('Erro: nenhum NCM (com a filtragem) encontrado no banco de dados.');
      return res.status(404).json({ error: "Nenhum NCM (com a filtragem) encontrado no banco de dados." });
    }
  } catch (error) {
    logger.error('Erro ao buscar NCMs  (com a filtragem)', { error: error.message, stack: error.stack });
    next(error);
  }
};
