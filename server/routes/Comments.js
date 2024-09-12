const express = require("express");
const router = express.Router();
const { Comments, Users } = require("../models");
const { validateToken } = require("../middlewares/AuthMiddleware");

//GET COMMENTS OF A SPECIFIC POST (1)
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

//POST A COMMENT
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

//DELETE A COMENT
router.delete("/delete/:commentId", validateToken, async (req, res) => {
  try {
    const commentId = req.params.commentId;
    await Comments.destroy({
      where: {
        id: commentId,
      },
    });
    res.json("comentario borrado");
  } catch (err) {
    res.status(500).json({ error: "Error deleting comments" });
  }
});

module.exports = router;
