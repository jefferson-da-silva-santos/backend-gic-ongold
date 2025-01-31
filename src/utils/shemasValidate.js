import Joi from "joi";

export const shemaFillter = Joi.object({
  field: Joi.string().required().valid(
    'id',
    'valor_unitario',
    'descricao',
    'taxa_icms_entrada',
    'taxa_icms_saida',
    'comissao',
    'ncm',
    'cst',
    'cfop',
    'ean',
    'excluido',
    'criado_em'
  ),
  value: Joi.required()
});