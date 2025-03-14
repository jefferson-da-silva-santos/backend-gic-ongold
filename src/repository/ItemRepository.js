import { Op, where } from "sequelize";
import ItemModel from "../models/item.js";
import NcmModel from "../models/ncm.js";
import CstIcmsModel from "../models/csticms.js";
import CfopModel from "../models/cfop.js";
import logger from "../utils/logger.js";

/**
 * @class ItemRepository
 * @description Classe responsável por interagir com o modelo de Item no banco de dados.
 */
class ItemRepository {
  /**
   * @private
   * @type {object}
   * @description Condição para filtrar itens não excluídos.
   */
  itemNotDeleted = { excluido: 0 };

  /**
   * @private
   * @type {object}
   * @description Condição para filtrar itens excluídos.
   */
  itemDeleted = { excluido: 1 };

  /**
   * @private
   * @type {string[]}
   * @description Lista de atributos do modelo Item que serão retornados nas consultas.
   */
  itemsAttrubutes = [
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
  ];

  /**
   * @private
   * @type {object[]}
   * @description Lista de modelos relacionados a serem incluídos nas consultas de itens.
   */
  itemsIncludes = [
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
  ];

  /**
   * @async
   * @function countItems
   * @description Conta o número de itens que correspondem a uma determinada condição.
   * @param {object} [condition] - Condição para filtrar os itens.
   * @returns {Promise<number>} - O número de itens que correspondem à condição.
   */
  async countItems(condition) {
    try {
      const whereCondition = condition ? { where: condition } : {};
      return await ItemModel.count(whereCondition);
    } catch (error) {
      logger.error(`Erro no repositório ao contar itens: ${error.message}`);
      throw new Error(`Erro no repositório ao contar itens: ${error.message}`);
    }
  }

  /**
   * @async
   * @function search
   * @description Busca itens paginados e filtrados por descrição.
   * @param {number} page - Número da página.
   * @param {number} limit - Número de itens por página.
   * @param {string} [description=""] - Descrição para filtrar os itens.
   * @returns {Promise<{items: ItemModel[], totalItems: number}>} - Um objeto contendo a lista de itens e o total de itens.
   */
  async search(page, limit, field, value) {
    try {
      const offset = (page - 1) * limit;

      const whereCondition = field
        ? {
          [field]: {
            [Op.like]: `%${value}%`,
          },
          ...this.itemNotDeleted,
        }
        : this.itemNotDeleted;

      const items = await ItemModel.findAll({
        where: whereCondition,
        limit,
        offset,
        attributes: this.itemsAttrubutes,
        include: this.itemsIncludes,
      });

      const totalItems = await this.countItems(whereCondition);

      return {
        items,
        totalItems,
      };
    } catch (error) {
      logger.error(`Erro no repositório ao buscar itens: ${error.message}`);
      throw new Error(`Erro no repositório ao buscar itens: ${error.message}`);
    }
  }

  /**
   * @async
   * @function getItems
   * @description Busca itens por ID.
   * @param {number} id - ID do item.
   * @returns {Promise<ItemModel[]>} - Uma lista de itens que correspondem ao ID.
   */
  async getItems(id) {
    try {
      return await ItemModel.findAll({
        where: { id, ...this.itemNotDeleted },
        attributes: this.itemsAttrubutes,
        include: this.itemsIncludes,
      });
    } catch (error) {
      logger.error(`Erro no repositório ao buscar itens: ${error.message}`);
      throw new Error(`Erro no repositório ao buscar itens: ${error.message}`);
    }
  }

  /**
   * @async
   * @function getDeletedItems
   * @description Busca todos os itens excluídos.
   * @returns {Promise<ItemModel[]>} - Uma lista de itens excluídos.
   */
  async getDeletedItems() {
    try {
      return await ItemModel.findAll({
        where: this.itemDeleted,
        attributes: this.itemsAttrubutes,
        include: this.itemsIncludes,
      });
    } catch (error) {
      logger.error(`Erro no repositório ao buscar itens excluídos: ${error.message}`);
      throw new Error(`Erro no repositório ao buscar itens excluídos: ${error.message}`);
    }
  }

  /**
   * @async
   * @function report
   * @description Gera um relatório com informações sobre os itens.
   * @returns {Promise<{tenMostExpensiveItems: ItemModel[], totalItems: number, valueStock: number, totalItemsAvailable: number, totalItemsDeleteds: number}>} - Um objeto contendo informações do relatório.
   */
  async report() {
    try {
      const tenMostExpensiveItems = await ItemModel.findAll({
        attributes: ["id", "valor_unitario", "descricao"],
        where: this.itemNotDeleted,
        order: [["valor_unitario", "DESC"]],
        limit: 10,
      });
      const valueStock = await ItemModel.sum("valor_unitario", {
        where: {
          excluido: false,
        },
      });

      const totalItems = await this.countItems();
      const totalItemsAvailable = await this.countItems(this.itemNotDeleted);
      const totalItemsDeleteds = await this.countItems(this.itemDeleted);

      return {
        tenMostExpensiveItems,
        totalItems,
        valueStock,
        totalItemsAvailable,
        totalItemsDeleteds,
      };
    } catch (error) {
      logger.error(`Erro no repositório ao gerar relatório: ${error.message}`);
      throw new Error(`Erro no repositório ao gerar relatório: ${error.message}`);
    }
  }

  /**
   * @async
   * @function insert
   * @description Insere um novo item no banco de dados.
   * @param {object} data - Dados do item a ser inserido.
   * @returns {Promise<ItemModel>} - O item inserido.
   */
  async insert(data) {
    try {
      return await ItemModel.create(data);
    } catch (error) {
      logger.error(`Erro no repositório ao inserir item: ${error.message}`);
      throw new Error(`Erro no repositório ao inserir item: ${error.message}`);
    }
  }

  /**
   * @async
   * @function update
   * @description Atualiza um item no banco de dados.
   * @param {number} id - ID do item a ser atualizado.
   * @param {object} data - Dados do item a serem atualizados.
   * @returns {Promise<number[]>} - O número de linhas afetadas pela atualização.
   * 
   * 
   * {
  valor_unitario: novoValorUnitario,
  descricao: novaDescricao,
  taxa_icms_entrada: novaTaxaIcmsEntrada,
  taxa_icms_saida: novaTaxaIcmsSaida,
  comissao: novaComissao,
  ean: novoEan
  
}
   */
  async update(id, data) {
    try {
      const updatableFields = {
        valor_unitario: data.valor_unitario,
        descricao: data.descricao,
        taxa_icms_entrada: data.taxa_icms_entrada,
        taxa_icms_saida: data.taxa_icms_saida,
        comissao: data.comissao,
        ean: data.ean
      };

      return await ItemModel.update(updatableFields, { where: { id, ...this.itemNotDeleted } });
    } catch (error) {
      logger.error(`Erro no repositório ao atualizar item: ${error.message}`);
      throw new Error(`Erro no repositório ao atualizar item: ${error.message}`);
    }
  }

  /**
   * @async
   * @function softDelete
   * @description Move um item para a lixeira.
   * @param {number} id - ID do item a ser movido para a lixeira.
   * @param {string} datetime - Data e hora da exclusão.
   * @returns {Promise<number[]>} - O número de linhas afetadas pela atualização.
   */
  async softDelete(id, datetime) {
    try {
      return await ItemModel.update(
        { ...this.itemDeleted, excluido_em: datetime },
        { where: { id } }
      );
    } catch (error) {
      logger.error(`Erro no repositório ao mover item para a lixeira: ${error.message}`);
      throw new Error(`Erro no repositório ao mover item para a lixeira: ${error.message}`);
    }
  }

  /**
   * @async
   * @function softDeleteItem
   * @description Restaura um item da lixeira ou restaura todos os itens da lixeira.
   * @param {number} [id=null] - ID do item a ser restaurado. Se null, todos os itens serão restaurados.
   * @returns {Promise<number[]>} - O número de linhas afetadas pela atualização.
   */
  async removeItemSoftly(id = null) {
    try {
      const whereCondition = id ? { where: { id } } : { where: this.itemDeleted };
      return await ItemModel.update(
        { ...this.itemNotDeleted, excluido_em: null },
        whereCondition
      );
    } catch (error) {
      logger.error(`Erro no repositório ao restaurar item: ${error.message}`);
      throw new Error(`Erro no repositório ao restaurar item: ${error.message}`);
    }
  }

  /**
   * @async
   * @function delete
   * @description Remove permanentemente um item ou todos os itens da lixeira.
   * @param {number} [id=null] - ID do item a ser removido. Se null, todos os itens da lixeira serão removidos.
   * @returns {Promise<number>} - O número de linhas afetadas pela exclusão.
   */
  async delete(id = null) {
    try {
      return await ItemModel.destroy({
        where: id ? { id } : this.itemDeleted,
      });
    } catch (error) {
      logger.error(`Erro no repositório ao remover item: ${error.message}`);
      throw new Error(`Erro no repositório ao remover item: ${error.message}`);
    }
  }

  /**
    * @async
    * @function clearItemsByDate
    * @description Remove permanentemente os itens da lixeira que foram excluídos antes de uma determinada data.
    * @param {string} dataLimit - Data limite para exclusão dos itens.
    * @returns {Promise<number>} - O número de linhas afetadas pela exclusão.
    */
  async clearItemsByDate(dataLimit) {
    try {
      return await ItemModel.destroy({
        where: {
          ...this.itemDeleted,
          excluido_em: {
            [Op.lte]: dataLimit,
          },
        },
      });
    } catch (error) {
      logger.error(`Erro no repositório ao tentar limpar os itens da lixeira ${error.message}`);
      throw new Error(`Erro no repositório ao tentar limpar os itens da lixeira ${error.message}`, error);
    }
  }
}

export default ItemRepository;