import CstRepository from "../repository/CstRepository.js";

// Entidade para tratar o CST
export default class Cst {
  async getAllCsts() {
    try {
      const cst = new CstRepository();
      const result = await cst.getAllCsts();
      if (!result || (Array.isArray(result) && result.length === 0)) {
        return null;
      }
      return result.map(({ dataValues: cst }) => ({
        idcst: cst.idcst,
        codcst: cst.codcst,
        descricao: cst.descricao,
        regime: cst.regime,
      }));
    } catch (error) {
      logger.error(`Erro no serviço ao buscar todos os CSTs: ${error.message}`);
      throw new Error(`Erro no serviço ao buscar todos os CSTs: ${error.message}`);
    }
  }
}