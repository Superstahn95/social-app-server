const mongoose = require("mongoose");

//refactor my postSchema
const postSchema = new mongoose.Schema(
  {
    //i can make the userId to be a reference to users
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    description: String,
    //   images: [
    //     {
    //       type: Object,
    //       url: { type: String, required: true },
    //       public_id: { type: String, required: true },
    //     },
    //   ],
    image: {
      type: Object,
      url: {
        type: String,
        required: true,
      },
      public_id: {
        type: String,
        required: true,
      },
    },
    likes: {
      type: Map,
      of: Boolean,
    },
    comments: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Comment",
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Post", postSchema);
