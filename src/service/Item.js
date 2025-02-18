import { Op, where } from "sequelize";
import ItemModel from "../models/item.js";
import logger from '../utils/logger.js';

// Entidade para tratar o Item
export default class Item {
  static async getAllItems() {
    try {
      logger.info('Iniciando a busca de itens no banco de dados');
      const items = await ItemModel.findAll({ where: { excluido: 0 } });
      logger.info('Itens encontrados com sucesso', { itemCount: items.length });
      return this.parseObject(items);
    } catch (error) {
      logger.error('Erro ao buscar itens', { error: error.message, stack: error.stack });
      throw new Error("Erro ao buscar itens");
    }
  }

  static async getItemFillter(field, value) {
    try {
      if (!field || !value) {
        throw new Error('Parâmetros de filtragem vazios');
      }
      const filters = { [field]: { [Op.eq]: value }, excluido: 0 };
      const items = await ItemModel.findAll({ where: filters });
      if (items.length === 0) {
        throw new Error('Erro ao buscar dados');
      }
      logger.info('Itens encontrados com filtragem', { filter: { field, value }, itemCount: items.length });
      return this.parseObject(items);
    } catch (error) {
      logger.error('Erro ao buscar itens com filtragem', { error: error.message, stack: error.stack });
      throw new Error("Erro ao buscar itens filtragem");
    }
  }

  static async getItemSearchDescription(description) {
    try {
      const results = await ItemModel.findAll({
        where: {
          descricao: {
        [Op.like]: `%${description}%`
          },
          excluido: 0
        }
      });
      if (results.length === 0) {
        throw new Error('Nenhum item encontrado com a descrição fornecida');
      }
      logger.info('Itens encontrados com descrição', { description, itemCount: results.length });
      return this.parseObject(results);
    } catch (error) {
      next();
    }
  }

  static async getDeletedItems() {
    try {
      logger.info('Iniciando a busca de itens excluídos no banco de dados');
      const items = await ItemModel.findAll({ where: { excluido: 1 } });
      logger.info('Itens excluídos encontrados com sucesso', { itemCount: items.length });
      return this.parseObject(items);
    } catch (error) {
      logger.error('Erro ao buscar itens excluídos', { error: error.message, stack: error.stack });
      throw new Error("Erro ao buscar itens excluídos");
    }
  }

  static async insertItem(data) {
    try {
      const result = await ItemModel.create(data);
      logger.info('Item inserido com sucesso', { itemId: result.id });
      return result;
    } catch (error) {
      logger.error('Erro ao tentar inserir um item', { error: error.message, stack: error.stack });
      throw new Error(`Erro ao tentar inserir um item: ${error.message}`);
    }
  }

  static async updateItem(id, data) {
    try {
      const itemExists = await ItemModel.findByPk(id);
      if (!itemExists) {
        logger.warn(`Item ID ${id} não encontrado para atualização`);
        return 0;
      }

      const [updatedRows] = await ItemModel.update(data, {
        where: { id },
      });

      if (updatedRows === 0) {
        logger.warn(`Nenhum item atualizado. ID ${id} não foi modificado.`);
      }

      logger.info('Item atualizado com sucesso', { itemId: id, updatedRows });
      return updatedRows;
    } catch (error) {
      logger.error('Erro ao atualizar item', { error: error.message, stack: error.stack });
      throw new Error(`Erro ao atualizar item: ${error.message}`);
    }
  }

  static async deleteItem(id) {
    try {
      const itemExists = await ItemModel.findByPk(id);
      if (!itemExists) {
        logger.warn(`Item ID ${id} não encontrado para deleção`);
        return 0;
      }

      const [updatedRows] = await ItemModel.update({ excluido: 1, excluido_em: new Date().toISOString().slice(0, 19).replace('T', ' ') }, { where: { id } });

      if (updatedRows === 0) {
        logger.warn(`Nenhum item atualizado. Item ID ${id} pode não existir.`);
      }

      logger.info('Item marcado como excluído com sucesso', { itemId: id, updatedRows });
      return updatedRows;
    } catch (error) {
      logger.error('Erro ao marcar item como excluído', { error: error.message, stack: error.stack });
      throw new Error(`Erro ao marcar item como excluído: ${error.message}`);
    }
  }

  static async deletePermanentAllItems() {
    try {
      const deletedItems = await ItemModel.destroy({ where: { excluido: 1 } });
      logger.info('Itens excluídos permanentemente', { deletedItems });
      return deletedItems;
    } catch (error) {
      logger.error('Erro ao excluir itens permanentemente', { error: error.message, stack: error.stack });
      throw new Error(`Erro ao excluir itens permanentemente: ${error.message}`);
    }
  }

  static async deletePermanentItem(id) {
    try {
      const deletedItems = await ItemModel.destroy({ where: { id } });
      logger.info('Item excluído permanentemente', { deletedItems });
      return deletedItems;
    } catch (error) {
      logger.error('Erro ao excluir item permanentemente', { error: error.message, stack: error.stack });
      throw new Error(`Erro ao excluir item permanentemente: ${error.message}`);
    }
  }

  static async restoreAllItems() {
    try {
      const restoredItems = await ItemModel.update({ excluido: 0, excluido_em: null }, { where: { excluido: 1 } });
      logger.info('Itens restaurados', { restoredItems });
      return restoredItems;
    } catch (error) {
      logger.error('Erro ao restaurar itens', { error: error.message, stack: error.stack });
      throw new Error(`Erro ao restaurar itens: ${error.message}`);
    }
  }

  static async restoreItem(id) {
    try {
      const restoredItems = await ItemModel.update({ excluido: 0, excluido_em: null }, { where: { id } });
      logger.info('Item restaurado', { restoredItems });
      return restoredItems;
    } catch (error) {
      logger.error('Erro ao restaurar item', { error: error.message, stack: error.stack });
      throw new Error(`Erro ao restaurar item: ${error.message}`);
    }
  }

  static parseObject(arr) {
    return arr.map(({ dataValues: item }) => ({
      id: item.id,
      valor_unitario: item.valor_unitario,
      descricao: item.descricao,
      taxa_icms_entrada: item.taxa_icms_entrada,
      taxa_icms_saida: item.taxa_icms_saida,
      comissao: item.comissao,
      ncm: item.ncm,
      cst: item.cst,
      cfop: item.cfop,
      ean: item.ean,
      totalCusto: Item.calculateTotalCost(
        item.valor_unitario,
        item.taxa_icms_entrada,
        item.taxa_icms_saida,
        item.comissao
      ),
      criado_em: item.criado_em,
      excluido_em: item.excluido_em
    }));
  }

  static calculateTotalCost(unitValue, entryIcmsRate = 0, exitIcmsRate = 0, commission = 0) {
    const value = parseFloat(unitValue) || 0;
    const entryIcms = parseFloat(entryIcmsRate) || 0;
    const exitIcms = parseFloat(exitIcmsRate) || 0;
    const commissionRate = parseFloat(commission) || 0;

    const totalCost = ((entryIcms / 100) + (exitIcms / 100) + (commissionRate / 100)) * value;
    return parseFloat(totalCost.toFixed(2));
  }
}
