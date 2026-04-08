"use client";

import { useState } from "react";
import Link from "next/link";
import {
  solveBruteForce,
  solveMultiplicativeInverse,
  solveExtendedEuclid,
} from "@/lib/math/congruence";
import type { CongruenceResult, SolutionStep } from "@/lib/math/congruence";

type Method = "bruteforce" | "inverse" | "euclid";

const METHODS: { key: Method; label: string }[] = [
  { key: "bruteforce", label: "Fuerza Bruta" },
  { key: "inverse", label: "Inverso Multiplicativo" },
  { key: "euclid", label: "Euclides Extendido" },
];

function StepCard({
  step,
  index,
  isLast,
}: {
  step: SolutionStep;
  index: number;
  isLast: boolean;
}) {
  return (
    <div
      className={`rounded-xl border p-4 sm:p-5 transition-all duration-500 ease-out opacity-0 translate-y-4 animate-[fadeSlideIn_0.4s_ease-out_forwards] ${
        isLast
          ? "border-emerald-300 bg-emerald-50 dark:border-emerald-700 dark:bg-emerald-950/40"
          : "border-slate-200 bg-white dark:border-zinc-700 dark:bg-zinc-800"
      }`}
      style={{ animationDelay: `${index * 150}ms` }}
    >
      <h3
        className={`text-sm font-bold mb-1 ${
          isLast
            ? "text-emerald-700 dark:text-emerald-400"
            : "text-slate-800 dark:text-zinc-100"
        }`}
      >
        {step.title}
      </h3>
      <p className="text-sm text-slate-600 dark:text-zinc-400 whitespace-pre-line leading-relaxed">
        {step.explanation}
      </p>
      <pre
        className={`mt-2 rounded-lg p-3 text-sm font-mono overflow-x-auto whitespace-pre-wrap break-words ${
          isLast
            ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/50 dark:text-emerald-300"
            : "bg-slate-100 text-slate-800 dark:bg-zinc-900 dark:text-zinc-200"
        }`}
      >
        {step.math}
      </pre>
    </div>
  );
}

function ErrorCard({ reason }: { reason: string }) {
  return (
    <div className="rounded-xl border border-red-300 bg-red-50 p-5 dark:border-red-700 dark:bg-red-950/40 animate-[fadeSlideIn_0.4s_ease-out_forwards]">
      <div className="flex items-start gap-3">
        <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/50">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-red-600 dark:text-red-400"
          >
            <circle cx="12" cy="12" r="10" />
            <line x1="15" x2="9" y1="9" y2="15" />
            <line x1="9" x2="15" y1="9" y2="15" />
          </svg>
        </div>
        <div>
          <h3 className="font-bold text-red-700 dark:text-red-400">
            Sin solucion
          </h3>
          <p className="mt-1 text-sm text-red-600 dark:text-red-300">
            {reason}
          </p>
        </div>
      </div>
    </div>
  );
}

export default function CalculadoraPage() {
  const [useOffset, setUseOffset] = useState(false);
  const [a, setA] = useState("");
  const [b, setB] = useState("");
  const [n, setN] = useState("");
  const [c, setC] = useState("");
  const [method, setMethod] = useState<Method>("bruteforce");
  const [result, setResult] = useState<CongruenceResult | null>(null);
  const [showResult, setShowResult] = useState(false);

  function handleSolve() {
    const aNum = parseInt(a, 10);
    const bNum = parseInt(b, 10);
    const nNum = parseInt(n, 10);

    if (isNaN(aNum) || isNaN(bNum) || isNaN(nNum) || nNum <= 0) return;

    const input = {
      a: aNum,
      b: bNum,
      n: nNum,
      offset: useOffset ? parseInt(c, 10) || 0 : undefined,
    };

    let res: CongruenceResult;
    switch (method) {
      case "bruteforce":
        res = solveBruteForce(input);
        break;
      case "inverse":
        res = solveMultiplicativeInverse(input);
        break;
      case "euclid":
        res = solveExtendedEuclid(input);
        break;
    }

    setShowResult(false);
    setResult(res);
    // Trigger animation on next frame
    requestAnimationFrame(() => setShowResult(true));
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-zinc-950 dark:to-zinc-900">
      <style>{`
        @keyframes fadeSlideIn {
          from {
            opacity: 0;
            transform: translateY(16px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
      <div className="mx-auto max-w-2xl px-4 py-8 sm:py-12">
        {/* Back link */}
        <Link
          href="/congruencias"
          className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-slate-800 dark:text-zinc-400 dark:hover:text-zinc-200 transition-colors mb-8"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M19 12H5" />
            <path d="m12 19-7-7 7-7" />
          </svg>
          Congruencias
        </Link>

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-zinc-50 tracking-tight">
            Calculadora de Congruencias
          </h1>
          <p className="mt-2 text-slate-600 dark:text-zinc-400">
            Ingresa los valores y selecciona un metodo de resolucion.
          </p>
        </div>

        {/* Format toggle */}
        <div className="mb-6">
          <label className="text-sm font-medium text-slate-700 dark:text-zinc-300 mb-2 block">
            Formato de la ecuacion
          </label>
          <div className="flex rounded-xl bg-slate-100 dark:bg-zinc-800 p-1">
            <button
              type="button"
              onClick={() => setUseOffset(false)}
              className={`flex-1 rounded-lg py-3 px-4 text-sm font-medium transition-all min-h-[44px] ${
                !useOffset
                  ? "bg-white text-slate-900 shadow-sm dark:bg-zinc-700 dark:text-zinc-50"
                  : "text-slate-500 hover:text-slate-700 dark:text-zinc-400 dark:hover:text-zinc-200"
              }`}
            >
              <span className="font-mono">ax &equiv; b mod n</span>
            </button>
            <button
              type="button"
              onClick={() => setUseOffset(true)}
              className={`flex-1 rounded-lg py-3 px-4 text-sm font-medium transition-all min-h-[44px] ${
                useOffset
                  ? "bg-white text-slate-900 shadow-sm dark:bg-zinc-700 dark:text-zinc-50"
                  : "text-slate-500 hover:text-slate-700 dark:text-zinc-400 dark:hover:text-zinc-200"
              }`}
            >
              <span className="font-mono">c + ax &equiv; b mod n</span>
            </button>
          </div>
        </div>

        {/* Input fields */}
        <div className="mb-6 grid grid-cols-3 gap-3 sm:gap-4">
          {useOffset && (
            <div className="col-span-3 sm:col-span-1">
              <label className="block text-sm font-medium text-slate-700 dark:text-zinc-300 mb-1.5">
                c (offset)
              </label>
              <input
                type="text"
                inputMode="numeric"
                value={c}
                onChange={(e) => setC(e.target.value)}
                placeholder="230"
                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-base text-slate-900 placeholder-slate-400 shadow-sm transition-colors focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-50 dark:placeholder-zinc-500 dark:focus:border-blue-500 min-h-[44px]"
              />
            </div>
          )}
          <div className={useOffset ? "col-span-3 sm:col-span-1" : ""}>
            <label className="block text-sm font-medium text-slate-700 dark:text-zinc-300 mb-1.5">
              a
            </label>
            <input
              type="text"
              inputMode="numeric"
              value={a}
              onChange={(e) => setA(e.target.value)}
              placeholder="9"
              className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-base text-slate-900 placeholder-slate-400 shadow-sm transition-colors focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-50 dark:placeholder-zinc-500 dark:focus:border-blue-500 min-h-[44px]"
            />
          </div>
          <div className={useOffset ? "col-span-3 sm:col-span-1" : ""}>
            <label className="block text-sm font-medium text-slate-700 dark:text-zinc-300 mb-1.5">
              b
            </label>
            <input
              type="text"
              inputMode="numeric"
              value={b}
              onChange={(e) => setB(e.target.value)}
              placeholder="8"
              className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-base text-slate-900 placeholder-slate-400 shadow-sm transition-colors focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-50 dark:placeholder-zinc-500 dark:focus:border-blue-500 min-h-[44px]"
            />
          </div>
          <div className={useOffset ? "col-span-3 sm:col-span-1" : ""}>
            <label className="block text-sm font-medium text-slate-700 dark:text-zinc-300 mb-1.5">
              n (modulo)
            </label>
            <input
              type="text"
              inputMode="numeric"
              value={n}
              onChange={(e) => setN(e.target.value)}
              placeholder="11"
              className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-base text-slate-900 placeholder-slate-400 shadow-sm transition-colors focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-50 dark:placeholder-zinc-500 dark:focus:border-blue-500 min-h-[44px]"
            />
          </div>
        </div>

        {/* Method selector */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-slate-700 dark:text-zinc-300 mb-2">
            Metodo de resolucion
          </label>
          <div className="flex flex-wrap gap-2">
            {METHODS.map((m) => (
              <button
                key={m.key}
                type="button"
                onClick={() => setMethod(m.key)}
                className={`rounded-full px-4 py-2.5 text-sm font-medium transition-all min-h-[44px] ${
                  method === m.key
                    ? "bg-blue-600 text-white shadow-md shadow-blue-600/25"
                    : "bg-white text-slate-600 border border-slate-200 hover:border-blue-300 hover:text-blue-600 dark:bg-zinc-800 dark:text-zinc-300 dark:border-zinc-600 dark:hover:border-blue-500 dark:hover:text-blue-400"
                }`}
              >
                {m.label}
              </button>
            ))}
          </div>
        </div>

        {/* Solve button */}
        <button
          type="button"
          onClick={handleSolve}
          disabled={!a || !b || !n}
          className="w-full rounded-xl bg-blue-600 px-6 py-3.5 text-base font-semibold text-white shadow-md shadow-blue-600/25 transition-all hover:bg-blue-700 hover:shadow-lg active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed disabled:shadow-none min-h-[48px]"
        >
          Resolver
        </button>

        {/* Results */}
        {result && showResult && (
          <div className="mt-8 space-y-4">
            <h2 className="text-lg font-bold text-slate-900 dark:text-zinc-50">
              Solucion
            </h2>

            {result.hasSolution ? (
              <div className="space-y-3">
                {result.steps.map((step, i) => (
                  <StepCard
                    key={i}
                    step={step}
                    index={i}
                    isLast={i === result.steps.length - 1}
                  />
                ))}
              </div>
            ) : (
              <div className="space-y-3">
                {result.steps.map((step, i) => (
                  <StepCard
                    key={i}
                    step={step}
                    index={i}
                    isLast={false}
                  />
                ))}
                <ErrorCard reason={result.reason} />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
