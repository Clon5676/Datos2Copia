const express = require("express");
const router = express.Router();
const { Users } = require("../models");
const bcrypt = require("bcrypt");
const { validateToken } = require("../middlewares/AuthMiddleware");

const { sign } = require("jsonwebtoken");

//CREATE A USER (1)
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

//CHECK IF USER EXSITS (2)
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
        //ESTO SE PASA A TRAVES DEL TOKEN, ESTA INFO
        { username: user.username, id: user.id },
        "importantsecret"
      );
      res.json({ token: accessToken, username: username, id: user.id });
    });
  } catch (err) {
    res.status(500).json({ error: "Error creating comments" });
  }
});

//VERIFICAR QUE EL TOKEN EN LOCALSTORAGE ES UN TOKEN VALIDO
router.get("/check", validateToken, async (req, res) => {
  try {
    await res.json(req.user);
  } catch (err) {
    console.error("Error checking if logged", err);
    res.status(500).json({
      error:
        "Error al verificar el token del localstorage: Token invalido (USERS)",
    });
  }
});

router.get("/basicinfo/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const basicInfo = await Users.findByPk(id, {
      attributes: { exclude: ["password"] },
    });
    res.json(basicInfo);
  } catch (err) {
    console.error("Error al traer info de usuario", err);
    res.status(500).json({
      error: "Error fetching user basicinfo",
    });
  }
});

module.exports = router;
