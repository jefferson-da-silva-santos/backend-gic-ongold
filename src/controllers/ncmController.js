import NcmService from "../service/Ncm.js";
import logger from "../utils/logger.js";

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
