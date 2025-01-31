import ItemService from "../service/Item.js";
import { idShema } from "../utils/shemasValidate.js";

// Controlador que retorna todos os itens do banco
export const getAll = async (req, res, next) => {
  try {
    const result = await ItemService.getAllItens();

    if (!result || result.length === 0) {
      return res.status(404).json({ error: "Nenhum item encontrado no banco de dados." });
    }

    res.status(200).json({ result });
  } catch (error) {
    console.error("Erro ao buscar itens:", error);
    next(error);
  }
};

// Controlador que retorna um item pelo id
export const getId = async (req, res, next) => {
  try {
    const {error, value} = idShema.validate(req.params);

    if (error) {
      return res.status(400).json({error: error.details[0].message});
    }

    // O id está chegando corretamente
    const {id} = value;
    
    res.status(200).json({id: id})
  } catch (error) {
    next();
  }
}