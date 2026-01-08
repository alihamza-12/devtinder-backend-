const mongoose = require("mongoose");

//Schema for connection requests
const connectionRequestSchema = new mongoose.Schema(
  {
    fromUserId: {
      type: mongoose.Schema.ObjectId,
      required: true,
    },
    toUserId: {
      type: mongoose.Schema.ObjectId,
      required: true,
    },
    status: {
      type: String,
      required: true,
      enum: {
        values: ["interested", "ignored", "accepted", "rejected"],
        message: `{VALUE} is incorrect status type`,
      },
    },
  },
  {
    timestamps: true,
  }
);
//compound Index --> for making the searching(querying) to DB Fast
// By default when the require is true then it automatically make the index 1
connectionRequestSchema.index({ fromUserId: 1, toUserId: 1 });

//pre validation if user and sender is same
connectionRequestSchema.pre("save", async function () {
  const connectionRequest = this;
  if (connectionRequest.fromUserId.equals(connectionRequest.toUserId)) {
    throw new Error("you cannot send request to yourself");
  }
});

const ConnectionRequestModel = new mongoose.model(
  "ConnectionRequest",
  connectionRequestSchema
);

module.exports = ConnectionRequestModel;
