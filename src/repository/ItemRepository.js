import { Op } from "sequelize";
import ItemModel from "../models/item.js";
import NcmModel from "../models/ncm.js";
import CstIcmsModel from "../models/csticms.js";
import CfopModel from "../models/cfop.js";
import moment from 'moment';

const itemNotDeleted = { excluido: 0 };
const itemDeleted = { excluido: 1 };

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
      where: itemNotDeleted,
      limit,
      offset,
      attributes: [
        "id",
        "valor_unitario",
        "descricao",
        "taxa_icms_entrada",
        "taxa_icms_saida",
        "comissao",
        "ean",
        "excluido",
        "criado_em",
        "excluido_em",
      ],
      include: [
        {
          model: NcmModel,
          as: "ncm",
          attributes: ["codncm"],
        },
        {
          model: CstIcmsModel,
          as: "csticms",
          attributes: ["codcst"],
        },
        {
          model: CfopModel,
          as: "cfopinfo",
          attributes: ["codcfop"],
        },
      ],
    });

    const totalItems = await ItemModel.count({
      where: itemNotDeleted,
    });

    return {
      items,
      totalItems,
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

    return await ItemModel.findAll({
      where: filters,
      attributes: [
        "id",
        "valor_unitario",
        "descricao",
        "taxa_icms_entrada",
        "taxa_icms_saida",
        "comissao",
        "ean",
        "excluido",
        "criado_em",
        "excluido_em",
      ],
      include: [
        {
          model: NcmModel,
          as: "ncm",
          attributes: ["codncm"],
        },
        {
          model: CstIcmsModel,
          as: "csticms",
          attributes: ["codcst"],
        },
        {
          model: CfopModel,
          as: "cfopinfo",
          attributes: ["codcfop"],
        },
      ],
    });
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

    const items = await ItemModel.findAll({
      where: {
        descricao: {
          [Op.like]: `%${description}%`
        },
        excluido: 0
      },
      limit,
      offset,
      attributes: [
        "id",
        "valor_unitario",
        "descricao",
        "taxa_icms_entrada",
        "taxa_icms_saida",
        "comissao",
        "ean",
        "excluido",
        "criado_em",
        "excluido_em",
      ],
      include: [
        {
          model: NcmModel,
          as: "ncm",
          attributes: ["codncm"],
        },
        {
          model: CstIcmsModel,
          as: "csticms",
          attributes: ["codcst"],
        },
        {
          model: CfopModel,
          as: "cfopinfo",
          attributes: ["codcfop"],
        },
      ],
    });
    const totalItems = await ItemModel.count({
      where: {
        descricao: {
          [Op.like]: `%${description}%`
        },
        excluido: 0
      }
    });

    return { items, totalItems }
  }

  /**
   * @description Recupera itens que foram adicionados a lixeira
   * @returns {Promise<Array>}
   */
  static async getDeletedItems() {
    return await ItemModel.findAll({
      where: itemDeleted,
      attributes: [
        "id",
        "valor_unitario",
        "descricao",
        "taxa_icms_entrada",
        "taxa_icms_saida",
        "comissao",
        "ean",
        "excluido",
        "criado_em",
        "excluido_em",
      ],
      include: [
        {
          model: NcmModel,
          as: "ncm",
          attributes: ["codncm"],
        },
        {
          model: CstIcmsModel,
          as: "csticms",
          attributes: ["codcst"],
        },
        {
          model: CfopModel,
          as: "cfopinfo",
          attributes: ["codcfop"],
        },
      ],
    })
  }

  static async getReportData() {
    console.log('🚀 Entrou na função getReportData');

    const tenMostExpensiveItems = await ItemModel.findAll({
      attributes: ["id", "valor_unitario", "descricao"],
      where: itemNotDeleted,
      order: [['valor_unitario', 'DESC']],
      limit: 10
    });
    const totalItems = await ItemModel.count();
    const totalItemsAvailable = await ItemModel.count({ where: itemNotDeleted });
    const totalItemsDeleteds = await ItemModel.count({ where: itemDeleted });
    const valueStock = await ItemModel.sum('valor_unitario', {
      where: {
        excluido: false // ou excluido: 0
      }
    });
    return {
      tenMostExpensiveItems,
      totalItems,
      valueStock,
      totalItemsAvailable,
      totalItemsDeleteds
    };
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
    return await ItemModel.destroy({ where: itemDeleted });
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
    return await ItemModel.update({ excluido: 0, excluido_em: null }, { where: itemDeleted });
  }

  /**
   * @description Remove itens que já estão a mais de 30 dias excluídos
   * @param {Date} dataLimit - Data limite (30 dias)
   * @returns {number} - Retorna a quantidade de linhas excluídas
   */
  static async deleteItemAfter30Days(dataLimit) {
    return await ItemModel.destroy({
      where: {
        excluido: 1,
        excluido_em: {
          [Op.lte]: dataLimit,
        }
      }
    })
  }
}


export default ItemRepository;
