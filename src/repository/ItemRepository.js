import { Op } from "sequelize";
import ItemModel from "../models/item.js";
import moment from 'moment';

class ItemRepository {

  /**
   * @description Recupera uma lista paginada de itens ativos no banco de dados.
   * @param {number} page - Número da página para a paginação.
   * @param {number} limit - Número máximo de itens a serem retornados por página.
   * @returns {Promise<{items: Array, totalItems: number}>} - Retorna um objeto contendo uma lista de itens e o total de itens disponíveis no banco.
   */
  static async getItems(page, limit) {
    const offset = (page - 1) * limit;
    const items = await ItemModel.findAll({
      where: { excluido: 0 },
      limit,
      offset
    });
    const totalItems = await ItemModel.count({
      where: { excluido: 0 }
    });
    return {
      items,
      totalItems
    };
  }

  /**
   * @description Recupera itens filtrados com base em um campo específico e seu valor.
   * @param {string} field - Nome do campo da tabela para aplicar o filtro.
   * @param {any} value - Valor a ser comparado no campo fornecido.
   * @returns {Promise<Array>} - Retorna uma lista de itens que correspondem ao filtro aplicado.
   */
  static async getItemsFiltering(field, value) {
    const filters = { [field]: { [Op.eq]: value }, excluido: 0 };
    return await ItemModel.findAll({ where: filters });
  }

  /**
   * @description Recupera itens baseados em uma busca de descrição, com suporte a paginação.
   * @param {number} page - Número da página para a paginação.
   * @param {number} limit - Número máximo de itens a serem retornados por página.
   * @param {string} description - Texto a ser buscado na descrição dos itens.
   * @returns {Promise<Array>} - Retorna uma lista de itens cujas descrições correspondem ao valor de pesquisa.
   */
  static async getItemsByDescription(page, limit, description) {
    const offset = (page - 1) * limit;
    return await ItemModel.findAll({
      where: {
        descricao: {
          [Op.like]: `%${description}%`
        },
        excluido: 0
      },
      limit,
      offset
    });
  }

  /**
   * @description Recupera itens que foram adicionados a lixeira
   * @returns {Promise<Array>}
   */
  static async getDeletedItems() {
    return await ItemModel.findAll({
      where: { excluido: 1 }
    })
  }

  /**
   * @description Adiciona um novo item ao banco de dados
   * @param {object} data - Um objeto com os dados do novo item
   * @returns {Promise<Array>}
   */
  static async insertItem(data) {
    return await ItemModel.create(data);
  }

  /**
   * @description Atualiza um item no banco de dados
   * @param {number} id - Id do item a ser atualizado
   * @param {object} data - Um objeto com os dados atualizados do item
   * @returns {Promise<Array>}
   */
  static async updateItem(id, data) {
    return await ItemModel.update(data, { where: { id, excluido: 0 } });
  }

  /**
   * @description Deleta momentâneamente um item (move para lixeira)
   * @param {number} id - Id do item a ser movido para lixeira
   * @returns {Promise<Array>}
   */
  static async deleteItemMomentarily(id) {
    return await ItemModel.update(
      { excluido: 1, excluido_em: moment().tz('America/Sao_Paulo').format('YYYY-MM-DD HH:mm:ss') },
      { where: { id } }
    );
  }

  /**
   * @description Deleta permanentemente um item
   * @param {number} id - Id do item a ser movido para lixeira
   * @returns {Promise<Array>}
   */
  static async deletePermanentItem(id) {
    return await ItemModel.destroy({ where: { id } });
  }

  /**
   * @description Deleta permanentemente um item
   * @param {number} id - Id do item a ser movido para lixeira
   * @returns {Promise<Array>}
   */
  static async deletePermanentAllItems() {
    return await ItemModel.destroy({ where: { excluido: 1 } });
  }

  /**
   * @description Tira um item da lixeira
   * @param {number} id - Id do item a ser removido para lixeira
   * @returns {Promise<Array>}
   */
  static async restoreItem(id) {
    return await ItemModel.update({ excluido: 0, excluido_em: null }, { where: { id } });
  }

  /**
   * @description Remove todos os items da lixeira
   * @returns {Promise<Array>}
   */
  static async restoreAllItems() {
    return await ItemModel.update({ excluido: 0, excluido_em: null }, { where: { excluido: 1 } });
  }
}

export default ItemRepository;
