import mongoose from "mongoose";
import Document from "../models/Document.js";
import DocumentVersion from "../models/DocumentVersion.js";
import Team from "../models/Team.js";

// Get all documents with filtering options
export const getAllDocuments = async (req, res) => {
  try {
    const {
      teamId,
      status,
      category,
      tags,
      authorId,
      limit = 20,
      skip = 0,
      sortBy = "updatedAt",
      sortOrder = "desc",
    } = req.query;

    // Build query filter
    const filter = { isLatestVersion: true };

    if (teamId && mongoose.Types.ObjectId.isValid(teamId)) {
      filter.teamId = teamId;
    }

    if (status) {
      filter.status = status;
    }

    if (category) {
      filter.category = category;
    }

    if (tags) {
      const tagArray = Array.isArray(tags) ? tags : tags.split(',');
      filter.tags = { $in: tagArray };
    }

    if (authorId) {
      filter.authorId = authorId;
    }

    // Build sort object
    const sort = {};
    sort[sortBy] = sortOrder === "asc" ? 1 : -1;

    // Execute query
    const documents = await Document.find(filter)
      .sort(sort)
      .limit(parseInt(limit))
      .skip(parseInt(skip))
      .populate('teamId', 'name slug color icon')
      .select('title slug status category tags authorName createdAt updatedAt version teamId');

    // Get total count for pagination
    const totalCount = await Document.countDocuments(filter);

    res.status(200).json({
      documents,
      pagination: {
        total: totalCount,
        limit: parseInt(limit),
        skip: parseInt(skip),
        hasMore: skip + documents.length < totalCount,
      }
    });
  } catch (error) {
    console.error("Error fetching documents:", error);
    res.status(500).json({ message: "Error fetching documents", error: error.message });
  }
};

// Get document by ID
export const getDocumentById = async (req, res) => {
  try {
    const { documentId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(documentId)) {
      return res.status(400).json({ message: "Invalid document ID format" });
    }

    const document = await Document.findById(documentId)
      .populate('teamId', 'name slug color icon')
      .populate('relatedDocuments.documentId', 'title slug category status');

    if (!document) {
      return res.status(404).json({ message: "Document not found" });
    }

    // Increment view count
    await document.incrementView();

    res.status(200).json(document);
  } catch (error) {
    console.error("Error fetching document:", error);
    res.status(500).json({ message: "Error fetching document", error: error.message });
  }
};

// Get documents by team
export const getDocumentsByTeam = async (req, res) => {
  try {
    const { teamId } = req.params;
    const { status, category, limit = 10, skip = 0 } = req.query;

    if (!mongoose.Types.ObjectId.isValid(teamId)) {
      return res.status(400).json({ message: "Invalid team ID format" });
    }

    const filter = { teamId, isLatestVersion: true };

    if (status) filter.status = status;
    if (category) filter.category = category;

    const documents = await Document.find(filter)
      .sort({ updatedAt: -1 })
      .limit(parseInt(limit))
      .skip(parseInt(skip))
      .select('title slug status category tags authorName createdAt updatedAt version');

    const totalCount = await Document.countDocuments(filter);

    res.status(200).json({
      documents,
      pagination: {
        total: totalCount,
        limit: parseInt(limit),
        skip: parseInt(skip),
        hasMore: skip + documents.length < totalCount,
      }
    });
  } catch (error) {
    console.error("Error fetching team documents:", error);
    res.status(500).json({ message: "Error fetching team documents", error: error.message });
  }
};

// Create new document
export const createDocument = async (req, res) => {
  try {
    const {
      title,
      slug,
      content,
      contentType,
      teamId,
      authorId,
      authorName,
      category,
      tags,
      permissions,
    } = req.body;

    if (!title || !content || !teamId || !authorId || !authorName) {
      return res.status(400).json({
        message: "Title, content, team ID, author ID, and author name are required"
      });
    }

    if (!mongoose.Types.ObjectId.isValid(teamId)) {
      return res.status(400).json({ message: "Invalid team ID format" });
    }

    // Verify team exists
    const team = await Team.findById(teamId);
    if (!team) {
      return res.status(404).json({ message: "Team not found" });
    }

    // Generate slug if not provided
    const finalSlug = slug || title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');

    // Check if document with same slug exists in team
    const existingDoc = await Document.findOne({ teamId, slug: finalSlug });
    if (existingDoc) {
      return res.status(400).json({
        message: "Document with this slug already exists in the team"
      });
    }

    const document = new Document({
      title,
      slug: finalSlug,
      content,
      contentType: contentType || "markdown",
      teamId,
      authorId,
      authorName,
      category: category || "other",
      tags: Array.isArray(tags) ? tags : (tags ? [tags] : []),
      permissions: permissions || {
        public: false,
        allowedTeams: [],
        allowedUsers: [],
      },
      version: 1,
      isLatestVersion: true,
      status: "draft",
    });

    const savedDocument = await document.save();

    // Create initial version
    const initialVersion = new DocumentVersion({
      documentId: savedDocument._id,
      version: 1,
      title,
      content,
      authorId,
      authorName,
      changeType: "created",
      changeSummary: "Initial document creation",
      tags: document.tags,
      approval: {
        isRequired: team.settings.requireApproval,
        finalStatus: team.settings.requireApproval ? "pending" : "approved",
      },
    });

    await initialVersion.save();

    // Populate team info before returning
    await savedDocument.populate('teamId', 'name slug color icon');

    res.status(201).json(savedDocument);
  } catch (error) {
    console.error("Error creating document:", error);
    res.status(500).json({ message: "Error creating document", error: error.message });
  }
};

// Update document
export const updateDocument = async (req, res) => {
  try {
    const { documentId } = req.params;
    const {
      title,
      content,
      category,
      tags,
      permissions,
      authorId,
      authorName,
      changeSummary,
    } = req.body;

    if (!mongoose.Types.ObjectId.isValid(documentId)) {
      return res.status(400).json({ message: "Invalid document ID format" });
    }

    if (!authorId || !authorName || !changeSummary) {
      return res.status(400).json({
        message: "Author ID, author name, and change summary are required"
      });
    }

    const document = await Document.findById(documentId).populate('teamId');
    if (!document) {
      return res.status(404).json({ message: "Document not found" });
    }

    // Check if current version is the latest
    if (!document.isLatestVersion) {
      return res.status(400).json({
        message: "Cannot update non-latest version of document"
      });
    }

    // Create new version
    const newVersion = document.version + 1;
    const oldDocumentId = document._id;

    // Update existing document to not be latest version
    document.isLatestVersion = false;
    await document.save();

    // Create new document version
    const updatedDocument = new Document({
      title: title || document.title,
      slug: document.slug,
      content: content || document.content,
      contentType: document.contentType,
      teamId: document.teamId._id,
      authorId,
      authorName,
      category: category || document.category,
      tags: Array.isArray(tags) ? tags : (document.tags || []),
      permissions: permissions || document.permissions,
      version: newVersion,
      parentDocumentId: oldDocumentId,
      isLatestVersion: true,
      status: document.teamId.settings.requireApproval ? "review" : "approved",
      relatedDocuments: document.relatedDocuments,
      metadata: document.metadata,
      statistics: {
        views: 0,
        editCount: document.statistics.editCount + 1,
      },
    });

    const savedDocument = await updatedDocument.save();

    // Create version history entry
    const versionEntry = new DocumentVersion({
      documentId: savedDocument._id,
      version: newVersion,
      title: savedDocument.title,
      content: savedDocument.content,
      authorId,
      authorName,
      changeType: "updated",
      changeSummary,
      tags: savedDocument.tags,
      parentVersionId: oldDocumentId,
      approval: {
        isRequired: document.teamId.settings.requireApproval,
        finalStatus: document.teamId.settings.requireApproval ? "pending" : "approved",
      },
    });

    await versionEntry.save();

    // Populate team info
    await savedDocument.populate('teamId', 'name slug color icon');

    res.status(200).json(savedDocument);
  } catch (error) {
    console.error("Error updating document:", error);
    res.status(500).json({ message: "Error updating document", error: error.message });
  }
};

// Get document versions
export const getDocumentVersions = async (req, res) => {
  try {
    const { documentId } = req.params;
    const { limit = 10, skip = 0 } = req.query;

    if (!mongoose.Types.ObjectId.isValid(documentId)) {
      return res.status(400).json({ message: "Invalid document ID format" });
    }

    // Get all versions of this document and its parent versions
    const document = await Document.findById(documentId);
    if (!document) {
      return res.status(404).json({ message: "Document not found" });
    }

    // Find the root document
    const rootDocumentId = document.parentDocumentId || documentId;

    // Get all documents in this version chain
    const allVersions = await Document.find({
      $or: [
        { _id: rootDocumentId },
        { parentDocumentId: rootDocumentId },
      ]
    })
    .sort({ version: -1 })
    .limit(parseInt(limit))
    .skip(parseInt(skip))
    .select('title version authorName createdAt updatedAt status isLatestVersion');

    const totalCount = await Document.countDocuments({
      $or: [
        { _id: rootDocumentId },
        { parentDocumentId: rootDocumentId },
      ]
    });

    res.status(200).json({
      versions: allVersions,
      pagination: {
        total: totalCount,
        limit: parseInt(limit),
        skip: parseInt(skip),
        hasMore: skip + allVersions.length < totalCount,
      }
    });
  } catch (error) {
    console.error("Error fetching document versions:", error);
    res.status(500).json({ message: "Error fetching document versions", error: error.message });
  }
};

// Add document relation
export const addDocumentRelation = async (req, res) => {
  try {
    const { documentId } = req.params;
    const { relatedDocumentId, relationType, strength } = req.body;

    if (!mongoose.Types.ObjectId.isValid(documentId) || !mongoose.Types.ObjectId.isValid(relatedDocumentId)) {
      return res.status(400).json({ message: "Invalid document ID format" });
    }

    if (!relationType || !["reference", "dependency", "similar", "follows", "supersedes"].includes(relationType)) {
      return res.status(400).json({ message: "Valid relation type is required" });
    }

    const document = await Document.findById(documentId);
    if (!document) {
      return res.status(404).json({ message: "Document not found" });
    }

    const relatedDocument = await Document.findById(relatedDocumentId);
    if (!relatedDocument) {
      return res.status(404).json({ message: "Related document not found" });
    }

    // Add relation
    document.addRelation(relatedDocumentId, relationType, strength || 0.5);
    await document.save();

    res.status(200).json({ message: "Document relation added successfully", document });
  } catch (error) {
    console.error("Error adding document relation:", error);
    res.status(500).json({ message: "Error adding document relation", error: error.message });
  }
};

// Search documents
export const searchDocuments = async (req, res) => {
  try {
    const { query, teamId, tags, category, status, limit = 10 } = req.query;

    if (!query || query.trim().length < 2) {
      return res.status(400).json({ message: "Search query must be at least 2 characters" });
    }

    const searchFilter = {
      isLatestVersion: true,
      $or: [
        { title: { $regex: query.trim(), $options: 'i' } },
        { content: { $regex: query.trim(), $options: 'i' } },
        { tags: { $in: [new RegExp(query.trim(), 'i')] } }
      ]
    };

    if (teamId && mongoose.Types.ObjectId.isValid(teamId)) {
      searchFilter.teamId = teamId;
    }

    if (tags) {
      const tagArray = Array.isArray(tags) ? tags : tags.split(',');
      searchFilter.tags = { $in: tagArray };
    }

    if (category) {
      searchFilter.category = category;
    }

    if (status) {
      searchFilter.status = status;
    }

    const documents = await Document.find(searchFilter)
      .limit(parseInt(limit))
      .populate('teamId', 'name slug color icon')
      .select('title slug status category tags authorName updatedAt teamId')
      .sort({ updatedAt: -1 });

    res.status(200).json({
      query: query.trim(),
      results: documents,
      count: documents.length
    });
  } catch (error) {
    console.error("Error searching documents:", error);
    res.status(500).json({ message: "Error searching documents", error: error.message });
  }
};

// Delete document (soft delete)
export const deleteDocument = async (req, res) => {
  try {
    const { documentId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(documentId)) {
      return res.status(400).json({ message: "Invalid document ID format" });
    }

    const document = await Document.findById(documentId);
    if (!document) {
      return res.status(404).json({ message: "Document not found" });
    }

    // Soft delete by setting status to archived
    document.status = "archived";
    await document.save();

    res.status(200).json({ message: "Document archived successfully" });
  } catch (error) {
    console.error("Error deleting document:", error);
    res.status(500).json({ message: "Error deleting document", error: error.message });
  }
};