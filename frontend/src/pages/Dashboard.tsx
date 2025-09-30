import React from 'react';
import { useQuery } from '@tanstack/react-query';
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
} from 'lucide-react';
import { teamApi, documentApi } from '../services/api';
import { useAppStore, useAppActions } from '../stores/appStore';

const Dashboard: React.FC = () => {
  const { user, teams, recentDocuments } = useAppStore();
  const { setTeams, setRecentDocuments } = useAppActions();

  // Fetch teams
  const { data: teamsData, isLoading: teamsLoading } = useQuery({
    queryKey: ['teams'],
    queryFn: teamApi.getAll,
    onSuccess: (data) => setTeams(data),
  });

  // Fetch recent documents
  const { data: documentsData, isLoading: documentsLoading } = useQuery({
    queryKey: ['documents', 'recent'],
    queryFn: () => documentApi.getAll({ limit: 10, sortBy: 'updatedAt', sortOrder: 'desc' }),
    onSuccess: (data) => setRecentDocuments(data.documents as any[]),
  });

  const statsCards = [
    {
      title: 'チーム総数',
      value: teamsData?.length || 0,
      icon: Users,
      color: 'bg-blue-500',
      href: '/teams',
    },
    {
      title: '総文書数',
      value: documentsData?.pagination.total || 0,
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
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                  風の谷 文書管理システム
                </h1>
                <p className="text-gray-600 dark:text-gray-300 mt-1">
                  ようこそ、{user?.name || 'ユーザー'}さん
                </p>
              </div>
              <div className="flex space-x-4">
                <Link
                  to="/documents/new"
                  className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  新規文書
                </Link>
                <Link
                  to="/documents/search"
                  className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
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
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-200 p-6 border border-gray-200 dark:border-gray-700">
                  <div className="flex items-center">
                    <div className={`flex-shrink-0 ${stat.color} rounded-lg p-3`}>
                      <stat.icon className="h-6 w-6 text-white" />
                    </div>
                    <div className="ml-4 flex-1">
                      <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                        {stat.title}
                      </p>
                      <p className="text-2xl font-semibold text-gray-900 dark:text-white">
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
            className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700"
          >
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center">
                  <Users className="h-5 w-5 mr-2" />
                  チーム一覧
                </h2>
                <Link
                  to="/teams"
                  className="text-indigo-600 hover:text-indigo-500 text-sm font-medium"
                >
                  すべて表示
                </Link>
              </div>
            </div>
            <div className="p-6">
              {teamsLoading ? (
                <div className="space-y-3">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="animate-pulse flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
                      <div className="flex-1">
                        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                        <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mt-1"></div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-4">
                  {teamsData?.slice(0, 5).map((team) => (
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
                        <p className="font-medium text-gray-900 dark:text-white">
                          {team.name}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {team.memberCount} メンバー • {team.documentCount} 文書
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </motion.div>

          {/* Recent Documents */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700"
          >
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center">
                  <Clock className="h-5 w-5 mr-2" />
                  最近の文書
                </h2>
                <Link
                  to="/documents/search"
                  className="text-indigo-600 hover:text-indigo-500 text-sm font-medium"
                >
                  すべて表示
                </Link>
              </div>
            </div>
            <div className="p-6">
              {documentsLoading ? (
                <div className="space-y-3">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="animate-pulse">
                      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                      <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mt-1"></div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-4">
                  {documentsData?.documents.slice(0, 8).map((doc) => (
                    <Link
                      key={doc._id}
                      to={`/documents/${doc._id}`}
                      className="block p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-150"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <p className="font-medium text-gray-900 dark:text-white line-clamp-1">
                            {doc.title}
                          </p>
                          <div className="flex items-center space-x-2 mt-1">
                            <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                              doc.status === 'approved'
                                ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                                : doc.status === 'review'
                                ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                                : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                            }`}>
                              {doc.status}
                            </span>
                            <span className="text-sm text-gray-500 dark:text-gray-400">
                              {doc.authorName}
                            </span>
                          </div>
                        </div>
                        <FileText className="h-4 w-4 text-gray-400 mt-1" />
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        </div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-8 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700"
        >
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
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
                  <h3 className="font-medium text-gray-900 dark:text-white">
                    ナレッジグラフ
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
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
                  <h3 className="font-medium text-gray-900 dark:text-white">
                    高度な検索
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
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
                  <h3 className="font-medium text-gray-900 dark:text-white">
                    使い方ガイド
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
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

export default Dashboard;