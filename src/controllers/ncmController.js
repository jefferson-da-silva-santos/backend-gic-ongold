import NcmService from "../service/NcmService.js";
import { codNcmShema } from "../utils/shemasValidate.js";
import { handleRequest, validateRequest } from "./itemController.js";

// Controlador que retorna todos os NCMs do banco
export const getAll = async (req, res, next) => {
  handleRequest(res, next, NcmService.getAllNcms);
};


export const getAllFilter = async (req, res, next) => {
  validateRequest(codNcmShema, req.params);
  handleRequest(res, next, NcmService.getAllNcmsFilterCod, req.params.cod);
};

/*
export const getAllFilter = async (req, res, next) => {
  const { cod } = validateRequest(codNcmShema, req.body);
  console.log(`Código: ${cod}`);
  
  handleRequest(res, next, NcmService.getAllNcmsFilterCod, cod);
}
  */