const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const expressJwt = require("express-jwt");
const User = require("./user");

mongoose.connect(
  "mongodb+srv:conecta tu mongo atlas"
);
const app = express();

app.use(express.json());

// ---------------------------------------------
const validateJwt = expressJwt({ secret: "secret", algorithms: ["HS256"] });

const signToken = (_id) => jwt.sign({ _id }, "secret");

// ----------------------------------------------

// END POINT DE RESGITRO !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
app.post("/register", async (req, res) => {
  const { body } = req;
  console.log({ body });
  try {
    // -----------------------------------------------------------------
    const isUser = await User.findOne({ email: body.email });
    // -----------------------------------------------------------------
    if (isUser) {
      return res.status(403).send("usuario ya existe");
    }
    // -------------------------------------------------------
    const salt = await bcrypt.genSalt();
    const hashed = await bcrypt.hash(body.password, salt);
    const user = await User.create({
      email: body.email,
      password: hashed,
      salt,
    });
    // ---------------------------------------------------

    const signed = signToken(user._id);
    // ----------------------------------------------------
    res.status(201).send(signed);
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
});

// END POINT LOGIN!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
app.post("/login", async (req, res) => {
  const { body } = req;
  try {
    // ---------------------------------------------------------------
    const user = await User.findOne({ email: body.email });
    // ----------------------------------------------------------------
    if (!user) {
      res.status(403).send("usuario y/o contraseña incorrecta");
      // en caso de que el usuario  y la contraseña sea incorrecta
    } else {
      const isMatch = await bcrypt.compare(body.password, user.password);
      if (isMatch) {
        const signed = signToken(user._id);
        res.status(200).send(signed);
      } else {
        res.status(403).send("usuario y/o contraseña incorrecta");
      }
    }
  } catch (error) {
    res.status(500).send(error.message);
  }
});
// ----------------------------------------------------------------------

// Middleware para proteger el token
const prevalidacion = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(401).end;
    }
    req.user = user;
    next();
  } catch (error) {
    next(error);
  }
};

// END POINT DE VALIDACIÓN!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
const isAuthenticated = express.Router().use(validateJwt, prevalidacion);

// END POINT DE VALIDACIÓN!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
app.get("/validacion", isAuthenticated, (req, res) => {
  res.send(req.user);
  // -----------------------------------
});

app.listen(3000, () => {
  console.log("Server running on port 3000");
});
