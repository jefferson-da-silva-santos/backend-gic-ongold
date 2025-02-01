import CstService from "../service/Cst.js";
import logger from "../utils/logger.js";

// Controlador que retorna todos os CSTs do banco
export const getAll = async (req, res, next) => {
  logger.info('Início da requisição para obter todos os CSTs', { method: req.method, url: req.originalUrl });

  try {
    const result = await CstService.getAllCsts();

    if (result && result.length > 0) {
      logger.info('CSTs encontrados com sucesso', { cstCount: result.length });
      return res.status(200).json(result);
    } else {
      logger.error('Erro: nenhum CST encontrado no banco de dados.');
      return res.status(404).json({ error: "Nenhum CST encontrado no banco de dados." });
    }

  } catch (error) {
    logger.error('Erro ao buscar CSTs', { error: error.message, stack: error.stack });
    next(error);
  }
};
