import mongoose from "mongoose";
import Team from "../models/Team.js";
import Document from "../models/Document.js";

// Get all teams with statistics
export const getAllTeams = async (req, res) => {
  try {
    const teams = await Team.find({ isActive: true }).sort({ createdAt: -1 });

    // Add document count and member count for each team
    const teamsWithStats = await Promise.all(
      teams.map(async (team) => {
        const documentCount = await Document.countDocuments({ teamId: team._id });
        return {
          _id: team._id,
          name: team.name,
          description: team.description || "",
          slug: team.slug,
          color: team.color,
          icon: team.icon,
          memberCount: team.members ? team.members.length : 0,
          documentCount,
          createdAt: team.createdAt,
        };
      })
    );

    return res.status(200).json(teamsWithStats);
  } catch (error) {
    console.error("Error fetching all teams:", error);
    return res
      .status(500)
      .json({ message: "Error fetching teams", error: error.message });
  }
};

// Get team by ID
export const getTeamById = async (req, res) => {
  const { teamId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(teamId)) {
    return res.status(400).json({ message: "Invalid team ID format" });
  }

  try {
    const team = await Team.findById(teamId);
    if (!team) {
      return res.status(404).json({ message: "Team not found" });
    }
    return res.status(200).json(team);
  } catch (error) {
    console.error(`Error fetching team ${teamId}:`, error);
    return res
      .status(500)
      .json({ message: "Error fetching team", error: error.message });
  }
};


// Get team detail with comprehensive information
export const getTeamDetail = async (req, res) => {
  const { teamId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(teamId)) {
    return res.status(400).json({ message: "Invalid team ID format" });
  }

  try {
    const team = await Team.findById(teamId);
    if (!team) {
      return res.status(404).json({ message: "Team not found" });
    }

    // Get document statistics
    const documentCount = await Document.countDocuments({ teamId });
    const recentDocuments = await Document.find({ teamId })
      .sort({ updatedAt: -1 })
      .limit(10)
      .select('title status category updatedAt authorName tags');

    // Get documents by status
    const documentsByStatus = await Document.aggregate([
      { $match: { teamId: new mongoose.Types.ObjectId(teamId) } },
      { $group: { _id: "$status", count: { $sum: 1 } } }
    ]);

    const statusCounts = documentsByStatus.reduce((acc, item) => {
      acc[item._id] = item.count;
      return acc;
    }, {});

    // Get documents by category
    const documentsByCategory = await Document.aggregate([
      { $match: { teamId: new mongoose.Types.ObjectId(teamId) } },
      { $group: { _id: "$category", count: { $sum: 1 } } }
    ]);

    const categoryCounts = documentsByCategory.reduce((acc, item) => {
      acc[item._id] = item.count;
      return acc;
    }, {});

    const detailResponse = {
      ...team.toObject(),
      statistics: {
        documentCount,
        statusCounts,
        categoryCounts,
        memberCount: team.members ? team.members.length : 0,
      },
      recentDocuments,
    };

    res.status(200).json(detailResponse);
  } catch (error) {
    console.error("Error fetching team detail:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Create new team
export const createTeam = async (req, res) => {
  const { name, description, slug, color, icon, settings } = req.body;

  if (!name || !slug) {
    return res.status(400).json({ message: "Name and slug are required" });
  }

  try {
    const existingTeam = await Team.findOne({ slug });
    if (existingTeam) {
      return res
        .status(400)
        .json({ message: "A team with this slug already exists" });
    }

    const team = new Team({
      name,
      description,
      slug,
      color: color || "#6366f1",
      icon: icon || "📋",
      isActive: true,
      members: [],
      settings: settings || {
        allowPublicView: false,
        requireApproval: true,
      },
    });

    const savedTeam = await team.save();
    return res.status(201).json(savedTeam);
  } catch (error) {
    console.error("Error creating team:", error);
    return res
      .status(500)
      .json({ message: "Error creating team", error: error.message });
  }
};

// Update team
export const updateTeam = async (req, res) => {
  const { teamId } = req.params;
  const { name, description, slug, color, icon, settings } = req.body;

  if (!mongoose.Types.ObjectId.isValid(teamId)) {
    return res.status(400).json({ message: "Invalid team ID format" });
  }

  try {
    const team = await Team.findById(teamId);
    if (!team) {
      return res.status(404).json({ message: "Team not found" });
    }

    if (slug && slug !== team.slug) {
      const existingTeam = await Team.findOne({ slug });
      if (existingTeam && existingTeam._id.toString() !== teamId) {
        return res
          .status(400)
          .json({ message: "A team with this slug already exists" });
      }
    }

    const updatedTeam = await Team.findByIdAndUpdate(
      teamId,
      {
        name: name || team.name,
        description: description !== undefined ? description : team.description,
        slug: slug || team.slug,
        color: color || team.color,
        icon: icon || team.icon,
        settings: settings || team.settings,
      },
      { new: true, runValidators: true }
    );

    return res.status(200).json(updatedTeam);
  } catch (error) {
    console.error(`Error updating team ${teamId}:`, error);
    return res
      .status(500)
      .json({ message: "Error updating team", error: error.message });
  }
};

// Add member to team
export const addTeamMember = async (req, res) => {
  const { teamId } = req.params;
  const { userId, userName, role } = req.body;

  if (!mongoose.Types.ObjectId.isValid(teamId)) {
    return res.status(400).json({ message: "Invalid team ID format" });
  }

  if (!userId || !userName) {
    return res.status(400).json({ message: "User ID and name are required" });
  }

  try {
    const team = await Team.findById(teamId);
    if (!team) {
      return res.status(404).json({ message: "Team not found" });
    }

    // Check if member already exists
    const existingMember = team.members.find(member => member.userId === userId);
    if (existingMember) {
      return res.status(400).json({ message: "Member already exists in team" });
    }

    team.members.push({
      userId,
      userName,
      role: role || "member",
      joinedAt: new Date(),
    });

    await team.save();
    return res.status(200).json(team);
  } catch (error) {
    console.error(`Error adding member to team ${teamId}:`, error);
    return res
      .status(500)
      .json({ message: "Error adding team member", error: error.message });
  }
};

// Remove member from team
export const removeTeamMember = async (req, res) => {
  const { teamId, userId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(teamId)) {
    return res.status(400).json({ message: "Invalid team ID format" });
  }

  try {
    const team = await Team.findById(teamId);
    if (!team) {
      return res.status(404).json({ message: "Team not found" });
    }

    const memberIndex = team.members.findIndex(member => member.userId === userId);
    if (memberIndex === -1) {
      return res.status(404).json({ message: "Member not found in team" });
    }

    team.members.splice(memberIndex, 1);
    await team.save();

    return res.status(200).json({ message: "Member removed successfully", team });
  } catch (error) {
    console.error(`Error removing member from team ${teamId}:`, error);
    return res
      .status(500)
      .json({ message: "Error removing team member", error: error.message });
  }
};

// Update member role
export const updateMemberRole = async (req, res) => {
  const { teamId, userId } = req.params;
  const { role } = req.body;

  if (!mongoose.Types.ObjectId.isValid(teamId)) {
    return res.status(400).json({ message: "Invalid team ID format" });
  }

  if (!role || !["leader", "member", "viewer"].includes(role)) {
    return res.status(400).json({ message: "Valid role is required (leader, member, viewer)" });
  }

  try {
    const team = await Team.findById(teamId);
    if (!team) {
      return res.status(404).json({ message: "Team not found" });
    }

    const member = team.members.find(member => member.userId === userId);
    if (!member) {
      return res.status(404).json({ message: "Member not found in team" });
    }

    member.role = role;
    await team.save();

    return res.status(200).json({ message: "Member role updated successfully", team });
  } catch (error) {
    console.error(`Error updating member role in team ${teamId}:`, error);
    return res
      .status(500)
      .json({ message: "Error updating member role", error: error.message });
  }
};

// Delete team (soft delete by setting isActive to false)
export const deleteTeam = async (req, res) => {
  const { teamId } = req.params;

  // Check if team deletion is allowed
  const allowDeleteTeam = process.env.ALLOW_DELETE_TEAM === "true";

  if (!allowDeleteTeam) {
    return res.status(400).json({
      message:
        "Team deletion is disabled. Set ALLOW_DELETE_TEAM=true to enable this feature.",
    });
  }

  if (!mongoose.Types.ObjectId.isValid(teamId)) {
    return res.status(400).json({ message: "Invalid team ID format" });
  }

  try {
    const team = await Team.findById(teamId);
    if (!team) {
      return res.status(404).json({ message: "Team not found" });
    }

    // Soft delete by setting isActive to false
    team.isActive = false;
    await team.save();

    return res.status(200).json({ message: "Team deactivated successfully" });
  } catch (error) {
    console.error(`Error deleting team ${teamId}:`, error);
    return res
      .status(500)
      .json({ message: "Error deleting team", error: error.message });
  }
};
