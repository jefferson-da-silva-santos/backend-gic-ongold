import ItemRepository from "../repository/ItemRepository.js";
import ItemDTO from "../dtos/itemDTO.js";
import logger from "../utils/logger.js";

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

  static async getReport() {
    try {
      const data = await ItemRepository.getReportData();
      data.tenMostExpensiveItems = data.tenMostExpensiveItems.map(item => ({
        ...item.toJSON(), // Garante que `descricao` e outros campos sejam preservados
        valor_unitario: parseFloat(item.valor_unitario).toFixed(2)
      }));


      data.valueStock = data.valueStock ? parseFloat(data.valueStock).toFixed(2) : "0.00";

      return data;
    } catch (error) {
      throw new Error(error);
    }
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

  static async deleteItemAfter30Days() {
    const dataLimit = new Date();
    dataLimit.setDate(dataLimit.getDate() - 30);
    try {
      const result = await ItemRepository.deleteItemAfter30Days(dataLimit);
      if (result > 0) {
        logger.info(`${result} itens antigos foram deletados da lixeira.`);
      } else {
        logger.info('Nenhum item foi deletado, pois não havia itens com mais de 30 dias.');
      }
    } catch (error) {
      logger.error(`Erro ao deletar itens antigos: ${error.message}`);
    }
  }
}
