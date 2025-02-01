import express from "express";
import { getAll } from "../controllers/ncmController.js";

const router = express.Router();

router.get('/ncms', getAll);

export default router;