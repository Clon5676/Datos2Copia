const express = require("express");
const router = express.Router();
const { Comments, Users } = require("../models");
const { validateToken } = require("../middlewares/AuthMiddleware");

router.get("/:postId", async (req, res) => {
  try {
    const postId = req.params.postId;
    const comments = await Comments.findAll({
      where: { PostId: postId },
      include: {
        model: Users,
        attributes: ["username"],
        required: false,
      },
    });
    res.json(comments);
  } catch (err) {
    res.status(500).json({ error: "Error fetching comments" });
  }
});

router.post("/", validateToken, async (req, res) => {
  try {
    const comment = req.body;
    const userId = req.user.id;
    comment.UserId = userId;
    await Comments.create(comment);
    res.json(comment);
  } catch (err) {
    res.status(500).json({ error: "Error creating comments" });
  }
});

module.exports = router;
