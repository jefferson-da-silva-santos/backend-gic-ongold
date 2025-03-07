import CstRepository from "../repository/CstRepository.js";
import logger from '../utils/logger.js';

// Entidade para tratar o CST
export default class Cst {
  static async getAllCsts() {

    const result = await CstRepository.getAllCsts();
    if (!result || (Array.isArray(result) && result.length === 0)) {
      return null;
    }
    return result.map(({ dataValues: cst }) => ({
      idcst: cst.idcst,
      codcst: cst.codcst,
      descricao: cst.descricao,
      regime: cst.regime,
    }));
  }
}