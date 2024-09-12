const express = require("express");
const router = express.Router();
const { sequelize, Dares, Tags } = require("../models");

//GET RANDOM CHALLENGES (1)
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

//GET THE TAGS OF A SPECIFIC DARE (2)
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const dare = await Dares.findByPk(id, {
      include: {
        model: Tags,
        through: { attributes: [] }, // Excluir atributos de la tabla intermedia
        attributes: ["tagName", "id"], // Obtener solo el nombre del tag
      },
    });

    if (dare) {
      res.json(dare);
    } else {
      res.status(404).json({ error: "Dare not found" });
    }
  } catch (error) {
    console.error("Error fetching dare with tags:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
