import express from "express";
import { getAll, getId } from "../controllers/itemsController.js";

const router = express.Router();

router.get('/items', getAll);
router.get('/items/:id', getId)

export default router;