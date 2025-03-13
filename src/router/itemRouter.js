import express from "express";
import { deleteItem, getItemById, getItems, insertItems, removeItemSoftly, softDeleteItem, updateItem } from "../controllers/itemController.js";

const router = express.Router();

router.get('/items', getItems); 
router.get('/items/:id', getItemById);
router.post('/items', insertItems);
router.patch('/items', removeItemSoftly);
router.patch('/items/delete/:id', softDeleteItem);
router.put('/items/:id', updateItem);
router.delete('/items', deleteItem);

export default router;


