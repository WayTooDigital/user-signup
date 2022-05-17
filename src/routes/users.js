import express from "express";
import { body, validationResult } from "express-validator";
import nacl from "tweetnacl";
import naclUtil from "tweetnacl-util";
import bs58 from "bs58";
import jwt from "jsonwebtoken";
import UserModel from "../models/users.js";
import NonceModel from "../models/nonces.js";

const router = express.Router();

const generateToken = (user) => {
  return jwt.sign({ id: user._id }, global.config.jwt_secret, {
    expiresIn: "15d", // expires in 15 days
  });
};

// Add new User
router.post(
  "/",
  body(["message", "signedMessage"]).not().isEmpty(),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ errors: errors.array() });

    const walletAddress = (/Wallet address: ([a-zA-Z0-9]*)/.exec(
      req.body.message
    ) ?? Array(1))[1];
    const nonce_str = (/Nonce: ([0-9]*)/.exec(req.body.message) ?? Array(1))[1];

    if (!walletAddress)
      return res.status(400).send({ message: "Wallet address is missing" });
    if (!nonce_str)
      return res.status(400).send({ message: "Nonce is missing" });

    const nonce = await NonceModel.findOne({
      walletAddress,
      nonce: nonce_str,
    });
    if (!nonce) return res.status(400).send({ message: "Can't verify nonce" });

    try {
      var verified = nacl.sign.detached.verify(
        naclUtil.decodeUTF8(req.body.message),
        Uint8Array.from(req.body.signedMessage),
        bs58.decode(walletAddress)
      );
    } catch (err) {
      return res.status(400).send({ message: err.message });
    }

    if (!verified)
      return res
        .status(400)
        .send({ message: "Can't verify signature and message" });

    // We delete the Nonce in the DB because it no longer makes sense to store it
    await NonceModel.deleteOne({
      walletAddress,
      nonce: nonce_str,
    });

    // Fetch the user from the DB (in case it already exists)
    const user = await UserModel.findOne({
      walletAddress: walletAddress,
    });
    if (user) return res.status(200).send({ token: generateToken(user) });

    try {
      // Create and save the new user
      const user = await new UserModel({
        walletAddress: walletAddress,
      }).save();

      // TODO
      // await fetchAndSaveWalletNfts(user);

      return res.status(201).send({ token: generateToken(user) });
    } catch (err) {
      return res
        .status(400)
        .send({ message: "There was an error saving data" });
    }
  }
);

export { router };