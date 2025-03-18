import CfopService from "../service/CfopService.js";
import { handleRequest } from "./itemController.js";

export const getAll = async (req, res, next) => {
  const cfop = new CfopService();
  handleRequest(res, next, cfop.getAllCfops);
};
