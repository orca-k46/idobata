# 風の谷 文書管理システム (Kaze no Tani Document Management System)

**次世代文書管理システム** - オープンソースの高機能文書管理・知識共有プラットフォーム

## 概要

風の谷プロジェクトチーム向けに設計された次世代文書管理システムです。従来のGoogle Driveでの文書管理における課題（情報のサイロ化、重複、散在）を解決し、効率的な知識共有とコラボレーションを実現します。

### 主な特徴

- 🏢 **12チーム体制対応** - 風の谷プロジェクトの各班に対応した構造
- 📝 **バージョン管理** - 完全な変更履歴とドキュメントのバージョン追跡
- 🔗 **ナレッジグラフ** - 文書間の関係性を可視化し、関連情報を自動発見
- 🤝 **協同編集** - GitHub風のワークフローによる承認プロセス
- 🔍 **高度な検索** - コンテンツ、タグ、メタデータによる包括的検索
- 🎨 **モダンUI** - 直感的で美しいユーザーインターフェース

## システム構成

### チーム構造（12班）

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

### 技術スタック

**フロントエンド:**
- React 19 + TypeScript
- TailwindCSS + Framer Motion
- React Query (TanStack Query)
- Zustand (状態管理)
- Monaco Editor (コード/文書エディタ)
- D3.js (ナレッジグラフ可視化)

**バックエンド:**
- Node.js + Express + TypeScript
- MongoDB (メインデータベース)
- Socket.IO (リアルタイム通信)
- OpenAI API (AI機能)

**インフラ:**
- Docker + Docker Compose
- Python Service (テキスト埋め込み・検索)
- ChromaDB (ベクトル検索)

## セットアップ

### 必要なソフトウェア

- Node.js 20+
- Docker & Docker Compose
- MongoDB (ローカル開発の場合)

### 環境変数の設定

`.env`ファイルを作成し、以下の変数を設定してください：

```bash
# データベース
MONGODB_URI=mongodb://localhost:27017/kaze_no_tani_docs

# API設定
CORS_ORIGIN=http://localhost:5173,http://localhost:5175
API_BASE_URL=http://localhost:3000/api

# 認証
JWT_SECRET=your-jwt-secret-here
JWT_EXPIRES_IN=7d

# AI機能（オプション）
OPENAI_API_KEY=your-openai-api-key

# フロントエンド設定
VITE_SITE_NAME="風の谷 文書管理システム"
VITE_SITE_DESCRIPTION="Kaze no Tani Document Management System"

# 権限設定
ALLOW_DELETE_TEAM=false
```

### Docker での起動

```bash
# プロジェクトクローン
git clone [repository-url]
cd idobata

# サービス起動
docker-compose up -d

# 初期チームデータの投入
docker-compose exec backend npm run init-teams
```

### ローカル開発

```bash
# 依存関係インストール
npm install

# バックエンド起動
cd backend
npm install
npm run dev

# フロントエンド起動（別ターミナル）
cd frontend
npm install
npm run dev

# 管理画面起動（別ターミナル）
cd admin
npm install
npm run dev
```

## 使用方法

### アクセス URL

- **メインアプリケーション**: http://localhost:5173
- **管理画面**: http://localhost:5175
- **API**: http://localhost:3000/api
- **Python Service**: http://localhost:8000

### 基本的な使い方

1. **ダッシュボード**: 全体概要とクイックアクセス
2. **チーム管理**: 12の班の情報とメンバー管理
3. **文書作成・編集**: Markdownベースの文書作成
4. **バージョン管理**: 変更履歴の確認とロールバック
5. **検索機能**: 高度な検索とフィルタリング
6. **ナレッジグラフ**: 文書間の関係性の可視化

### 主な機能

#### 文書管理
- ドキュメントの作成、編集、削除
- Markdownサポート
- タグ付けとカテゴリ分類
- バージョン管理と変更履歴

#### チーム管理
- メンバー追加・削除
- 役割管理（リーダー、メンバー、ビューワー）
- チーム固有の権限設定

#### 検索・発見
- 全文検索
- タグベース検索
- フィルタリング機能
- 関連文書の自動提案

#### 可視化
- ナレッジグラフによる文書関係性の表示
- チーム活動状況の可視化
- 統計ダッシュボード

## API エンドポイント

### チーム管理
- `GET /api/teams` - 全チーム取得
- `GET /api/teams/:id` - チーム詳細
- `POST /api/teams` - チーム作成
- `PUT /api/teams/:id` - チーム更新
- `DELETE /api/teams/:id` - チーム削除

### 文書管理
- `GET /api/documents` - 文書一覧
- `GET /api/documents/:id` - 文書詳細
- `POST /api/documents` - 文書作成
- `PUT /api/documents/:id` - 文書更新
- `GET /api/documents/search` - 文書検索

## 開発・貢献

### 開発ガイドライン

1. TypeScriptを使用し、型安全性を保つ
2. ESLint・Prettierの設定に従う
3. コミット前に`npm run test`でテストを実行
4. 機能追加時は適切なドキュメントを更新

### プロジェクト構造

```
idobata/
├── backend/                 # バックエンドAPI
│   ├── controllers/         # APIコントローラー
│   ├── models/             # データモデル
│   ├── routes/             # ルーティング
│   ├── services/           # ビジネスロジック
│   └── scripts/            # ユーティリティスクリプト
├── frontend/               # フロントエンドアプリケーション
│   ├── src/
│   │   ├── components/     # Reactコンポーネント
│   │   ├── pages/          # ページコンポーネント
│   │   ├── services/       # API通信
│   │   ├── stores/         # 状態管理
│   │   └── types/          # TypeScript型定義
├── admin/                  # 管理画面
├── python-service/         # AI/検索サービス
└── docker-compose.yml      # Docker設定
```

## トラブルシューティング

### よくある問題

1. **MongoDB接続エラー**: `.env`ファイルのMONGODB_URIを確認
2. **ポート競合**: 他のサービスが同じポートを使用していないか確認
3. **権限エラー**: Dockerの権限設定を確認

### ログの確認

```bash
# 全サービスのログ
docker-compose logs -f

# 特定のサービスのログ
docker-compose logs -f backend
docker-compose logs -f frontend
```

## ライセンス

MIT License - 詳細は[LICENSE](./LICENSE)ファイルを参照してください。

## 貢献者

風の谷プロジェクトチーム

## サポート

問題や質問がある場合は、GitHubのIssueを作成してください。

---

**風の谷 文書管理システム** - より良い知識共有とコラボレーションのために 🌟