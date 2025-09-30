import mongoose from "mongoose";

const problemSchema = new mongoose.Schema(
  {
    statement: {
      // 単体で理解可能な課題文
      type: String,
      required: true,
    },
    sourceOriginId: {
      // 抽出元の `chat_threads` ID または `imported_items` ID
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      // We can't use a simple ref here as it could be ChatThread or ImportedItem.
      // We'll rely on sourceType to know which collection to query.
      // ref: function() { return this.sourceType === 'chat' ? 'ChatThread' : 'ImportedItem'; } // This doesn't work directly with populate
    },
    sourceType: {
      // データソース種別
      type: String,
      required: true,
      // Removed enum constraint to allow any string value
    },
    originalSnippets: {
      // (任意) 抽出の元になったユーザー発言の断片
      type: [String],
      default: [],
    },
    sourceMetadata: {
      // (任意) ソースに関する追加情報 (例: tweet ID, URL, author)
      type: Object,
      default: {},
    },
    version: {
      // 更新版管理用バージョン番号
      type: Number,
      required: true,
      default: 1,
    },
    themeId: {
      // 追加：所属するテーマのID
      type: mongoose.Schema.Types.ObjectId,
      ref: "Theme",
      required: true,
    },
    embeddingGenerated: {
      type: Boolean,
      default: false,
      index: true,
    },
  },
  { timestamps: true }
); // createdAt, updatedAt を自動追加

const Problem = mongoose.model("Problem", problemSchema);

export default Problem;
