import NcmService from "../service/NcmService.js";
import { codNcmShema } from "../utils/shemasValidate.js";
import { handleRequest, validateRequest } from "./itemController.js";

export const getAll = async (req, res, next) => {
  const ncm = new NcmService();
  handleRequest(res, next, ncm.getAllNcms);
};

export const getAllFilter = async (req, res, next) => {
  validateRequest(codNcmShema, req.params);
  const ncm = new NcmService();
  handleRequest(res, next, ncm.getAllNcmsFilterCod, req.params.cod);
};