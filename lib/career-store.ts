"use client";

import { create } from "zustand";
import { CareerAnalysisResult, RecommendedJob } from "@/lib/career-types";

type CareerState = {
  latestAnalysis: CareerAnalysisResult | null;
  savedJobs: RecommendedJob[];
  favoriteQuestions: string[];
  setLatestAnalysis: (analysis: CareerAnalysisResult) => void;
  toggleSavedJob: (job: RecommendedJob) => void;
  toggleFavoriteQuestion: (question: string) => void;
};

export const useCareerStore = create<CareerState>((set) => ({
  latestAnalysis: null,
  savedJobs: [],
  favoriteQuestions: [],
  setLatestAnalysis: (analysis) => set({ latestAnalysis: analysis }),
  toggleSavedJob: (job) =>
    set((state) => ({
      savedJobs: state.savedJobs.some((item) => item.id === job.id)
        ? state.savedJobs.filter((item) => item.id !== job.id)
        : [...state.savedJobs, { ...job, saved: true }],
    })),
  toggleFavoriteQuestion: (question) =>
    set((state) => ({
      favoriteQuestions: state.favoriteQuestions.includes(question)
        ? state.favoriteQuestions.filter((item) => item !== question)
        : [...state.favoriteQuestions, question],
    })),
}));

