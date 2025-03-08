import ItemRepository from "../repository/ItemRepository.js";
import ItemDTO from "../dtos/itemDTO.js";

export default class ItemService {
  static async getAllItems(page = 1, limit = 4) {
    const { items, totalItems } = await ItemRepository.getItems(page, limit);
    const totalPages = Math.ceil(totalItems / limit);
    
    return {
      items: ItemDTO.parseObject(items),
      quantityItems: totalItems,
      totalPages,
      currentPage: page
    };
  }

  static async getItemByField(field, value) {
    if (!field || !value) throw new Error('Parâmetros de filtragem vazios');
    
    const items = await ItemRepository.getItemsFiltering(field, value);
    if (items.length === 0) throw new Error('Nenhum item encontrado');

    return ItemDTO.parseObject(items);
  }

  static async searchItemsByDescription(page, limit, description) {
    const { items, totalItems } = await ItemRepository.getItemsByDescription(page, limit, description);
    const totalPages = Math.ceil(totalItems / limit);

    return {
      items: ItemDTO.parseObject(items),
      quantityItems: totalItems,
      totalPages,
      currentPage: page
    };
}

  static async getDeletedItems() {
    const items = await ItemRepository.getDeletedItems();
    return ItemDTO.parseObject(items);
  }

  static async insertItem(data) {
    return await ItemRepository.insertItem(data);
  }

  static async updateItem(id, data) {
    const updated = await ItemRepository.updateItem(id, data);
    if (!updated) throw new Error("Item não encontrado para atualização");

    return updated;
  }

  static async softDeleteItem(id) {
    return await ItemRepository.deleteItemMomentarily(id);
  }

  static async restoreAllItems() {
    return ItemRepository.restoreAllItems();
  }

  static async restoreItem(id) {
    return await ItemRepository.restoreItem(id);
  }

  static async deleteItemPermanently(id) {
    return await ItemRepository.deletePermanentItem(id);
  }

  static async deleteAllItemsPermanently() {
    return await ItemRepository.deletePermanentAllItems();
  }
}
