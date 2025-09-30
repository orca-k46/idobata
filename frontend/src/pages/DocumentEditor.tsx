import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import {
  Save,
  X,
  Eye,
  FileText,
  Users,
  Tag,
  Calendar,
  AlertCircle,
  CheckCircle,
  Clock,
  Settings,
} from 'lucide-react';
import { documentApi, teamApi } from '../services/api';

const DocumentEditor: React.FC = () => {
  const { documentId } = useParams<{ documentId: string }>();
  const [searchParams] = useSearchParams();
  const teamId = searchParams.get('teamId');
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('specification');
  const [tags, setTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState('');
  const [selectedTeamId, setSelectedTeamId] = useState(teamId || '');
  const [status, setStatus] = useState<'draft' | 'review' | 'approved'>('draft');
  const [isPreview, setIsPreview] = useState(false);

  const isEditMode = !!documentId;

  // Fetch document data if editing
  const { data: document } = useQuery({
    queryKey: ['document', documentId],
    queryFn: () => documentApi.getById(documentId!),
    enabled: isEditMode,
    onSuccess: (data) => {
      setTitle(data.title);
      setContent(data.content);
      setCategory(data.category);
      setTags(data.tags || []);
      setSelectedTeamId(data.teamId?._id || '');
      setStatus(data.status);
    },
  });

  // Fetch teams for team selection
  const { data: teams } = useQuery({
    queryKey: ['teams'],
    queryFn: teamApi.getAll,
  });

  // Create/Update document mutation
  const saveMutation = useMutation({
    mutationFn: (data: any) => {
      if (isEditMode) {
        return documentApi.update(documentId!, data);
      }
      return documentApi.create(data);
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['documents'] });
      queryClient.invalidateQueries({ queryKey: ['document', documentId] });
      navigate(`/documents/${data._id}`);
    },
  });

  const handleSave = () => {
    const documentData = {
      title,
      content,
      category,
      tags,
      teamId: selectedTeamId,
      status,
    };
    saveMutation.mutate(documentData);
  };

  const handleCancel = () => {
    if (isEditMode) {
      navigate(`/documents/${documentId}`);
    } else {
      navigate('/documents/search');
    }
  };

  const addTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      setTags([...tags, newTag.trim()]);
      setNewTag('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const statusConfig = {
    draft: { color: 'gray', text: '下書き', icon: FileText },
    review: { color: 'yellow', text: 'レビュー中', icon: AlertCircle },
    approved: { color: 'green', text: '承認済み', icon: CheckCircle },
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {isEditMode ? '文書編集' : '新規文書作成'}
                </h1>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setIsPreview(!isPreview)}
                    className={`inline-flex items-center px-3 py-1 rounded-md text-sm font-medium ${
                      isPreview
                        ? 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200'
                        : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                    }`}
                  >
                    <Eye className="h-4 w-4 mr-1" />
                    プレビュー
                  </button>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <button
                  onClick={handleCancel}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
                >
                  <X className="h-4 w-4 mr-2" />
                  キャンセル
                </button>
                <button
                  onClick={handleSave}
                  disabled={!title.trim() || !content.trim() || !selectedTeamId || saveMutation.isLoading}
                  className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-400"
                >
                  <Save className="h-4 w-4 mr-2" />
                  {saveMutation.isLoading ? '保存中...' : '保存'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Editor */}
          <div className="lg:col-span-3">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700"
            >
              <div className="p-6">
                {/* Title Input */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    タイトル
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="文書のタイトルを入力してください"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
                  />
                </div>

                {/* Content Editor/Preview */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    内容
                  </label>
                  {isPreview ? (
                    <div className="min-h-96 p-4 border border-gray-300 dark:border-gray-600 rounded-md bg-gray-50 dark:bg-gray-700">
                      <div className="prose prose-lg dark:prose-invert max-w-none">
                        {content.split('\n').map((line, index) => {
                          if (line.startsWith('# ')) {
                            return (
                              <h1 key={index} className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                                {line.substring(2)}
                              </h1>
                            );
                          } else if (line.startsWith('## ')) {
                            return (
                              <h2 key={index} className="text-2xl font-semibold text-gray-900 dark:text-white mt-8 mb-4">
                                {line.substring(3)}
                              </h2>
                            );
                          } else if (line.trim() === '') {
                            return <br key={index} />;
                          } else {
                            return (
                              <p key={index} className="mb-4 text-gray-700 dark:text-gray-300 leading-relaxed">
                                {line}
                              </p>
                            );
                          }
                        })}
                      </div>
                    </div>
                  ) : (
                    <textarea
                      value={content}
                      onChange={(e) => setContent(e.target.value)}
                      placeholder="Markdownで文書の内容を記述してください..."
                      rows={20}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white font-mono"
                    />
                  )}
                </div>
              </div>
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Document Settings */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6"
            >
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                <Settings className="h-5 w-5 mr-2" />
                文書設定
              </h3>

              {/* Team Selection */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  <Users className="h-4 w-4 inline mr-1" />
                  チーム
                </label>
                <select
                  value={selectedTeamId}
                  onChange={(e) => setSelectedTeamId(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
                >
                  <option value="">チームを選択</option>
                  {teams?.map((team: any) => (
                    <option key={team._id} value={team._id}>
                      {team.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Category */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  <FileText className="h-4 w-4 inline mr-1" />
                  カテゴリ
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
                >
                  <option value="specification">仕様書</option>
                  <option value="proposal">提案書</option>
                  <option value="report">報告書</option>
                  <option value="manual">マニュアル</option>
                  <option value="meeting">議事録</option>
                  <option value="other">その他</option>
                </select>
              </div>

              {/* Status */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  <Clock className="h-4 w-4 inline mr-1" />
                  ステータス
                </label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as any)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
                >
                  <option value="draft">下書き</option>
                  <option value="review">レビュー中</option>
                  <option value="approved">承認済み</option>
                </select>
              </div>
            </motion.div>

            {/* Tags */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6"
            >
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                <Tag className="h-5 w-5 mr-2" />
                タグ
              </h3>

              {/* Add Tag */}
              <div className="flex mb-4">
                <input
                  type="text"
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && addTag()}
                  placeholder="タグを追加"
                  className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-l-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
                />
                <button
                  onClick={addTag}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-r-md hover:bg-indigo-700"
                >
                  追加
                </button>
              </div>

              {/* Tag List */}
              <div className="flex flex-wrap gap-2">
                {tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center px-3 py-1 text-sm bg-indigo-100 dark:bg-indigo-900 text-indigo-800 dark:text-indigo-200 rounded-full"
                  >
                    #{tag}
                    <button
                      onClick={() => removeTag(tag)}
                      className="ml-2 text-indigo-600 hover:text-indigo-800"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DocumentEditor;