import { Team, TeamSummary } from '../types/team';
import { Document, DocumentSummary, DocumentVersion, DocumentCreateInput, DocumentUpdateInput, DocumentSearchResult } from '../types/document';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';

class ApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.status = status;
    this.name = 'ApiError';
  }
}

async function fetchApi<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;

  const config: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  };

  try {
    const response = await fetch(url, config);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'Request failed' }));
      throw new ApiError(errorData.message || 'Request failed', response.status);
    }

    return await response.json();
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError('Network error', 0);
  }
}

// Team API
export const teamApi = {
  getAll: (): Promise<TeamSummary[]> =>
    fetchApi('/teams'),

  getById: (id: string): Promise<Team> =>
    fetchApi(`/teams/${id}`),

  getDetail: (id: string): Promise<Team> =>
    fetchApi(`/teams/${id}/detail`),

  create: (team: Omit<Team, '_id' | 'createdAt' | 'updatedAt' | 'members'>): Promise<Team> =>
    fetchApi('/teams', {
      method: 'POST',
      body: JSON.stringify(team),
    }),

  update: (id: string, updates: Partial<Team>): Promise<Team> =>
    fetchApi(`/teams/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    }),

  addMember: (teamId: string, member: { userId: string; userName: string; role?: string }): Promise<Team> =>
    fetchApi(`/teams/${teamId}/members`, {
      method: 'POST',
      body: JSON.stringify(member),
    }),

  removeMember: (teamId: string, userId: string): Promise<{ message: string; team: Team }> =>
    fetchApi(`/teams/${teamId}/members/${userId}`, {
      method: 'DELETE',
    }),

  updateMemberRole: (teamId: string, userId: string, role: string): Promise<{ message: string; team: Team }> =>
    fetchApi(`/teams/${teamId}/members/${userId}/role`, {
      method: 'PUT',
      body: JSON.stringify({ role }),
    }),

  delete: (id: string): Promise<{ message: string }> =>
    fetchApi(`/teams/${id}`, {
      method: 'DELETE',
    }),
};

// Document API
export const documentApi = {
  getAll: (params?: {
    teamId?: string;
    status?: string;
    category?: string;
    tags?: string[];
    authorId?: string;
    limit?: number;
    skip?: number;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
  }): Promise<{
    documents: DocumentSummary[];
    pagination: {
      total: number;
      limit: number;
      skip: number;
      hasMore: boolean;
    };
  }> => {
    const searchParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          if (Array.isArray(value)) {
            searchParams.append(key, value.join(','));
          } else {
            searchParams.append(key, value.toString());
          }
        }
      });
    }
    return fetchApi(`/documents?${searchParams.toString()}`);
  },

  getById: (id: string): Promise<Document> =>
    fetchApi(`/documents/${id}`),

  getByTeam: (teamId: string, params?: {
    status?: string;
    category?: string;
    limit?: number;
    skip?: number;
  }): Promise<{
    documents: DocumentSummary[];
    pagination: {
      total: number;
      limit: number;
      skip: number;
      hasMore: boolean;
    };
  }> => {
    const searchParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          searchParams.append(key, value.toString());
        }
      });
    }
    return fetchApi(`/teams/${teamId}/documents?${searchParams.toString()}`);
  },

  create: (document: DocumentCreateInput & { authorId: string; authorName: string }): Promise<Document> =>
    fetchApi('/documents', {
      method: 'POST',
      body: JSON.stringify(document),
    }),

  update: (id: string, updates: DocumentUpdateInput & { authorId: string; authorName: string }): Promise<Document> =>
    fetchApi(`/documents/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    }),

  getVersions: (id: string, params?: {
    limit?: number;
    skip?: number;
  }): Promise<{
    versions: DocumentVersion[];
    pagination: {
      total: number;
      limit: number;
      skip: number;
      hasMore: boolean;
    };
  }> => {
    const searchParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          searchParams.append(key, value.toString());
        }
      });
    }
    return fetchApi(`/documents/${id}/versions?${searchParams.toString()}`);
  },

  addRelation: (documentId: string, relation: {
    relatedDocumentId: string;
    relationType: string;
    strength?: number;
  }): Promise<{ message: string; document: Document }> =>
    fetchApi(`/documents/${documentId}/relations`, {
      method: 'POST',
      body: JSON.stringify(relation),
    }),

  search: (params: {
    query: string;
    teamId?: string;
    tags?: string[];
    category?: string;
    status?: string;
    limit?: number;
  }): Promise<{
    query: string;
    results: DocumentSearchResult[];
    count: number;
  }> => {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) {
        if (Array.isArray(value)) {
          searchParams.append(key, value.join(','));
        } else {
          searchParams.append(key, value.toString());
        }
      }
    });
    return fetchApi(`/documents/search?${searchParams.toString()}`);
  },

  delete: (id: string): Promise<{ message: string }> =>
    fetchApi(`/documents/${id}`, {
      method: 'DELETE',
    }),
};