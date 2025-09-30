import mongoose from "mongoose";

const documentVersionSchema = new mongoose.Schema(
  {
    documentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Document",
      required: true,
    },
    version: {
      type: Number,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    content: {
      type: String,
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
    changeType: {
      type: String,
      enum: ["created", "updated", "approved", "archived", "restored"],
      required: true,
    },
    changeSummary: {
      type: String,
      required: true,
    },
    changeDetails: {
      // 詳細な変更内容（diff情報等）
      type: String,
    },
    tags: [{
      type: String,
      trim: true,
    }],
    metadata: {
      type: Object,
      default: {},
    },
    parentVersionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "DocumentVersion",
      default: null,
    },
    mergeInfo: {
      // マージ情報（複数のバージョンからマージされた場合）
      sourceVersionIds: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "DocumentVersion",
      }],
      conflictResolutions: [{
        section: String,
        resolution: String,
        resolvedBy: String,
      }],
    },
    approval: {
      isRequired: {
        type: Boolean,
        default: false,
      },
      approvers: [{
        userId: String,
        userName: String,
        status: {
          type: String,
          enum: ["pending", "approved", "rejected"],
        },
        comment: String,
        approvedAt: Date,
      }],
      finalStatus: {
        type: String,
        enum: ["pending", "approved", "rejected"],
        default: "pending",
      },
    },
    statistics: {
      size: Number,
      wordCount: Number,
      changeScore: {
        // 変更の規模を表すスコア
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
documentVersionSchema.index({ documentId: 1, version: -1 });
documentVersionSchema.index({ authorId: 1 });
documentVersionSchema.index({ changeType: 1 });
documentVersionSchema.index({ "approval.finalStatus": 1 });

// 仮想フィールド
documentVersionSchema.virtual('isApproved').get(function() {
  return this.approval.finalStatus === 'approved';
});

documentVersionSchema.virtual('isPending').get(function() {
  return this.approval.finalStatus === 'pending';
});

documentVersionSchema.virtual('approvalProgress').get(function() {
  if (!this.approval.approvers || this.approval.approvers.length === 0) {
    return 0;
  }
  const approvedCount = this.approval.approvers.filter(a => a.status === 'approved').length;
  return approvedCount / this.approval.approvers.length;
});

// メソッド
documentVersionSchema.methods.addApprover = function(userId, userName) {
  const existingApprover = this.approval.approvers.find(a => a.userId === userId);
  if (!existingApprover) {
    this.approval.approvers.push({
      userId,
      userName,
      status: 'pending'
    });
  }
};

documentVersionSchema.methods.approve = function(userId, comment = '') {
  const approver = this.approval.approvers.find(a => a.userId === userId);
  if (approver) {
    approver.status = 'approved';
    approver.comment = comment;
    approver.approvedAt = new Date();

    // すべての承認者が承認した場合、最終ステータスを更新
    const allApproved = this.approval.approvers.every(a => a.status === 'approved');
    if (allApproved) {
      this.approval.finalStatus = 'approved';
    }
  }
};

documentVersionSchema.methods.reject = function(userId, comment = '') {
  const approver = this.approval.approvers.find(a => a.userId === userId);
  if (approver) {
    approver.status = 'rejected';
    approver.comment = comment;
    approver.approvedAt = new Date();
    this.approval.finalStatus = 'rejected';
  }
};

const DocumentVersion = mongoose.model("DocumentVersion", documentVersionSchema);

export default DocumentVersion;