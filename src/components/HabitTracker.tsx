"use client";

import { useEffect, useState } from "react";

type Habit = { id: string; name: string; done: string[] }; // done = ISO dates (YYYY-MM-DD)

const STORAGE_KEY = "projectlife.habits";

function isoDate(d: Date) {
  return d.toLocaleDateString("en-CA"); // YYYY-MM-DD in local time
}

function lastNDays(n: number) {
  return Array.from({ length: n }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (n - 1 - i));
    return d;
  });
}

function streak(done: string[]) {
  const set = new Set(done);
  const d = new Date();
  if (!set.has(isoDate(d))) d.setDate(d.getDate() - 1); // today not done yet doesn't break the streak
  let count = 0;
  while (set.has(isoDate(d))) {
    count++;
    d.setDate(d.getDate() - 1);
  }
  return count;
}

export default function HabitTracker() {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [name, setName] = useState("");
  const [loaded, setLoaded] = useState(false);
  const days = lastNDays(7);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setHabits(JSON.parse(raw));
    } catch {}
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (!loaded) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(habits));
    } catch {}
  }, [habits, loaded]);

  function addHabit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = name.trim();
    if (!trimmed) return;
    setHabits((h) => [...h, { id: crypto.randomUUID(), name: trimmed, done: [] }]);
    setName("");
  }

  function toggle(id: string, date: string) {
    setHabits((hs) =>
      hs.map((h) =>
        h.id !== id
          ? h
          : { ...h, done: h.done.includes(date) ? h.done.filter((d) => d !== date) : [...h.done, date] },
      ),
    );
  }

  function remove(id: string) {
    setHabits((hs) => hs.filter((h) => h.id !== id));
  }

  return (
    <div className="mt-8">
      <form onSubmit={addHabit} className="flex gap-2">
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g. Read 20 minutes"
          className="flex-1 rounded-lg border border-[var(--border)] bg-[var(--card)] px-4 py-2 outline-none focus:border-brand-500"
        />
        <button className="rounded-lg bg-brand-600 px-5 py-2 font-semibold text-white hover:bg-brand-700">
          Add
        </button>
      </form>

      {loaded && habits.length === 0 && (
        <p className="mt-10 rounded-xl border border-dashed border-[var(--border)] p-8 text-center text-[var(--muted)]">
          No habits yet. Add your first one above.
        </p>
      )}

      {habits.length > 0 && (
        <div className="mt-8 overflow-x-auto rounded-xl border border-[var(--border)]">
          <table className="w-full text-sm">
            <thead className="bg-[var(--card)] text-[var(--muted)]">
              <tr>
                <th className="px-4 py-3 text-left font-medium">Habit</th>
                {days.map((d) => (
                  <th key={isoDate(d)} className="px-2 py-3 text-center font-medium">
                    <div>{d.toLocaleDateString(undefined, { weekday: "short" })}</div>
                    <div className="text-xs">{d.getDate()}</div>
                  </th>
                ))}
                <th className="px-4 py-3 text-center font-medium">Streak</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {habits.map((h) => (
                <tr key={h.id} className="border-t border-[var(--border)]">
                  <td className="px-4 py-3 font-medium">{h.name}</td>
                  {days.map((d) => {
                    const date = isoDate(d);
                    const checked = h.done.includes(date);
                    return (
                      <td key={date} className="px-2 py-3 text-center">
                        <button
                          onClick={() => toggle(h.id, date)}
                          aria-label={`${h.name} on ${date}`}
                          aria-pressed={checked}
                          className={`h-7 w-7 rounded-md border transition ${
                            checked
                              ? "border-brand-600 bg-brand-600 text-white"
                              : "border-[var(--border)] hover:border-brand-500"
                          }`}
                        >
                          {checked ? "✓" : ""}
                        </button>
                      </td>
                    );
                  })}
                  <td className="px-4 py-3 text-center font-semibold">🔥 {streak(h.done)}</td>
                  <td className="px-2 py-3">
                    <button
                      onClick={() => remove(h.id)}
                      aria-label={`Delete ${h.name}`}
                      className="rounded p-1 text-[var(--muted)] hover:text-red-500"
                    >
                      ✕
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
