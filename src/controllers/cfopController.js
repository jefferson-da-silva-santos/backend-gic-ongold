import CfopService from "../service/CfopService.js";
import { handleRequest } from "./itemController.js";

// Controlador que retorna todos os cfops do banco
export const getAll = async (req, res, next) => {
  handleRequest(res, next, CfopService.getAllCfops);
};
