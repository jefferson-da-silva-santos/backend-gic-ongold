import express from "express";
import { getAll, getAllFilter } from "../controllers/ncmController.js";

const router = express.Router();

router.get('/ncms', getAll);
router.get('/ncms/:cod', getAllFilter);

export default router;