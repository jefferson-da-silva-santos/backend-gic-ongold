import ItemRepository from "../repository/ItemRepository.js";
import ItemsDTO from "../dtos/itemsDTO.js";
import moment from "moment-timezone";

export default class ItemService {
  static async getAllItems(page = 1, limit = 4) {
    const items = await ItemRepository.findAll({ page, limit });
    const quantityItems = await ItemRepository.count();
    const totalPages = Math.ceil(quantityItems / limit);
    
    return {
      items: ItemsDTO.parseObject(items),
      quantityItems,
      totalPages,
      currentPage: page
    };
  }

  static async getItemByField(field, value) {
    if (!field || !value) throw new Error('Parâmetros de filtragem vazios');
    
    const items = await ItemRepository.findByField(field, value);
    if (items.length === 0) throw new Error('Nenhum item encontrado');

    return ItemsDTO.parseObject(items);
  }

  static async searchItemsByDescription(page, limit, description) {
    const items = await ItemRepository.findByDescription({ page, limit, description });
    const quantityItems = await ItemRepository.count();
    const totalPages = Math.ceil(quantityItems / limit);

    return {
      items: ItemsDTO.parseObject(items),
      quantityItems,
      totalPages,
      currentPage: page
    };
  }

  static async getDeletedItems() {
    const items = await ItemRepository.deleteds();
    return ItemsDTO.parseObject(items);
  }

  static async insertItem(data) {
    return await ItemRepository.create(data);
  }

  static async updateItem(id, data) {
    const updated = await ItemRepository.updateById(id, data);
    if (!updated) throw new Error("Item não encontrado para atualização");

    return updated;
  }

  static async softDeleteItem(id) {
    return await ItemRepository.updateById(id, {
      excluido: 1,
      excluido_em: moment().tz("America/Sao_Paulo").format("YYYY-MM-DD HH:mm:ss")
    });
  }

  static restoreAllItems() {
    return ItemRepository.restoreAll();
  }

  static async restoreItem(id) {
    return await ItemRepository.updateById(id, { excluido: 0, excluido_em: null });
  }

  static async deleteItemPermanently(id) {
    return await ItemRepository.deleteById(id);
  }

  static async deletedAllItemsPermanently() {
    return await ItemRepository.deleteAll();
  }
}
