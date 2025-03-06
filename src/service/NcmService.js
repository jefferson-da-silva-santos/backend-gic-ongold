import NcmRepository from "../repository/NcmRepository.js";
import logger from "../utils/logger.js";

export default class NcmService {
  static async getAllNcms() {
    try {
      const ncms = await NcmRepository.getAllNcms();
      if (ncms.length === 0) {
        throw new Error("Nenhum NCM encontrado", 404);
      }

      return ncms.map(({ dataValues: ncm }) => ({
        codncm: ncm.codncm,
        nomencm: ncm.nomencm,
        aliquota: ncm.aliquota,
      }));
    } catch (error) {
      logger.error(`Erro no serviço ao buscar todos os NCMs: ${error.message}`);
      throw error;
    }
  }

  static async getAllNcmsFilterCod(cod) {
    try {
      const ncms = await NcmRepository.getAllNcmsFilterCod(cod);
      if (ncms.length === 0) {
        throw new Error(`Nenhum NCM encontrado para '${cod}'`, 404);
      }

      return ncms.map(({ dataValues: ncm }) => ({
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
