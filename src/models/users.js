import mongoose from "mongoose";
var Schema = mongoose.Schema;

var userSchema = new Schema(
  {
    walletAddress: { type: String, required: "{PATH} is required!" },
    nfts: [{ type: Object }],
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

export default mongoose.model("User", userSchema, "users");
