import ItemService from "../service/Item.js";
import { shemaFillter, itemSchema } from "../utils/shemasValidate.js";

// Controlador que retorna todos os itens do banco
export const getAll = async (req, res, next) => {
  try {
    const result = await ItemService.getAllItems();

    if (!result || result.length === 0) {
      return res.status(404).json({ error: "Nenhum item encontrado no banco de dados." });
    }

    res.status(200).json(result);
  } catch (error) {
    console.error("Erro ao buscar itens:", error);
    next(error);
  }
};

// Controlador que retorna um item pelo id
export const getFillter = async (req, res, next) => {
  try {
    const {error, value} = shemaFillter.validate(req.params);

    if (error) {
      return res.status(400).json({error: error.details[0].message});
    }

    const result = await ItemService.getItemFillter(value.field, value.value);

    if (!result || result.length === 0) {
      return res.status(404).json({ error: "Nenhum item encontrado no banco de dados." });
    }
    res.status(200).json(result);
  } catch (error) {
    next();
  }
}

// Controlador que insere um dado a tabela
export const insert = async (req, res, next) => {
  try {
    const {error, value} = itemSchema.validate(req.body);

    if (error) {
      return res.status(400).json({error: error.details[0].message});
    }
    const item = new ItemService(
      value.valor_unitario,
      value.descricao,
      value.taxa_icms_entrada,
      value.taxa_icms_saida,
      value.comissao,
      value.ncm,
      value.cst,
      value.cfop,
      value.ean,
      value.excluido // Nome corrigido para corresponder ao banco
    );
    
    const result = await item.insertItem(); // Chamar a função para inserir no banco!
    

    res.status(200).json(value);
  } catch (error) {
    next();
  }
}