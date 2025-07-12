"use client";

import useSWR from "swr";

export interface Comment {
  _id: string;
  content: string;
  user: string;
  votes: number;
  createdAt: string;
}

export interface Answer {
  _id: string;
  content: string;
  user: string;
  votes: number;
  isAccepted: boolean;
  createdAt: string;
  comments: Comment[];
}

export interface Question {
  _id: string;
  title: string;
  description: string;
  tags: string[];
  user: string;
  createdAt: string;
  answers: Answer[];
}

const fetcher = (url: string) =>
  fetch(url).then((r) => r.json().then((d) => d.data as Question));

export function useQuestion(id: string | undefined) {
  const { data, mutate, isLoading } = useSWR<Question>(
    id ? `/api/questions/${id}` : null,
    fetcher
  );

  /* --- Mutations ------------------------------------------------- */
  const voteAnswer = async (answerId: string, dir: "up" | "down") => {
    await fetch(`/api/answers/${answerId}/votes`, {
      method: "POST",
      body: JSON.stringify({ questionId: id, dir }),
    });
    mutate();
  };

  const voteComment = async (
    answerId: string,
    commentId: string,
    dir: "up" | "down"
  ) => {
    await fetch(`/api/answers/${answerId}/votes`, {
      method: "POST",
      body: JSON.stringify({ questionId: id, commentId, dir }),
    });
    mutate();
  };

  const addComment = async (
    answerId: string,
    content: string,
    user: string
  ) => {
    await fetch(`/api/answers/${answerId}/comments`, {
      method: "POST",
      body: JSON.stringify({ questionId: id, content, user }),
    });
    mutate();
  };

  const addAnswer = async (content: string, user: string) => {
    await fetch(`/api/questions/${id}/answers`, {
      method: "POST",
      body: JSON.stringify({ content, user }),
    });
    mutate();
  };

  return {
    question: data,
    isLoading,
    voteAnswer,
    voteComment,
    addComment,
    addAnswer,
    mutate,
  };
}
