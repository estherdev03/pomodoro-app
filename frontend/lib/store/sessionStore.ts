import axios from "axios";
import { create } from "zustand";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true,
});

export interface PomodoroSession {
  id: number;
  type: "pomodoro" | "short_break" | "long_break";
  startTime: string;
  endTime: string | null;
  duration: number | null;
  expectedDuration: number;
}

interface PomodoroSessionState {
  currentSession: PomodoroSession | null;
  sessionHistory: PomodoroSession[];
  startSession: (
    type: "pomodoro" | "short_break" | "long_break",
  ) => Promise<void>;
  getCurrentSession: () => Promise<void>;
  getSessionHistory: () => Promise<void>;
  endSession: () => Promise<void>;
}

export const usePomodoroSessionStore = create<PomodoroSessionState>(
  (set, get) => ({
    currentSession: null,
    sessionHistory: [],
    startSession: async (type: string) => {
      try {
        const response = await api.post("/pomodoro-session/start", { type });
        set({ currentSession: response.data });
        await get().getSessionHistory();
      } catch (error) {
        console.error("Failed to start session.", error);
      }
    },
    getCurrentSession: async () => {
      try {
        const response = await api.get("/pomodoro-session/current");
        set({ currentSession: response.data || null });
      } catch {
        set({ currentSession: null });
      }
    },
    getSessionHistory: async () => {
      try {
        const response = await api.get("/pomodoro-session/history?limit=20");
        set({ sessionHistory: response.data || [] });
      } catch {
        set({ sessionHistory: [] });
      }
    },
    endSession: async () => {
      const { currentSession } = get();
      if (!currentSession) return;
      try {
        await api.patch(
          `/pomodoro-session/${currentSession.id}/end`,
          {},
        );
        set({ currentSession: null });
        await get().getSessionHistory();
      } catch (error) {
        console.error("Failed to end session.", error);
      }
    },
  }),
);
