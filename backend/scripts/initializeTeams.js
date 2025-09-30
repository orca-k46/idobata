import mongoose from "mongoose";
import Team from "../models/Team.js";

const teams = [
  {
    name: "文化・全体デザイン",
    slug: "culture-overall-design",
    description: "プロジェクト全体の文化的側面と包括的デザインを担当",
    color: "#8b5cf6",
    icon: "🎨",
  },
  {
    name: "空間デザイン",
    slug: "spatial-design",
    description: "物理的空間の設計と配置を担当",
    color: "#06b6d4",
    icon: "🏗️",
  },
  {
    name: "エネルギー",
    slug: "energy",
    description: "持続可能なエネルギーシステムの企画・実装",
    color: "#facc15",
    icon: "⚡",
  },
  {
    name: "森と水とトレイル",
    slug: "forest-water-trail",
    description: "自然環境の保全と活用、トレイル整備",
    color: "#22c55e",
    icon: "🌲",
  },
  {
    name: "生活オフィス空間（サンゴ礁1）",
    slug: "living-office-coral1",
    description: "住居とオフィスが融合した生活空間の設計",
    color: "#f472b6",
    icon: "🏠",
  },
  {
    name: "まち商業空間（サンゴ礁2）",
    slug: "town-commercial-coral2",
    description: "コミュニティの商業・交流空間の企画",
    color: "#fb923c",
    icon: "🏪",
  },
  {
    name: "食と農",
    slug: "food-agriculture",
    description: "持続可能な食料生産と農業システム",
    color: "#84cc16",
    icon: "🌾",
  },
  {
    name: "JOL & PPK（ヘルスケア）",
    slug: "healthcare-jol-ppk",
    description: "健康管理とウェルネスシステムの構築",
    color: "#ef4444",
    icon: "🏥",
  },
  {
    name: "谷をつくる人をつくる（教育）",
    slug: "education-human-development",
    description: "教育システムと人材育成プログラム",
    color: "#3b82f6",
    icon: "🎓",
  },
  {
    name: "テクノロジー（情報インフラ＆他領域との協働）",
    slug: "technology-info-infrastructure",
    description: "情報技術基盤と領域間連携システム",
    color: "#6366f1",
    icon: "💻",
  },
  {
    name: "土地読み（空間デザイン×文化×森）",
    slug: "land-reading-integration",
    description: "土地の特性を読み解き、空間・文化・自然を統合",
    color: "#8b4513",
    icon: "🗺️",
  },
];

async function initializeTeams() {
  try {
    // MongoDB接続
    const mongoUri = process.env.MONGODB_URI || "mongodb://localhost:27017/kaze_no_tani";
    await mongoose.connect(mongoUri);
    console.log("MongoDB connected");

    // 既存チームをクリア
    await Team.deleteMany({});
    console.log("Existing teams cleared");

    // 新しいチームを作成
    const createdTeams = [];
    for (const teamData of teams) {
      const team = new Team({
        ...teamData,
        isActive: true,
        members: [], // 初期状態では空のメンバー配列
        settings: {
          allowPublicView: false,
          requireApproval: true,
        }
      });

      const savedTeam = await team.save();
      createdTeams.push(savedTeam);
      console.log(`Created team: ${teamData.name}`);
    }

    console.log(`\n✅ Successfully created ${createdTeams.length} teams`);
    console.log("Teams initialized with the following structure:");

    createdTeams.forEach((team, index) => {
      console.log(`${index + 1}. ${team.icon} ${team.name} (${team.slug})`);
    });

    process.exit(0);
  } catch (error) {
    console.error("Error initializing teams:", error);
    process.exit(1);
  }
}

// スクリプトが直接実行された場合のみ初期化を実行
if (import.meta.url === `file://${process.argv[1]}`) {
  initializeTeams();
}

export { initializeTeams, teams };