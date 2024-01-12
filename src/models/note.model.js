import { model, Schema } from "mongoose";
const noteSchema = new Schema(
  {
    title: { type: String },
    contents: { type: String },
    owner: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
  }, { timestamps: true }
);

export const Note = model("Note", noteSchema);