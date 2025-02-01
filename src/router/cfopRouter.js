import express from "express";
import { getAll } from "../controllers/cfopController.js";

const router = express.Router();

router.get('/cfops', getAll);

export default router;