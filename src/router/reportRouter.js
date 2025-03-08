import { Router } from "express";
import { getReport } from "../controllers/reportController.js";

const router = Router();

router.get('/report', getReport);

export default router;