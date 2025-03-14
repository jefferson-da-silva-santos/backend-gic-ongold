import Joi from "joi";

export const shemaFillterCst = Joi.object({
  field: Joi.string().required().valid(
    'codcst'
  ),
  value: Joi.required()
});

export const itemSchema = Joi.object({
  valor_unitario: Joi.number().positive().precision(2).required()
    .messages({
      "number.base": "O campo 'valor_unitario' deve ser um número.",
      "number.positive": "O 'valor_unitario' deve ser um número positivo.",
      "number.precision": "O 'valor_unitario' pode ter no máximo duas casas decimais.",
      "any.required": "O campo 'valor_unitario' é obrigatório."
    }),

  descricao: Joi.string().min(3).max(255).required()
    .messages({
      "string.base": "O campo 'descricao' deve ser um texto.",
      "string.min": "O campo 'descricao' deve ter pelo menos 3 caracteres.",
      "string.max": "O campo 'descricao' pode ter no máximo 255 caracteres.",
      "any.required": "O campo 'descricao' é obrigatório."
    }),

  taxa_icms_entrada: Joi.number().min(0).max(100).precision(2).required()
    .messages({
      "number.base": "O campo 'taxa_icms_entrada' deve ser um número.",
      "number.min": "A 'taxa_icms_entrada' deve ser no mínimo 0%.",
      "number.max": "A 'taxa_icms_entrada' não pode ultrapassar 100%.",
      "number.precision": "A 'taxa_icms_entrada' pode ter no máximo duas casas decimais.",
      "any.required": "O campo 'taxa_icms_entrada' é obrigatório."
    }),

  taxa_icms_saida: Joi.number().min(0).max(100).precision(2).required()
    .messages({
      "number.base": "O campo 'taxa_icms_saida' deve ser um número.",
      "number.min": "A 'taxa_icms_saida' deve ser no mínimo 0%.",
      "number.max": "A 'taxa_icms_saida' não pode ultrapassar 100%.",
      "number.precision": "A 'taxa_icms_saida' pode ter no máximo duas casas decimais.",
      "any.required": "O campo 'taxa_icms_saida' é obrigatório."
    }),

  comissao: Joi.number().min(0).max(100).precision(2).required()
    .messages({
      "number.base": "O campo 'comissao' deve ser um número.",
      "number.min": "A 'comissao' deve ser no mínimo 0%.",
      "number.max": "A 'comissao' não pode ultrapassar 100%.",
      "number.precision": "A 'comissao' pode ter no máximo duas casas decimais.",
      "any.required": "O campo 'comissao' é obrigatório."
    }),

  ncm_id: Joi.number().integer().min(0).required()
    .messages({
      "number.base": "O campo 'ncm' deve ser um número.",
      "number.integer": "O campo 'ncm' deve ser um número inteiro.",
      "number.min": "O campo 'ncm' deve ser no mínimo 0.",
      "any.required": "O campo 'ncm' é obrigatório."
    }),

  cst_id: Joi.number().integer().min(0).required()
    .messages({
      "number.base": "O campo 'cst' deve ser um número.",
      "number.integer": "O campo 'cst' deve ser um número inteiro.",
      "number.min": "O campo 'cst' deve ser no mínimo 0.",
      "any.required": "O campo 'cst' é obrigatório."
    }),

  cfop_id: Joi.number().integer().min(0).required()
    .messages({
      "number.base": "O campo 'cfop' deve ser um número.",
      "number.integer": "O campo 'cfop' deve ser um número inteiro.",
      "number.min": "O campo 'cfop' deve ser no mínimo 0.",
      "any.required": "O campo 'cfop' é obrigatório."
    }),

  ean: Joi.string().length(13).pattern(/^\d+$/).required()
    .messages({
      "string.base": "O campo 'ean' deve ser uma string numérica.",
      "string.length": "O 'ean' deve ter exatamente 13 dígitos.",
      "string.pattern.base": "O 'ean' deve conter apenas números.",
      "any.required": "O campo 'ean' é obrigatório."
    }),

  excluido: Joi.alternatives().try(
    Joi.number().valid(0, 1),
    Joi.boolean()
  ).default(0)
    .messages({
      "alternatives.types": "O campo 'excluido' deve ser um número (0 ou 1) ou um booleano (true/false)."
    })
});

export const updateShema = Joi.object({
  valor_unitario: Joi.number().positive().precision(2).required()
    .messages({
      "number.base": "O campo 'valor_unitario' deve ser um número.",
      "number.positive": "O 'valor_unitario' deve ser um número positivo.",
      "number.precision": "O 'valor_unitario' pode ter no máximo duas casas decimais.",
      "any.required": "O campo 'valor_unitario' é obrigatório."
    }),

  descricao: Joi.string().min(3).max(255).required()
    .messages({
      "string.base": "O campo 'descricao' deve ser um texto.",
      "string.min": "O campo 'descricao' deve ter pelo menos 3 caracteres.",
      "string.max": "O campo 'descricao' pode ter no máximo 255 caracteres.",
      "any.required": "O campo 'descricao' é obrigatório."
    }),

  taxa_icms_entrada: Joi.number().min(0).max(100).precision(2).required()
    .messages({
      "number.base": "O campo 'taxa_icms_entrada' deve ser um número.",
      "number.min": "A 'taxa_icms_entrada' deve ser no mínimo 0%.",
      "number.max": "A 'taxa_icms_entrada' não pode ultrapassar 100%.",
      "number.precision": "A 'taxa_icms_entrada' pode ter no máximo duas casas decimais.",
      "any.required": "O campo 'taxa_icms_entrada' é obrigatório."
    }),

  taxa_icms_saida: Joi.number().min(0).max(100).precision(2).required()
    .messages({
      "number.base": "O campo 'taxa_icms_saida' deve ser um número.",
      "number.min": "A 'taxa_icms_saida' deve ser no mínimo 0%.",
      "number.max": "A 'taxa_icms_saida' não pode ultrapassar 100%.",
      "number.precision": "A 'taxa_icms_saida' pode ter no máximo duas casas decimais.",
      "any.required": "O campo 'taxa_icms_saida' é obrigatório."
    }),

  comissao: Joi.number().min(0).max(100).precision(2).required()
    .messages({
      "number.base": "O campo 'comissao' deve ser um número.",
      "number.min": "A 'comissao' deve ser no mínimo 0%.",
      "number.max": "A 'comissao' não pode ultrapassar 100%.",
      "number.precision": "A 'comissao' pode ter no máximo duas casas decimais.",
      "any.required": "O campo 'comissao' é obrigatório."
    }),
  ean: Joi.string().length(13).pattern(/^\d+$/).required()
    .messages({
      "string.base": "O campo 'ean' deve ser uma string numérica.",
      "string.length": "O 'ean' deve ter exatamente 13 dígitos.",
      "string.pattern.base": "O 'ean' deve conter apenas números.",
      "any.required": "O campo 'ean' é obrigatório."
    })
});

export const idShema = Joi.object({
  id: Joi.number().positive().messages()
})

export const codNcmShema = Joi.object({
  cod: Joi.required()
})

// Validação para a busca de itens
export const searchSchema = Joi.object({
  page: Joi.number().positive(),
  limit: Joi.number().positive(),
  field: Joi.string().valid(
    'valor_unitario',
    'descricao',
    'taxa_icms_entrada',
    'taxa_icms_saida',
    'comissao',
    'ncm_id',
    'cst_id',
    'cfop_id',
    'ean',
    'excluido',
    'criado_em',
    'excluido_em'
  ),
  value: Joi.alternatives().conditional('field', {
    is: Joi.valid(
      'id',
      'cfop_id'
    ),
    then: Joi.number().integer().allow(null, ''),
    otherwise: Joi.alternatives().conditional('field', {
      is: Joi.valid(
        'valor_unitario',
        'taxa_icms_entrada',
        'taxa_icms_saida',
        'comissao'
      ),
      then: Joi.number().allow(null, ''),
      otherwise: Joi.alternatives().conditional('field', {
        is: Joi.valid(
          'ncm_id',
          'cst_id',
          'ean'
        ),
        then: Joi.string().allow(null, ''),
        otherwise: Joi.alternatives().conditional('field', {
          is: Joi.valid(
            'excluido'
          ),
          then: Joi.number().allow(null, ''),
          otherwise: Joi.alternatives().conditional('field', {
            is: Joi.valid(
              'criado_em',
              'excluido_em'
            ),
            then: Joi.date().allow(null, ''),
            otherwise: Joi.string().trim().min(0).max(255).allow(null, '')
          })
        })
      })
    })
  })
});