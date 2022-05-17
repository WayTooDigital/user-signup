import express from "express";
import { body, validationResult } from "express-validator";
import NonceModel from "../models/nonces.js";
const router = express.Router();

const generateNonce = () => Math.floor(Math.random() * 1000000);

// Add new Nonce
router.post(
  "/",
  body(["walletAddress"]).not().isEmpty(),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ errors: errors.array() });

    // Fetch the nonce from the DB (in case already exists)
    // and update the nonce
    const nonce = await NonceModel.findOneAndUpdate(
      { walletAddress: req.body.walletAddress },
      { nonce: generateNonce() },
      { new: true }
    );
    if (nonce) return res.status(200).send(nonce);

    try {
      const nonce = await new NonceModel({
        walletAddress: req.body.walletAddress,
        nonce: generateNonce(),
      }).save();

      return res.status(201).send(nonce);
    } catch (err) {
      console.log(err);
      return res
        .status(400)
        .send({ message: "There was an error saving data" });
    }
  }
);

export { router };
