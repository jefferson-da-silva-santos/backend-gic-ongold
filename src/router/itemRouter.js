import express from "express";
import { getAll, getFillter } from "../controllers/itemsController.js";

const router = express.Router();

router.get('/items', getAll);
router.get('/items/:field/:value', getFillter);

export default router;