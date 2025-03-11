import express from "express";
import { deleteItem, getDeleted, getItemById, getItems, insertItems, removeItemSoftly, softDeleteItem, updateItem } from "../controllers/itemController.js";

const router = express.Router();

// passa o description page e limit na query
router.get('/items', getItems);
router.get('/items/deleted', getDeleted); 
router.get('/items/:id', getItemById);
router.post('/items', insertItems);
// passa id na query
router.patch('/items', removeItemSoftly);
router.patch('/items/delete/:id', softDeleteItem);
router.put('/items/:id', updateItem);
// passa id na query
router.delete('/items', deleteItem);

export default router;


