import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Users,
  FileText,
  Search,
  TrendingUp,
  Clock,
  Plus,
  BookOpen,
  GitBranch,
  Calendar,
  Filter,
  SortAsc,
  Tag,
  User,
  Eye,
  CheckCircle,
  AlertCircle,
  Network,
  Mail,
  Settings,
  Edit,
  MessageCircle,
  Activity,
} from 'lucide-react';

export const SimpleDashboard: React.FC = () => {
  // 風の谷プロジェクト12班のデータ
  const mockTeams = [
    { _id: '1', name: '文化・全体デザイン', color: '#8b5cf6', icon: '🌸', memberCount: 12, documentCount: 28 },
    { _id: '2', name: '空間デザイン', color: '#06b6d4', icon: '🏗️', memberCount: 15, documentCount: 34 },
    { _id: '3', name: 'エネルギー', color: '#eab308', icon: '⚡', memberCount: 11, documentCount: 22 },
    { _id: '4', name: '森と水とトレイル', color: '#16a34a', icon: '🌲', memberCount: 18, documentCount: 31 },
    { _id: '5', name: '生活オフィス空間（サンゴ礁1）', color: '#f97316', icon: '🏡', memberCount: 14, documentCount: 26 },
    { _id: '6', name: 'まち商業空間（サンゴ礁2）', color: '#ec4899', icon: '🏪', memberCount: 16, documentCount: 29 },
    { _id: '7', name: '食と農', color: '#84cc16', icon: '🌾', memberCount: 13, documentCount: 25 },
    { _id: '8', name: 'JOL &PPK（ヘルスケア）', color: '#10b981', icon: '🏥', memberCount: 9, documentCount: 19 },
    { _id: '9', name: '谷をつくる人をつくる（教育）', color: '#3b82f6', icon: '📚', memberCount: 17, documentCount: 33 },
    { _id: '10', name: 'テクノロジー（情報インフラ＆他領域との協働）', color: '#6366f1', icon: '💻', memberCount: 8, documentCount: 42 },
    { _id: '11', name: '土地読み（空間デザイン×文化×森）', color: '#a855f7', icon: '🗺️', memberCount: 10, documentCount: 21 },
  ];

  const mockDocuments = [
    { _id: '1', title: '風の谷プロジェクト全体構想書', status: 'approved', authorName: '文化・全体デザイン班' },
    { _id: '2', title: '持続可能エネルギーシステム設計書', status: 'review', authorName: 'エネルギー班' },
    { _id: '3', title: '自然共生型建築ガイドライン', status: 'approved', authorName: '空間デザイン班' },
    { _id: '4', title: '森林保全・水循環計画書', status: 'review', authorName: '森と水とトレイル班' },
    { _id: '5', title: 'コミュニティ教育プログラム案', status: 'draft', authorName: '谷をつくる人をつくる班' },
    { _id: '6', title: 'IT基盤・各班連携フレームワーク', status: 'approved', authorName: 'テクノロジー班' },
  ];

  const statsCards = [
    {
      title: 'チーム総数',
      value: mockTeams.length,
      icon: Users,
      color: 'bg-blue-500',
      href: '/teams',
    },
    {
      title: '総文書数',
      value: mockTeams.reduce((sum, team) => sum + team.documentCount, 0),
      icon: FileText,
      color: 'bg-green-500',
      href: '/documents/search',
    },
    {
      title: 'ナレッジグラフ',
      value: '活用可能',
      icon: GitBranch,
      color: 'bg-purple-500',
      href: '/knowledge-graph',
    },
    {
      title: 'レポート',
      value: '最新版',
      icon: TrendingUp,
      color: 'bg-orange-500',
      href: '/reports',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-cyan-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-slate-800">
                  風の谷 文書管理システム
                </h1>
                <p className="text-slate-600 mt-1">
                  ようこそ、ゲストさん
                </p>
              </div>
              <div className="flex space-x-4">
                <Link
                  to="/documents/new"
                  className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  新規文書
                </Link>
                <Link
                  to="/documents/search"
                  className="inline-flex items-center px-4 py-2 border border-cyan-300 rounded-md shadow-sm text-sm font-medium text-slate-700 bg-white bg-cyan-50 hover:bg-gray-50 dark:hover:bg-gray-600"
                >
                  <Search className="h-4 w-4 mr-2" />
                  文書検索
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {statsCards.map((stat, index) => (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Link to={stat.href}>
                <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-200 p-6 border border-cyan-200">
                  <div className="flex items-center">
                    <div className={`flex-shrink-0 ${stat.color} rounded-lg p-3`}>
                      <stat.icon className="h-6 w-6 text-white" />
                    </div>
                    <div className="ml-4 flex-1">
                      <p className="text-sm font-medium text-slate-600">
                        {stat.title}
                      </p>
                      <p className="text-2xl font-semibold text-slate-800">
                        {stat.value}
                      </p>
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Teams Overview */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-xl shadow-lg border border-cyan-200"
          >
            <div className="p-6 border-b border-cyan-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-slate-800 flex items-center">
                  <Users className="h-5 w-5 mr-2" />
                  チーム一覧
                </h2>
                <Link
                  to="/teams"
                  className="text-cyan-600 hover:text-indigo-500 text-sm font-medium"
                >
                  すべて表示
                </Link>
              </div>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {mockTeams.map((team) => (
                  <Link
                    key={team._id}
                    to={`/teams/${team._id}`}
                    className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-150"
                  >
                    <div
                      className="w-10 h-10 rounded-lg flex items-center justify-center text-white text-lg"
                      style={{ backgroundColor: team.color }}
                    >
                      {team.icon}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-slate-800">
                        {team.name}
                      </p>
                      <p className="text-sm text-slate-500">
                        {team.memberCount} メンバー • {team.documentCount} 文書
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Recent Documents */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-xl shadow-lg border border-cyan-200"
          >
            <div className="p-6 border-b border-cyan-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-slate-800 flex items-center">
                  <Clock className="h-5 w-5 mr-2" />
                  最近の文書
                </h2>
                <Link
                  to="/documents/search"
                  className="text-cyan-600 hover:text-indigo-500 text-sm font-medium"
                >
                  すべて表示
                </Link>
              </div>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {mockDocuments.map((doc) => (
                  <Link
                    key={doc._id}
                    to={`/documents/${doc._id}`}
                    className="block p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-150"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <p className="font-medium text-slate-800 line-clamp-1">
                          {doc.title}
                        </p>
                        <div className="flex items-center space-x-2 mt-1">
                          <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                            doc.status === 'approved'
                              ? 'bg-green-100 text-green-800'
                              : doc.status === 'review'
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-gray-100 text-gray-800 bg-cyan-50 dark:text-gray-300'
                          }`}>
                            {doc.status}
                          </span>
                          <span className="text-sm text-slate-500">
                            {doc.authorName}
                          </span>
                        </div>
                      </div>
                      <FileText className="h-4 w-4 text-gray-400 mt-1" />
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </motion.div>
        </div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-8 bg-white rounded-xl shadow-lg border border-cyan-200"
        >
          <div className="p-6 border-b border-cyan-200">
            <h2 className="text-xl font-semibold text-slate-800">
              クイックアクション
            </h2>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Link
                to="/knowledge-graph"
                className="flex items-center p-4 border border-gray-200 dark:border-gray-600 rounded-lg hover:border-indigo-500 hover:shadow-md transition-all duration-200"
              >
                <GitBranch className="h-8 w-8 text-purple-500 mr-4" />
                <div>
                  <h3 className="font-medium text-slate-800">
                    ナレッジグラフ
                  </h3>
                  <p className="text-sm text-slate-500">
                    文書間の関係性を可視化
                  </p>
                </div>
              </Link>
              <Link
                to="/documents/search"
                className="flex items-center p-4 border border-gray-200 dark:border-gray-600 rounded-lg hover:border-indigo-500 hover:shadow-md transition-all duration-200"
              >
                <Search className="h-8 w-8 text-blue-500 mr-4" />
                <div>
                  <h3 className="font-medium text-slate-800">
                    高度な検索
                  </h3>
                  <p className="text-sm text-slate-500">
                    条件を指定して文書を検索
                  </p>
                </div>
              </Link>
              <Link
                to="/about"
                className="flex items-center p-4 border border-gray-200 dark:border-gray-600 rounded-lg hover:border-indigo-500 hover:shadow-md transition-all duration-200"
              >
                <BookOpen className="h-8 w-8 text-green-500 mr-4" />
                <div>
                  <h3 className="font-medium text-slate-800">
                    使い方ガイド
                  </h3>
                  <p className="text-sm text-slate-500">
                    システムの使い方を学ぶ
                  </p>
                </div>
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export const SimpleTeams: React.FC = () => {
  // 風の谷プロジェクト12班のデータ
  const mockTeams = [
    { _id: '1', name: '文化・全体デザイン', description: 'プロジェクト全体の文化的基盤とデザイン統括', color: '#8b5cf6', icon: '🌸', memberCount: 12, documentCount: 28, createdAt: '2024-01-10T10:00:00Z' },
    { _id: '2', name: '空間デザイン', description: '建築・都市計画・空間設計', color: '#06b6d4', icon: '🏗️', memberCount: 15, documentCount: 34, createdAt: '2024-01-12T10:00:00Z' },
    { _id: '3', name: 'エネルギー', description: '再生可能エネルギーシステム構築', color: '#eab308', icon: '⚡', memberCount: 11, documentCount: 22, createdAt: '2024-01-15T10:00:00Z' },
    { _id: '4', name: '森と水とトレイル', description: '自然環境整備とエコシステム管理', color: '#16a34a', icon: '🌲', memberCount: 18, documentCount: 31, createdAt: '2024-01-18T10:00:00Z' },
    { _id: '5', name: '生活オフィス空間（サンゴ礁1）', description: '住居・オフィス統合型生活空間設計', color: '#f97316', icon: '🏡', memberCount: 14, documentCount: 26, createdAt: '2024-01-20T10:00:00Z' },
    { _id: '6', name: 'まち商業空間（サンゴ礁2）', description: '商業施設・コミュニティ空間設計', color: '#ec4899', icon: '🏪', memberCount: 16, documentCount: 29, createdAt: '2024-01-22T10:00:00Z' },
    { _id: '7', name: '食と農', description: '持続可能な農業・食料システム構築', color: '#84cc16', icon: '🌾', memberCount: 13, documentCount: 25, createdAt: '2024-01-25T10:00:00Z' },
    { _id: '8', name: 'JOL &PPK（ヘルスケア）', description: '健康・医療・ウェルネスシステム', color: '#10b981', icon: '🏥', memberCount: 9, documentCount: 19, createdAt: '2024-01-28T10:00:00Z' },
    { _id: '9', name: '谷をつくる人をつくる（教育）', description: '教育システム・人材育成プログラム', color: '#3b82f6', icon: '📚', memberCount: 17, documentCount: 33, createdAt: '2024-02-01T10:00:00Z' },
    { _id: '10', name: 'テクノロジー（情報インフラ＆他領域との協働）', description: 'IT基盤構築・各領域との技術連携', color: '#6366f1', icon: '💻', memberCount: 8, documentCount: 42, createdAt: '2024-02-05T10:00:00Z' },
    { _id: '11', name: '土地読み（空間デザイン×文化×森）', description: '地域特性分析・統合的土地活用計画', color: '#a855f7', icon: '🗺️', memberCount: 10, documentCount: 21, createdAt: '2024-02-08T10:00:00Z' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-cyan-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-slate-800">
                  チーム一覧
                </h1>
                <p className="text-slate-600 mt-1">
                  {mockTeams.length} チームが登録されています
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Teams Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mockTeams.map((team, index) => (
            <motion.div
              key={team._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Link to={`/teams/${team._id}`}>
                <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 border border-cyan-200 group hover:scale-105">
                  <div className="flex items-center mb-4">
                    <div
                      className="w-16 h-16 rounded-lg flex items-center justify-center text-white text-2xl group-hover:scale-110 transition-transform duration-200"
                      style={{ backgroundColor: team.color }}
                    >
                      {team.icon}
                    </div>
                    <div className="ml-4 flex-1">
                      <h3 className="font-semibold text-slate-800 text-lg line-clamp-2 group-hover:text-cyan-600 dark:group-hover:text-indigo-400 transition-colors">
                        {team.name}
                      </h3>
                    </div>
                  </div>

                  {team.description && (
                    <p className="text-slate-600 text-sm mb-4 line-clamp-2">
                      {team.description}
                    </p>
                  )}

                  <div className="flex items-center justify-between text-sm text-slate-500">
                    <div className="flex items-center">
                      <Users className="h-4 w-4 mr-1" />
                      {team.memberCount} メンバー
                    </div>
                    <div className="flex items-center">
                      <FileText className="h-4 w-4 mr-1" />
                      {team.documentCount} 文書
                    </div>
                  </div>

                  <div className="mt-4 flex items-center text-xs text-gray-400 dark:text-gray-500">
                    <Calendar className="h-3 w-3 mr-1" />
                    作成: {new Date(team.createdAt).toLocaleDateString('ja-JP')}
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export const SimpleTeamDetail: React.FC = () => (
  <div className="p-8">
    <h1 className="text-3xl font-bold mb-4">チーム詳細</h1>
    <p>チーム詳細ページです。</p>
  </div>
);

export const SimpleDocumentDetail: React.FC = () => (
  <div className="p-8">
    <h1 className="text-3xl font-bold mb-4">文書詳細</h1>
    <p>文書詳細ページです。</p>
  </div>
);

export const SimpleDocumentEditor: React.FC = () => {
  const [title, setTitle] = React.useState('新規文書');
  const [content, setContent] = React.useState('');
  const [category, setCategory] = React.useState('specification');
  const [tags, setTags] = React.useState<string[]>([]);
  const [newTag, setNewTag] = React.useState('');

  const addTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      setTags([...tags, newTag.trim()]);
      setNewTag('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-cyan-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-slate-800">
                  文書編集
                </h1>
                <p className="text-slate-600 mt-1">
                  新しい文書を作成または既存の文書を編集
                </p>
              </div>
              <div className="flex space-x-3">
                <button className="inline-flex items-center px-4 py-2 border border-cyan-300 rounded-md shadow-sm text-sm font-medium text-slate-700 bg-white bg-cyan-50 hover:bg-gray-50 dark:hover:bg-gray-600">
                  <Clock className="h-4 w-4 mr-2" />
                  下書き保存
                </button>
                <button className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700">
                  <Plus className="h-4 w-4 mr-2" />
                  公開
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Editor */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Editor */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-xl shadow-lg border border-cyan-200">
              <div className="p-6 border-b border-cyan-200">
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full text-2xl font-bold border-none outline-none bg-transparent text-slate-800 placeholder-gray-500"
                  placeholder="文書タイトルを入力..."
                />
              </div>
              <div className="p-6">
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="w-full h-96 border-none outline-none resize-none bg-transparent text-slate-800 placeholder-gray-500"
                  placeholder="文書の内容を入力してください..."
                />
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Document Settings */}
            <div className="bg-white rounded-xl shadow-lg border border-cyan-200 p-6">
              <h3 className="text-lg font-semibold text-slate-800 mb-4">
                文書設定
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    カテゴリ
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-3 py-2 border border-cyan-300 rounded-lg bg-white bg-cyan-50 text-slate-800"
                  >
                    <option value="specification">仕様書</option>
                    <option value="manual">マニュアル</option>
                    <option value="policy">ポリシー</option>
                    <option value="report">レポート</option>
                    <option value="meeting">議事録</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Tags */}
            <div className="bg-white rounded-xl shadow-lg border border-cyan-200 p-6">
              <h3 className="text-lg font-semibold text-slate-800 mb-4">
                タグ
              </h3>
              <div className="space-y-3">
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && addTag()}
                    className="flex-1 px-3 py-2 border border-cyan-300 rounded-lg bg-white bg-cyan-50 text-slate-800 text-sm"
                    placeholder="タグを追加..."
                  />
                  <button
                    onClick={addTag}
                    className="px-3 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 text-sm"
                  >
                    追加
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {tags.map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center px-3 py-1 text-sm bg-cyan-100 text-cyan-800 rounded-full"
                    >
                      #{tag}
                      <button
                        onClick={() => removeTag(tag)}
                        className="ml-2 text-cyan-600 hover:text-indigo-800 dark:text-indigo-300 dark:hover:text-indigo-100"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Preview Info */}
            <div className="bg-white rounded-xl shadow-lg border border-cyan-200 p-6">
              <h3 className="text-lg font-semibold text-slate-800 mb-4">
                プレビュー情報
              </h3>
              <div className="space-y-3 text-sm">
                <div>
                  <span className="text-slate-600">文字数:</span>
                  <span className="ml-2 text-slate-800">
                    {content.length} 文字
                  </span>
                </div>
                <div>
                  <span className="text-slate-600">ステータス:</span>
                  <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800 bg-cyan-50 dark:text-gray-300">
                    下書き
                  </span>
                </div>
                <div>
                  <span className="text-slate-600">最終更新:</span>
                  <span className="ml-2 text-slate-800">
                    {new Date().toLocaleDateString('ja-JP')}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export const SimpleDocumentSearch: React.FC = () => {
  const [searchQuery, setSearchQuery] = React.useState('');
  const [selectedTeam, setSelectedTeam] = React.useState('');
  const [selectedStatus, setSelectedStatus] = React.useState('');
  const [sortBy, setSortBy] = React.useState('updatedAt');

  // 風の谷プロジェクトの文書データ
  const mockDocuments = [
    { _id: '1', title: '風の谷プロジェクト全体構想書', status: 'approved', authorName: '文化・全体デザイン班', teamName: '文化・全体デザイン', category: 'specification', tags: ['構想', '全体'], updatedAt: '2024-03-01T10:00:00Z', views: 245 },
    { _id: '2', title: '持続可能エネルギーシステム設計書', status: 'review', authorName: 'エネルギー班', teamName: 'エネルギー', category: 'specification', tags: ['エネルギー', '設計'], updatedAt: '2024-02-28T14:30:00Z', views: 123 },
    { _id: '3', title: '自然共生型建築ガイドライン', status: 'approved', authorName: '空間デザイン班', teamName: '空間デザイン', category: 'guideline', tags: ['建築', '自然'], updatedAt: '2024-02-27T09:15:00Z', views: 189 },
    { _id: '4', title: '森林保全・水循環計画書', status: 'review', authorName: '森と水とトレイル班', teamName: '森と水とトレイル', category: 'plan', tags: ['森林', '水', 'トレイル'], updatedAt: '2024-02-26T16:45:00Z', views: 156 },
    { _id: '5', title: 'コミュニティ教育プログラム案', status: 'draft', authorName: '谷をつくる人をつくる班', teamName: '谷をつくる人をつくる（教育）', category: 'program', tags: ['教育', 'コミュニティ'], updatedAt: '2024-02-25T11:20:00Z', views: 78 },
    { _id: '6', title: 'IT基盤・各班連携フレームワーク', status: 'approved', authorName: 'テクノロジー班', teamName: 'テクノロジー（情報インフラ＆他領域との協働）', category: 'framework', tags: ['IT', '連携', 'インフラ'], updatedAt: '2024-02-24T13:00:00Z', views: 234 },
    { _id: '7', title: '生活オフィス空間設計指針', status: 'review', authorName: '生活オフィス空間班', teamName: '生活オフィス空間（サンゴ礁1）', category: 'guideline', tags: ['オフィス', '生活空間'], updatedAt: '2024-02-23T08:30:00Z', views: 167 },
    { _id: '8', title: '商業空間・コミュニティ統合プラン', status: 'draft', authorName: 'まち商業空間班', teamName: 'まち商業空間（サンゴ礁2）', category: 'plan', tags: ['商業', 'コミュニティ'], updatedAt: '2024-02-22T15:10:00Z', views: 145 },
    { _id: '9', title: '持続可能農業・食料システム基本方針', status: 'approved', authorName: '食と農班', teamName: '食と農', category: 'policy', tags: ['農業', '食料', '持続可能'], updatedAt: '2024-02-21T10:45:00Z', views: 198 },
    { _id: '10', title: '地域特性分析・土地活用戦略', status: 'review', authorName: '土地読み班', teamName: '土地読み（空間デザイン×文化×森）', category: 'analysis', tags: ['土地', '分析', '戦略'], updatedAt: '2024-02-20T12:15:00Z', views: 112 },
  ];

  const teams = ['文化・全体デザイン', 'エネルギー', '空間デザイン', '森と水とトレイル', '谷をつくる人をつくる（教育）', 'テクノロジー（情報インフラ＆他領域との協働）', '生活オフィス空間（サンゴ礁1）', 'まち商業空間（サンゴ礁2）', '食と農', '土地読み（空間デザイン×文化×森）'];

  const filteredDocuments = mockDocuments.filter(doc => {
    const matchesSearch = doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         doc.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesTeam = !selectedTeam || doc.teamName === selectedTeam;
    const matchesStatus = !selectedStatus || doc.status === selectedStatus;
    return matchesSearch && matchesTeam && matchesStatus;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-cyan-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-slate-800">
                  文書検索
                </h1>
                <p className="text-slate-600 mt-1">
                  {filteredDocuments.length} 件の文書が見つかりました
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="bg-white rounded-lg shadow-sm border border-cyan-200 p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search */}
            <div className="md:col-span-2 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="文書タイトル、タグで検索..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-cyan-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-indigo-500 bg-white bg-cyan-50 text-slate-800"
              />
            </div>

            {/* Team Filter */}
            <div>
              <select
                value={selectedTeam}
                onChange={(e) => setSelectedTeam(e.target.value)}
                className="w-full px-3 py-2 border border-cyan-300 rounded-lg bg-white bg-cyan-50 text-slate-800"
              >
                <option value="">すべてのチーム</option>
                {teams.map(team => (
                  <option key={team} value={team}>{team}</option>
                ))}
              </select>
            </div>

            {/* Status Filter */}
            <div>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="w-full px-3 py-2 border border-cyan-300 rounded-lg bg-white bg-cyan-50 text-slate-800"
              >
                <option value="">すべてのステータス</option>
                <option value="approved">承認済み</option>
                <option value="review">レビュー中</option>
                <option value="draft">下書き</option>
              </select>
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="space-y-4">
          {filteredDocuments.map((doc, index) => (
            <motion.div
              key={doc._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Link to={`/documents/${doc._id}`}>
                <div className="bg-white rounded-lg shadow-sm border border-cyan-200 p-6 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-slate-800 mb-2 hover:text-cyan-600">
                        {doc.title}
                      </h3>
                      <div className="flex items-center space-x-4 text-sm text-slate-500 mb-3">
                        <div className="flex items-center">
                          <User className="h-4 w-4 mr-1" />
                          {doc.authorName}
                        </div>
                        <div className="flex items-center">
                          <Clock className="h-4 w-4 mr-1" />
                          {new Date(doc.updatedAt).toLocaleDateString('ja-JP')}
                        </div>
                        <div className="flex items-center">
                          <Eye className="h-4 w-4 mr-1" />
                          {doc.views} 回表示
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                          doc.status === 'approved'
                            ? 'bg-green-100 text-green-800'
                            : doc.status === 'review'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-gray-100 text-gray-800 bg-cyan-50 dark:text-gray-300'
                        }`}>
                          {doc.status === 'approved' && <CheckCircle className="h-3 w-3 mr-1" />}
                          {doc.status === 'review' && <AlertCircle className="h-3 w-3 mr-1" />}
                          {doc.status === 'approved' ? '承認済み' : doc.status === 'review' ? 'レビュー中' : '下書き'}
                        </span>
                        <span className="text-sm text-slate-600">
                          {doc.teamName}
                        </span>
                        <div className="flex flex-wrap gap-1">
                          {doc.tags.map(tag => (
                            <span key={tag} className="inline-flex items-center px-2 py-0.5 rounded text-xs bg-cyan-100 text-cyan-800">
                              <Tag className="h-3 w-3 mr-1" />
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                    <FileText className="h-6 w-6 text-gray-400 ml-4" />
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {filteredDocuments.length === 0 && (
          <div className="bg-white rounded-lg shadow-sm border border-cyan-200 p-12 text-center">
            <Search className="h-16 w-16 text-slate-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-slate-800 mb-2">
              文書が見つかりませんでした
            </h3>
            <p className="text-slate-500">
              検索条件を変更してお試しください。
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export const SimpleKnowledgeGraph: React.FC = () => {
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [filterTeam, setFilterTeam] = useState<string>('all');

  // Mock teams data
  const mockTeams = [
    { _id: '1', name: '文化・全体デザイン', color: '#8b5cf6', icon: '🌸' },
    { _id: '2', name: '空間デザイン', color: '#06b6d4', icon: '🏗️' },
    { _id: '3', name: 'エネルギー', color: '#eab308', icon: '⚡' },
    { _id: '4', name: '森と水とトレイル', color: '#22c55e', icon: '🌲' },
    { _id: '5', name: '生活オフィス空間（サンゴ礁1）', color: '#f97316', icon: '🏠' },
    { _id: '6', name: 'まち商業空間（サンゴ礁2）', color: '#ec4899', icon: '🏪' },
    { _id: '7', name: '食と農', color: '#84cc16', icon: '🌾' },
    { _id: '8', name: 'JOL & PPK（ヘルスケア）', color: '#ef4444', icon: '🏥' },
    { _id: '9', name: '谷をつくる人をつくる（教育）', color: '#8b5cf6', icon: '🎓' },
    { _id: '10', name: 'テクノロジー（情報インフラ＆他領域との協働）', color: '#6b7280', icon: '💻' },
    { _id: '11', name: '土地読み（空間デザイン×文化×森）', color: '#a855f7', icon: '🗺️' },
  ];

  // Mock graph data
  const mockNodes = [
    { id: '1', title: 'エネルギー基本計画書', team: 'エネルギー', connections: 8, type: 'document' },
    { id: '2', title: '空間デザイン設計図', team: '空間デザイン', connections: 12, type: 'document' },
    { id: '3', title: '森林保全ガイドライン', team: '森と水とトレイル', connections: 6, type: 'document' },
    { id: '4', title: '文化活動方針', team: '文化・全体デザイン', connections: 15, type: 'document' },
    { id: '5', title: '食料生産計画', team: '食と農', connections: 9, type: 'document' },
    { id: '6', title: 'ヘルスケア基準', team: 'JOL & PPK（ヘルスケア）', connections: 7, type: 'document' },
    { id: '7', title: '教育プログラム', team: '谷をつくる人をつくる（教育）', connections: 11, type: 'document' },
    { id: '8', title: 'テクノロジー戦略', team: 'テクノロジー（情報インフラ＆他領域との協働）', connections: 20, type: 'document' },
    { id: '9', title: '持続可能性', team: 'multiple', connections: 25, type: 'concept' },
    { id: '10', title: '地域連携', team: 'multiple', connections: 18, type: 'concept' },
  ];

  const mockConnections = [
    { from: '1', to: '9', strength: 'strong' },
    { from: '2', to: '9', strength: 'medium' },
    { from: '3', to: '9', strength: 'strong' },
    { from: '4', to: '10', strength: 'strong' },
    { from: '5', to: '9', strength: 'medium' },
    { from: '6', to: '7', strength: 'medium' },
    { from: '7', to: '10', strength: 'strong' },
    { from: '8', to: '9', strength: 'strong' },
    { from: '8', to: '10', strength: 'medium' },
    { from: '1', to: '2', strength: 'weak' },
    { from: '2', to: '3', strength: 'medium' },
    { from: '4', to: '7', strength: 'strong' },
    { from: '5', to: '3', strength: 'medium' },
  ];

  const filteredNodes = filterTeam === 'all'
    ? mockNodes
    : mockNodes.filter(node => node.team === filterTeam || node.team === 'multiple');

  const getNodeColor = (team: string, type: string) => {
    if (type === 'concept') return '#8b5cf6'; // Purple for concepts
    const teamColors: { [key: string]: string } = {
      '文化・全体デザイン': '#e91e63',
      '空間デザイン': '#2196f3',
      'エネルギー': '#ff9800',
      '森と水とトレイル': '#4caf50',
      '食と農': '#8bc34a',
      'JOL & PPK（ヘルスケア）': '#f44336',
      '谷をつくる人をつくる（教育）': '#9c27b0',
      'テクノロジー（情報インフラ＆他領域との協働）': '#607d8b',
    };
    return teamColors[team] || '#6b7280';
  };

  return (
    <div className="min-h-screen bg-cyan-50 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-800 mb-4">
            ナレッジグラフ
          </h1>
          <p className="text-slate-600 mb-6">
            文書とコンセプトの関係性を視覚的に探索できます
          </p>

          <div className="flex items-center space-x-4 mb-6">
            <select
              value={filterTeam}
              onChange={(e) => setFilterTeam(e.target.value)}
              className="px-4 py-2 border border-cyan-300 rounded-lg bg-white text-slate-800"
            >
              <option value="all">すべてのチーム</option>
              {mockTeams.map(team => (
                <option key={team._id} value={team.name}>{team.name}</option>
              ))}
            </select>

            <div className="flex items-center space-x-4 text-sm text-slate-600">
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-blue-500 mr-2"></div>
                文書
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-purple-500 mr-2"></div>
                コンセプト
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Graph Visualization */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm border border-cyan-200 p-6">
              <h2 className="text-lg font-semibold text-slate-800 mb-4">
                関係性マップ
              </h2>

              {/* Mock SVG Graph */}
              <div className="relative h-96 bg-cyan-50 rounded-lg overflow-hidden">
                <svg width="100%" height="100%" className="absolute inset-0">
                  {/* Connections */}
                  {mockConnections.map((conn, index) => {
                    const fromNode = filteredNodes.find(n => n.id === conn.from);
                    const toNode = filteredNodes.find(n => n.id === conn.to);
                    if (!fromNode || !toNode) return null;

                    const x1 = (parseInt(conn.from) * 80) % 600 + 50;
                    const y1 = (parseInt(conn.from) * 60) % 300 + 50;
                    const x2 = (parseInt(conn.to) * 80) % 600 + 50;
                    const y2 = (parseInt(conn.to) * 60) % 300 + 50;

                    return (
                      <line
                        key={index}
                        x1={x1}
                        y1={y1}
                        x2={x2}
                        y2={y2}
                        stroke={conn.strength === 'strong' ? '#4f46e5' : conn.strength === 'medium' ? '#6b7280' : '#d1d5db'}
                        strokeWidth={conn.strength === 'strong' ? 3 : conn.strength === 'medium' ? 2 : 1}
                        opacity={0.7}
                      />
                    );
                  })}

                  {/* Nodes */}
                  {filteredNodes.map((node) => {
                    const x = (parseInt(node.id) * 80) % 600 + 50;
                    const y = (parseInt(node.id) * 60) % 300 + 50;
                    const radius = Math.max(8, Math.min(20, node.connections));

                    return (
                      <g key={node.id}>
                        <circle
                          cx={x}
                          cy={y}
                          r={radius}
                          fill={getNodeColor(node.team, node.type)}
                          stroke={selectedNode === node.id ? '#1f2937' : 'none'}
                          strokeWidth={selectedNode === node.id ? 3 : 0}
                          className="cursor-pointer hover:opacity-80 transition-opacity"
                          onClick={() => setSelectedNode(selectedNode === node.id ? null : node.id)}
                        />
                        <text
                          x={x}
                          y={y + radius + 15}
                          textAnchor="middle"
                          className="text-xs fill-slate-700 pointer-events-none"
                          fontSize="10"
                        >
                          {node.title.length > 12 ? node.title.substring(0, 12) + '...' : node.title}
                        </text>
                      </g>
                    );
                  })}
                </svg>
              </div>

              <div className="mt-4 text-sm text-slate-500">
                ノードをクリックして詳細を表示
              </div>
            </div>
          </div>

          {/* Node Details */}
          <div className="space-y-6">
            {selectedNode ? (
              <div className="bg-white rounded-lg shadow-sm border border-cyan-200 p-6">
                {(() => {
                  const node = mockNodes.find(n => n.id === selectedNode);
                  if (!node) return null;

                  return (
                    <>
                      <h3 className="text-lg font-semibold text-slate-800 mb-4">
                        {node.title}
                      </h3>

                      <div className="space-y-3">
                        <div>
                          <span className="text-sm font-medium text-slate-700">タイプ:</span>
                          <span className="ml-2 text-sm text-slate-600">
                            {node.type === 'document' ? '文書' : 'コンセプト'}
                          </span>
                        </div>

                        <div>
                          <span className="text-sm font-medium text-slate-700">チーム:</span>
                          <span className="ml-2 text-sm text-slate-600">
                            {node.team === 'multiple' ? '複数チーム' : node.team}
                          </span>
                        </div>

                        <div>
                          <span className="text-sm font-medium text-slate-700">関連性:</span>
                          <span className="ml-2 text-sm text-slate-600">
                            {node.connections} 個の関連項目
                          </span>
                        </div>
                      </div>

                      <div className="mt-4">
                        <h4 className="text-sm font-medium text-slate-700 mb-2">関連する項目</h4>
                        <div className="space-y-2">
                          {mockConnections
                            .filter(conn => conn.from === selectedNode || conn.to === selectedNode)
                            .slice(0, 5)
                            .map((conn, index) => {
                              const relatedId = conn.from === selectedNode ? conn.to : conn.from;
                              const relatedNode = mockNodes.find(n => n.id === relatedId);
                              return relatedNode ? (
                                <div
                                  key={index}
                                  className="text-sm text-cyan-600 hover:text-cyan-800 cursor-pointer"
                                  onClick={() => setSelectedNode(relatedId)}
                                >
                                  {relatedNode.title}
                                </div>
                              ) : null;
                            })}
                        </div>
                      </div>
                    </>
                  );
                })()}
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow-sm border border-cyan-200 p-6">
                <h3 className="text-lg font-semibold text-slate-800 mb-4">
                  ノード詳細
                </h3>
                <p className="text-slate-500 text-center py-8">
                  グラフ上のノードをクリックして詳細を表示
                </p>
              </div>
            )}

            {/* Graph Statistics */}
            <div className="bg-white rounded-lg shadow-sm border border-cyan-200 p-6">
              <h3 className="text-lg font-semibold text-slate-800 mb-4">
                グラフ統計
              </h3>

              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-slate-600">総ノード数:</span>
                  <span className="text-sm font-medium text-slate-800">{filteredNodes.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-slate-600">総接続数:</span>
                  <span className="text-sm font-medium text-slate-800">{mockConnections.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-slate-600">文書数:</span>
                  <span className="text-sm font-medium text-slate-800">
                    {filteredNodes.filter(n => n.type === 'document').length}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-slate-600">コンセプト数:</span>
                  <span className="text-sm font-medium text-slate-800">
                    {filteredNodes.filter(n => n.type === 'concept').length}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export const SimpleMyPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'profile' | 'documents' | 'activity' | 'settings'>('profile');

  // Mock user data
  const mockUser = {
    id: '1',
    name: '田中 太郎',
    email: 'tanaka@kazenotani.jp',
    role: 'メンバー',
    team: 'テクノロジー（情報インフラ＆他領域との協働）',
    joinDate: '2024-01-15',
    avatar: 'https://via.placeholder.com/150',
    bio: '風の谷プロジェクトにおいて、情報インフラの構築と他領域との連携を担当しています。',
    stats: {
      documentsCreated: 24,
      documentsEdited: 67,
      commentsPosted: 156,
      projectsJoined: 8,
    }
  };

  const mockRecentDocuments = [
    { id: '1', title: 'システム設計書 v2.1', updatedAt: '2024-01-28', status: 'approved' },
    { id: '2', title: 'API仕様書', updatedAt: '2024-01-27', status: 'review' },
    { id: '3', title: 'データベース設計', updatedAt: '2024-01-25', status: 'draft' },
    { id: '4', title: 'セキュリティガイドライン', updatedAt: '2024-01-24', status: 'approved' },
  ];

  const mockRecentActivity = [
    { id: '1', type: 'document_created', content: '「API仕様書」を作成しました', timestamp: '2024-01-28 14:30' },
    { id: '2', type: 'document_approved', content: '「システム設計書 v2.1」が承認されました', timestamp: '2024-01-28 10:15' },
    { id: '3', type: 'comment_posted', content: '「データベース設計」にコメントしました', timestamp: '2024-01-27 16:45' },
    { id: '4', type: 'document_edited', content: '「セキュリティガイドライン」を編集しました', timestamp: '2024-01-27 09:20' },
  ];

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'document_created': return <FileText className="h-4 w-4 text-green-500" />;
      case 'document_approved': return <CheckCircle className="h-4 w-4 text-blue-500" />;
      case 'comment_posted': return <MessageCircle className="h-4 w-4 text-purple-500" />;
      case 'document_edited': return <Edit className="h-4 w-4 text-orange-500" />;
      default: return <Activity className="h-4 w-4 text-gray-500" />;
    }
  };

  return (
    <div className="min-h-screen bg-cyan-50 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-800 mb-4">
            マイページ
          </h1>
          <p className="text-slate-600">
            プロフィール情報と活動履歴を確認できます
          </p>
        </div>

        {/* Profile Header */}
        <div className="bg-white rounded-lg shadow-sm border border-cyan-200 p-6 mb-8">
          <div className="flex items-center space-x-6">
            <div className="relative">
              <div className="w-24 h-24 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                {mockUser.name.charAt(0)}
              </div>
              <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 border-2 border-white border-white rounded-full"></div>
            </div>

            <div className="flex-1">
              <h2 className="text-2xl font-bold text-slate-800 mb-2">
                {mockUser.name}
              </h2>
              <div className="space-y-1 text-sm text-slate-600">
                <div className="flex items-center">
                  <Mail className="h-4 w-4 mr-2" />
                  {mockUser.email}
                </div>
                <div className="flex items-center">
                  <Users className="h-4 w-4 mr-2" />
                  {mockUser.team}
                </div>
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-2" />
                  参加日: {new Date(mockUser.joinDate).toLocaleDateString('ja-JP')}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 text-center">
              <div className="bg-cyan-50 rounded-lg p-4">
                <div className="text-2xl font-bold text-cyan-600">
                  {mockUser.stats.documentsCreated}
                </div>
                <div className="text-sm text-slate-600">作成文書</div>
              </div>
              <div className="bg-cyan-50 rounded-lg p-4">
                <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                  {mockUser.stats.documentsEdited}
                </div>
                <div className="text-sm text-slate-600">編集協力</div>
              </div>
            </div>
          </div>

          {mockUser.bio && (
            <div className="mt-6 pt-6 border-t border-cyan-200">
              <p className="text-slate-700">{mockUser.bio}</p>
            </div>
          )}
        </div>

        {/* Tabs */}
        <div className="mb-6">
          <div className="flex space-x-1 bg-cyan-100 rounded-lg p-1">
            {[
              { id: 'profile', label: 'プロフィール', icon: User },
              { id: 'documents', label: '文書', icon: FileText },
              { id: 'activity', label: '活動履歴', icon: Activity },
              { id: 'settings', label: '設定', icon: Settings },
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center px-4 py-2 rounded-md transition-colors ${
                    activeTab === tab.id
                      ? 'bg-white bg-cyan-50 text-cyan-600 shadow-sm'
                      : 'text-slate-600 hover:text-slate-800'
                  }`}
                >
                  <Icon className="h-4 w-4 mr-2" />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Tab Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {activeTab === 'profile' && (
            <>
              <div className="lg:col-span-2 space-y-6">
                {/* Profile Information */}
                <div className="bg-white rounded-lg shadow-sm border border-cyan-200 p-6">
                  <h3 className="text-lg font-semibold text-slate-800 mb-4">
                    基本情報
                  </h3>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">
                          氏名
                        </label>
                        <div className="text-slate-800">{mockUser.name}</div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">
                          メールアドレス
                        </label>
                        <div className="text-slate-800">{mockUser.email}</div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">
                          所属チーム
                        </label>
                        <div className="text-slate-800">{mockUser.team}</div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">
                          役割
                        </label>
                        <div className="text-slate-800">{mockUser.role}</div>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">
                        自己紹介
                      </label>
                      <div className="text-slate-800">{mockUser.bio}</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                {/* Statistics */}
                <div className="bg-white rounded-lg shadow-sm border border-cyan-200 p-6">
                  <h3 className="text-lg font-semibold text-slate-800 mb-4">
                    活動統計
                  </h3>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-slate-600">作成した文書</span>
                      <span className="font-semibold text-slate-800">
                        {mockUser.stats.documentsCreated}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-slate-600">編集に参加</span>
                      <span className="font-semibold text-slate-800">
                        {mockUser.stats.documentsEdited}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-slate-600">投稿コメント</span>
                      <span className="font-semibold text-slate-800">
                        {mockUser.stats.commentsPosted}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-slate-600">参加プロジェクト</span>
                      <span className="font-semibold text-slate-800">
                        {mockUser.stats.projectsJoined}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}

          {activeTab === 'documents' && (
            <div className="lg:col-span-3">
              <div className="bg-white rounded-lg shadow-sm border border-cyan-200 p-6">
                <h3 className="text-lg font-semibold text-slate-800 mb-4">
                  最近の文書
                </h3>
                <div className="space-y-4">
                  {mockRecentDocuments.map((doc) => (
                    <div
                      key={doc.id}
                      className="flex items-center justify-between p-4 bg-cyan-50 rounded-lg hover:bg-cyan-100 transition-colors cursor-pointer"
                    >
                      <div className="flex items-center space-x-3">
                        <FileText className="h-5 w-5 text-gray-400" />
                        <div>
                          <div className="font-medium text-slate-800">
                            {doc.title}
                          </div>
                          <div className="text-sm text-slate-500">
                            {new Date(doc.updatedAt).toLocaleDateString('ja-JP')}
                          </div>
                        </div>
                      </div>
                      <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${
                        doc.status === 'approved'
                          ? 'bg-green-100 text-green-800'
                          : doc.status === 'review'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {doc.status === 'approved' ? '承認済み' : doc.status === 'review' ? 'レビュー中' : '下書き'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'activity' && (
            <div className="lg:col-span-3">
              <div className="bg-white rounded-lg shadow-sm border border-cyan-200 p-6">
                <h3 className="text-lg font-semibold text-slate-800 mb-4">
                  最近の活動
                </h3>
                <div className="space-y-4">
                  {mockRecentActivity.map((activity) => (
                    <div key={activity.id} className="flex items-start space-x-3 p-4 bg-cyan-50 rounded-lg">
                      <div className="flex-shrink-0 mt-0.5">
                        {getActivityIcon(activity.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm text-slate-800">
                          {activity.content}
                        </div>
                        <div className="text-xs text-slate-500 mt-1">
                          {activity.timestamp}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="lg:col-span-3">
              <div className="bg-white rounded-lg shadow-sm border border-cyan-200 p-6">
                <h3 className="text-lg font-semibold text-slate-800 mb-4">
                  設定
                </h3>
                <div className="space-y-6">
                  <div>
                    <h4 className="text-md font-medium text-slate-800 mb-3">
                      通知設定
                    </h4>
                    <div className="space-y-3">
                      <label className="flex items-center">
                        <input type="checkbox" defaultChecked className="rounded border-gray-300 text-cyan-600 focus:ring-cyan-500" />
                        <span className="ml-2 text-sm text-slate-700">
                          文書の承認要求
                        </span>
                      </label>
                      <label className="flex items-center">
                        <input type="checkbox" defaultChecked className="rounded border-gray-300 text-cyan-600 focus:ring-cyan-500" />
                        <span className="ml-2 text-sm text-slate-700">
                          コメントへの返信
                        </span>
                      </label>
                      <label className="flex items-center">
                        <input type="checkbox" className="rounded border-gray-300 text-cyan-600 focus:ring-cyan-500" />
                        <span className="ml-2 text-sm text-slate-700">
                          新しい文書の投稿
                        </span>
                      </label>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-md font-medium text-slate-800 mb-3">
                      表示設定
                    </h4>
                    <div className="space-y-3">
                      <label className="flex items-center">
                        <input type="checkbox" defaultChecked className="rounded border-gray-300 text-cyan-600 focus:ring-cyan-500" />
                        <span className="ml-2 text-sm text-slate-700">
                          ダークモード
                        </span>
                      </label>
                      <label className="flex items-center">
                        <input type="checkbox" defaultChecked className="rounded border-gray-300 text-cyan-600 focus:ring-cyan-500" />
                        <span className="ml-2 text-sm text-slate-700">
                          アニメーション効果
                        </span>
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};