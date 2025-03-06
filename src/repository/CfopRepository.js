import CfopModel from "../models/cfop.js"

export default class CfopRepository {
  /**
   * @description Recupera uma lista de cfops
   */
  static async getAllCfops() {
    const cfops = await CfopModel.findAll({
      order: [['descricaocfop', 'ASC']]
    });
    return {
      cfops
    }
  }
}