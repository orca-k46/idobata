import React, { createContext, useContext, useEffect, useState } from "react";
import { apiClient } from "../services/api/apiClient";

interface SiteConfig {
  _id: string;
  title: string;
  aboutMessage: string;
}

interface SiteConfigContextType {
  siteConfig: SiteConfig | null;
  loading: boolean;
  error: string | null;
}

const SiteConfigContext = createContext<SiteConfigContextType>({
  siteConfig: null,
  loading: true,
  error: null,
});

export const useSiteConfig = () => useContext(SiteConfigContext);

export const SiteConfigProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [siteConfig, setSiteConfig] = useState<SiteConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSiteConfig = async () => {
      const result = await apiClient.getSiteConfig();

      result.match(
        (data) => {
          setSiteConfig(data);
          setError(null);
        },
        (error) => {
          console.error("Failed to fetch site config:", error);
          setError("サイト設定の取得に失敗しました");
          setSiteConfig({
            _id: "default",
            title: "風の谷 文書管理システム",
            aboutMessage: `# 風の谷 文書管理システムとは

風の谷 文書管理システムは、風の谷プロジェクトの12チーム向けに設計された次世代文書管理・知識共有プラットフォームです。
従来のGoogle Driveでの文書管理における課題（情報のサイロ化、重複、散在）を解決し、効率的な知識共有とコラボレーションを実現します。

## 主な機能

### 📝 文書管理
- バージョン管理機能付きの文書作成・編集
- Markdownサポート
- タグ付けとカテゴリ分類
- 承認フローによる品質管理

### 🏢 チーム管理
- 12チーム体制に対応した構造
- メンバー管理と役割設定
- チーム固有の権限設定

### 🔍 高度な検索
- 全文検索とフィルタリング
- タグベース検索
- 関連文書の自動提案

### 🔗 ナレッジグラフ
- 文書間の関係性を可視化
- インタラクティブなグラフ表示
- 知識の発見と探索をサポート

## 風の谷プロジェクトの12チーム

1. 文化・全体デザイン 🎨
2. 空間デザイン 🏗️
3. エネルギー ⚡
4. 森と水とトレイル 🌲
5. 生活オフィス空間（サンゴ礁1） 🏠
6. まち商業空間（サンゴ礁2） 🏪
7. 食と農 🌾
8. JOL & PPK（ヘルスケア） 🏥
9. 谷をつくる人をつくる（教育） 🎓
10. テクノロジー（情報インフラ＆他領域との協働） 💻
11. 土地読み（空間デザイン×文化×森） 🗺️

## より良い知識共有とコラボレーションのために

このシステムを通じて、各チームの知識が有機的につながり、プロジェクト全体の発展に貢献できることを願っています。`,
          });
        }
      );

      setLoading(false);
    };

    fetchSiteConfig();
  }, []);

  return (
    <SiteConfigContext.Provider value={{ siteConfig, loading, error }}>
      {children}
    </SiteConfigContext.Provider>
  );
};
