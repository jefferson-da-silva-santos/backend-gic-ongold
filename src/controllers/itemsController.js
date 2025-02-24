import ItemService from "../service/Item.js";
import { shemaFillter, itemSchema, idShema, searchSchema } from "../utils/shemasValidate.js";
import logger from "../utils/logger.js";


// Controlador de busca de todos os itens

export const getAll = async (req, res, next) => {
  const page = parseInt(req.params.page) || 1; // Obtém a página da query string (padrão para página 1)
  const limit = parseInt(req.params.limit) || 10; // Obtém o limite da query string (padrão para 10 itens por página)

  logger.info('Início da requisição para obter todos os itens', { method: req.method, url: req.originalUrl });

  try  {
    const result = await ItemService.getAllItems(page, limit);

    if (!result || result.length === 0) {
      logger.error('Erro: Nenhum item encontrado no banco de dados.');
      return res.status(404).json({ error: "Nenhum item encontrado no banco de dados." });
    }

    logger.info('Itens encontrados com sucesso', { itemCount: result.length });
    res.status(200).json({
      items: result.items,
      totalItems: result.totalItems,
      totalPages: result.totalPages,
      currentPage: result.currentPage,
    });
  } catch (error) {
    logger.error('Erro ao buscar itens', { error: error.message, stack: error.stack });
    next(error);
  }
};

// Controlador de busca de itens com uma filtragem
export const getFillter = async (req, res, next) => {
  logger.info('Início da requisição para buscar item com filtro', { method: req.method, url: req.originalUrl });

  try {
    const { error, value } = shemaFillter.validate(req.params);

    if (error) {
      logger.error('Erro de validação de parâmetros', { error: error.details[0].message });
      return res.status(400).json({ error: error.details[0].message });
    }

    const result = await ItemService.getItemFillter(value.field, value.value);

    if (!result || result.length === 0) {
      logger.error('Erro: Nenhum item encontrado com o filtro', { field: value.field, value: value.value });
      return res.status(404).json({ error: "Nenhum item encontrado no banco de dados." });
    }

    logger.info('Item(s) encontrados com sucesso', { itemCount: result.length, filter: value });
    res.status(200).json(result);
  } catch (error) {
    logger.error('Erro ao buscar item com filtro', { error: error.message, stack: error.stack });
    next(error);
  }
};

export const getSearchDescription = async (req, res, next) => {
  logger.info('Início da requisição para buscar item por descrição', { method: req.method, url: req.originalUrl });

  try {
    const { error, value } = searchSchema.validate(req.params);
    const page = value.page; // Obtém a página da query string (padrão para página 1)
    const limit = value.limit; // Obtém o limite da query string (padrão para 10 itens por página)

    if (error) {
      logger.error('Erro de validação de parâmetros', { error: error.details[0].message });
      return res.status(400).json({ error: error.details[0].message });
    }

    const result = await ItemService.getItemSearchDescription(page, limit, value.description);

    if (!result || result.length === 0) {
      logger.error('Erro: Nenhum item encontrado com a descrição', { description: value.description });
      return res.status(404).json({ error: "Nenhum item encontrado no banco de dados." });
    }

    logger.info('Item(s) encontrados com sucesso', { itemCount: result.length, description: value.description });
    res.status(200).json(result);
  } catch (error) {
    logger.error('Erro ao buscar item por descrição', { error: error.message, stack: error.stack });
    next(error);
  }
}

// Controlador de busca de itens excluídos
export const getDeleted = async (req, res, next) => {
  try {
    const result = await ItemService.getDeletedItems();

    if (!result || result.length === 0) {
      logger.error('Erro: Nenhum item excluído encontrado no banco de dados.');
      return res.status(404).json({ error: "Nenhum item excluído encontrado no banco de dados." });
    }

    logger.info('Itens excluídos encontrados com sucesso', { itemCount: result.length });
    res.status(200).json(result);
  } catch (error) {
    logger.error('Erro ao buscar itens excluídos', { error: error.message, stack: error.stack });
    next(error);
  }
}

// Controlador de inserir itens
export const insert = async (req, res, next) => {
  logger.info('Início da requisição para inserir item', { method: req.method, url: req.originalUrl });

  try {
    const { error, value } = itemSchema.validate(req.body);

    if (error) {
      logger.error('Erro de validação de corpo da requisição', { error: error.details[0].message });
      return res.status(400).json({ error: error.details[0].message });
    }

    const result = await ItemService.insertItem(value);
    logger.info('Item inserido com sucesso', { itemId: result.id });
    res.status(200).json(result);
  } catch (error) {
    logger.error('Erro ao inserir item', { error: error.message, stack: error.stack });
    next(error);
  }
};

// Controlador de atualizar itens
export const update = async (req, res, next) => {
  logger.info('Início da requisição para atualizar item', { method: req.method, url: req.originalUrl });

  try {
    const { error: errorId, value: valueId } = idShema.validate(req.params);
    if (errorId) {
      logger.error('Erro de validação de ID', { error: errorId.details[0].message });
      return res.status(400).json({ error: `ID inválido! ${errorId.details[0].message}` });
    }
    const { id } = valueId;

    const { error: errorBody, value: valueBody } = itemSchema.validate(req.body);
    if (errorBody) {
      logger.error('Erro de validação de corpo da requisição para atualização', { error: errorBody.details[0].message });
      return res.status(400).json({ error: errorBody.details[0].message });
    }

    logger.info(`Atualizando item ID: ${id} com dados`, { updateData: valueBody });
    const result = await ItemService.updateItem(id, valueBody);

    if (result === 0) {
      logger.error('Erro: Item não encontrado para atualização', { itemId: id });
      return res.status(404).json({ error: "Item não encontrado." });
    }

    logger.info('Item atualizado com sucesso', { itemId: id, updatedRows: result });
    res.status(200).json({ message: "Item atualizado com sucesso!", updatedRows: result });
  } catch (error) {
    logger.error('Erro ao atualizar item', { error: error.message, stack: error.stack });
    next(error);
  }
};

// Controlador de deletar itens
export const deleted = async (req, res, next) => {
  logger.info('Início da requisição para deletar item', { method: req.method, url: req.originalUrl });

  try {
    const { error, value } = idShema.validate(req.params);

    if (error) {
      logger.error('Erro de validação de ID para deletação', { error: error.details[0].message });
      return res.status(400).json({ error: `ID inválido! ${error.details[0].message}` });
    }

    const { id } = value;

    const result = await ItemService.deleteItem(id);

    if (result === 0) {
      logger.error('Erro: Item não encontrado para deleção', { itemId: id });
      return res.status(404).json({ error: "Item não encontrado." });
    }

    logger.info('Item deletado com sucesso', { itemId: id, deletedRows: result });
    res.status(200).json({ message: "Item deletado com sucesso!", deletedRows: result });

  } catch (error) {
    logger.error('Erro ao deletar item', { error: error.message, stack: error.stack });
    next(error);
  }
};

export const deletedPermanentAll = async (req, res, next) => {
  try {
    const result = await ItemService.deletePermanentAllItems();

    if (result === 0) {
      logger.error('Erro: Nenhum item encontrado para deleção permanente');
      return res.status(404).json({ error: "Nenhum item encontrado para deleção permanente." });
    }

    logger.info('Itens deletados permanentemente com sucesso', { deletedRows: result });
    res.status(200).json({ message: "Itens deletados permanentemente com sucesso!", deletedRows: result });
  } catch (error) {
    logger.error('Erro ao deletar itens permanentemente', { error: error.message, stack: error.stack });
    next(error);
  }
}

export const deletedPermanentItem = async (req, res, next) => {
  try {
    const { error, value } = idShema.validate(req.params);
    if (error) {
      logger.error('Erro de validação de ID para deleção permanente', { error: error.details[0].message });
      return res.status(400).json({ error: `ID inválido! ${error.details[0].message}` });
    }

    const { id } = value;
    const result = await ItemService.deletePermanentItem(id);
    if (result === 0) {
      logger.error('Erro: Item não encontrado para deleção permanente', { itemId: id });
      return res.status(404).json({ error: "Item não encontrado." });
    }

    logger.info('Item deletado permanentemente com sucesso', { itemId: id, deletedRows: result });
    res.status(200).json({ message: "Item deletado permanentemente com sucesso!", deletedRows: result });
  } catch (error) {
    logger.error('Erro ao deletar item permanentemente', { error: error.message, stack: error.stack });
    next(error);
  }
}

export const restoreAllItems = async (req, res, next) => {
  try {
    const result = await ItemService.restoreAllItems();
    if (result === 0) {
      logger.error('Erro: Nenhum item encontrado para restauração');
      return res.status(404).json({ error: "Nenhum item encontrado para restauração." });
    }

    logger.info('Itens restaurados com sucesso', { restoredRows: result });
    res.status(200).json({ message: "Itens restaurados com sucesso!", restoredRows: result });
  } catch (error) {
    logger.error('Erro ao restaurar itens', { error: error.message, stack: error.stack });
    next(error);
  }
}

export const restoreItem = async (req, res, next) => {
  try {
    const { error, value } = idShema.validate(req.params);
    if (error) {
      logger.error('Erro de validação de ID para restauração', { error: error.details[0].message });
      return res.status(400).json({ error: `ID inválido! ${error.details[0].message}` });
    }

    const { id } = value;
    const result = await ItemService.restoreItem(id);
    if (result === 0) {
      logger.error('Erro: Item não encontrado para restauração', { itemId: id });
      return res.status(404).json({ error: "Item não encontrado." });
    }

    logger.info('Item restaurado com sucesso', { itemId: id, restoredRows: result });
    res.status(200).json({ message: "Item restaurado com sucesso!", restoredRows: result });
  } catch (error) {
    logger.error('Erro ao restaurar item', { error: error.message, stack: error.stack });
    next(error);
  }
}