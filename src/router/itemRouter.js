import express from "express";
import { deleted, getAll, getFillter, insert, update } from "../controllers/itemsController.js";

const router = express.Router();

router.get('/items', getAll);
router.get('/items/:field/:value', getFillter);
router.post('/items', insert);
router.put('/items/:id', update);
router.delete('/items/:id', deleted);

export default router;