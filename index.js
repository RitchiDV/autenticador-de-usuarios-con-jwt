const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const expressJwt = require("express-jwt");
mongoose.connect(
  "mongodb+srv://Hakdigital98:Adivinala123@ricardi.j4xrm.mongodb.net/auth?retryWrites=true&w=majority&appName=Ricardi"
);
