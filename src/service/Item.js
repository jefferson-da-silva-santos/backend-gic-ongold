import { Op } from "sequelize";
import ItemModel from "../models/item.js";

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

  // função responsável por buscar os dados dos itens
  static async getAllItens() {
    try {
      const items = await ItemModel.findAll();
  
      return items.map(({ dataValues: item }) => ({
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
    } catch (error) {
      console.error("Erro ao buscar itens:", error);
      throw new Error("Erro ao buscar itens");
    }
  }

  // função responsável por buscar os dados dos itens com uma filtragem
  static async getItenFillter(field, value) {
    try {
      if (!field || !value) {
        throw new Error('Parâmetros de filtragem vazios');
      }
      const filters = {[field]: {[Op.eq]: value}};
      const itens = await ItemModel.findAll({where: filters});
      if (itens.length === 0) {
        throw new Error('Erro ao buscar dados');
      }
      return itens.map(({ dataValues: item }) => ({
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
    } catch (error) {
      console.error("Erro ao buscar itens com filtragem:", error);
      throw new Error("Erro ao buscar itens filtragem");
    }
  }
  
  // Função responsável por calcular o total de custo dos itens
  static calculateTotalCost(unitValue, entryIcmsRate, exitIcmsRate, commission) {
    const value = parseFloat(unitValue) || 0;
    const entryIcms = parseFloat(entryIcmsRate) || 0;
    const exitIcms = parseFloat(exitIcmsRate) || 0;
    const commissionRate = parseFloat(commission) || 0;
    const totalCost = ((entryIcms / 100) + (exitIcms / 100) + (commissionRate / 100)) * value;
    return totalCost.toFixed(2);
  }

  // Função responsável por validar os dados de entrada da classe aplicando o "Retorne Cedo"
  validateInputs(value_unit, description, entry_icms_fee, exit_icms_rate, commission, codNcm, codCst, codCfop, codEan, deleted) {
    if (typeof value_unit !== "number" || value_unit <= 0) {
      throw new Error("O valor unitário deve ser um número positivo.");
    }

    if (typeof description !== "string" || description.trim().length === 0 || description.length > 255) {
      throw new Error("A descrição deve ser uma string não vazia com até 255 caracteres.");
    }

    if (entry_icms_fee !== null && (typeof entry_icms_fee !== "number" || entry_icms_fee < 0 || entry_icms_fee > 100)) {
      throw new Error("A taxa ICMS de entrada deve ser um número entre 0 e 100 ou nula.");
    }
    if (exit_icms_rate !== null && (typeof exit_icms_rate !== "number" || exit_icms_rate < 0 || exit_icms_rate > 100)) {
      throw new Error("A taxa ICMS de saída deve ser um número entre 0 e 100 ou nula.");
    }

    if (commission !== null && (typeof commission !== "number" || commission < 0 || commission > 100)) {
      throw new Error("A comissão deve ser um número entre 0 e 100 ou nula.");
    }

    if (!/^\d{8}$/.test(codNcm)) {
      throw new Error(`O código NCM "${codNcm}" deve conter exatamente 8 dígitos numéricos.`);
    }

    if (!/^\d{3}$/.test(codCst)) {
      throw new Error(`O código CST "${codCst}" deve conter exatamente 3 dígitos numéricos.`);
    }

    if (!/^\d{4}$/.test(codCfop)) {
      throw new Error(`O código CFOP "${codCfop}" deve conter exatamente 4 dígitos numéricos.`);
    }

    if (!/^\d{13}$/.test(codEan)) {
      throw new Error(`O código EAN "${codEan}" deve conter exatamente 13 dígitos numéricos.`);
    }

    if (typeof deleted !== "number" || deleted < 0 || deleted > 1) {
      throw new Error("O campo 'excluido' deve ser um número (1 ou 0).");
    }
  }
}


