import express from "express";
import {
  getAllDocuments,
  getDocumentById,
  getDocumentsByTeam,
  createDocument,
  updateDocument,
  getDocumentVersions,
  addDocumentRelation,
  searchDocuments,
  deleteDocument,
} from "../controllers/documentController.js";

const router = express.Router();

// General document routes
router.get("/", getAllDocuments);

router.get("/search", searchDocuments);

router.get("/:documentId", getDocumentById);

router.post("/", createDocument);

router.put("/:documentId", updateDocument);

router.delete("/:documentId", deleteDocument);

// Version management routes
router.get("/:documentId/versions", getDocumentVersions);

// Relationship management routes
router.post("/:documentId/relations", addDocumentRelation);

export default router;