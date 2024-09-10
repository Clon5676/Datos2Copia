const { verify } = require("jsonwebtoken");

const validateToken = (req, res, next) => {
  const accesToken = req.header("accesToken");

  if (!accesToken) return res.json({ error: "El usuario no esta logeado!" });

  try {
    const validToken = verify(accesToken, "importantsecret");

    if (validToken) {
      return next();
    }
  } catch (err) {
    return res.json({ error: err });
  }
};

module.exports = { validateToken };
