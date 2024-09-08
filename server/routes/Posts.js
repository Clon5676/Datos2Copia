const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const { Posts } = require("../models");

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
  limits: { fileSize: 1 * 1024 * 1024 }, // 1MB
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
    const listOfPosts = await Posts.findAll();
    res.json(listOfPosts);
  } catch (err) {
    res.status(500).json({ error: "Error fetching posts" });
  }
});

// Use the correct `upload` middleware
router.post("/", upload.single("photo"), async (req, res) => {
  const { dare, postText, username, approvals, disapproval } = req.body;
  const photoUrl = req.file ? `/uploads/${req.file.filename}` : null;

  try {
    const newPost = await Posts.create({
      dare,
      postText,
      username,
      approvals,
      disapproval,
      photoUrl,
    });
    res.json(newPost);
  } catch (err) {
    res.status(500).json({ error: "Error creating post" });
  }
});

module.exports = router;
