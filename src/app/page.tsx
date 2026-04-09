import Link from "next/link";

const tools = [
  {
    href: "/congruencias",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
        className="size-8 text-primary"
      >
        <path d="M18 7V4H6l6 8-6 8h12v-3" />
      </svg>
    ),
    title: "Congruencias",
    description:
      "Resuelve sistemas de congruencias lineales, calcula el inverso modular y aplica el Teorema Chino del Resto.",
  },
  {
    href: "/rsa",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
        className="size-8 text-primary"
      >
        <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
      </svg>
    ),
    title: "Cifrado RSA",
    description:
      "Genera claves publica y privada, cifra y descifra mensajes con el algoritmo RSA paso a paso.",
  },
  {
    href: "/afin",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
        className="size-8 text-primary"
      >
        <path d="M4 22h14a2 2 0 0 0 2-2V7l-5-5H6a2 2 0 0 0-2 2v4" />
        <path d="M14 2v5h5" />
        <path d="m3 15 2 2 4-4" />
      </svg>
    ),
    title: "Cifrado Afin",
    description:
      "Encripta y desencripta con el cifrado afin C = (a·M + b) mod n, paso a paso.",
  },
  {
    href: "/nif",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
        className="size-8 text-primary"
      >
        <rect x="2" y="5" width="20" height="14" rx="2" />
        <circle cx="8" cy="12" r="2" />
        <path d="M14 10h4" />
        <path d="M14 14h4" />
        <path d="M6 16c0-1.1.9-2 2-2s2 .9 2 2" />
      </svg>
    ),
    title: "Validacion NIF",
    description:
      "Valida y genera la letra de control del NIF/DNI usando aritmetica modular.",
  },
];

export default function Home() {
  return (
    <div className="flex flex-col min-h-dvh">
      {/* ── Header with gradient ────────────────────────────── */}
      <header className="relative overflow-hidden bg-gradient-to-br from-primary via-blue-700 to-indigo-800 px-5 pb-8 pt-12 text-white">
        {/* Decorative circles */}
        <div className="pointer-events-none absolute -right-10 -top-10 size-40 rounded-full bg-white/10" />
        <div className="pointer-events-none absolute -left-6 bottom-4 size-24 rounded-full bg-white/5" />

        <div className="relative mx-auto max-w-lg">
          <p className="mb-1 text-xs font-semibold uppercase tracking-widest text-blue-200">
            Universidad Nacional de Ingenieria
          </p>
          <h1 className="text-2xl font-bold leading-tight tracking-tight">
            MA475 Matematica Computacional
          </h1>
          <p className="mt-2 text-sm leading-relaxed text-blue-100">
            Semana 1: Aritmetica Modular y Criptografia
          </p>
        </div>
      </header>

      {/* ── Tool cards ──────────────────────────────────────── */}
      <main className="mx-auto w-full max-w-lg flex-1 px-4 py-6">
        <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-text-secondary">
          Herramientas
        </h2>

        <div className="flex flex-col gap-3">
          {tools.map((tool, i) => (
            <Link
              key={tool.href}
              href={tool.href}
              className={`card-hover group flex items-center gap-4 rounded-2xl border border-border bg-surface-card p-4 shadow-sm animate-slide-in-up delay-${i + 1}`}
            >
              {/* Icon container */}
              <div className="flex size-14 shrink-0 items-center justify-center rounded-xl bg-primary/5 transition-colors group-hover:bg-primary/10">
                {tool.icon}
              </div>

              {/* Text */}
              <div className="flex-1 min-w-0">
                <h3 className="text-base font-semibold text-text-primary">
                  {tool.title}
                </h3>
                <p className="mt-0.5 text-sm leading-snug text-text-secondary">
                  {tool.description}
                </p>
              </div>

              {/* Arrow */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                className="size-5 shrink-0 text-text-secondary/50 transition-transform group-hover:translate-x-0.5"
              >
                <path
                  fillRule="evenodd"
                  d="M7.21 14.77a.75.75 0 0 1 .02-1.06L11.17 10 7.23 6.29a.75.75 0 1 1 1.04-1.08l4.5 4.25a.75.75 0 0 1 0 1.08l-4.5 4.25a.75.75 0 0 1-1.06-.02Z"
                  clipRule="evenodd"
                />
              </svg>
            </Link>
          ))}
        </div>

        {/* ── Footer note ─────────────────────────────────── */}
        <p className="mt-8 text-center text-xs text-text-secondary/70">
          Selecciona una herramienta para comenzar
        </p>
      </main>
    </div>
  );
}
