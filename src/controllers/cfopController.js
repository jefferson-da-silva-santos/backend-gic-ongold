import CfopService from "../service/Cfop.js";
import logger from "../utils/logger.js";

// Controlador que retorna todos os itens do banco
export const getAll = async (req, res, next) => {
  logger.info('Início da requisição para obter todos os CFOPs', { method: req.method, url: req.originalUrl });

  try {
    const result = await CfopService.getAllCfops();
    if (result && result.length > 0) {
      logger.info('CFOPs encontrados com sucesso', { cfopCount: result.length });
      return res.status(200).json(result);
    } else {
      logger.error('Erro: nenhum CFOP encontrado no banco de dados.');
      return res.status(404).json({ error: "Nenhum CFOP encontrado no banco de dados." });
    }

  } catch (error) {
    logger.error('Erro ao buscar CFOPs', { error: error.message, stack: error.stack });
    next(error);
  }
};
