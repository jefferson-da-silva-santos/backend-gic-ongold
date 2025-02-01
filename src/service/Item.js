import { Op } from "sequelize";
import ItemModel from "../models/item.js";
import logger from '../utils/logger.js';

// Entidade para tratar o Item
export default class Item {
  constructor(value_unit, description, entry_icms_fee, exit_icms_rate, commission, codNcm, codCst, codCfop, codEan, deleted) {
    this.validateInputs(value_unit, description, entry_icms_fee, exit_icms_rate, commission, codNcm, codCst, codCfop, codEan, deleted);
    this._value_unit = value_unit;
    this._description = description;
    this._entry_icms_fee = entry_icms_fee;
    this._exit_icms_rate = exit_icms_rate;
    this._commission = commission;
    this._codNcm = codNcm;
    this._codCst = codCst;
    this._codCfop = codCfop;
    this._codEan = codEan;
    this._deleted = deleted;
  }

  get value_unit() {
    return this._value_unit;
  }

  get description() {
    return this._description;
  }

  get entry_icms_fee() {
    return this._entry_icms_fee;
  }

  get exit_icms_rate() {
    return this._exit_icms_rate;
  }

  get commission() {
    return this._commission;
  }

  get codNcm() {
    return this._codNcm;
  }

  get codCst() {
    return this._codCst;
  }

  get codCfop() {
    return this._codCfop;
  }

  get codEan() {
    return this._codEan;
  }

  get deleted() {
    return this._deleted;
  }

  static async getAllItems() {
    try {
      logger.info('Iniciando a busca de itens no banco de dados');
      const items = await ItemModel.findAll();
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
      const filters = { [field]: { [Op.eq]: value } };
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

  async insertItem() {
    try {
      const newItem = {
        valor_unitario: this.value_unit,
        descricao: this.description,
        taxa_icms_entrada: this.entry_icms_fee || null,
        taxa_icms_saida: this.exit_icms_rate || null,
        comissao: this.commission || null,
        ncm: this.codNcm,
        cst: this.codCst,
        cfop: this.codCfop,
        ean: this.codEan,
        excluido: this.deleted
      };

      const result = await ItemModel.create(newItem);
      logger.info('Item inserido com sucesso', { itemId: result.dataValues.id });
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
      const deletedRows = await ItemModel.destroy({ where: { id } });

      if (deletedRows === 0) {
        logger.warn(`Nenhum item deletado. Item ID ${id} pode não existir.`);
      }

      logger.info('Item deletado com sucesso', { itemId: id, deletedRows });
      return deletedRows;
    } catch (error) {
      logger.error('Erro ao deletar item', { error: error.message, stack: error.stack });
      throw new Error(`Erro ao deletar item: ${error.message}`);
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

  validateInputs(value_unit, description, entry_icms_fee, exit_icms_rate, commission, codNcm, codCst, codCfop, codEan, deleted) {
    if (typeof value_unit !== "number" || value_unit <= 0) {
      logger.error("Validação falhou", { field: "value_unit", error: "O valor unitário deve ser um número positivo.", value: value_unit });
      throw new Error("O valor unitário deve ser um número positivo.");
    }

    if (typeof description !== "string" || description.trim().length === 0 || description.length > 255) {
      logger.error("Validação falhou", { field: "description", error: "A descrição deve ser uma string não vazia com até 255 caracteres.", value: description });
      throw new Error("A descrição deve ser uma string não vazia com até 255 caracteres.");
    }

    if (entry_icms_fee !== null && (typeof entry_icms_fee !== "number" || entry_icms_fee < 0 || entry_icms_fee > 100)) {
      logger.error("Validação falhou", { field: "entry_icms_fee", error: "A taxa ICMS de entrada deve ser um número entre 0 e 100 ou nula.", value: entry_icms_fee });
      throw new Error("A taxa ICMS de entrada deve ser um número entre 0 e 100 ou nula.");
    }

    if (exit_icms_rate !== null && (typeof exit_icms_rate !== "number" || exit_icms_rate < 0 || exit_icms_rate > 100)) {
      logger.error("Validação falhou", { field: "exit_icms_rate", error: "A taxa ICMS de saída deve ser um número entre 0 e 100 ou nula.", value: exit_icms_rate });
      throw new Error("A taxa ICMS de saída deve ser um número entre 0 e 100 ou nula.");
    }

    if (commission !== null && (typeof commission !== "number" || commission < 0 || commission > 100)) {
      logger.error("Validação falhou", { field: "commission", error: "A comissão deve ser um número entre 0 e 100 ou nula.", value: commission });
      throw new Error("A comissão deve ser um número entre 0 e 100 ou nula.");
    }

    if (!/^\d{8}$/.test(codNcm)) {
      logger.error("Validação falhou", { field: "codNcm", error: `O código NCM "${codNcm}" deve conter exatamente 8 dígitos numéricos.`, value: codNcm });
      throw new Error(`O código NCM "${codNcm}" deve conter exatamente 8 dígitos numéricos.`);
    }

    if (!/^\d{3}$/.test(codCst)) {
      logger.error("Validação falhou", { field: "codCst", error: `O código CST "${codCst}" deve conter exatamente 3 dígitos numéricos.`, value: codCst });
      throw new Error(`O código CST "${codCst}" deve conter exatamente 3 dígitos numéricos.`);
    }

    if (!/^\d{4}$/.test(codCfop)) {
      logger.error("Validação falhou", { field: "codCfop", error: `O código CFOP "${codCfop}" deve conter exatamente 4 dígitos numéricos.`, value: codCfop });
      throw new Error(`O código CFOP "${codCfop}" deve conter exatamente 4 dígitos numéricos.`);
    }

    if (!/^\d{13}$/.test(codEan)) {
      logger.error("Validação falhou", { field: "codEan", error: `O código EAN "${codEan}" deve conter exatamente 13 dígitos numéricos.`, value: codEan });
      throw new Error(`O código EAN "${codEan}" deve conter exatamente 13 dígitos numéricos.`);
    }

    if (typeof deleted !== "boolean" && (deleted !== 0 && deleted !== 1)) {
      logger.error("Validação falhou", { field: "deleted", error: "O campo 'excluido' deve ser um número (1 ou 0) ou um booleano.", value: deleted });
      throw new Error("O campo 'excluido' deve ser um número (1 ou 0) ou um booleano.");
    }
  }

}
