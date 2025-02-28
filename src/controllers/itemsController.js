import ItemService from "../service/ItemService.js";
import { shemaFillter, itemSchema, idShema, searchSchema } from "../utils/shemasValidate.js";
import logger from "../utils/logger.js";

// Função auxiliar para lidar com erros de validação
const validateRequest = (schema, data) => {
  const { error, value } = schema.validate(data);
  if (error) {
    throw new Error(error.details[0].message);
  }
  return value;
};

// Função auxiliar para lidar com requisições assíncronas no Controller
const handleRequest = async (res, serviceMethod, ...params) => {
  try {
    const result = await serviceMethod(...params);
    if (!result || (Array.isArray(result) && result.length === 0)) {
      return res.status(404).json({ error: "Nenhum item encontrado." });
    }
    return res.status(200).json(result);
  } catch (error) {
    logger.error(error.message, { error: error.message, stack: error.stack });
    return res.status(500).json({ error: "Erro interno no servidor." });
  }
};

export const getAll = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  await handleRequest(res, ItemService.getAllItems, page, limit);
};

export const getFillter = async (req, res) => {
  try {
    const { field, value } = validateRequest(shemaFillter, req.query);
    await handleRequest(res, ItemService.getItemByField, field, value);
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};

export const getSearchDescription = async (req, res) => {
  try {
    const { page, limit, description } = validateRequest(searchSchema, req.query);
    await handleRequest(res, ItemService.searchItemsByDescription, page, limit, description);
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};

export const getDeleted = async (req, res) => {
  await handleRequest(res, ItemService.getDeletedItems);
};

export const insert = async (req, res) => {
  try {
    const data = validateRequest(itemSchema, req.body);
    await handleRequest(res, ItemService.insertItem, data);
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};

export const update = async (req, res) => {
  try {
    const { id } = validateRequest(idShema, req.params);
    const data = validateRequest(itemSchema, req.body);
    await handleRequest(res, ItemService.updateItem, id, data);
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};

export const deleted = async (req, res) => {
  try {
    const { id } = validateRequest(idShema, req.params);
    await handleRequest(res, ItemService.softDeleteItem, id);
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};

export const deletedPermanentAll = async (req, res) => {
  await handleRequest(res, ItemService.deletedAllItemsPermanently);
};

export const deletedPermanentItem = async (req, res) => {
  try {
    const { id } = validateRequest(idShema, req.params);
    await handleRequest(res, ItemService.deleteItemPermanently, id);
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};

export const restoreAllItems = async (req, res) => {
  await handleRequest(res, ItemService.restoreAllItems);
};

export const restoreItem = async (req, res) => {
  try {
    const { id } = validateRequest(idShema, req.params);
    await handleRequest(res, ItemService.restoreItem, id);
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};
