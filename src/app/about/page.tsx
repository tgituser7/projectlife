import type { Metadata } from "next";

export const metadata: Metadata = { title: "About — ProjectLife" };

export default function About() {
  return (
    <section className="mx-auto max-w-3xl px-4 py-20">
      <h1 className="text-4xl font-bold">About ProjectLife</h1>
      <p className="mt-6 text-lg text-[var(--muted)]">
        ProjectLife treats your life like a project worth managing well. Instead of vague resolutions,
        you pick a focus, turn it into small daily habits, and track them consistently.
      </p>
      <h2 className="mt-12 text-2xl font-semibold">Principles</h2>
      <ul className="mt-4 space-y-3 text-[var(--muted)]">
        <li><strong className="text-[var(--foreground)]">Small beats big.</strong> Tiny daily actions compound.</li>
        <li><strong className="text-[var(--foreground)]">Visible progress.</strong> Streaks keep you motivated.</li>
        <li><strong className="text-[var(--foreground)]">Private by default.</strong> Your data stays in your browser.</li>
      </ul>
    </section>
  );
}
