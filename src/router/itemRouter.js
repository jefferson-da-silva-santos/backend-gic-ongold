import express from "express";
import { getAll, getFillter, insert } from "../controllers/itemsController.js";

const router = express.Router();

router.get('/items', getAll);
router.get('/items/:field/:value', getFillter);
router.post('/items', insert);

export default router;