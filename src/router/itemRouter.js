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

router.get('/items', getAll); 
router.get('/items/filter', getFillter);
router.get('/items/search', getSearchDescription);
router.get('/items/deleted', getDeleted);
router.post('/items', insert);
router.patch('/items/restore', restoreAllItems); 
router.patch('/items/:id/restore', restoreItem);
router.put('/items/:id', update);
router.delete('/items/permanent', deletedPermanentAll);
router.delete('/items/:id/permanent', deletedPermanentItem);
router.delete('/items/:id', deleted);

export default router;

/*


// 🔹 Atualizar um item pelo ID
router.put('/items/:id', update);

// 🔹 Deletar permanentemente TODOS os itens excluídos
router.delete('/items/permanent', deletedPermanentAll);

// 🔹 Deletar permanentemente um item específico pelo ID
router.delete('/items/:id/permanent', deletedPermanentItem);

// 🔹 Deletar um item (Soft Delete)
router.delete('/items/:id', deleted);

export default router;

 */