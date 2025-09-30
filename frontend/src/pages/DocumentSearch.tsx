import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import {
  Search,
  Filter,
  Grid,
  List,
  FileText,
  Clock,
  User,
  Tag,
  Eye,
  MoreVertical,
  CheckCircle,
  AlertCircle,
  SortAsc,
  SortDesc,
  Calendar,
  Users,
} from 'lucide-react';
import { documentApi, teamApi } from '../services/api';

const DocumentSearch: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');
  const [selectedTeam, setSelectedTeam] = useState(searchParams.get('team') || '');
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || '');
  const [selectedStatus, setSelectedStatus] = useState(searchParams.get('status') || '');
  const [selectedTags, setSelectedTags] = useState<string[]>(searchParams.get('tags')?.split(',').filter(Boolean) || []);
  const [sortBy, setSortBy] = useState(searchParams.get('sort') || 'updatedAt');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>(searchParams.get('order') as any || 'desc');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = useState(false);

  // Memoize search parameters to prevent infinite loops
  const searchParameters = useMemo(() => ({
    q: searchQuery,
    team: selectedTeam,
    category: selectedCategory,
    status: selectedStatus,
    tags: selectedTags.join(','),
    sort: sortBy,
    order: sortOrder,
  }), [searchQuery, selectedTeam, selectedCategory, selectedStatus, selectedTags, sortBy, sortOrder]);

  // Fetch documents
  const { data: documents, isLoading } = useQuery({
    queryKey: ['documents', 'search', searchParameters],
    queryFn: () => documentApi.search(searchParameters),
  });

  // Fetch teams for filtering
  const { data: teams } = useQuery({
    queryKey: ['teams'],
    queryFn: teamApi.getAll,
  });

  // Update URL params when search is performed
  const updateURLParams = useCallback(() => {
    const params = new URLSearchParams();
    if (searchQuery) params.set('q', searchQuery);
    if (selectedTeam) params.set('team', selectedTeam);
    if (selectedCategory) params.set('category', selectedCategory);
    if (selectedStatus) params.set('status', selectedStatus);
    if (selectedTags.length > 0) params.set('tags', selectedTags.join(','));
    if (sortBy !== 'updatedAt') params.set('sort', sortBy);
    if (sortOrder !== 'desc') params.set('order', sortOrder);

    setSearchParams(params, { replace: true });
  }, [searchQuery, selectedTeam, selectedCategory, selectedStatus, selectedTags, sortBy, sortOrder]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    updateURLParams();
  };

  const handleTagToggle = (tag: string) => {
    setSelectedTags(prev =>
      prev.includes(tag)
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedTeam('');
    setSelectedCategory('');
    setSelectedStatus('');
    setSelectedTags([]);
    setSortBy('updatedAt');
    setSortOrder('desc');
    // Clear URL params as well
    setSearchParams({});
  };

  const statusConfig = {
    draft: { color: 'gray', text: '下書き', icon: FileText },
    review: { color: 'yellow', text: 'レビュー中', icon: AlertCircle },
    approved: { color: 'green', text: '承認済み', icon: CheckCircle },
    archived: { color: 'red', text: 'アーカイブ', icon: FileText }
  };

  const categories = [
    { value: 'specification', label: '仕様書' },
    { value: 'proposal', label: '提案書' },
    { value: 'report', label: '報告書' },
    { value: 'manual', label: 'マニュアル' },
    { value: 'meeting', label: '議事録' },
    { value: 'other', label: 'その他' },
  ];

  const sortOptions = [
    { value: 'updatedAt', label: '更新日時' },
    { value: 'createdAt', label: '作成日時' },
    { value: 'title', label: 'タイトル' },
    { value: 'views', label: '閲覧数' },
  ];

  // Get all unique tags from documents
  const allTags = Array.from(new Set(documents?.flatMap((doc: any) => doc.tags || []) || []));

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-6">
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                文書検索
              </h1>
              <Link
                to="/documents/new"
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
              >
                <FileText className="h-4 w-4 mr-2" />
                新規文書作成
              </Link>
            </div>

            {/* Search Bar */}
            <form onSubmit={handleSearch} className="mb-6">
              <div className="flex space-x-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="文書を検索..."
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
                    />
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setShowFilters(!showFilters)}
                  className={`inline-flex items-center px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm text-sm font-medium ${
                    showFilters
                      ? 'bg-indigo-50 text-indigo-700 border-indigo-300 dark:bg-indigo-900 dark:text-indigo-200'
                      : 'bg-white text-gray-700 dark:bg-gray-700 dark:text-gray-300'
                  } hover:bg-gray-50 dark:hover:bg-gray-600`}
                >
                  <Filter className="h-5 w-5 mr-2" />
                  フィルター
                </button>
              </div>
            </form>

            {/* Filters */}
            {showFilters && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mb-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                  {/* Team Filter */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      <Users className="h-4 w-4 inline mr-1" />
                      チーム
                    </label>
                    <select
                      value={selectedTeam}
                      onChange={(e) => setSelectedTeam(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
                    >
                      <option value="">すべてのチーム</option>
                      {teams?.map((team: any) => (
                        <option key={team._id} value={team._id}>
                          {team.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Category Filter */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      <FileText className="h-4 w-4 inline mr-1" />
                      カテゴリ
                    </label>
                    <select
                      value={selectedCategory}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
                    >
                      <option value="">すべてのカテゴリ</option>
                      {categories.map((category) => (
                        <option key={category.value} value={category.value}>
                          {category.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Status Filter */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      <Clock className="h-4 w-4 inline mr-1" />
                      ステータス
                    </label>
                    <select
                      value={selectedStatus}
                      onChange={(e) => setSelectedStatus(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
                    >
                      <option value="">すべてのステータス</option>
                      <option value="draft">下書き</option>
                      <option value="review">レビュー中</option>
                      <option value="approved">承認済み</option>
                      <option value="archived">アーカイブ</option>
                    </select>
                  </div>

                  {/* Sort */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      並び順
                    </label>
                    <div className="flex space-x-2">
                      <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                        className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
                      >
                        {sortOptions.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                      <button
                        onClick={() => setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc')}
                        className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
                      >
                        {sortOrder === 'desc' ? <SortDesc className="h-4 w-4" /> : <SortAsc className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Tags */}
                {allTags.length > 0 && (
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      <Tag className="h-4 w-4 inline mr-1" />
                      タグ
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {allTags.map((tag: string) => (
                        <button
                          key={tag}
                          onClick={() => handleTagToggle(tag)}
                          className={`inline-flex items-center px-3 py-1 text-sm rounded-full ${
                            selectedTags.includes(tag)
                              ? 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200'
                              : 'bg-gray-100 text-gray-800 dark:bg-gray-600 dark:text-gray-300'
                          }`}
                        >
                          #{tag}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <button
                  onClick={clearFilters}
                  className="text-sm text-indigo-600 hover:text-indigo-500 dark:text-indigo-400"
                >
                  フィルターをクリア
                </button>
              </motion.div>
            )}

            {/* View Controls */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  {documents?.length || 0} 件の文書が見つかりました
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-md ${
                    viewMode === 'grid'
                      ? 'bg-indigo-100 text-indigo-600 dark:bg-indigo-900 dark:text-indigo-200'
                      : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400'
                  }`}
                >
                  <Grid className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-md ${
                    viewMode === 'list'
                      ? 'bg-indigo-100 text-indigo-600 dark:bg-indigo-900 dark:text-indigo-200'
                      : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400'
                  }`}
                >
                  <List className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {isLoading ? (
          <div className="animate-pulse">
            <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-4'}>
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
                  <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-4"></div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-2"></div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-2/3"></div>
                </div>
              ))}
            </div>
          </div>
        ) : documents?.length === 0 ? (
          <div className="text-center py-12">
            <FileText className="h-12 w-12 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              文書が見つかりませんでした
            </h3>
            <p className="text-gray-500 dark:text-gray-400 mb-4">
              検索条件を変更するか、新しい文書を作成してみてください。
            </p>
            <Link
              to="/documents/new"
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
            >
              <FileText className="h-4 w-4 mr-2" />
              新規文書作成
            </Link>
          </div>
        ) : (
          <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-4'}>
            {documents?.map((document: any, index: number) => {
              const config = statusConfig[document.status as keyof typeof statusConfig];
              return (
                <motion.div
                  key={document._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Link
                    to={`/documents/${document._id}`}
                    className="block bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 hover:border-indigo-500 hover:shadow-xl transition-all duration-200"
                  >
                    <div className="p-6">
                      <div className="flex items-start justify-between mb-3">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white line-clamp-2">
                          {document.title}
                        </h3>
                        <button className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                          <MoreVertical className="h-4 w-4" />
                        </button>
                      </div>

                      <div className="flex items-center space-x-2 mb-3">
                        <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${
                          config.color === 'green'
                            ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                            : config.color === 'yellow'
                            ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                            : config.color === 'red'
                            ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                            : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                        }`}>
                          <config.icon className="h-3 w-3 mr-1" />
                          {config.text}
                        </span>
                        {document.teamId && (
                          <div className="flex items-center">
                            <div
                              className="w-4 h-4 rounded flex items-center justify-center text-white text-xs mr-1"
                              style={{ backgroundColor: document.teamId.color }}
                            >
                              {document.teamId.icon}
                            </div>
                            <span className="text-xs text-gray-600 dark:text-gray-400">
                              {document.teamId.name}
                            </span>
                          </div>
                        )}
                      </div>

                      <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400 mb-3">
                        <div className="flex items-center">
                          <User className="h-4 w-4 mr-1" />
                          {document.authorName}
                        </div>
                        <div className="flex items-center">
                          <Clock className="h-4 w-4 mr-1" />
                          {new Date(document.updatedAt).toLocaleDateString('ja-JP')}
                        </div>
                        <div className="flex items-center">
                          <Eye className="h-4 w-4 mr-1" />
                          {document.statistics?.views || 0}
                        </div>
                      </div>

                      {document.tags && document.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          {document.tags.slice(0, 3).map((tag: string) => (
                            <span
                              key={tag}
                              className="inline-block px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded"
                            >
                              #{tag}
                            </span>
                          ))}
                          {document.tags.length > 3 && (
                            <span className="text-xs text-gray-400">
                              +{document.tags.length - 3} more
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default DocumentSearch;