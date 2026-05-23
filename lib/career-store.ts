"use client";

import { create } from "zustand";
import { InterviewResult } from "@/lib/career-types";

type CareerState = {
  latestResult: InterviewResult | null;
  favoriteQuestions: string[];
  setLatestResult: (result: InterviewResult) => void;
  toggleFavoriteQuestion: (question: string) => void;
};

export const useCareerStore = create<CareerState>((set) => ({
  latestResult: null,
  favoriteQuestions: [],
  setLatestResult: (result) => set({ latestResult: result }),
  toggleFavoriteQuestion: (question) =>
    set((state) => ({
      favoriteQuestions: state.favoriteQuestions.includes(question)
        ? state.favoriteQuestions.filter((item) => item !== question)
        : [...state.favoriteQuestions, question],
    })),
}));
