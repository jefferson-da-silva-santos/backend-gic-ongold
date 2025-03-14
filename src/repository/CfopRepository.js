import CfopModel from "../models/cfop.js"
import logger from "../utils/logger.js";

export default class CfopRepository {
  /**
   * @description Recupera uma lista de cfops
   */
  async getAllCfops() {
    try {
      const cfops = await CfopModel.findAll({
        order: [['descricaocfop', 'ASC']]
      });
      return {
        cfops
      }
    } catch (error) {
      logger.error(`Erro no repositório ao buscar todos os CFOPs: ${error.message}`);
      throw new Error(`Erro no repositório ao buscar todos os CFOPs: ${error.message}`);
    }
  }
}