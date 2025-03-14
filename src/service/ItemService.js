import ItemRepository from "../repository/ItemRepository.js";
import ItemDTO from "../dtos/itemDTO.js";
import logger from "../utils/logger.js";
import moment from "moment";

export default class ItemService {
  async search(page = 1, limit = 4, field = "", value = "") {
    try {
      const item = new ItemRepository();

      if (field === "excluido" && value === 1) {
        const items = await item.getDeletedItems();
        return ItemDTO.parseObject(items);
      }

      const { items, totalItems } = await item.search(page, limit, field, value);

      const totalPages = Math.ceil(totalItems / limit);

      return {
        items: ItemDTO.parseObject(items),
        quantityItems: totalItems,
        totalPages,
        currentPage: page
      };
    } catch (error) {
      logger.error(`Erro no serviço ao buscar itens: ${error.message}`);
      throw new Error(`Erro no serviço ao buscar itens: ${error.message}`);
    }
  }

  async getItems(id) {
    try {
      if (!id) throw new Error('O id não pode estar vazio!');
      const item = new ItemRepository();
      const items = await item.getItems(id);
      if (items.length === 0) throw new Error('Nenhum item encontrado');

      return ItemDTO.parseObject(items);
    } catch (error) {
      logger.error(`Erro no serviço ao buscar itens: ${error.message}`);
      throw new Error(`Erro no serviço ao buscar itens: ${error.message}`);
    }
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
      logger.error(`Erro no serviço ao gerar relatório: ${error.message}`);
      throw new Error(`Erro no serviço ao gerar relatório: ${error.message}`);
    }
  }

  async insert(data) {
    try {
      const item = new ItemRepository();
      return await item.insert(data);
    } catch (error) {
      logger.error(`Erro no serviço ao inserir item: ${error.message}`);
      throw new Error(`Erro no serviço ao inserir item: ${error.message}`);
    }
  }

  async update(id, data) {
    try {
      const item = new ItemRepository();
      const updated = await item.update(id, data);
      if (!updated) throw new Error("Item não encontrado para atualização");

      return updated;
    } catch (error) {
      logger.error(`Erro no serviço ao atualizar item: ${error.message}`);
      throw new Error(`Erro no serviço ao atualizar item: ${error.message}`);
    }
  }

  async softDeleteItem(id) {
    try {
      const currentMoment = moment().tz('America/Sao_Paulo').format('YYYY-MM-DD HH:mm:ss');
      const item = new ItemRepository();
      return item.softDelete(id, currentMoment);
    } catch (error) {
      logger.error(`Erro no serviço ao mover item para a lixeira: ${error.message}`);
      throw new Error(`Erro no serviço ao mover item para a lixeira: ${error.message}`);
    }
  }

  async delete(id) {
    try {
      const item = new ItemRepository();
      return item.delete(id);
    } catch (error) {
      logger.error(`Erro no serviço ao remover item: ${error.message}`);
      throw new Error(`Erro no serviço ao remover item: ${error.message}`);
    }
  }

  async removeItemSoftly(id) {
    try {
      const item = new ItemRepository();
      return item.removeItemSoftly(id);
    } catch (error) {
      logger.error(`Erro no serviço ao restaurar item: ${error.message}`);
      throw new Error(`Erro no serviço ao restaurar item: ${error.message}`);
    }
  }

  async clearItemsByDate() {
    try {
      const dataLimit = new Date();
      dataLimit.setDate(dataLimit.getDate() - 30);
      const item = new ItemRepository();

      const result = await item.clearItemsByDate(dataLimit);
      if (result <= 0) {
        logger.info('Nenhum item foi deletado, pois nenhum item tinha mais de 30 dias.');
        throw new Error('Nenhum item foi deletado, pois nenhum item tinha mais de 30 dias.');
      } 
      logger.info('Itens antigos deletados com sucesso.');
    } catch (error) {
      logger.error(`Erro ao deletar itens antigos: ${error.message}`);
    }
  }
}
