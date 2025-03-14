import CstService from "../service/CstService.js";
import { handleRequest } from "./itemController.js";

// Controlador que retorna todos os CSTs do banco
export const getAll = async (req, res, next) => {
  const cst = new CstService();
  handleRequest(res, next, cst.getAllCsts);
};