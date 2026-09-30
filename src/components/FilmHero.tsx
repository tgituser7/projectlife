"use client";

import Image from "next/image";
import Link from "next/link";
import { Fragment, useCallback, useEffect, useRef, useState } from "react";
import { films, type Film } from "@/data/films";

type Phase = "grid" | "opening" | "detail" | "closing";

const EASE_OUT = "cubic-bezier(.22,1,.36,1)";
const EASE_IN_OUT = "cubic-bezier(.77,0,.18,1)";
const EASE_SOFT = "cubic-bezier(.16,1,.3,1)"; // long, gentle deceleration for the intro
const EASE_GLIDE = "cubic-bezier(.45,0,.12,1)"; // soft start and soft landing
const OPEN_MS = 1750; // dim + line + strip widening; details start as the panel lands
const CLOSE_MS = 700;
const SURNAME = "Villeneuve";

export default function FilmHero() {
  const [phase, setPhase] = useState<Phase>("grid");
  const [selected, setSelected] = useState<Film | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [saved, setSaved] = useState<string[]>([]);
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => () => clearTimeout(timer.current), []);

  function open(film: Film) {
    if (phase !== "grid") return;
    setMenuOpen(false);
    setSelected(film);
    setPhase("opening");
    timer.current = setTimeout(() => setPhase("detail"), OPEN_MS);
  }

  const close = useCallback(() => {
    if (phase !== "detail") return;
    setPhase("closing");
    timer.current = setTimeout(() => {
      setPhase("grid");
      setSelected(null);
    }, CLOSE_MS);
  }, [phase]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [close]);

  const covered = phase !== "grid";
  const opening = phase === "opening";
  const isSaved = selected ? saved.includes(selected.id) : false;

  function toggleSave() {
    if (!selected) return;
    setSaved((s) => (s.includes(selected.id) ? s.filter((id) => id !== selected.id) : [...s, selected.id]));
  }

  return (
    <section
      className={`film-hero relative h-[100svh] min-h-[560px] overflow-hidden bg-black text-white ${covered ? "is-covered" : ""}`}
    >
      {/* Giant surname, letters rise in one by one */}
      <p
        aria-hidden
        className="pointer-events-none absolute -bottom-[0.22em] -left-[0.04em] z-0 select-none whitespace-nowrap text-[23.5vw] font-normal leading-none tracking-[-0.05em] text-[#2a2a2a] transition-opacity duration-500"
        style={{ opacity: covered ? 0.4 : 1 }}
      >
        {SURNAME.split("").map((ch, i) => (
          <span key={i} className="inline-block" style={{ animation: `letter-rise 1.8s ${EASE_SOFT} ${1.2 + i * 0.12}s both` }}>
            {ch}
          </span>
        ))}
      </p>

      {/* Poster row: slides in from the right while each poster is revealed bottom-up, one after another */}
      <div className={`absolute left-1/2 top-[18.5vh] z-10 -translate-x-1/2 ${covered ? "pointer-events-none" : ""}`}>
        <div className="flex h-[60vh] items-end gap-[1.5vw] sm:gap-[1.4vw]" style={{ animation: `row-in 3.2s ${EASE_GLIDE} .4s both` }}>
          {films.map((film, i) => (
            <button
              key={film.id}
              onClick={() => open(film)}
              aria-label={`Open ${film.title}`}
              className="poster group relative h-[60vh] w-[11vw] max-w-[200px] outline-none sm:w-[9vw]"
              style={{ animation: `grow-up 1.8s ${EASE_SOFT} ${0.6 + i * 0.22}s both` }}
            >
              <span className={`poster-clip absolute inset-0 ${selected?.id === film.id ? "is-open" : ""}`}>
                <Image
                  src={film.poster}
                  alt=""
                  fill
                  loading="eager"
                  sizes="(max-width: 640px) 11vw, 9vw"
                  className="poster-img object-cover"
                />
                {film.posterColor && (
                  <Image
                    src={film.posterColor}
                    alt=""
                    fill
                    loading="eager"
                    sizes="(max-width: 640px) 11vw, 9vw"
                    className="poster-color object-cover"
                  />
                )}
                <span className="scanline" />
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Thin guide line that drops from the breadcrumb before the strip opens */}
      {opening && (
        <span
          aria-hidden
          className="absolute left-1/2 top-[8vh] z-[25] h-[92vh] w-px origin-top bg-white/40"
          style={{ animation: `line-down .5s ${EASE_IN_OUT} .2s both` }}
        />
      )}

      {/* Detail panel: a center strip that widens to full screen */}
      {selected && covered && (
        <div
          className="absolute inset-0 z-30 overflow-hidden bg-black"
          style={{
            animation:
              phase === "closing"
                ? `collapse ${CLOSE_MS}ms ${EASE_IN_OUT} both`
                : `expand 1.4s ${EASE_IN_OUT} .6s both`,
          }}
        >
          <div className="absolute inset-0" style={{ animation: `zoom-settle 2.2s ${EASE_OUT} .6s both` }}>
            <Backdrop film={selected} />
          </div>
          <div className="absolute inset-0 bg-gradient-to-b from-black/45 via-transparent to-black/85" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/35 via-transparent to-black/45" />
          {phase === "detail" && <Details film={selected} />}
        </div>
      )}

      {/* Breadcrumb: the opening strip passes over it, then it returns with the film added */}
      <nav
        key={phase === "detail" ? "detail" : "grid"}
        aria-label="Breadcrumb"
        className={`absolute left-1/2 top-[4.5vh] -translate-x-1/2 whitespace-nowrap text-[clamp(12px,1.1vw,20px)] ${
          opening ? "z-[25]" : "z-50"
        }`}
        style={{ animation: phase === "detail" ? `fade-in .6s ease both` : `fade-in 1.6s ease .4s both` }}
      >
        <ol className="flex items-center gap-[0.8em]">
          <li>
            <Link href="/" className="text-white/55 transition-colors hover:text-white">Main</Link>
          </li>
          <Chevron />
          <li className="text-white/55">Films</li>
          <Chevron />
          <li>
            {phase === "detail" ? (
              <button onClick={close} className="text-white/55 transition-colors hover:text-white">
                Denis Villeneuve
              </button>
            ) : (
              <span className="text-white">Denis Villeneuve</span>
            )}
          </li>
          {phase === "detail" && selected && (
            <>
              <Chevron />
              <li className="text-white" style={{ animation: `fade-up .5s ${EASE_OUT} .15s both` }}>
                {selected.title}
              </li>
            </>
          )}
        </ol>
      </nav>

      {/* Dock: dims and sits under the opening strip, then fades back in on top */}
      <div
        className={`absolute bottom-[3vh] left-1/2 -translate-x-1/2 transition-opacity ${opening ? "z-[25]" : "z-50"}`}
        style={{
          opacity: covered && phase !== "detail" ? 0.35 : 1,
          transitionDuration: phase === "detail" ? "900ms" : "500ms",
          transitionDelay: phase === "detail" ? "500ms" : "0ms",
        }}
      >
        <div
          className="flex h-[clamp(52px,6vh,76px)] items-stretch gap-1.5 rounded-2xl bg-[#0b0b0b]/90 p-1.5 backdrop-blur"
          style={{ animation: `fade-up 1.6s ${EASE_SOFT} .5s both` }}
        >
          <Link
            href="/"
            aria-label="Home"
            className="grid w-[clamp(64px,6vw,120px)] place-items-center rounded-lg bg-[#f5c518] text-black"
          >
            <span
              className="inline-block text-[clamp(16px,1.5vw,28px)] font-black tracking-tight"
              style={{ animation: `logo-in 2s ${EASE_SOFT} .7s both` }}
            >
              IMDb
            </span>
          </Link>

          <div className="relative flex items-center gap-[2.2vw] rounded-lg bg-[#1c1c1c] px-5 text-[clamp(12px,0.85vw,16px)] text-white/60">
            <button
              onClick={() => setMenuOpen((o) => !o)}
              aria-expanded={menuOpen}
              className="flex items-center gap-2 transition-colors hover:text-white"
            >
              <GridIcon /> Menu
            </button>
            {["Actors", "Description", "Title", "Title"].map((label, i) => (
              <button key={i} className="hidden transition-colors hover:text-white md:inline">
                {label}
              </button>
            ))}
            {menuOpen && (
              <div className="absolute bottom-full left-0 mb-2 w-44 rounded-lg bg-[#1c1c1c] p-1.5 shadow-xl">
                {[
                  { href: "/", label: "Home" },
                  { href: "/habits", label: "Habits" },
                  { href: "/about", label: "About" },
                ].map((l) => (
                  <Link
                    key={l.href}
                    href={l.href}
                    onClick={() => setMenuOpen(false)}
                    className="block rounded-md px-3 py-2 text-white/70 hover:bg-white/10 hover:text-white"
                  >
                    {l.label}
                  </Link>
                ))}
              </div>
            )}
          </div>

          <DockIcon label={isSaved ? "Saved" : "Save"} onClick={toggleSave} disabled={!selected}>
            <path d="M6 3h12v18l-6-4-6 4z" fill={isSaved ? "currentColor" : "none"} />
          </DockIcon>
          <DockIcon label="Search">
            <circle cx="11" cy="11" r="6" />
            <path d="M20 20l-4.5-4.5" />
          </DockIcon>
          <DockIcon label="Sign In">
            <circle cx="12" cy="8" r="4" />
            <path d="M4 21c1.5-4 4.5-6 8-6s6.5 2 8 6" />
          </DockIcon>
        </div>
      </div>
    </section>
  );
}

function Backdrop({ film }: { film: Film }) {
  if (film.backdrop) {
    return (
      <Image
        src={film.backdrop}
        alt=""
        fill
        sizes="100vw"
        className="object-cover"
        style={{ objectPosition: film.backdropPosition ?? "center" }}
      />
    );
  }
  // Poster only: blurred fill behind a full-height poster
  const src = film.posterColor ?? film.poster;
  return (
    <>
      <Image src={src} alt="" fill sizes="30vw" className="scale-125 object-cover blur-2xl brightness-50" />
      <div className="absolute inset-y-0 left-1/2 aspect-[303/1025] -translate-x-1/2">
        <Image src={src} alt="" fill sizes="30vw" className="object-cover" />
      </div>
    </>
  );
}

function trailerUrl(film: Film) {
  return `https://www.youtube.com/results?search_query=${encodeURIComponent(`${film.title} official trailer`)}`;
}

function Details({ film }: { film: Film }) {
  let n = 0; // running letter index across title lines, for the stagger
  const words = film.description.split(" ");
  // Long lines ("Blade Runner") shrink so the title stays clear of the centered breadcrumb
  const longest = Math.max(...film.lines.map((l) => l.length));
  const titleSize = `clamp(40px, ${Math.min(7.6, 68 / longest).toFixed(2)}vw, 170px)`;
  const titleEnd = 0.05 + film.lines.join("").length * 0.05 + 0.5;
  const descStart = Math.max(0.8, titleEnd - 0.3);
  const infoStart = descStart + words.length * 0.014 + 0.2;
  const meta = [
    { label: "Country", values: film.countries },
    { label: "Studio", values: [film.studio] },
    { label: "Time", values: [film.runtime] },
    { label: "Date", values: [film.released] },
    { label: "Rate", values: [film.age] },
  ];

  return (
    <>
      <h2
        aria-label={film.title}
        className="absolute left-[1.7vw] top-[3.5vh] z-10 font-normal leading-[0.92] tracking-[-0.045em] max-md:top-[9vh]"
        style={{ fontSize: titleSize }}
      >
        {film.lines.map((line) => (
          <span key={line} aria-hidden className="block overflow-hidden pb-[0.06em]">
            {line.split("").map((ch, i) => (
              <span
                key={i}
                className="inline-block"
                style={{ animation: `letter-rise .8s ${EASE_OUT} ${0.05 + n++ * 0.05}s both` }}
              >
                {ch === " " ? " " : ch}
              </span>
            ))}
          </span>
        ))}
      </h2>

      <div className="absolute right-[1.5vw] top-[4.8vh] z-10 w-[min(24vw,480px)] max-md:left-4 max-md:right-4 max-md:top-[34vh] max-md:w-auto">
        {/* Each word rises out of its own mask, so lines appear to wipe in */}
        <p className="text-[clamp(13px,0.95vw,19px)] leading-snug text-white/90">
          {words.map((w, i) => (
            <Fragment key={i}>
              <span className="-mb-[0.2em] inline-block overflow-hidden pb-[0.2em] align-bottom">
                <span
                  className="inline-block"
                  style={{ animation: `letter-rise .7s ${EASE_OUT} ${descStart + i * 0.014}s both` }}
                >
                  {w}
                </span>
              </span>{" "}
            </Fragment>
          ))}
        </p>
        <div
          className="mt-[3vh] inline-flex items-center gap-4 rounded-full bg-[#f5c518] px-6 py-3 text-black"
          style={{ animation: `fade-up .6s ${EASE_OUT} ${infoStart}s both` }}
        >
          <span className="text-xl font-black tracking-tight">IMDb</span>
          <span>{film.rating}</span>
        </div>
      </div>

      {/* Film facts, bottom left */}
      <dl className="absolute bottom-[4.5vh] left-[2.1vw] z-10 flex flex-col gap-[1vh] max-md:bottom-[13vh] max-md:left-4">
        {meta.map((row, i) => (
          <div
            key={row.label}
            className="flex items-center"
            style={{ animation: `fade-up .7s ${EASE_OUT} ${infoStart + (i === 0 ? 0 : 0.35 + i * 0.1)}s both` }}
          >
            <dt className="w-[max(64px,3.6vw)] text-[clamp(12px,0.85vw,17px)] text-white/85">{row.label}:</dt>
            <dd className="flex gap-[0.6vw]">
              {row.values.map((v) => (
                <span
                  key={v}
                  className="rounded-full border border-white/75 px-[max(14px,1.2vw)] py-[max(6px,0.9vh)] text-[clamp(12px,0.85vw,17px)]"
                >
                  {v}
                </span>
              ))}
            </dd>
          </div>
        ))}
      </dl>

      {/* Round button: starts as a small ▼ and grows into the trailer play button */}
      <a
        href={trailerUrl(film)}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`Watch the ${film.title} trailer`}
        className="absolute left-1/2 top-1/2 z-10 -translate-x-1/2 -translate-y-1/2"
      >
        <span
          className="grid h-[clamp(96px,9.5vw,200px)] w-[clamp(96px,9.5vw,200px)] place-items-center rounded-full bg-white/20 backdrop-blur-md transition-colors hover:bg-white/30"
          style={{ animation: `orb-grow 1.6s ${EASE_SOFT} ${infoStart}s both` }}
        >
          <svg
            viewBox="0 0 10 10"
            aria-hidden
            className="w-[18%] [grid-area:1/1]"
            style={{ animation: `icon-out 1.6s linear ${infoStart}s both` }}
          >
            <path d="M1 3h8L5 8z" fill="currentColor" />
          </svg>
          <svg
            viewBox="0 0 10 10"
            aria-hidden
            className="ml-[4%] w-[22%] [grid-area:1/1]"
            style={{ animation: `icon-in 1.6s linear ${infoStart}s both` }}
          >
            <path d="M2 1l7 4-7 4z" fill="currentColor" />
          </svg>
        </span>
      </a>

      {/* Side toolbar, right edge */}
      <div className="absolute right-[1.2vw] top-1/2 z-10 -translate-y-1/2 max-sm:hidden">
        <div
          className="flex flex-col gap-1.5 rounded-2xl bg-[#0b0b0b]/90 p-1.5"
          style={{ animation: `side-in .8s ${EASE_OUT} ${infoStart + 0.5}s both` }}
        >
          <ToolButton label="Download">
            <path d="M12 4v11m0 0l-4-4m4 4l4-4M5 20h14" />
          </ToolButton>
          <ToolButton label="Reviews" badge>
            <path d="M4 5h16v11H9l-5 4z" />
          </ToolButton>
          <ToolButton label="Trailer" href={trailerUrl(film)}>
            <path d="M8 5l11 7-11 7z" fill="currentColor" />
          </ToolButton>
        </div>
      </div>
    </>
  );
}

function Chevron() {
  return (
    <li aria-hidden className="text-white/55">
      <svg width="8" height="12" viewBox="0 0 8 12" fill="none" stroke="currentColor" strokeWidth="1.4">
        <path d="M2 1l5 5-5 5" />
      </svg>
    </li>
  );
}

function GridIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" aria-hidden>
      {[2, 8, 14].flatMap((y) => [2, 8, 14].map((x) => <circle key={`${x}-${y}`} cx={x} cy={y} r="1.1" />))}
    </svg>
  );
}

function DockIcon({
  label,
  children,
  onClick,
  disabled,
}: {
  label: string;
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="flex w-[clamp(52px,4.4vw,76px)] flex-col items-center justify-center gap-1 rounded-lg bg-[#1c1c1c] text-white/70 transition-colors hover:text-white disabled:hover:text-white/70"
    >
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
        {children}
      </svg>
      <span className="text-[9px] text-white/40">{label}</span>
    </button>
  );
}

function ToolButton({
  label,
  children,
  href,
  badge,
}: {
  label: string;
  children: React.ReactNode;
  href?: string;
  badge?: boolean;
}) {
  const className =
    "relative flex h-[clamp(52px,3.6vw,72px)] w-[clamp(52px,3.6vw,72px)] flex-col items-center justify-center gap-1 rounded-lg bg-[#1c1c1c] text-white/70 transition-colors hover:text-white";
  const content = (
    <>
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
        {children}
      </svg>
      {badge && <span aria-hidden className="absolute right-[26%] top-[18%] h-2 w-2 rounded-full bg-[#f5c518]" />}
      <span className="text-[9px] text-white/40">{label}</span>
    </>
  );
  return href ? (
    <a href={href} target="_blank" rel="noopener noreferrer" className={className}>
      {content}
    </a>
  ) : (
    <button className={className}>{content}</button>
  );
}
