"use client";

import { useState } from "react";
import Link from "next/link";
import { CONGRUENCE_EXERCISES } from "@/lib/data/exercises";
import type { CongruenceExercise } from "@/lib/data/exercises";
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
      className={`rounded-xl border p-4 transition-all duration-500 ease-out opacity-0 translate-y-4 animate-[fadeSlideIn_0.4s_ease-out_forwards] ${
        isLast
          ? "border-emerald-300 bg-emerald-50 dark:border-emerald-700 dark:bg-emerald-950/40"
          : "border-slate-200 bg-white dark:border-zinc-700 dark:bg-zinc-800"
      }`}
      style={{ animationDelay: `${index * 120}ms` }}
    >
      <h4
        className={`text-sm font-bold mb-1 ${
          isLast
            ? "text-emerald-700 dark:text-emerald-400"
            : "text-slate-800 dark:text-zinc-100"
        }`}
      >
        {step.title}
      </h4>
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
    <div className="rounded-xl border border-red-300 bg-red-50 p-4 dark:border-red-700 dark:bg-red-950/40 animate-[fadeSlideIn_0.4s_ease-out_forwards]">
      <div className="flex items-start gap-3">
        <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/50">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
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
          <h4 className="font-bold text-red-700 dark:text-red-400 text-sm">
            Sin solucion
          </h4>
          <p className="mt-0.5 text-sm text-red-600 dark:text-red-300">
            {reason}
          </p>
        </div>
      </div>
    </div>
  );
}

function ExerciseCard({
  exercise,
  method,
}: {
  exercise: CongruenceExercise;
  method: Method;
}) {
  const [result, setResult] = useState<CongruenceResult | null>(null);
  const [showSteps, setShowSteps] = useState(false);

  function handleSolve() {
    if (result && showSteps) {
      // If already showing, collapse
      setShowSteps(false);
      setTimeout(() => setResult(null), 300);
      return;
    }

    const input = {
      a: exercise.a,
      b: exercise.b,
      n: exercise.n,
      offset: exercise.offset,
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

    setResult(res);
    requestAnimationFrame(() => setShowSteps(true));
  }

  return (
    <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden dark:border-zinc-700 dark:bg-zinc-800">
      {/* Exercise header */}
      <div className="flex items-center justify-between gap-4 p-4 sm:p-5">
        <div className="flex items-center gap-3 min-w-0">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-100 text-sm font-bold text-blue-700 dark:bg-blue-900/40 dark:text-blue-400">
            {exercise.label}
          </span>
          <span className="font-mono text-base text-slate-800 dark:text-zinc-200 truncate">
            {exercise.description}
          </span>
        </div>
        <button
          type="button"
          onClick={handleSolve}
          className={`shrink-0 rounded-xl px-4 py-2.5 text-sm font-semibold transition-all min-h-[44px] ${
            result && showSteps
              ? "bg-slate-200 text-slate-700 hover:bg-slate-300 dark:bg-zinc-600 dark:text-zinc-200 dark:hover:bg-zinc-500"
              : "bg-blue-600 text-white shadow-sm shadow-blue-600/25 hover:bg-blue-700 active:scale-[0.97]"
          }`}
        >
          {result && showSteps ? "Ocultar" : "Resolver"}
        </button>
      </div>

      {/* Solution area */}
      {result && showSteps && (
        <div className="border-t border-slate-100 bg-slate-50/50 p-4 sm:p-5 space-y-3 dark:border-zinc-700 dark:bg-zinc-900/30">
          {result.hasSolution ? (
            result.steps.map((step, i) => (
              <StepCard
                key={i}
                step={step}
                index={i}
                isLast={i === result.steps.length - 1}
              />
            ))
          ) : (
            <>
              {result.steps.map((step, i) => (
                <StepCard key={i} step={step} index={i} isLast={false} />
              ))}
              <ErrorCard reason={result.reason} />
            </>
          )}
        </div>
      )}
    </div>
  );
}

export default function EjerciciosPage() {
  const [method, setMethod] = useState<Method>("bruteforce");

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
            Ejercicios del PDF
          </h1>
          <p className="mt-2 text-slate-600 dark:text-zinc-400">
            Los 6 ejercicios de congruencias lineales del curso. Pulsa
            &quot;Resolver&quot; para ver la solucion paso a paso.
          </p>
        </div>

        {/* Method selector */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-slate-700 dark:text-zinc-300 mb-2">
            Metodo de resolucion (aplica a todos)
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

        {/* Exercise list */}
        <div className="space-y-4">
          {CONGRUENCE_EXERCISES.map((exercise) => (
            <ExerciseCard
              key={exercise.id}
              exercise={exercise}
              method={method}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
