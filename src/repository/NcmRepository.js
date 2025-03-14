import NcmModel from "../models/ncm.js";
import { Op } from "sequelize";
import logger from "../utils/logger.js";

export default class NcmRepository {
  async getAllNcms() {
    try {
      return await NcmModel.findAll();
    } catch (error) {
      logger.error(`Erro no repositório ao buscar todos os NCMs: ${error.message}`);
      throw new Error(`Erro no repositório ao buscar todos os NCMs: ${error.message}`);
    }
  }

  async getAllNcmsFilterCod(cod) {
    try {
      const ncms = await NcmModel.findAll({
        where: {
          [Op.or]: [
            { codncm: { [Op.like]: `${cod}%` } },
            { nomencm: { [Op.like]: `${cod}%` } },
          ],
        },
      });
      return ncms;
    } catch (error) {
      logger.error(`Erro no repositório ao buscar NCMs com código '${cod}': ${error.message}`);
      throw new Error(`Err no repositórioo ao buscar NCMs com código '${cod}': ${error.message}`);
    }
  }
}
