import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Edit,
  Share2,
  Clock,
  User,
  Tag,
  GitBranch,
  Eye,
  MoreVertical,
  ChevronLeft,
  CheckCircle,
  AlertCircle,
  FileText,
} from 'lucide-react';

const DocumentDetail: React.FC = () => {
  const { documentId } = useParams<{ documentId: string }>();

  // Mock data for now - will be replaced with actual API call
  const document = {
    _id: documentId,
    title: 'サンプル文書',
    content: `# サンプル文書

これは文書管理システムのサンプル文書です。

## 概要

この文書では、風の谷プロジェクトの文書管理システムの使い方について説明します。

## 機能

- **バージョン管理**: 文書の変更履歴を追跡
- **協同編集**: チームメンバーとの共同作業
- **タグ付け**: 文書の分類と検索
- **承認フロー**: 品質保証のためのレビュープロセス

## 使用方法

1. 新規文書を作成
2. 内容を編集
3. レビューを依頼
4. 承認後に公開

詳細な使用方法については、各機能のドキュメントを参照してください。`,
    status: 'approved',
    category: 'specification',
    tags: ['サンプル', '使い方', 'ガイド'],
    authorName: '田中太郎',
    version: 3,
    teamId: {
      _id: 'team1',
      name: 'テクノロジー',
      color: '#6366f1',
      icon: '💻'
    },
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-20T14:30:00Z',
    statistics: {
      views: 45,
      editCount: 7,
    },
    relatedDocuments: [
      {
        _id: 'doc2',
        title: '関連文書1',
        relationType: 'reference'
      },
      {
        _id: 'doc3',
        title: '関連文書2',
        relationType: 'similar'
      }
    ]
  };

  const statusConfig = {
    draft: { color: 'gray', text: '下書き', icon: FileText },
    review: { color: 'yellow', text: 'レビュー中', icon: AlertCircle },
    approved: { color: 'green', text: '承認済み', icon: CheckCircle },
    archived: { color: 'red', text: 'アーカイブ', icon: FileText }
  };

  const config = statusConfig[document.status as keyof typeof statusConfig];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-cyan-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-6">
            <div className="flex items-center mb-4">
              <Link
                to="/documents/search"
                className="flex items-center text-cyan-600 hover:text-cyan-800 mr-4"
              >
                <ChevronLeft className="h-5 w-5 mr-1" />
                文書一覧に戻る
              </Link>
            </div>

            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  <h1 className="text-3xl font-bold text-cyan-800">
                    {document.title}
                  </h1>
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                    config.color === 'green'
                      ? 'bg-green-100 text-green-800'
                      : config.color === 'yellow'
                      ? 'bg-yellow-100 text-yellow-800'
                      : config.color === 'red'
                      ? 'bg-red-100 text-red-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    <config.icon className="h-4 w-4 mr-1" />
                    {config.text}
                  </span>
                </div>

                <div className="flex items-center space-x-6 text-sm text-cyan-600 mb-4">
                  <div className="flex items-center">
                    <User className="h-4 w-4 mr-1" />
                    {document.authorName}
                  </div>
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-1" />
                    更新: {new Date(document.updatedAt).toLocaleDateString('ja-JP')}
                  </div>
                  <div className="flex items-center">
                    <GitBranch className="h-4 w-4 mr-1" />
                    バージョン {document.version}
                  </div>
                  <div className="flex items-center">
                    <Eye className="h-4 w-4 mr-1" />
                    {document.statistics.views} 回表示
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <div
                    className="w-6 h-6 rounded flex items-center justify-center text-white text-sm"
                    style={{ backgroundColor: document.teamId.color }}
                  >
                    {document.teamId.icon}
                  </div>
                  <span className="text-sm text-cyan-600">
                    {document.teamId.name}
                  </span>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <Link
                  to={`/documents/${document._id}/edit`}
                  className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-cyan-600 hover:bg-cyan-700"
                >
                  <Edit className="h-4 w-4 mr-2" />
                  編集
                </Link>
                <button className="inline-flex items-center px-4 py-2 border border-cyan-300 rounded-md shadow-sm text-sm font-medium text-cyan-700 bg-white hover:bg-cyan-50">
                  <Share2 className="h-4 w-4 mr-2" />
                  共有
                </button>
                <button className="inline-flex items-center p-2 border border-cyan-300 rounded-md shadow-sm text-cyan-400 bg-white hover:bg-cyan-50">
                  <MoreVertical className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-xl shadow-lg border border-cyan-200"
            >
              <div className="p-8">
                <div className="prose prose-lg dark:prose-invert max-w-none">
                  {document.content.split('\n').map((line, index) => {
                    if (line.startsWith('# ')) {
                      return (
                        <h1 key={index} className="text-3xl font-bold text-cyan-900 mb-4">
                          {line.substring(2)}
                        </h1>
                      );
                    } else if (line.startsWith('## ')) {
                      return (
                        <h2 key={index} className="text-2xl font-semibold text-cyan-900 mt-8 mb-4">
                          {line.substring(3)}
                        </h2>
                      );
                    } else if (line.startsWith('- **') && line.includes('**:')) {
                      const parts = line.match(/- \*\*(.*?)\*\*: (.*)/);
                      if (parts) {
                        return (
                          <li key={index} className="mb-2">
                            <strong className="text-cyan-900">{parts[1]}</strong>: {parts[2]}
                          </li>
                        );
                      }
                    } else if (line.startsWith('- ')) {
                      return (
                        <li key={index} className="mb-1 text-cyan-700">
                          {line.substring(2)}
                        </li>
                      );
                    } else if (line.match(/^\d+\. /)) {
                      return (
                        <li key={index} className="mb-1 text-cyan-700">
                          {line.replace(/^\d+\. /, '')}
                        </li>
                      );
                    } else if (line.trim() === '') {
                      return <br key={index} />;
                    } else {
                      return (
                        <p key={index} className="mb-4 text-cyan-700 leading-relaxed">
                          {line}
                        </p>
                      );
                    }
                  })}
                </div>
              </div>
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Tags */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-xl shadow-lg border border-cyan-200 p-6"
            >
              <h3 className="text-lg font-semibold text-cyan-900 mb-4 flex items-center">
                <Tag className="h-5 w-5 mr-2" />
                タグ
              </h3>
              <div className="flex flex-wrap gap-2">
                {document.tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-block px-3 py-1 text-sm bg-cyan-100 text-cyan-800 rounded-full"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </motion.div>

            {/* Document Info */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-xl shadow-lg border border-cyan-200 p-6"
            >
              <h3 className="text-lg font-semibold text-cyan-900 mb-4">
                文書情報
              </h3>
              <div className="space-y-3 text-sm">
                <div>
                  <span className="text-cyan-600">カテゴリ:</span>
                  <span className="ml-2 text-cyan-900">仕様書</span>
                </div>
                <div>
                  <span className="text-cyan-600">作成日:</span>
                  <span className="ml-2 text-cyan-900">
                    {new Date(document.createdAt).toLocaleDateString('ja-JP')}
                  </span>
                </div>
                <div>
                  <span className="text-cyan-600">編集回数:</span>
                  <span className="ml-2 text-cyan-900">
                    {document.statistics.editCount} 回
                  </span>
                </div>
              </div>
            </motion.div>

            {/* Related Documents */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white rounded-xl shadow-lg border border-cyan-200 p-6"
            >
              <h3 className="text-lg font-semibold text-cyan-900 mb-4 flex items-center">
                <GitBranch className="h-5 w-5 mr-2" />
                関連文書
              </h3>
              <div className="space-y-3">
                {document.relatedDocuments.map((relDoc) => (
                  <Link
                    key={relDoc._id}
                    to={`/documents/${relDoc._id}`}
                    className="block p-3 border border-cyan-200 rounded-lg hover:border-cyan-500 hover:shadow-sm transition-colors"
                  >
                    <div className="flex items-center">
                      <FileText className="h-4 w-4 text-cyan-400 mr-2" />
                      <span className="text-sm text-cyan-900">
                        {relDoc.title}
                      </span>
                    </div>
                    <div className="text-xs text-cyan-500 mt-1">
                      {relDoc.relationType === 'reference' ? '参照' : '類似'}
                    </div>
                  </Link>
                ))}
              </div>
            </motion.div>

            {/* Version History */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-white rounded-xl shadow-lg border border-cyan-200 p-6"
            >
              <h3 className="text-lg font-semibold text-cyan-900 mb-4">
                バージョン履歴
              </h3>
              <div className="text-center py-4">
                <GitBranch className="h-8 w-8 text-cyan-300 mx-auto mb-2" />
                <p className="text-sm text-cyan-500">
                  バージョン履歴はまだ実装されていません
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DocumentDetail;