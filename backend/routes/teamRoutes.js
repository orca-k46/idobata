import express from "express";
import {
  createTeam,
  deleteTeam,
  getAllTeams,
  getTeamById,
  getTeamDetail,
  updateTeam,
  addTeamMember,
  removeTeamMember,
  updateMemberRole,
} from "../controllers/teamController.js";

const router = express.Router();

router.get("/", getAllTeams);

router.get("/:teamId", getTeamById);

router.get("/:teamId/detail", getTeamDetail);

router.post("/", createTeam);

router.put("/:teamId", updateTeam);

router.delete("/:teamId", deleteTeam);

// Member management routes
router.post("/:teamId/members", addTeamMember);

router.delete("/:teamId/members/:userId", removeTeamMember);

router.put("/:teamId/members/:userId/role", updateMemberRole);

export default router;
