const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const { Posts, Dares } = require("../models"); // Ensure Dares is imported

// Configure multer storage and file filter
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads"); // Make sure the 'uploads' directory exists
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (req, file, cb) => {
    const fileTypes = /jpeg|jpg|png/;
    const mimeType = fileTypes.test(file.mimetype);
    const extname = fileTypes.test(
      path.extname(file.originalname).toLowerCase()
    );

    if (mimeType && extname) {
      return cb(null, true);
    }
    cb(
      new Error("Invalid file format. Only JPEG, JPG, and PNG are allowed."),
      false
    );
  },
});

router.get("/", async (req, res) => {
  try {
    const listOfPosts = await Posts.findAll({
      include: {
        model: Dares,
        attributes: ["dare"],
        required: false, // Change to false if you want to include posts without dares
      },
    });
    res.json(listOfPosts);
  } catch (err) {
    console.error("Error fetching posts:", err);
    res.status(500).json({ error: "Error fetching all posts" });
  }
});

router.post("/", upload.single("photo"), async (req, res) => {
  const { postText, username, approvals, disapproval, DareId } = req.body;
  const photoUrl = req.file ? `/uploads/${req.file.filename}` : null;

  try {
    const newPost = await Posts.create({
      postText,
      username,
      approvals,
      disapproval,
      photoUrl,
      DareId,
    });
    res.json(newPost);
  } catch (err) {
    if (err instanceof multer.MulterError) {
      res.status(400).json({ error: err.message });
    } else {
      console.error("Error creating post:", err);
      res.status(500).json({ error: "Error creating post" });
    }
  }
});

router.get("/byId/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const post = await Posts.findByPk(id, {
      include: {
        model: Dares,
        attributes: ["dare", "points"],
        required: false,
      },
    });
    if (post) {
      res.json(post);
    } else {
      res.status(404).json({ error: "Post not found" });
    }
  } catch (err) {
    console.error("Error fetching specific post:", err);
    res.status(500).json({ error: "Error fetching specific post" });
  }
});

module.exports = router;
