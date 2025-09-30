import express from "express";
import {
  getDocumentsByTeam,
} from "../controllers/documentController.js";

const router = express.Router({ mergeParams: true });

// Get documents for a specific team
router.get("/", getDocumentsByTeam);

export default router;