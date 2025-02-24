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

  ncm: Joi.string().length(8).pattern(/^\d+$/).required()
    .messages({
      "string.base": "O campo 'ncm' deve ser uma string numérica.",
      "string.length": "O 'ncm' deve ter exatamente 8 dígitos.",
      "string.pattern.base": "O 'ncm' deve conter apenas números.",
      "any.required": "O campo 'ncm' é obrigatório."
    }),

  cst: Joi.string().length(3).pattern(/^\d+$/).required()
    .messages({
      "string.base": "O campo 'cst' deve ser uma string numérica.",
      "string.length": "O 'cst' deve ter exatamente 3 dígitos.",
      "string.pattern.base": "O 'cst' deve conter apenas números.",
      "any.required": "O campo 'cst' é obrigatório."
    }),

  cfop: Joi.number().integer().min(1000).max(9999).required()
    .messages({
      "number.base": "O campo 'cfop' deve ser um número inteiro.",
      "number.integer": "O 'cfop' deve ser um número inteiro.",
      "number.min": "O 'cfop' deve estar entre 1000 e 9999.",
      "number.max": "O 'cfop' deve estar entre 1000 e 9999.",
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

export const idShema = Joi.object({
  id: Joi.number().required().positive().messages()
})

export const codNcmShema = Joi.object({
  cod: Joi.required()
})

// Validação para a busca de itens
export const searchSchema = Joi.object({
  page: Joi.number().positive(),
  limit: Joi.number().positive(),
  description: Joi.string()
    .trim() 
    .min(0) 
    .max(100) 
    .regex(/^[a-zA-Z0-9\sáéíóúàèìòùãõâêîôûáéíóúãõç]*$/) 
    .required() 
});
