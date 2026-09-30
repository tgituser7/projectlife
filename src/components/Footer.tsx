"use client";

import { usePathname } from "next/navigation";

export default function Footer() {
  // The home page is a single full-screen hero
  if (usePathname() === "/") return null;

  return (
    <footer className="border-t border-[var(--border)] py-8 text-center text-sm text-[var(--muted)]">
      © {new Date().getFullYear()} ProjectLife. Built with Next.js.
    </footer>
  );
}
