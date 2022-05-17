import express from "express";
import { router as noncesRouter } from "./routes/nonces.js";
import { router as usersRouter } from "./routes/users.js";
import authMiddleware from "./middlewares/authMiddleware.js";

import { connectDb } from "./db.js";
connectDb();

const router = express.Router();

router.use('/nonces', noncesRouter);
router.use('/users', usersRouter);

export { router, authMiddleware };
