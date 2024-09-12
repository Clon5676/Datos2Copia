const express = require("express");
const router = express.Router();
const { Ratings, Posts } = require("../models");
const { validateToken } = require("../middlewares/AuthMiddleware");

// POST route (ADD, UPDATE RATINGS 1)
router.post("/", validateToken, async (req, res) => {
  const { PostId, ratingValue } = req.body;
  const UserId = req.user.id;

  const found = await Ratings.findOne({
    where: { PostId: PostId, UserId: UserId },
  });

  if (!found) {
    await Ratings.create({
      PostId: PostId,
      UserId: UserId,
      ratingValue: ratingValue,
    });
  } else {
    await Ratings.update(
      { ratingValue: ratingValue },
      {
        where: { PostId: PostId, UserId: UserId },
      }
    );
  }
  await updateAverageRating(PostId);
  res.json("Success");
});

// Function to update the average rating of a post
const updateAverageRating = async (postId) => {
  try {
    const ratings = await Ratings.findAll({
      where: { PostId: postId },
    });

    if (ratings.length > 0) {
      const totalRatings = ratings.reduce(
        (sum, rating) => sum + rating.ratingValue,
        0
      );
      const averageRating = totalRatings / ratings.length;

      await Posts.update(
        { averageRating: averageRating },
        { where: { id: postId } }
      );
    } else {
      await Posts.update(
        { averageRating: 0 }, // Set to 0 if no ratings
        { where: { id: postId } }
      );
    }
  } catch (error) {
    console.error("Error updating average rating:", error);
  }
};

// GET route for fetching all ratings of the logged-in user (2)
router.get("/", validateToken, async (req, res) => {
  const UserId = req.user.id;

  try {
    const userRatings = await Ratings.findAll({
      where: { UserId: UserId },
    });

    res.json(userRatings);
  } catch (error) {
    console.error("Error fetching ratings:", error);
    res.status(500).json({ error: "Something went wrong" });
  }
});

module.exports = router;
