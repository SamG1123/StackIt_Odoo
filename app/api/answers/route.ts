await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/notifications`, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    userId: question.authorId,
    type: "answer",
    message: "Someone answered your question",
    relatedId: question._id,
  }),
});
