import express from "express";
import { getAll } from "../controllers/cstController.js";

const router = express.Router();

router.get('/csts', getAll);

export default router;