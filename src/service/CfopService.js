import CfopRepository from "../repository/CfopRepository.js";

// Entidade para tratar o CFOP
export default class CfopService {
  /**
   * @description 
   * @returns 
   */
  async getAllCfops() {
    try {
      const cfop = new CfopRepository();
      const result = await cfop.getAllCfops();
      if (!result || (Array.isArray(result) && result.length === 0)) {
        return null;
      }
      return result.cfops;
    } catch (error) {
      logger.error(`Erro no serviço ao buscar todos os CFOPs: ${error.message}`);
      throw new Error(`Erro no serviço ao buscar todos os CFOPs: ${error.message}`);
    }
  }
}