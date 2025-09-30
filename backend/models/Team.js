import mongoose from "mongoose";

const teamSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    description: {
      type: String,
      required: false,
    },
    slug: {
      // URLなどで使用するための識別子
      type: String,
      required: true,
      unique: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    color: {
      // チーム識別用の色
      type: String,
      default: "#6366f1",
    },
    icon: {
      // チームアイコン
      type: String,
      default: "📋",
    },
    members: [{
      userId: {
        type: String,
        required: true,
      },
      role: {
        type: String,
        enum: ["leader", "member", "viewer"],
        default: "member",
      },
      joinedAt: {
        type: Date,
        default: Date.now,
      }
    }],
    settings: {
      allowPublicView: {
        type: Boolean,
        default: false,
      },
      requireApproval: {
        type: Boolean,
        default: true,
      },
    },
  },
  { timestamps: true }
);

const Team = mongoose.model("Team", teamSchema);

export default Team;
