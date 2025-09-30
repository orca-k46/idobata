import mongoose from "mongoose";

const documentSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    slug: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    contentType: {
      type: String,
      enum: ["markdown", "html", "text", "pdf", "image"],
      default: "markdown",
    },
    teamId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Team",
      required: true,
    },
    authorId: {
      type: String,
      required: true,
    },
    authorName: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["draft", "review", "approved", "archived"],
      default: "draft",
    },
    version: {
      type: Number,
      default: 1,
    },
    parentDocumentId: {
      // 元となる文書のID（バージョン管理用）
      type: mongoose.Schema.Types.ObjectId,
      ref: "Document",
      default: null,
    },
    isLatestVersion: {
      type: Boolean,
      default: true,
    },
    tags: [{
      type: String,
      trim: true,
    }],
    category: {
      type: String,
      enum: [
        "meeting-minutes",
        "research",
        "proposal",
        "specification",
        "reference",
        "report",
        "other"
      ],
      default: "other",
    },
    relatedDocuments: [{
      documentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Document",
      },
      relationType: {
        type: String,
        enum: ["reference", "dependency", "similar", "follows", "supersedes"],
      },
      strength: {
        // 関連度の強さ (0.0 - 1.0)
        type: Number,
        min: 0.0,
        max: 1.0,
        default: 0.5,
      }
    }],
    metadata: {
      fileSize: Number,
      originalFilename: String,
      attachments: [{
        filename: String,
        url: String,
        type: String,
        size: Number,
      }],
      lastReviewDate: Date,
      nextReviewDate: Date,
    },
    permissions: {
      public: {
        type: Boolean,
        default: false,
      },
      allowedTeams: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Team",
      }],
      allowedUsers: [{
        type: String,
      }],
    },
    approvals: [{
      userId: String,
      userName: String,
      approvedAt: Date,
      comment: String,
    }],
    embedding: [{
      type: Number,
    }],
    embeddingGenerated: {
      type: Boolean,
      default: false,
    },
    statistics: {
      views: {
        type: Number,
        default: 0,
      },
      lastViewedAt: Date,
      editCount: {
        type: Number,
        default: 0,
      },
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// インデックス
documentSchema.index({ teamId: 1, status: 1 });
documentSchema.index({ authorId: 1 });
documentSchema.index({ tags: 1 });
documentSchema.index({ category: 1 });
documentSchema.index({ "relatedDocuments.documentId": 1 });
documentSchema.index({ embedding: "2dsphere" });

// 仮想フィールド
documentSchema.virtual('isApproved').get(function() {
  return this.status === 'approved';
});

documentSchema.virtual('approvalCount').get(function() {
  return this.approvals ? this.approvals.length : 0;
});

// メソッド
documentSchema.methods.addRelation = function(documentId, relationType, strength = 0.5) {
  const existingRelation = this.relatedDocuments.find(
    rel => rel.documentId.toString() === documentId.toString()
  );

  if (!existingRelation) {
    this.relatedDocuments.push({
      documentId,
      relationType,
      strength
    });
  } else {
    existingRelation.relationType = relationType;
    existingRelation.strength = strength;
  }
};

documentSchema.methods.incrementView = function() {
  this.statistics.views += 1;
  this.statistics.lastViewedAt = new Date();
  return this.save();
};

const Document = mongoose.model("Document", documentSchema);

export default Document;