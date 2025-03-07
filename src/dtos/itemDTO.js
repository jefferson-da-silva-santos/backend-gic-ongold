export default class ItemsDTO {
  static parseObject(arr) {
    return arr.map(({ dataValues: item }) => ({
      id: item.id,
      valor_unitario: item.valor_unitario,
      descricao: item.descricao,
      taxa_icms_entrada: item.taxa_icms_entrada,
      taxa_icms_saida: item.taxa_icms_saida,
      comissao: item.comissao,
      ncm: item.ncm?.codncm || null, 
      cst: item.csticms?.codcst || null, 
      cfop: item.cfopinfo?.codcfop || null, 
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

    const totalCost = ((entryIcms / 100) + (exitIcms / 100) + (commissionRate / 100)) * value;
    return parseFloat(totalCost.toFixed(2));
  }
}