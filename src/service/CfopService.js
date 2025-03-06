import CfopRepository from "../repository/CfopRepository.js";

// Entidade para tratar o CFOP
export default class CfopService {
  /**
   * @description 
   * @returns 
   */
  static async getAllCfops() {
    const result = await CfopRepository.getAllCfops();
    if (!result || (Array.isArray(result) && result.length === 0)) {
      return null;
    }
    return result.cfops;
  }
}