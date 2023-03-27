const express = require("express");
const bodyParser = require("body-parser");
const app = express();
var cors = require("cors");
const port = 3000;
app.use(bodyParser.json());
app.use(cors());

import { Request, Response } from "express";
import { AuthController } from "./src/controllers/auth.controller";
import { UserEntry } from "./src/entities/user";
import {
  validateUserLogin,
  validateUserRegistration,
} from "./src/validator/auth";

const memory: Record<string, UserEntry> = {};

// Register for a new user

app.post(
  "/register",
  validateUserRegistration,
  (req: Request, res: Response) => {
    return new AuthController(memory).register(req, res);
  }
);

// Login with a username and password
app.post("/login", validateUserLogin, (req: Request, res: Response) => {
  return new AuthController(memory).login(req, res);
});

app.listen(port);
