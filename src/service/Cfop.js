import CfopModel from "../models/cfop.js";
import logger from "../utils/logger.js";

export default class Cfop {
  static async getAllCfops() {
    try {
      logger.info('Iniciando a busca de CFOPs no banco de dados');
      const cfops = await CfopModel.findAll();
      
      if (!cfops || cfops.length === 0) {
        logger.warn('Nenhum CFOP encontrado no banco de dados'); 
      } else {
        logger.info('CFOPs encontrados com sucesso', { cfopCount: cfops.length });
      }

      return cfops.map(cfop => cfop.dataValues);
    } catch (error) {
      logger.error('Erro ao buscar CFOPs', { error: error.message, stack: error.stack });
      throw new Error("Erro ao buscar CFOPs");
    }
  }
}