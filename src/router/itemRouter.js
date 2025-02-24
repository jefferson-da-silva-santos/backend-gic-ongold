import express from "express";
import { 
  deleted, 
  deletedPermanentAll, 
  deletedPermanentItem, 
  restoreAllItems, 
  restoreItem,
  getAll,
  getFillter,
  getSearchDescription,
  insert, 
  update, 
  getDeleted
} from "../controllers/itemsController.js";

const router = express.Router();

router.get('/items/:page/:limit', getAll); 
router.get('/items/filter/:field/:value', getFillter);
router.get('/items/search/:page/:limit/:description', getSearchDescription);
router.get('/items/deleted', getDeleted);
router.post('/items', insert);
router.put('/items/restore', restoreAllItems); 
router.put('/items/restore/:id', restoreItem);
router.put('/items/:id', update);
router.delete('/items/permanent', deletedPermanentAll);
router.delete('/items/permanent/:id', deletedPermanentItem);
router.delete('/items/:id', deleted);

export default router;
