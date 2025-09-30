export interface TeamMember {
  userId: string;
  userName: string;
  role: 'leader' | 'member' | 'viewer';
  joinedAt: string;
}

export interface TeamSettings {
  allowPublicView: boolean;
  requireApproval: boolean;
}

export interface TeamStatistics {
  documentCount: number;
  statusCounts: {
    draft?: number;
    review?: number;
    approved?: number;
    archived?: number;
  };
  categoryCounts: {
    [key: string]: number;
  };
  memberCount: number;
}

export interface Team {
  _id: string;
  name: string;
  description?: string;
  slug: string;
  color: string;
  icon: string;
  isActive: boolean;
  members: TeamMember[];
  settings: TeamSettings;
  statistics?: TeamStatistics;
  createdAt: string;
  updatedAt: string;
}

export interface TeamSummary {
  _id: string;
  name: string;
  description?: string;
  slug: string;
  color: string;
  icon: string;
  memberCount: number;
  documentCount: number;
  createdAt: string;
}