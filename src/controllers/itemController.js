import ItemService from "../service/ItemService.js";
import { shemaFillter, itemSchema, idShema, searchSchema } from "../utils/shemasValidate.js";
import logger from "../utils/logger.js";

// Função auxiliar para lidar com erros de validação
export const validateRequest = (schema, data) => {
  const { error, value } = schema.validate(data);
  if (error) {
    throw new Error(error.details[0].message);
  }
  return value;
};

// Função auxiliar para lidar com requisições assíncronas no Controller
export const handleRequest = async (res, next, serviceMethod, ...params) => {
  try {
    const result = await serviceMethod(...params);
    if (!result || (Array.isArray(result) && result.length === 0)) {
      return res.status(404).json({ error: "Nenhum item encontrado." });
    }
    return res.status(200).json(result);
  } catch (error) {
    logger.error(error.message, { error: error.message, stack: error.stack });
    next();
  }
};

export const getAll = async (req, res, next) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  await handleRequest(res, next, ItemService.getAllItems, page, limit);
};

export const getFillter = async (req, res, next) => {
  try {
    const { field, value } = validateRequest(shemaFillter, req.query);
    await handleRequest(res, next, ItemService.getItemByField, field, value);
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};

export const getSearchDescription = async (req, res, next) => {
  try {
    const { page, limit, description } = validateRequest(searchSchema, req.query);
    await handleRequest(res, next, ItemService.searchItemsByDescription, page, limit, description);
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};

export const getDeleted = async (req, res, next) => {
  await handleRequest(res, next, ItemService.getDeletedItems);
};

export const insert = async (req, res, next) => {
  try {
    const data = validateRequest(itemSchema, req.body);
    await handleRequest(res, next, ItemService.insertItem, data);
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};

export const update = async (req, res, next) => {
  try {
    const { id } = validateRequest(idShema, req.params);
    const data = validateRequest(itemSchema, req.body);
    await handleRequest(res, next, ItemService.updateItem, id, data);
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};

export const deleted = async (req, res, next) => {
  try {
    const { id } = validateRequest(idShema, req.params);
    await handleRequest(res, next, ItemService.softDeleteItem, id);
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};

export const deletedPermanentAll = async (req, res, next) => {
  await handleRequest(res, next, ItemService.deleteAllItemsPermanently);
};

export const deletedPermanentItem = async (req, res, next) => {
  try {
    const { id } = validateRequest(idShema, req.params);
    await handleRequest(res, next, ItemService.deleteItemPermanently, id);
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};

export const restoreAllItems = async (req, res, next) => {
  await handleRequest(res, next, ItemService.restoreAllItems);
};

export const restoreItem = async (req, res, next) => {
  const { id } = validateRequest(idShema, req.params);
  handleRequest(res, next, ItemService.restoreItem, id);
};
