const express = require("express");
const router = express.Router();
const { Users } = require("../models");
const bcrypt = require("bcrypt");
const { validateToken } = require("../middlewares/AuthMiddleware");

const { sign } = require("jsonwebtoken");

router.post("/", async (req, res) => {
  try {
    const { username, password } = req.body;
    bcrypt.hash(password, 10).then((hash) => {
      Users.create({
        username: username,
        password: hash,
      });
      res.json("Usuario agregado");
    });
  } catch (err) {
    res.status(500).json({ error: "Error creating comments" });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await Users.findOne({ where: { username: username } });
    if (!user) return res.json({ error: "Ese usuario no existe" });

    bcrypt.compare(password, user.password).then((match) => {
      if (!match)
        return res.json({
          error: "Combinación incorrecta de usuario y contraseña",
        });
      const accessToken = sign(
        { username: user.username, id: user.id },
        "importantsecret"
      );
      res.json({ token: accessToken, username: username, id: user.id });
    });
  } catch (err) {
    res.status(500).json({ error: "Error creating comments" });
  }
});

module.exports = router;

router.get("/check", validateToken, (req, res) => {
  try {
    res.json(req.user);
  } catch (err) {
    console.error("Error checking if logged", err);
    res.status(500).json({
      error:
        "Error al verificar el token del localstorage: Token invalido (USERS)",
    });
  }
});
