import NcmRepository from "../repository/NcmRepository.js";
import logger from "../utils/logger.js";

export default class NcmService {
  async getAllNcms() {
    try {
      const ncm = new NcmRepository();
      const ncms = await ncm.getAllNcms();
      if (ncms.length === 0) {
        throw new Error("Nenhum NCM encontrado", 404);
      }

      return ncms.map(({ dataValues: ncm }) => ({
        idncm: ncm.idncm,
        codncm: ncm.codncm,
        nomencm: ncm.nomencm,
        aliquota: ncm.aliquota,
      }));
    } catch (error) {
      logger.error(`Erro no serviço ao buscar todos os NCMs: ${error.message}`);
      throw error;
    }
  }

  async getAllNcmsFilterCod(cod) {
    try {
      const ncm = new NcmRepository();
      const ncms = await ncm.getAllNcmsFilterCod(cod);
      if (ncms.length === 0) {
        throw new Error(`Nenhum NCM encontrado para '${cod}'`, 404);
      }

      return ncms.map(({ dataValues: ncm }) => ({
        idncm: ncm.idncm,
        codncm: ncm.codncm,
        nomencm: ncm.nomencm,
        aliquota: ncm.aliquota,
      }));
    } catch (error) {
      logger.error(`Erro no serviço ao buscar NCMs com código '${cod}': ${error.message}`);
      throw error;
    }
  }
}
