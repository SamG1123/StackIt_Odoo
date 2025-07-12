import mongoose from "mongoose"

const QuestionSchema = new mongoose.Schema(
  {
    title: String,
    description: String,
    tags: [String],
    user: String,
  },
  { timestamps: true }
)

export default mongoose.models.Question ||
  mongoose.model("Question", QuestionSchema)
