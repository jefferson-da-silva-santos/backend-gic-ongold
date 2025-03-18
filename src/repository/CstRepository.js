import CstIcmsModel from "../models/csticms.js";
import logger from "../utils/logger.js";

export default class CstRepository {
  async getAllCsts() {
    try {
      const csts = await CstIcmsModel.findAll({
        order: [['descricao', 'ASC']]
      });
      return csts;
    } catch (error) {
      logger.error(`Erro no repositório ao buscar todos os CSTs: ${error.message}`);
      throw new Error(`Erro no repositório ao buscar todos os CSTs: ${error.message}`);
    }
  }
}
