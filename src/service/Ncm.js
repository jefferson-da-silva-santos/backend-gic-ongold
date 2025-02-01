import NcmModel from "../models/ncm.js";
import logger from '../utils/logger.js';

// Entidade para tratar o NCM
export default class Ncm {
  static async getAllNcms() {
    try {
      logger.info('Iniciando a busca de NCMs no banco de dados');
      
      const ncms = await NcmModel.findAll();
      
      if (!ncms || ncms.length === 0) {
        logger.warn('Nenhum NCM encontrado no banco de dados');
      } else {
        logger.info('NCMs encontrados com sucesso', { ncmCount: ncms.length });
      }

      return ncms.map(({ dataValues: ncm }) => ({
        codncm: ncm.codncm,
        nomencm: ncm.nomencm,
        aliquota: ncm.aliquota,
      }));
    } catch (error) {
      logger.error('Erro ao buscar NCMs', { error: error.message, stack: error.stack });
      throw new Error("Erro ao buscar NCMs");
    }
  }
}
