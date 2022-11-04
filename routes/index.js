import express from "express";

import { verifyToken } from "../middleware/VerifyToken.js";
import {
  getUsers,
  Login,
  Register,
  getUserbyId,
  deleteUser
} from "../controllers/Users.js";
import { RefreshToken } from "../controllers/RefreshToken.js";

const router = express.Router();

router.get("/users", verifyToken, getUsers);
router.get("/users/:id", getUserbyId);
router.delete("/users/:id", deleteUser);
router.post("/users", Register);
router.post("/login", Login);
router.get("/token", RefreshToken);

export default router;
