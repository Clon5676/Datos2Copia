const { verify } = require("jsonwebtoken");

const validateToken = (req, res, next) => {
  const accessToken = req.header("accessToken");

  if (!accessToken) return res.json({ error: "El usuario no esta logeado!" });

  try {
    const validToken = verify(accessToken, "importantsecret");
    //REQ.USER ES ACCESIBLE POR TODOS LO QUE USEN VALIDATETOKEN
    req.user = validToken;

    if (validToken) {
      return next();
    }
  } catch (err) {
    return res.json({ error: err });
  }
};

module.exports = { validateToken };
