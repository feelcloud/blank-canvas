import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";

export const Route = createFileRoute("/")({
  component: Index,
  head: () => ({
    meta: [
      { title: "Campeonato 2026 — Lista de Jogadores" },
      {
        name: "description",
        content:
          "Elenco completo, posições, números, clubes e estatísticas dos jogadores do campeonato 2026.",
      },
    ],
  }),
});

type Player = {
  id: number;
  name: string;
  number: number;
  position: "Goleiro" | "Zagueiro" | "Lateral" | "Meio-campo" | "Atacante";
  club: string;
  age: number;
  goals: number;
  assists: number;
  matches: number;
};

const PLAYERS: Player[] = [
  { id: 1, name: "Lucas Almeida", number: 1, position: "Goleiro", club: "Tigres FC", age: 28, goals: 0, assists: 1, matches: 14 },
  { id: 2, name: "Rafael Souza", number: 4, position: "Zagueiro", club: "Tigres FC", age: 30, goals: 2, assists: 0, matches: 14 },
  { id: 3, name: "Bruno Martins", number: 3, position: "Zagueiro", club: "Águias EC", age: 26, goals: 1, assists: 1, matches: 13 },
  { id: 4, name: "Diego Ramos", number: 6, position: "Lateral", club: "Leões SC", age: 24, goals: 0, assists: 4, matches: 14 },
  { id: 5, name: "Pedro Henrique", number: 8, position: "Meio-campo", club: "Tigres FC", age: 25, goals: 3, assists: 6, matches: 14 },
  { id: 6, name: "Gustavo Lima", number: 10, position: "Meio-campo", club: "Águias EC", age: 27, goals: 7, assists: 9, matches: 14 },
  { id: 7, name: "Thiago Costa", number: 7, position: "Atacante", club: "Leões SC", age: 23, goals: 11, assists: 4, matches: 14 },
  { id: 8, name: "Marcelo Dias", number: 9, position: "Atacante", club: "Tigres FC", age: 29, goals: 13, assists: 2, matches: 13 },
  { id: 9, name: "André Oliveira", number: 11, position: "Atacante", club: "Falcões AC", age: 22, goals: 8, assists: 5, matches: 14 },
  { id: 10, name: "Felipe Rocha", number: 5, position: "Meio-campo", club: "Falcões AC", age: 26, goals: 2, assists: 3, matches: 12 },
  { id: 11, name: "Caio Pereira", number: 2, position: "Lateral", club: "Águias EC", age: 25, goals: 1, assists: 2, matches: 14 },
  { id: 12, name: "João Vitor", number: 14, position: "Meio-campo", club: "Leões SC", age: 21, goals: 4, assists: 5, matches: 13 },
  { id: 13, name: "Eduardo Silva", number: 17, position: "Atacante", club: "Águias EC", age: 28, goals: 9, assists: 3, matches: 14 },
  { id: 14, name: "Vinícius Moraes", number: 21, position: "Zagueiro", club: "Falcões AC", age: 24, goals: 0, assists: 0, matches: 14 },
  { id: 15, name: "Mateus Barbosa", number: 12, position: "Goleiro", club: "Águias EC", age: 31, goals: 0, assists: 0, matches: 14 },
  { id: 16, name: "Henrique Faria", number: 19, position: "Atacante", club: "Tigres FC", age: 20, goals: 5, assists: 6, matches: 12 },
];

const POSITIONS = ["Todos", "Goleiro", "Zagueiro", "Lateral", "Meio-campo", "Atacante"] as const;

function positionColor(p: Player["position"]) {
  switch (p) {
    case "Goleiro": return "bg-amber-100 text-amber-800";
    case "Zagueiro": return "bg-blue-100 text-blue-800";
    case "Lateral": return "bg-cyan-100 text-cyan-800";
    case "Meio-campo": return "bg-emerald-100 text-emerald-800";
    case "Atacante": return "bg-rose-100 text-rose-800";
  }
}

function initials(name: string) {
  return name.split(" ").map((n) => n[0]).slice(0, 2).join("").toUpperCase();
}

function Index() {
  const [query, setQuery] = useState("");
  const [position, setPosition] = useState<(typeof POSITIONS)[number]>("Todos");

  const clubs = useMemo(() => Array.from(new Set(PLAYERS.map((p) => p.club))), []);

  const filtered = useMemo(() => {
    return PLAYERS.filter((p) => {
      const matchesQ =
        query.trim() === "" ||
        p.name.toLowerCase().includes(query.toLowerCase()) ||
        p.club.toLowerCase().includes(query.toLowerCase());
      const matchesPos = position === "Todos" || p.position === position;
      return matchesQ && matchesPos;
    });
  }, [query, position]);

  const topScorer = useMemo(
    () => [...PLAYERS].sort((a, b) => b.goals - a.goals)[0],
    []
  );

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      {/* Header */}
      <header className="bg-gradient-to-br from-emerald-700 via-emerald-600 to-teal-600 text-white">
        <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-14">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-emerald-100">
            <span className="inline-block h-2 w-2 rounded-full bg-emerald-300" />
            Temporada 2026
          </div>
          <h1 className="mt-3 text-3xl font-bold tracking-tight sm:text-5xl">
            Campeonato Estadual
          </h1>
          <p className="mt-3 max-w-2xl text-emerald-50/90 sm:text-lg">
            Confira o elenco completo, posições, números e estatísticas atualizadas dos jogadores que disputam a temporada.
          </p>

          <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
            <Stat label="Jogadores" value={PLAYERS.length} />
            <Stat label="Clubes" value={clubs.length} />
            <Stat label="Gols" value={PLAYERS.reduce((s, p) => s + p.goals, 0)} />
            <Stat label="Assistências" value={PLAYERS.reduce((s, p) => s + p.assists, 0)} />
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-12">
        {/* Top scorer card */}
        <section className="mb-8 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-emerald-700">
                Artilheiro
              </p>
              <h2 className="mt-1 text-xl font-bold sm:text-2xl">{topScorer.name}</h2>
              <p className="text-sm text-slate-500">
                {topScorer.club} · {topScorer.position}
              </p>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-emerald-700 sm:text-4xl">
                {topScorer.goals}
              </div>
              <div className="text-xs uppercase tracking-wider text-slate-500">gols</div>
            </div>
          </div>
        </section>

        {/* Filters */}
        <section className="mb-6 space-y-3">
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar por nome ou clube..."
            className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm shadow-sm outline-none placeholder:text-slate-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
          />
          <div className="flex flex-wrap gap-2">
            {POSITIONS.map((p) => (
              <button
                key={p}
                onClick={() => setPosition(p)}
                className={`rounded-full px-3 py-1.5 text-xs font-semibold transition ${
                  position === p
                    ? "bg-emerald-700 text-white shadow"
                    : "bg-white text-slate-600 ring-1 ring-slate-200 hover:bg-slate-100"
                }`}
              >
                {p}
              </button>
            ))}
          </div>
        </section>

        {/* Players list */}
        <section>
          <div className="mb-3 flex items-baseline justify-between">
            <h2 className="text-lg font-semibold">Jogadores</h2>
            <span className="text-sm text-slate-500">{filtered.length} resultado(s)</span>
          </div>

          {filtered.length === 0 ? (
            <div className="rounded-xl border border-dashed border-slate-300 bg-white p-10 text-center text-slate-500">
              Nenhum jogador encontrado.
            </div>
          ) : (
            <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {filtered.map((p) => (
                <li
                  key={p.id}
                  className="group flex items-center gap-4 rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:border-emerald-300 hover:shadow-md"
                >
                  <div className="relative flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-emerald-600 to-teal-600 text-base font-bold text-white">
                    {initials(p.name)}
                    <span className="absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-white text-xs font-bold text-emerald-700 ring-2 ring-white">
                      {p.number}
                    </span>
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <p className="truncate font-semibold">{p.name}</p>
                    </div>
                    <p className="truncate text-sm text-slate-500">{p.club}</p>
                    <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
                      <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${positionColor(p.position)}`}>
                        {p.position}
                      </span>
                      <span className="text-[11px] text-slate-500">{p.age} anos</span>
                    </div>
                  </div>
                  <div className="hidden shrink-0 text-right sm:block">
                    <div className="text-sm font-bold text-slate-900">{p.goals}G · {p.assists}A</div>
                    <div className="text-[11px] text-slate-500">{p.matches} jogos</div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>
      </main>

      <footer className="border-t border-slate-200 bg-white">
        <div className="mx-auto max-w-6xl px-4 py-6 text-center text-xs text-slate-500 sm:px-6">
          © 2026 Campeonato Estadual · Dados ilustrativos
        </div>
      </footer>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-xl bg-white/10 px-4 py-3 backdrop-blur-sm ring-1 ring-white/15">
      <div className="text-2xl font-bold sm:text-3xl">{value}</div>
      <div className="text-xs uppercase tracking-wider text-emerald-50/80">{label}</div>
    </div>
  );
}
