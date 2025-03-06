import CstIcmsModel from "../models/csticms.js";

// Entidade para tratar o CST
export default class CstRepository {
  static async getAllCsts() {
    const csts = await CstIcmsModel.findAll({
      order: [['descricao', 'ASC']]
    });
    return csts;
  }
}
