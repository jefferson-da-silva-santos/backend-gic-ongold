class ItemDTO {
  static parse(arr) {
    return arr.map(item => ({
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
      totalCusto: this.calculateTotalCost(
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

    return parseFloat(((entryIcms / 100) + (exitIcms / 100) + (commissionRate / 100)) * value).toFixed(2);
  }
}

export { ItemDTO };