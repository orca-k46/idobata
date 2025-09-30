import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import {
  Users,
  FileText,
  Settings,
  Plus,
  Calendar,
  Activity,
  TrendingUp,
  Clock,
  Edit,
  MoreVertical,
} from 'lucide-react';
import { teamApi } from '../services/api';

const TeamDetail: React.FC = () => {
  const { teamId } = useParams<{ teamId: string }>();

  const { data: team, isLoading, error } = useQuery({
    queryKey: ['team', teamId],
    queryFn: () => teamApi.getDetail(teamId!),
    enabled: !!teamId,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mb-4"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-8"></div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
                  <div className="h-16 bg-gray-200 dark:bg-gray-700 rounded mb-4"></div>
                  <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !team) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            チームが見つかりませんでした
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            指定されたチームは存在しないか、アクセス権限がありません。
          </p>
          <Link
            to="/teams"
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
          >
            チーム一覧に戻る
          </Link>
        </div>
      </div>
    );
  }

  const stats = [
    {
      title: 'メンバー数',
      value: team.statistics?.memberCount || 0,
      icon: Users,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100 dark:bg-blue-900',
    },
    {
      title: '総文書数',
      value: team.statistics?.documentCount || 0,
      icon: FileText,
      color: 'text-green-600',
      bgColor: 'bg-green-100 dark:bg-green-900',
    },
    {
      title: '承認済み文書',
      value: team.statistics?.statusCounts?.approved || 0,
      icon: TrendingUp,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100 dark:bg-purple-900',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div
                  className="w-16 h-16 rounded-xl flex items-center justify-center text-white text-2xl mr-6"
                  style={{ backgroundColor: team.color }}
                >
                  {team.icon}
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                    {team.name}
                  </h1>
                  <p className="text-gray-600 dark:text-gray-300 mt-1">
                    {team.description || 'このチームの説明はまだありません。'}
                  </p>
                  <div className="flex items-center mt-2 text-sm text-gray-500 dark:text-gray-400">
                    <Calendar className="h-4 w-4 mr-1" />
                    作成日: {new Date(team.createdAt).toLocaleDateString('ja-JP')}
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <Link
                  to={`/documents/new?teamId=${team._id}`}
                  className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  新規文書
                </Link>
                <button className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                  <Settings className="h-4 w-4 mr-2" />
                  設定
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700"
            >
              <div className="flex items-center">
                <div className={`flex-shrink-0 ${stat.bgColor} rounded-lg p-3`}>
                  <stat.icon className={`h-6 w-6 ${stat.color}`} />
                </div>
                <div className="ml-4 flex-1">
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    {stat.title}
                  </p>
                  <p className="text-3xl font-bold text-gray-900 dark:text-white">
                    {stat.value}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Documents */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700"
            >
              <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center">
                    <Clock className="h-5 w-5 mr-2" />
                    最近の文書
                  </h2>
                  <Link
                    to={`/documents/search?team=${team._id}`}
                    className="text-indigo-600 hover:text-indigo-500 text-sm font-medium"
                  >
                    すべて表示
                  </Link>
                </div>
              </div>
              <div className="p-6">
                {team.recentDocuments && team.recentDocuments.length > 0 ? (
                  <div className="space-y-4">
                    {team.recentDocuments.map((doc) => (
                      <Link
                        key={doc._id}
                        to={`/documents/${doc._id}`}
                        className="block p-4 border border-gray-200 dark:border-gray-600 rounded-lg hover:border-indigo-500 hover:shadow-md transition-all duration-200"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h3 className="font-medium text-gray-900 dark:text-white">
                              {doc.title}
                            </h3>
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
                              <span className="text-sm text-gray-500 dark:text-gray-400">
                                {new Date(doc.updatedAt).toLocaleDateString('ja-JP')}
                              </span>
                            </div>
                            {doc.tags && doc.tags.length > 0 && (
                              <div className="flex flex-wrap gap-1 mt-2">
                                {doc.tags.slice(0, 3).map((tag) => (
                                  <span
                                    key={tag}
                                    className="inline-block px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded"
                                  >
                                    #{tag}
                                  </span>
                                ))}
                                {doc.tags.length > 3 && (
                                  <span className="text-xs text-gray-400">
                                    +{doc.tags.length - 3} more
                                  </span>
                                )}
                              </div>
                            )}
                          </div>
                          <div className="flex items-center space-x-2">
                            <FileText className="h-4 w-4 text-gray-400" />
                            <button className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                              <MoreVertical className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <FileText className="h-12 w-12 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                      まだ文書がありません
                    </h3>
                    <p className="text-gray-500 dark:text-gray-400 mb-4">
                      このチームの最初の文書を作成してみましょう。
                    </p>
                    <Link
                      to={`/documents/new?teamId=${team._id}`}
                      className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      新規文書作成
                    </Link>
                  </div>
                )}
              </div>
            </motion.div>
          </div>

          {/* Team Members */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700"
          >
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center">
                  <Users className="h-5 w-5 mr-2" />
                  チームメンバー
                </h2>
                <button className="text-indigo-600 hover:text-indigo-500 text-sm font-medium">
                  <Plus className="h-4 w-4" />
                </button>
              </div>
            </div>
            <div className="p-6">
              {team.members && team.members.length > 0 ? (
                <div className="space-y-4">
                  {team.members.map((member) => (
                    <div key={member.userId} className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-gray-300 dark:bg-gray-600 rounded-full flex items-center justify-center">
                        <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
                          {member.userName.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          {member.userName}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {member.role === 'leader' ? 'リーダー' :
                           member.role === 'member' ? 'メンバー' : 'ビューワー'}
                        </p>
                      </div>
                      <div className="text-xs text-gray-400">
                        {new Date(member.joinedAt).toLocaleDateString('ja-JP')}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Users className="h-8 w-8 text-gray-300 dark:text-gray-600 mx-auto mb-2" />
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                    まだメンバーがいません
                  </p>
                  <button className="text-indigo-600 hover:text-indigo-500 text-sm font-medium">
                    メンバーを招待
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        </div>

        {/* Activity Timeline */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-8 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700"
        >
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center">
              <Activity className="h-5 w-5 mr-2" />
              最近のアクティビティ
            </h2>
          </div>
          <div className="p-6">
            <div className="text-center py-8">
              <Activity className="h-8 w-8 text-gray-300 dark:text-gray-600 mx-auto mb-2" />
              <p className="text-sm text-gray-500 dark:text-gray-400">
                最近のアクティビティはありません
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default TeamDetail;