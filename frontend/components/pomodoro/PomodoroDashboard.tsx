/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { usePomodoroSessionStore } from "@/lib/store/sessionStore";
import moment from "moment";
import { useEffect, useRef, useState } from "react";
import {
  Play,
  Coffee,
  Sunset,
  Square,
  History,
  Clock,
  CheckCircle2,
} from "lucide-react";

const SESSION_LABELS = {
  pomodoro: {
    label: "Pomodoro",
    icon: Clock,
    color: "emerald",
    duration: "25 min",
  },
  short_break: {
    label: "Short Break",
    icon: Coffee,
    color: "blue",
    duration: "5 min",
  },
  long_break: {
    label: "Long Break",
    icon: Sunset,
    color: "violet",
    duration: "15 min",
  },
};

export default function PomodoroDashboard() {
  const {
    currentSession,
    sessionHistory,
    startSession,
    getCurrentSession,
    endSession,
    getSessionHistory,
  } = usePomodoroSessionStore();

  const [timeLeft, setTimeLeft] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [completedMessage, setCompletedMessage] = useState<string | null>(null);
  const prevTimeLeftRef = useRef<number | null>(null);
  const hasTriggeredEndRef = useRef(false);

  const notifySessionComplete = (sessionType: string) => {
    const label =
      SESSION_LABELS[sessionType as keyof typeof SESSION_LABELS]?.label ??
      sessionType;
    setCompletedMessage(`${label} complete! Great work.`);
    setTimeout(() => setCompletedMessage(null), 5000);
    if (typeof window !== "undefined" && "Notification" in window) {
      if (Notification.permission === "granted") {
        new Notification("Session complete!", {
          body: `${label} finished. Time for a break?`,
        });
      } else if (Notification.permission !== "denied") {
        Notification.requestPermission();
      }
    }
  };

  useEffect(() => {
    const init = async () => {
      await getCurrentSession();
      await getSessionHistory();
    };
    init();
  }, [getCurrentSession, getSessionHistory]);

  useEffect(() => {
    if (!isRunning || timeLeft <= 0) return;
    const timer = setInterval(() => {
      setTimeLeft((prev) => Math.max(prev - 1, 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [isRunning, timeLeft]);

  useEffect(() => {
    if (
      currentSession &&
      timeLeft === 0 &&
      prevTimeLeftRef.current !== null &&
      prevTimeLeftRef.current > 0 &&
      !hasTriggeredEndRef.current
    ) {
      hasTriggeredEndRef.current = true;
      const sessionType = currentSession.type;
      endSession().then(() => {
        notifySessionComplete(sessionType);
      });
    }
    prevTimeLeftRef.current = timeLeft;
  }, [timeLeft, currentSession, endSession]);

  useEffect(() => {
    if (!currentSession) {
      setTimeLeft(0);
      setIsRunning(false);
      hasTriggeredEndRef.current = false;
      return;
    }
    const startedAt = new Date(currentSession.startTime).getTime();
    const elapsed = Math.floor((Date.now() - startedAt) / 1000);
    const remaining = currentSession.expectedDuration - elapsed;

    if (remaining > 0) {
      setTimeLeft(remaining);
      setIsRunning(true);
    } else {
      setTimeLeft(0);
      setIsRunning(false);
    }
  }, [currentSession]);

  function formatTime(seconds: number) {
    return moment.utc(seconds * 1000).format("mm:ss");
  }

  const completedPomodoros = sessionHistory.filter(
    (s) => s.type === "pomodoro",
  ).length;

  return (
    <div className="min-h-[calc(100vh-64px)] bg-slate-50 py-8 px-4">
      {completedMessage && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 px-6 py-4 bg-emerald-600 text-white rounded-xl shadow-lg">
          <CheckCircle2 className="w-6 h-6 shrink-0" />
          <p className="font-medium">{completedMessage}</p>
        </div>
      )}
      <div className="max-w-4xl mx-auto">
        {/* Header stats */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
            <p className="text-slate-600 mt-0.5">
              {completedPomodoros} pomodoros completed
            </p>
          </div>
        </div>

        {/* Timer card */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden mb-8">
          <div className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 px-8 py-12">
            <p className="text-white/90 text-sm font-medium mb-2 uppercase tracking-wider">
              {currentSession
                ? SESSION_LABELS[currentSession.type]?.label || "Session"
                : "Ready"}
            </p>
            <div className="text-6xl md:text-7xl font-mono font-bold text-white mb-6 tabular-nums">
              {timeLeft > 0 ? formatTime(timeLeft) : "00:00"}
            </div>
            <div className="flex flex-wrap gap-3">
              {!isRunning ? (
                <>
                  <button
                    onClick={() => startSession("pomodoro")}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-500 hover:bg-emerald-600 rounded-xl text-white font-semibold shadow-lg transition-colors"
                  >
                    <Play className="w-5 h-5" />
                    Start Pomodoro
                  </button>
                  <button
                    onClick={() => startSession("short_break")}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-white/20 hover:bg-white/30 backdrop-blur rounded-xl text-white font-semibold transition-colors"
                  >
                    <Coffee className="w-5 h-5" />
                    Short Break
                  </button>
                  <button
                    onClick={() => startSession("long_break")}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-white/20 hover:bg-white/30 backdrop-blur rounded-xl text-white font-semibold transition-colors"
                  >
                    <Sunset className="w-5 h-5" />
                    Long Break
                  </button>
                </>
              ) : (
                <button
                  onClick={() => endSession()}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-red-500 hover:bg-red-600 rounded-xl text-white font-semibold shadow-lg transition-colors"
                >
                  <Square className="w-5 h-5" />
                  End Session
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Session history */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
          <h2 className="flex items-center gap-2 text-lg font-semibold text-slate-900 mb-4">
            <History className="w-5 h-5 text-indigo-500" />
            Recent sessions
          </h2>
          {sessionHistory.length === 0 ? (
            <p className="text-slate-500 py-8 text-center">
              No sessions yet. Start your first Pomodoro!
            </p>
          ) : (
            <ul className="space-y-2">
              {sessionHistory.map((s) => {
                const meta =
                  SESSION_LABELS[s.type as keyof typeof SESSION_LABELS];
                const Icon = meta?.icon || Clock;
                const duration = s.duration
                  ? moment.utc(s.duration * 1000).format("m[min]")
                  : "—";
                return (
                  <li
                    key={s.id}
                    className="flex items-center justify-between py-3 px-4 rounded-xl bg-slate-50 hover:bg-slate-100/80 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                          s.type === "pomodoro"
                            ? "bg-emerald-100 text-emerald-600"
                            : s.type === "short_break"
                              ? "bg-blue-100 text-blue-600"
                              : "bg-violet-100 text-violet-600"
                        }`}
                      >
                        <Icon className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="font-medium text-slate-900">
                          {meta?.label || s.type}
                        </p>
                        <p className="text-sm text-slate-500">
                          {moment(s.startTime).format("MMM D, h:mm a")}
                        </p>
                      </div>
                    </div>
                    <span className="font-mono text-slate-600">{duration}</span>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
