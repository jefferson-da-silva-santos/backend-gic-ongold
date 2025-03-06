import NcmModel from "../models/ncm.js";
import { Op } from "sequelize";

export default class NcmRepository {
  static async getAllNcms() {
    return await NcmModel.findAll();
  }

  static async getAllNcmsFilterCod(cod) {
    const ncms = await NcmModel.findAll({
      where: {
        [Op.or]: [
          { codncm: { [Op.like]: `${cod}%` } },
          { nomencm: { [Op.like]: `${cod}%` } },
        ],
      },
    });
    return ncms;
  }
}
