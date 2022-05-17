import mongoose from "mongoose";
var Schema = mongoose.Schema;

var nonceSchema = new Schema(
  {
    nonce: { type: Number },
    walletAddress: { type: String },
  },
  {
    timestamps: true,
    versionKey: false,
    toJSON: {
      transform: function (doc, ret) {
        const { _id, createdAt, updatedAt, ...obj } = ret;
        return obj;
      },
    },
  }
);

export default mongoose.model("Nonce", nonceSchema, "nonces");
