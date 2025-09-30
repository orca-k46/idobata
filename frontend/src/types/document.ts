import { Team } from './team';

export interface DocumentRelation {
  documentId: string;
  relationType: 'reference' | 'dependency' | 'similar' | 'follows' | 'supersedes';
  strength: number;
}

export interface DocumentApproval {
  userId: string;
  userName: string;
  approvedAt: string;
  comment?: string;
}

export interface DocumentPermissions {
  public: boolean;
  allowedTeams: string[];
  allowedUsers: string[];
}

export interface DocumentMetadata {
  fileSize?: number;
  originalFilename?: string;
  attachments?: Array<{
    filename: string;
    url: string;
    type: string;
    size: number;
  }>;
  lastReviewDate?: string;
  nextReviewDate?: string;
}

export interface DocumentStatistics {
  views: number;
  lastViewedAt?: string;
  editCount: number;
}

export interface Document {
  _id: string;
  title: string;
  slug: string;
  content: string;
  contentType: 'markdown' | 'html' | 'text' | 'pdf' | 'image';
  teamId: string | Team;
  authorId: string;
  authorName: string;
  status: 'draft' | 'review' | 'approved' | 'archived';
  version: number;
  parentDocumentId?: string;
  isLatestVersion: boolean;
  tags: string[];
  category: 'meeting-minutes' | 'research' | 'proposal' | 'specification' | 'reference' | 'report' | 'other';
  relatedDocuments: DocumentRelation[];
  metadata: DocumentMetadata;
  permissions: DocumentPermissions;
  approvals: DocumentApproval[];
  embeddingGenerated: boolean;
  statistics: DocumentStatistics;
  createdAt: string;
  updatedAt: string;
}

export interface DocumentSummary {
  _id: string;
  title: string;
  slug: string;
  status: 'draft' | 'review' | 'approved' | 'archived';
  category: string;
  tags: string[];
  authorName: string;
  teamId: string | Team;
  version: number;
  createdAt: string;
  updatedAt: string;
}

export interface DocumentVersion {
  _id: string;
  documentId: string;
  version: number;
  title: string;
  content: string;
  authorId: string;
  authorName: string;
  changeType: 'created' | 'updated' | 'approved' | 'archived' | 'restored';
  changeSummary: string;
  changeDetails?: string;
  tags: string[];
  metadata: object;
  parentVersionId?: string;
  mergeInfo?: {
    sourceVersionIds: string[];
    conflictResolutions: Array<{
      section: string;
      resolution: string;
      resolvedBy: string;
    }>;
  };
  approval: {
    isRequired: boolean;
    approvers: Array<{
      userId: string;
      userName: string;
      status: 'pending' | 'approved' | 'rejected';
      comment?: string;
      approvedAt?: string;
    }>;
    finalStatus: 'pending' | 'approved' | 'rejected';
  };
  statistics: {
    size?: number;
    wordCount?: number;
    changeScore?: number;
  };
  createdAt: string;
  updatedAt: string;
}

export interface DocumentSearchResult {
  _id: string;
  title: string;
  slug: string;
  status: string;
  category: string;
  tags: string[];
  authorName: string;
  teamId: Team;
  updatedAt: string;
}

export interface DocumentCreateInput {
  title: string;
  slug?: string;
  content: string;
  contentType?: string;
  teamId: string;
  category?: string;
  tags?: string[];
  permissions?: Partial<DocumentPermissions>;
}

export interface DocumentUpdateInput {
  title?: string;
  content?: string;
  category?: string;
  tags?: string[];
  permissions?: Partial<DocumentPermissions>;
  changeSummary: string;
}