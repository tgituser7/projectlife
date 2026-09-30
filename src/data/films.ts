export type Film = {
  id: string;
  title: string;
  /** Title split into the lines shown in the big heading. */
  lines: string[];
  poster: string;
  /** Color version shown on hover / when opened; falls back to brightening `poster`. */
  posterColor?: string;
  /** Wide full-bleed image for the detail view; falls back to the poster. */
  backdrop?: string;
  /** CSS object-position for the backdrop (default "center"). */
  backdropPosition?: string;
  description: string;
  rating: string;
  countries: string[];
  studio: string;
  runtime: string;
  released: string;
  age: string;
};

export const films: Film[] = [
  {
    id: "arrival",
    title: "Arrival",
    lines: ["Arrival"],
    poster: "/posters/arrival-color.jpg",
    backdrop: "/posters/arrival-backdrop.jpg",
    description:
      "When twelve mysterious spacecraft touch down around the world, linguist Louise Banks is recruited to find a way to talk to the visitors before rising global tensions tip into war.",
    rating: "7.9",
    countries: ["Usa"],
    studio: "Paramount",
    runtime: "1h 56min",
    released: "11 Nov 2016",
    age: "13+",
  },
  {
    id: "dune-part-two",
    title: "Dune: Part Two",
    lines: ["Dune:", "Part Two"],
    poster: "/posters/dune-part-two.jpg",
    posterColor: "/posters/dune-part-two-color.jpg",
    backdrop: "/posters/dune-part-two-backdrop.jpg",
    backdropPosition: "top",
    description:
      "Paul Atreides unites with Chani and the Fremen while on a warpath of revenge against the conspirators who destroyed his family. Facing a choice between the love of his life and the fate of the known universe, he endeavors to prevent a terrible future only he can foresee.—Warner Bros. Pictures",
    rating: "8.5",
    countries: ["Usa", "Canada"],
    studio: "Warner Bros.",
    runtime: "2h 46min",
    released: "28 Feb 2024",
    age: "13+",
  },
  {
    id: "dune",
    title: "Dune",
    lines: ["Dune"],
    poster: "/posters/dune-color.jpg",
    backdrop: "/posters/dune-backdrop.jpg",
    description:
      "Paul Atreides, heir to a noble house, travels to the desert planet Arrakis, the only source of the most precious resource in the universe, where betrayal drives him into the deep desert.",
    rating: "8.0",
    countries: ["Usa", "Canada"],
    studio: "Warner Bros.",
    runtime: "2h 35min",
    released: "22 Oct 2021",
    age: "13+",
  },
  {
    id: "prisoners",
    title: "Prisoners",
    lines: ["Prisoners"],
    poster: "/posters/prisoners-color.jpg",
    backdrop: "/posters/prisoners-backdrop.jpg",
    description:
      "When his young daughter and her friend go missing, a desperate father takes matters into his own hands while a relentless detective races to find the girls.",
    rating: "8.1",
    countries: ["Usa"],
    studio: "Warner Bros.",
    runtime: "2h 33min",
    released: "20 Sep 2013",
    age: "17+",
  },
  {
    id: "enemy",
    title: "Enemy",
    lines: ["Enemy"],
    poster: "/posters/enemy-color.jpg",
    backdrop: "/posters/enemy-backdrop.jpg",
    description:
      "A quiet history professor spots his exact double in a movie and becomes obsessed with meeting him, a discovery that slowly unravels both of their lives.",
    rating: "6.9",
    countries: ["Canada", "Spain"],
    studio: "A24",
    runtime: "1h 31min",
    released: "14 Mar 2014",
    age: "17+",
  },
  {
    id: "blade-runner-2049",
    title: "Blade Runner 2049",
    lines: ["Blade Runner", "2049"],
    poster: "/posters/blade-runner-2049-color.jpg",
    backdrop: "/posters/blade-runner-2049-backdrop.jpg",
    description:
      "Thirty years after the original, blade runner K unearths a long-buried secret that sends him searching for Rick Deckard, who has been missing for three decades.",
    rating: "8.0",
    countries: ["Usa", "Canada"],
    studio: "Warner Bros.",
    runtime: "2h 44min",
    released: "6 Oct 2017",
    age: "17+",
  },
  {
    id: "sicario",
    title: "Sicario",
    lines: ["Sicario"],
    poster: "/posters/sicario-color.jpg",
    backdrop: "/posters/sicario-backdrop.jpg",
    description:
      "An idealistic FBI agent is drafted into a covert task force fighting the drug war along the US–Mexico border, where the line between right and wrong quickly blurs.",
    rating: "7.6",
    countries: ["Usa"],
    studio: "Lionsgate",
    runtime: "2h 1min",
    released: "2 Oct 2015",
    age: "17+",
  },
];
