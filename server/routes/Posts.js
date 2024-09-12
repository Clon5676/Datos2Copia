const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const { Posts, Dares, Tags, Users, PostTags } = require("../models"); // Ensure Dares is imported
const { validateToken } = require("../middlewares/AuthMiddleware");

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

// YA COSAS NORMALES

//GET ALL POSTS (1)
router.get("/", async (req, res) => {
  try {
    const listOfPosts = await Posts.findAll({
      include: [
        {
          model: Dares,
          attributes: ["dare", "points", "id"],
          required: true, // Ensures only posts with dares are included
        },
        {
          model: Users,
          attributes: ["username"],
          required: true, // Ensures only posts with users are included
        },
      ],
    });
    res.json(listOfPosts);
  } catch (err) {
    console.error("Error fetching posts:", err);
    res.status(500).json({ error: "Error fetching all posts" });
  }
});

//GET ALL POSTS WITH A SPECIFIC DARE (2)
router.get("/byDare", async (req, res) => {
  const { dareId } = req.query;

  try {
    const posts = await Posts.findAll({
      where: { DareId: dareId },
      include: [
        {
          model: Dares,
          attributes: ["dare", "points", "id"],
          required: false,
        },
        {
          model: Users,
          attributes: ["username"],
          required: true, // Ensures only posts with users are included
        },
      ],
    });
    res.json(posts);
  } catch (error) {
    console.error("Error fetching posts by DareId:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

//GET ALL POSTS WITH AN ESPECIFIC TAG (3)

router.get("/byTag", async (req, res) => {
  const { TagId } = req.query; // Get tagId from query parameters

  try {
    // Fetch posts associated with the given tagId
    const posts = await Posts.findAll({
      include: [
        {
          model: Tags,
          where: { id: TagId },
          through: { attributes: [] }, // Exclude attributes from the junction table
        },
        {
          model: Users,
          attributes: ["username"],
          required: true, // Include user details if needed
        },
      ],
    });

    res.json(posts);
  } catch (error) {
    console.error("Error fetching posts by tag:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

//GET individual posts (4)
router.get("/byId/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const post = await Posts.findByPk(id, {
      include: [
        {
          model: Dares,
          attributes: ["dare", "points", "id", "description"],
          required: false,
        },
        {
          model: Users,
          attributes: ["username"],
          required: true, // Ensures only posts with users are included
        },
      ],
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

//POST create (5)

router.post("/", validateToken, upload.single("photo"), async (req, res) => {
  const { postText, DareId } = req.body;
  const UserId = req.user.id;
  const photoUrl = req.file ? `/uploads/${req.file.filename}` : null;

  try {
    // Create the new post
    const newPost = await Posts.create({
      postText,
      photoUrl,
      DareId,
      UserId,
    });

    // Fetch tags associated with the given DareId
    const dare = await Dares.findByPk(DareId, {
      include: [
        {
          model: Tags,
          through: { attributes: [] }, // Exclude attributes from the junction table
        },
      ],
    });

    if (dare && dare.Tags) {
      // Create entries in PostTags for each tag associated with the dare
      const postTags = dare.Tags.map((tag) => ({
        PostId: newPost.id,
        TagId: tag.id,
      }));

      await PostTags.bulkCreate(postTags);
    }

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

module.exports = router;
