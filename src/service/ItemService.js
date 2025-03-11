import ItemRepository from "../repository/ItemRepository.js";
import ItemDTO from "../dtos/itemDTO.js";
import logger from "../utils/logger.js";
import moment from "moment";

export default class ItemService {
  async search(page = 1, limit = 4, description = "") {
    const item = new ItemRepository();
    const { items, totalItems } = await item.search(page, limit, description);
    const totalPages = Math.ceil(totalItems / limit);

    return {
      items: ItemDTO.parseObject(items),
      quantityItems: totalItems,
      totalPages,
      currentPage: page
    };
  }

  async getItems(id) {
    if (!id) throw new Error('O id não pode estar vazio!');
    const item = new ItemRepository();
    const items = await item.getItems(id);
    if (items.length === 0) throw new Error('Nenhum item encontrado');

    return ItemDTO.parseObject(items);
  }

  async getDeletedItems() {
    const item = new ItemRepository();
    const items = await item.getDeletedItems();
    return ItemDTO.parseObject(items);
  }

  async getReport() {
    try {
      const item = new ItemRepository();
      const data = await item.report();
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

  async insert(data) {
    const item = new ItemRepository();
    return await item.insert(data);
  }

  async update(id, data) {
    const item = new ItemRepository();
    const updated = await item.update(id, data);
    if (!updated) throw new Error("Item não encontrado para atualização");

    return updated;
  }

  async softDeleteItem(id) {
    const currentMoment = moment().tz('America/Sao_Paulo').format('YYYY-MM-DD HH:mm:ss');
    const item = new ItemRepository();
    return item.softDelete(id, currentMoment);
  }

  async delete(id) {
    const item = new ItemRepository();
    return item.delete(id);
  }

  async removeItemSoftly(id) {
    const item = new ItemRepository();
    return item.removeItemSoftly(id);
  }

  async clearItemsByDate() {
    const dataLimit = new Date();
    dataLimit.setDate(dataLimit.getDate() - 30);
    const item = new ItemRepository();
    try {
      const result = await item.clearItemsByDate(dataLimit);
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
