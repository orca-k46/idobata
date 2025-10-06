import React, { useEffect, useRef, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import * as d3 from 'd3';
import {
  Network,
  FileText,
  Users,
  Settings,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Filter,
  Info,
  Search,
  Maximize,
} from 'lucide-react';
import { documentApi, teamApi } from '../services/api';

interface Node {
  id: string;
  title: string;
  type: 'document';
  teamId?: string;
  status?: string;
  category?: string;
  tags?: string[];
  x?: number;
  y?: number;
  fx?: number | null;
  fy?: number | null;
}

interface Link {
  source: string | Node;
  target: string | Node;
  strength: number;
  type: string;
}

const KnowledgeGraph: React.FC = () => {
  const svgRef = useRef<SVGSVGElement>(null);
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  const [selectedTeam, setSelectedTeam] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(1);

  // Sample data for knowledge graph demonstration
  const mockDocuments = [
    {
      _id: '1',
      title: '風の谷プロジェクト全体構想書',
      status: 'approved',
      category: 'specification',
      tags: ['構想', '全体', '基本方針'],
      teamId: { _id: 'team1', name: '文化・全体デザイン' },
      relatedDocuments: [
        { documentId: '2', relationType: 'reference', strength: 0.9 },
        { documentId: '3', relationType: 'reference', strength: 0.8 },
        { documentId: '4', relationType: 'similar', strength: 0.7 }
      ]
    },
    {
      _id: '2',
      title: '持続可能エネルギーシステム設計書',
      status: 'approved',
      category: 'specification',
      tags: ['エネルギー', '設計', '持続可能'],
      teamId: { _id: 'team2', name: 'エネルギー' },
      relatedDocuments: [
        { documentId: '1', relationType: 'reference', strength: 0.9 },
        { documentId: '5', relationType: 'reference', strength: 0.8 },
        { documentId: '7', relationType: 'similar', strength: 0.6 }
      ]
    },
    {
      _id: '3',
      title: '自然共生型建築ガイドライン',
      status: 'approved',
      category: 'guideline',
      tags: ['建築', '自然', 'ガイドライン'],
      teamId: { _id: 'team3', name: '空間デザイン' },
      relatedDocuments: [
        { documentId: '1', relationType: 'reference', strength: 0.8 },
        { documentId: '4', relationType: 'similar', strength: 0.9 },
        { documentId: '6', relationType: 'related', strength: 0.5 }
      ]
    },
    {
      _id: '4',
      title: '森林保全・水循環計画書',
      status: 'review',
      category: 'plan',
      tags: ['森林', '水', 'トレイル', '保全'],
      teamId: { _id: 'team4', name: '森と水とトレイル' },
      relatedDocuments: [
        { documentId: '1', relationType: 'similar', strength: 0.7 },
        { documentId: '3', relationType: 'similar', strength: 0.9 },
        { documentId: '8', relationType: 'reference', strength: 0.6 }
      ]
    },
    {
      _id: '5',
      title: 'コミュニティ教育プログラム案',
      status: 'draft',
      category: 'program',
      tags: ['教育', 'コミュニティ', 'プログラム'],
      teamId: { _id: 'team5', name: '谷をつくる人をつくる（教育）' },
      relatedDocuments: [
        { documentId: '2', relationType: 'reference', strength: 0.8 },
        { documentId: '6', relationType: 'similar', strength: 0.7 },
        { documentId: '9', relationType: 'related', strength: 0.5 }
      ]
    },
    {
      _id: '6',
      title: 'IT基盤・各班連携フレームワーク',
      status: 'approved',
      category: 'framework',
      tags: ['IT', '連携', 'インフラ', 'フレームワーク'],
      teamId: { _id: 'team6', name: 'テクノロジー' },
      relatedDocuments: [
        { documentId: '3', relationType: 'related', strength: 0.5 },
        { documentId: '5', relationType: 'similar', strength: 0.7 },
        { documentId: '7', relationType: 'reference', strength: 0.8 }
      ]
    },
    {
      _id: '7',
      title: '生活オフィス空間設計指針',
      status: 'review',
      category: 'guideline',
      tags: ['オフィス', '生活空間', '設計'],
      teamId: { _id: 'team7', name: '生活オフィス空間（サンゴ礁1）' },
      relatedDocuments: [
        { documentId: '2', relationType: 'similar', strength: 0.6 },
        { documentId: '6', relationType: 'reference', strength: 0.8 },
        { documentId: '8', relationType: 'related', strength: 0.4 }
      ]
    },
    {
      _id: '8',
      title: '商業空間・コミュニティ統合プラン',
      status: 'draft',
      category: 'plan',
      tags: ['商業', 'コミュニティ', '統合'],
      teamId: { _id: 'team8', name: 'まち商業空間（サンゴ礁2）' },
      relatedDocuments: [
        { documentId: '4', relationType: 'reference', strength: 0.6 },
        { documentId: '7', relationType: 'related', strength: 0.4 },
        { documentId: '9', relationType: 'similar', strength: 0.7 }
      ]
    },
    {
      _id: '9',
      title: '持続可能農業・食料システム基本方針',
      status: 'approved',
      category: 'policy',
      tags: ['農業', '食料', '持続可能', '基本方針'],
      teamId: { _id: 'team9', name: '食と農' },
      relatedDocuments: [
        { documentId: '5', relationType: 'related', strength: 0.5 },
        { documentId: '8', relationType: 'similar', strength: 0.7 },
        { documentId: '1', relationType: 'reference', strength: 0.6 }
      ]
    }
  ];

  // Use mock data for demonstration, fallback to API data when available
  const { data: documents = mockDocuments } = useQuery({
    queryKey: ['documents'],
    queryFn: () => documentApi.getAll(),
    enabled: false, // Disable API call for now to use mock data
  });

  const { data: teams } = useQuery({
    queryKey: ['teams'],
    queryFn: teamApi.getAll,
    enabled: false, // Disable API call for now
  });

  // Process data into nodes and links
  const graphData = React.useMemo(() => {
    if (!documents) return { nodes: [], links: [] };

    const nodes: Node[] = [];
    const links: Link[] = [];

    // Add document nodes only
    documents.forEach((doc: any) => {
      if (selectedTeam && doc.teamId?._id !== selectedTeam) return;
      if (selectedCategory && doc.category !== selectedCategory) return;
      if (searchQuery && !doc.title.toLowerCase().includes(searchQuery.toLowerCase())) return;

      nodes.push({
        id: doc._id,
        title: doc.title,
        type: 'document',
        teamId: doc.teamId?._id,
        status: doc.status,
        category: doc.category,
        tags: doc.tags,
      });
    });

    // Links between related documents only
    documents.forEach((doc: any) => {
      if (selectedTeam && doc.teamId?._id !== selectedTeam) return;
      if (selectedCategory && doc.category !== selectedCategory) return;
      if (searchQuery && !doc.title.toLowerCase().includes(searchQuery.toLowerCase())) return;

      if (doc.relatedDocuments) {
        doc.relatedDocuments.forEach((rel: any) => {
          const targetExists = nodes.find(n => n.id === rel.documentId);
          if (targetExists) {
            links.push({
              source: doc._id,
              target: rel.documentId,
              strength: rel.strength || 0.5,
              type: rel.relationType || 'related',
            });
          }
        });
      }
    });

    return { nodes, links };
  }, [documents, selectedTeam, selectedCategory, searchQuery]);

  // D3 force simulation
  useEffect(() => {
    if (!svgRef.current || graphData.nodes.length === 0) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    const width = svgRef.current.clientWidth;
    const height = svgRef.current.clientHeight;

    // Zoom behavior
    const zoom = d3.zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.1, 4])
      .on('zoom', (event) => {
        container.attr('transform', event.transform);
        setZoomLevel(event.transform.k);
      });

    svg.call(zoom);

    const container = svg.append('g');

    // Create force simulation
    const simulation = d3.forceSimulation<Node>(graphData.nodes)
      .force('link', d3.forceLink<Node, Link>(graphData.links)
        .id(d => d.id)
        .distance(d => 100 / (d.strength + 0.1))
        .strength(d => d.strength)
      )
      .force('charge', d3.forceManyBody().strength(-300))
      .force('center', d3.forceCenter(width / 2, height / 2))
      .force('collision', d3.forceCollide().radius(30));

    // Create links
    const link = container.append('g')
      .attr('class', 'links')
      .selectAll('line')
      .data(graphData.links)
      .enter().append('line')
      .attr('stroke', d => {
        switch (d.type) {
          case 'reference': return '#10b981';
          case 'similar': return '#f59e0b';
          default: return '#9ca3af';
        }
      })
      .attr('stroke-opacity', 0.6)
      .attr('stroke-width', d => Math.sqrt(d.strength * 3));

    // Create node groups
    const nodeGroup = container.append('g')
      .attr('class', 'nodes')
      .selectAll('g')
      .data(graphData.nodes)
      .enter().append('g')
      .attr('class', 'node')
      .call(d3.drag<SVGGElement, Node>()
        .on('start', dragstarted)
        .on('drag', dragged)
        .on('end', dragended)
      );

    // Add circles for nodes
    nodeGroup.append('circle')
      .attr('r', 15)
      .attr('fill', d => {
        switch (d.status) {
          case 'approved': return '#10b981';
          case 'review': return '#f59e0b';
          case 'draft': return '#9ca3af';
          default: return '#6b7280';
        }
      })
      .attr('stroke', '#fff')
      .attr('stroke-width', 2)
      .on('click', (event, d) => {
        setSelectedNode(d);
      })
      .on('mouseover', function(event, d) {
        d3.select(this).attr('r', 20);
      })
      .on('mouseout', function(event, d) {
        d3.select(this).attr('r', 15);
      });

    // Add icons
    nodeGroup.append('text')
      .attr('text-anchor', 'middle')
      .attr('dy', '0.35em')
      .attr('font-size', '12px')
      .attr('fill', 'white')
      .text('📄')
      .style('pointer-events', 'none');

    // Add labels
    nodeGroup.append('text')
      .attr('dx', 25)
      .attr('dy', '0.35em')
      .attr('font-size', '12px')
      .attr('fill', 'currentColor')
      .text(d => d.title.length > 20 ? d.title.substring(0, 20) + '...' : d.title)
      .style('pointer-events', 'none');

    // Simulation tick
    simulation.on('tick', () => {
      link
        .attr('x1', d => (d.source as Node).x!)
        .attr('y1', d => (d.source as Node).y!)
        .attr('x2', d => (d.target as Node).x!)
        .attr('y2', d => (d.target as Node).y!);

      nodeGroup
        .attr('transform', d => `translate(${d.x},${d.y})`);
    });

    // Drag functions
    function dragstarted(event: any, d: Node) {
      if (!event.active) simulation.alphaTarget(0.3).restart();
      d.fx = d.x;
      d.fy = d.y;
    }

    function dragged(event: any, d: Node) {
      d.fx = event.x;
      d.fy = event.y;
    }

    function dragended(event: any, d: Node) {
      if (!event.active) simulation.alphaTarget(0);
      d.fx = null;
      d.fy = null;
    }

    // Cleanup
    return () => {
      simulation.stop();
    };

  }, [graphData, teams]);

  const handleZoomIn = () => {
    const svg = d3.select(svgRef.current);
    svg.transition().call(
      d3.zoom<SVGSVGElement, unknown>().scaleBy as any,
      1.5
    );
  };

  const handleZoomOut = () => {
    const svg = d3.select(svgRef.current);
    svg.transition().call(
      d3.zoom<SVGSVGElement, unknown>().scaleBy as any,
      0.75
    );
  };

  const handleReset = () => {
    const svg = d3.select(svgRef.current);
    svg.transition().call(
      d3.zoom<SVGSVGElement, unknown>().transform as any,
      d3.zoomIdentity
    );
    setZoomLevel(1);
  };

  const categories = [
    { value: 'specification', label: '仕様書' },
    { value: 'proposal', label: '提案書' },
    { value: 'report', label: '報告書' },
    { value: 'manual', label: 'マニュアル' },
    { value: 'meeting', label: '議事録' },
    { value: 'other', label: 'その他' },
  ];

  return (
    <div className={`${isFullscreen ? 'fixed inset-0 z-50' : 'min-h-screen'} bg-gradient-to-br from-blue-50 to-cyan-50`}>
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-cyan-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <h1 className="text-3xl font-bold text-slate-800 flex items-center">
                  <Network className="h-8 w-8 mr-3" />
                  ナレッジグラフ
                </h1>
                <div className="flex items-center space-x-2 text-sm text-slate-600">
                  <span>{graphData.nodes.length} ノード</span>
                  <span>•</span>
                  <span>{graphData.links.length} リンク</span>
                  <span>•</span>
                  <span>ズーム: {Math.round(zoomLevel * 100)}%</span>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className={`inline-flex items-center px-3 py-2 border border-cyan-300 rounded-md shadow-sm text-sm font-medium ${
                    showFilters
                      ? 'bg-cyan-50 text-cyan-700 border-cyan-300'
                      : 'bg-white text-slate-700'
                  }`}
                >
                  <Filter className="h-4 w-4 mr-2" />
                  フィルター
                </button>
                <button
                  onClick={() => setIsFullscreen(!isFullscreen)}
                  className="inline-flex items-center px-3 py-2 border border-cyan-300 rounded-md shadow-sm text-sm font-medium text-slate-700 bg-white"
                >
                  <Maximize className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Filters */}
            {showFilters && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-4 p-4 bg-cyan-50 rounded-lg border border-cyan-200"
              >
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Search */}
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      <Search className="h-4 w-4 inline mr-1" />
                      検索
                    </label>
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="文書タイトルで検索..."
                      className="w-full px-3 py-2 border border-cyan-300 rounded-md shadow-sm focus:outline-none focus:ring-cyan-500 focus:border-cyan-500 bg-white text-slate-800"
                    />
                  </div>

                  {/* Team Filter */}
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      <Users className="h-4 w-4 inline mr-1" />
                      チーム
                    </label>
                    <select
                      value={selectedTeam}
                      onChange={(e) => setSelectedTeam(e.target.value)}
                      className="w-full px-3 py-2 border border-cyan-300 rounded-md shadow-sm focus:outline-none focus:ring-cyan-500 focus:border-cyan-500 bg-white text-slate-800"
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
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      <FileText className="h-4 w-4 inline mr-1" />
                      カテゴリ
                    </label>
                    <select
                      value={selectedCategory}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                      className="w-full px-3 py-2 border border-cyan-300 rounded-md shadow-sm focus:outline-none focus:ring-cyan-500 focus:border-cyan-500 bg-white text-slate-800"
                    >
                      <option value="">すべてのカテゴリ</option>
                      {categories.map((category) => (
                        <option key={category.value} value={category.value}>
                          {category.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>

      <div className="flex h-full">
        {/* Main Graph Area */}
        <div className={`flex-1 relative ${isFullscreen ? 'h-screen' : 'h-[calc(100vh-200px)]'}`}>
          {/* Graph Controls */}
          <div className="absolute top-4 right-4 z-10 flex flex-col space-y-2">
            <button
              onClick={handleZoomIn}
              className="p-2 bg-white rounded-md shadow-lg border border-cyan-200 hover:bg-cyan-50"
            >
              <ZoomIn className="h-4 w-4" />
            </button>
            <button
              onClick={handleZoomOut}
              className="p-2 bg-white rounded-md shadow-lg border border-cyan-200 hover:bg-cyan-50"
            >
              <ZoomOut className="h-4 w-4" />
            </button>
            <button
              onClick={handleReset}
              className="p-2 bg-white rounded-md shadow-lg border border-cyan-200 hover:bg-cyan-50"
            >
              <RotateCcw className="h-4 w-4" />
            </button>
          </div>

          {/* SVG Graph */}
          <svg
            ref={svgRef}
            className="w-full h-full bg-white"
            style={{ cursor: 'grab' }}
          />

          {/* Legend */}
          <div className="absolute bottom-4 left-4 bg-white rounded-lg shadow-lg border border-cyan-200 p-4">
            <h4 className="text-sm font-medium text-slate-800 mb-2">凡例</h4>
            <div className="space-y-2 text-xs">
              <div className="flex items-center">
                <div className="w-4 h-4 rounded-full bg-green-500 mr-2"></div>
                <span className="text-slate-700">承認済み文書</span>
              </div>
              <div className="flex items-center">
                <div className="w-4 h-4 rounded-full bg-yellow-500 mr-2"></div>
                <span className="text-slate-700">レビュー中文書</span>
              </div>
              <div className="flex items-center">
                <div className="w-4 h-4 rounded-full bg-gray-500 mr-2"></div>
                <span className="text-slate-700">下書き文書</span>
              </div>
              <div className="space-y-1 mt-3 pt-2 border-t border-cyan-200">
                <div className="flex items-center">
                  <div className="w-4 h-1 bg-green-500 mr-2"></div>
                  <span className="text-slate-700">参照関係</span>
                </div>
                <div className="flex items-center">
                  <div className="w-4 h-1 bg-yellow-500 mr-2"></div>
                  <span className="text-slate-700">類似関係</span>
                </div>
                <div className="flex items-center">
                  <div className="w-4 h-1 bg-gray-500 mr-2"></div>
                  <span className="text-slate-700">関連</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Node Details Sidebar */}
        {selectedNode && (
          <motion.div
            initial={{ opacity: 0, x: 300 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 300 }}
            className="w-80 bg-white border-l border-cyan-200 p-6 overflow-y-auto"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-slate-800 flex items-center">
                <Info className="h-5 w-5 mr-2" />
                詳細情報
              </h3>
              <button
                onClick={() => setSelectedNode(null)}
                className="text-slate-400 hover:text-slate-600"
              >
                ×
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <span className="text-sm font-medium text-slate-500">タイトル</span>
                <p className="text-slate-800">{selectedNode.title}</p>
              </div>

              <div>
                <span className="text-sm font-medium text-slate-500">タイプ</span>
                <p className="text-slate-800">文書</p>
              </div>

              {selectedNode.status && (
                <div>
                  <span className="text-sm font-medium text-slate-500">ステータス</span>
                  <p className="text-slate-800">
                    {selectedNode.status === 'approved' ? '承認済み' :
                     selectedNode.status === 'review' ? 'レビュー中' : '下書き'}
                  </p>
                </div>
              )}

              {selectedNode.category && (
                <div>
                  <span className="text-sm font-medium text-slate-500">カテゴリ</span>
                  <p className="text-slate-800">
                    {categories.find(c => c.value === selectedNode.category)?.label || selectedNode.category}
                  </p>
                </div>
              )}

              {selectedNode.tags && selectedNode.tags.length > 0 && (
                <div>
                  <span className="text-sm font-medium text-slate-500">タグ</span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {selectedNode.tags.map((tag) => (
                      <span
                        key={tag}
                        className="inline-block px-2 py-1 text-xs bg-indigo-100 dark:bg-indigo-900 text-indigo-800 dark:text-indigo-200 rounded"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default KnowledgeGraph;