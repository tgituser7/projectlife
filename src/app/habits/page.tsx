import type { Metadata } from "next";
import HabitTracker from "@/components/HabitTracker";

export const metadata: Metadata = { title: "Habits — ProjectLife" };

export default function HabitsPage() {
  return (
    <section className="mx-auto max-w-3xl px-4 py-16">
      <h1 className="text-3xl font-bold">Habit tracker</h1>
      <p className="mt-2 text-[var(--muted)]">Check off each habit for the last 7 days. Saved in your browser.</p>
      <HabitTracker />
    </section>
  );
}
