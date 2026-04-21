"use client";

import { useEffect, useState } from "react";

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

const DEADLINE = new Date("2026-05-24T00:00:00");

function getTimeLeft(): TimeLeft {
  const diff = DEADLINE.getTime() - Date.now();
  if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 };
  return {
    days: Math.floor(diff / 86400000),
    hours: Math.floor((diff % 86400000) / 3600000),
    minutes: Math.floor((diff % 3600000) / 60000),
    seconds: Math.floor((diff % 60000) / 1000),
  };
}

function TimeUnit({ value, label }: { value: number; label: string }) {
  return (
    <div className="flex flex-col items-center gap-2 bg-[#13161e] border border-[#1e2233] rounded-2xl px-8 py-5">
      <span className="text-4xl font-medium text-white tabular-nums">
        {String(value).padStart(2, "0")}
      </span>
      <span className="text-[10px] text-slate-500 uppercase tracking-widest">
        {label}
      </span>
    </div>
  );
}

export default function Countdown() {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>(getTimeLeft());

  useEffect(() => {
    const interval = setInterval(() => setTimeLeft(getTimeLeft()), 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-[#0d0f14] flex flex-col items-center justify-center gap-8">
      <p className="text-slate-400 text-sm tracking-widest uppercase">
        Projet livré dans
      </p>
      <div className="grid grid-cols-4 gap-3">
        <TimeUnit value={timeLeft.days} label="Jours" />
        <div className="flex flex-col items-center gap-2 bg-[#13161e] border border-indigo-500/40 rounded-2xl px-8 py-5">
          <span className="text-4xl font-medium text-indigo-400 tabular-nums">
            {String(timeLeft.hours).padStart(2, "0")}
          </span>
          <span className="text-[10px] text-slate-500 uppercase tracking-widest">
            Heures
          </span>
        </div>
        <TimeUnit value={timeLeft.minutes} label="Minutes" />
        <TimeUnit value={timeLeft.seconds} label="Secondes" />
      </div>
    </div>
  );
}