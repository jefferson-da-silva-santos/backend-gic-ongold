import express from "express";
import { 
  deleted, 
  deletedPermanentAll, 
  deletedPermanentItem, 
  restoreAllItems, 
  restoreItem, 
  getAll, 
  getFillter, 
  insert, 
  update, 
  getDeleted
} from "../controllers/itemsController.js";

const router = express.Router();

router.get('/items', getAll);
router.get('/items/:field/:value', getFillter);
router.get('/items/deleted', getDeleted);
router.post('/items', insert);
router.put('/items/restore', restoreAllItems); 
router.put('/items/restore/:id', restoreItem);
router.put('/items/:id', update);
router.delete('/items/permanent', deletedPermanentAll);
router.delete('/items/permanent/:id', deletedPermanentItem);
router.delete('/items/:id', deleted);

export default router;
