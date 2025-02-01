import CstIcmsModel from "../models/csticms.js";
import logger from '../utils/logger.js';

// Entidade para tratar o CST
export default class Cst {
  static async getAllCsts() {
    try {
      logger.info('Iniciando a busca de CSTs no banco de dados');
      
      const csts = await CstIcmsModel.findAll();
      
      if (!csts || csts.length === 0) {
        logger.warn('Nenhum CST encontrado no banco de dados');
      } else {
        logger.info('CSTs encontrados com sucesso', { cstCount: csts.length });
      }

      return csts.map(({ dataValues: cst }) => ({
        codcst: cst.codcst,
        descricao: cst.descricao,
        regime: cst.regime,
      }));
    } catch (error) {
      logger.error('Erro ao buscar CSTs', { error: error.message, stack: error.stack });
      throw new Error("Erro ao buscar CSTs");
    }
  }
}
