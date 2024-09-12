const express = require("express");
const router = express.Router();
const { Tags } = require("../models");

//GET THE TAG BASED ON ITS ID(1)
router.get("/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const tag = await Tags.findByPk(id);

    if (tag) {
      res.json(tag);
    } else {
      res.status(404).json({ error: "tag not foun" });
    }
  } catch (error) {
    console.error("Error fetching tag based on id", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
