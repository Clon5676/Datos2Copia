const express = require("express");
const router = express.Router();
const { sequelize, Dares } = require("../models");

router.get("/random", async (req, res) => {
  try {
    // Count the total number of dares
    const count = await Dares.count();

    // Get 3-4 random dares
    const randomDares = await Dares.findAll({
      order: [sequelize.random()],
      limit: Math.min(4, count),
    });

    res.json(randomDares);
  } catch (error) {
    console.error("Error fetching random dares:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
