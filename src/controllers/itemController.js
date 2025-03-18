import ItemService from "../service/ItemService.js";
import { itemSchema, idShema, searchSchema, updateShema } from "../utils/shemasValidate.js";
import logger from "../utils/logger.js";

export const validateRequest = (schema, data) => {
  const { error, value } = schema.validate(data);
  if (error) {
    logger.error('Erro na validação da requisição: ',error.details[0].message);
    throw new Error(error.details[0].message);
  }
  return value;
};

export const handleRequest = async (res, next, serviceMethod, ...params) => {
  try {
    const result = await serviceMethod(...params);
    if (!result || (Array.isArray(result) && result.length === 0)) {
      return res.status(404).json({ error: "Nenhum item encontrado." });
    }
    return res.status(200).json(result);
  } catch (error) {
    logger.error(`Erro no controlador: ${ error.message}`, { error: error.message, stack: error.stack });
    next();
  }
};

export const getItems = async (req, res, next) => {
  const { page, limit, field, value } = validateRequest(searchSchema, req.query);
  const item = new ItemService();
  await handleRequest(res, next, item.search, page, limit, field, value);
};

export const getItemById = async (req, res, next) => {
  try {
    const { id } = validateRequest(idShema, req.params);
    const item = new ItemService();
    await handleRequest(res, next, item.getItems, id);
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};


export const insertItems = async (req, res, next) => {
  try {
    const item = new ItemService();
    const data = validateRequest(itemSchema, req.body);
    await handleRequest(res, next, item.insert, data);
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};

export const updateItem = async (req, res, next) => {
  try {
    const item = new ItemService();
    const { id } = validateRequest(idShema, req.params);
    const data = validateRequest(updateShema, req.body);
    const updated = await item.update(id, data);

    if (updated && updated[0] > 0) {
      res.status(200).json({ message: "Item atualizado com sucesso", result: updated });
    } else if (updated && updated[0] === 0) {
      res.status(404).json({ message: "Item não encontrado ou não alterado", result: updated });
    } else {
      res.status(200).json({ message: "Item atualizado com sucesso", result: updated });
    }
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};

export const softDeleteItem = async (req, res, next) => {
  try {
    const item = new ItemService();
    const { id } = validateRequest(idShema, req.params);
    await handleRequest(res, next, item.softDeleteItem, id);
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};

export const deleteItem = async (req, res, next) => {
  try {
    const item = new ItemService();
    const { id } = validateRequest(idShema, req.query);
    await handleRequest(res, next, item.delete, id);
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};

export const removeItemSoftly = async (req, res, next) => {
  const item = new ItemService();
  const { id } = validateRequest(idShema, req.query);
  handleRequest(res, next, item.removeItemSoftly, id);
};
