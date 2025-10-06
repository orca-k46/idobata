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

  // Fetch documents and teams
  const { data: documents } = useQuery({
    queryKey: ['documents'],
    queryFn: () => documentApi.getAll(),
  });

  const { data: teams } = useQuery({
    queryKey: ['teams'],
    queryFn: teamApi.getAll,
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
    <div className={`${isFullscreen ? 'fixed inset-0 z-50' : 'min-h-screen'} bg-gray-50 dark:bg-gray-900`}>
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center">
                  <Network className="h-8 w-8 mr-3" />
                  ナレッジグラフ
                </h1>
                <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
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
                  className={`inline-flex items-center px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium ${
                    showFilters
                      ? 'bg-indigo-50 text-indigo-700 border-indigo-300 dark:bg-indigo-900 dark:text-indigo-200'
                      : 'bg-white text-gray-700 dark:bg-gray-700 dark:text-gray-300'
                  }`}
                >
                  <Filter className="h-4 w-4 mr-2" />
                  フィルター
                </button>
                <button
                  onClick={() => setIsFullscreen(!isFullscreen)}
                  className="inline-flex items-center px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700"
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
                className="mt-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600"
              >
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Search */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      <Search className="h-4 w-4 inline mr-1" />
                      検索
                    </label>
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="文書タイトルで検索..."
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
                    />
                  </div>

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
              className="p-2 bg-white dark:bg-gray-800 rounded-md shadow-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              <ZoomIn className="h-4 w-4" />
            </button>
            <button
              onClick={handleZoomOut}
              className="p-2 bg-white dark:bg-gray-800 rounded-md shadow-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              <ZoomOut className="h-4 w-4" />
            </button>
            <button
              onClick={handleReset}
              className="p-2 bg-white dark:bg-gray-800 rounded-md shadow-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              <RotateCcw className="h-4 w-4" />
            </button>
          </div>

          {/* SVG Graph */}
          <svg
            ref={svgRef}
            className="w-full h-full bg-white dark:bg-gray-800"
            style={{ cursor: 'grab' }}
          />

          {/* Legend */}
          <div className="absolute bottom-4 left-4 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-4">
            <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">凡例</h4>
            <div className="space-y-2 text-xs">
              <div className="flex items-center">
                <div className="w-4 h-4 rounded-full bg-green-500 mr-2"></div>
                <span className="text-gray-700 dark:text-gray-300">承認済み文書</span>
              </div>
              <div className="flex items-center">
                <div className="w-4 h-4 rounded-full bg-yellow-500 mr-2"></div>
                <span className="text-gray-700 dark:text-gray-300">レビュー中文書</span>
              </div>
              <div className="flex items-center">
                <div className="w-4 h-4 rounded-full bg-gray-500 mr-2"></div>
                <span className="text-gray-700 dark:text-gray-300">下書き文書</span>
              </div>
              <div className="space-y-1 mt-3 pt-2 border-t border-gray-200 dark:border-gray-600">
                <div className="flex items-center">
                  <div className="w-4 h-1 bg-green-500 mr-2"></div>
                  <span className="text-gray-700 dark:text-gray-300">参照関係</span>
                </div>
                <div className="flex items-center">
                  <div className="w-4 h-1 bg-yellow-500 mr-2"></div>
                  <span className="text-gray-700 dark:text-gray-300">類似関係</span>
                </div>
                <div className="flex items-center">
                  <div className="w-4 h-1 bg-gray-500 mr-2"></div>
                  <span className="text-gray-700 dark:text-gray-300">関連</span>
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
            className="w-80 bg-white dark:bg-gray-800 border-l border-gray-200 dark:border-gray-700 p-6 overflow-y-auto"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
                <Info className="h-5 w-5 mr-2" />
                詳細情報
              </h3>
              <button
                onClick={() => setSelectedNode(null)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                ×
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <span className="text-sm font-medium text-gray-500 dark:text-gray-400">タイトル</span>
                <p className="text-gray-900 dark:text-white">{selectedNode.title}</p>
              </div>

              <div>
                <span className="text-sm font-medium text-gray-500 dark:text-gray-400">タイプ</span>
                <p className="text-gray-900 dark:text-white">文書</p>
              </div>

              {selectedNode.status && (
                <div>
                  <span className="text-sm font-medium text-gray-500 dark:text-gray-400">ステータス</span>
                  <p className="text-gray-900 dark:text-white">
                    {selectedNode.status === 'approved' ? '承認済み' :
                     selectedNode.status === 'review' ? 'レビュー中' : '下書き'}
                  </p>
                </div>
              )}

              {selectedNode.category && (
                <div>
                  <span className="text-sm font-medium text-gray-500 dark:text-gray-400">カテゴリ</span>
                  <p className="text-gray-900 dark:text-white">
                    {categories.find(c => c.value === selectedNode.category)?.label || selectedNode.category}
                  </p>
                </div>
              )}

              {selectedNode.tags && selectedNode.tags.length > 0 && (
                <div>
                  <span className="text-sm font-medium text-gray-500 dark:text-gray-400">タグ</span>
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