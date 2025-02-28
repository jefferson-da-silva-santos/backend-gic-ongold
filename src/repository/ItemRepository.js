import { Op } from "sequelize";
import ItemModel from "../models/item.js";

export default class ItemRepository {
  static async findAll({ page = 1, limit = 4 }) {
    const offset = (page - 1) * limit;
    return await ItemModel.findAll({ where: { excluido: 0 }, limit, offset });
  }

  static async count() {
    return await ItemModel.count({ where: { excluido: 0 } });
  }

  static async findByField(field, value) {
    return await ItemModel.findAll({ where: { [field]: { [Op.eq]: value }, excluido: 0 } });
  }

  static async findByDescription({ page = 1, limit = 10, description }) {
    const offset = (page - 1) * limit;
    return await ItemModel.findAll({
      where: { descricao: { [Op.like]: `%${description}%` }, excluido: 0 },
      limit,
      offset
    });
  }

  static async deleteds() {
    return await ItemModel.findAll({ where: { excluido: 1 } });
  }

  static async create(data) {
    return await ItemModel.create(data);
  }

  static async restoreAll() {
    return await ItemModel.update({ excluido: 0, excluido_em: null }, { where: { excluido: 1 } });
  }

  static async updateById(id, data) {
    return await ItemModel.update(data, { where: { id } });
  }

  static async deleteById(id) {
    return await ItemModel.destroy({ where: { id } });
  }

  static async deleteAll(id) {
    return await ItemModel.destroy({ where: { excluido: 1 } });
  }
}
