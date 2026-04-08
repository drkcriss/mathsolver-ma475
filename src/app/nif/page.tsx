'use client';

import { useState } from 'react';
import Link from 'next/link';
import { solveNIF, NIFResult } from '@/lib/math/nif';
import { NIF_EXERCISE } from '@/lib/data/exercises';

const NIF_LETTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

export default function NIFPage() {
  const [template, setTemplate] = useState('');
  const [letter, setLetter] = useState('');
  const [result, setResult] = useState<NIFResult | null>(null);
  const [error, setError] = useState('');

  function handleSolve(tpl?: string, ltr?: string) {
    setError('');
    setResult(null);

    const t = tpl ?? template.trim();
    const l = ltr ?? letter.trim().toUpperCase();

    if (!t) {
      setError('Ingresa la plantilla del NIF (Ej: 753xx357).');
      return;
    }
    if (!l || l.length !== 1 || !NIF_LETTERS.includes(l)) {
      setError('Ingresa una letra valida (A-Z).');
      return;
    }

    const res = solveNIF(t, l);
    setResult(res);
  }

  function handleExercise() {
    setTemplate(NIF_EXERCISE.template);
    setLetter(NIF_EXERCISE.letter);
    handleSolve(NIF_EXERCISE.template, NIF_EXERCISE.letter);
  }

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
      <div className="max-w-4xl mx-auto px-4 py-8 sm:py-12">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-sm text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100 transition-colors mb-8"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
          </svg>
          Volver al inicio
        </Link>

        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-zinc-900 dark:text-zinc-50 mb-2">
            Solucionador de NIF
          </h1>
          <p className="text-zinc-600 dark:text-zinc-400">
            Encuentra los digitos faltantes de un NIF a partir de la letra asignada, usando congruencias modulo 26.
          </p>
        </div>

        {/* NIF Letter Table */}
        <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 p-5 mb-6">
          <h2 className="text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-3 uppercase tracking-wide">
            Tabla NIF: Letra segun resto (mod 26)
          </h2>
          <div className="overflow-x-auto">
            <div className="flex flex-wrap gap-1">
              {NIF_LETTERS.split('').map((ch, i) => (
                <div
                  key={ch}
                  className="flex flex-col items-center px-2 py-1.5 rounded-lg bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 min-w-[36px]"
                >
                  <span className="text-xs text-zinc-500 dark:text-zinc-400 font-mono">{i}</span>
                  <span className="text-sm font-bold text-blue-600 dark:text-blue-400">{ch}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Input Form */}
        <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 p-6 mb-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1.5">
                Plantilla del NIF
              </label>
              <input
                type="text"
                value={template}
                onChange={(e) => setTemplate(e.target.value)}
                placeholder="Ej: 753xx357"
                className="w-full h-12 px-4 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 text-base font-mono focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              />
              <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
                Usa &quot;x&quot; para los digitos desconocidos (Ej: 753xx357)
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1.5">
                Letra del NIF
              </label>
              <input
                type="text"
                value={letter}
                onChange={(e) => setLetter(e.target.value.toUpperCase())}
                placeholder="Ej: R"
                maxLength={1}
                className="w-full h-12 px-4 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 text-base font-mono uppercase focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              />
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => handleSolve()}
              className="h-12 px-8 rounded-xl bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-semibold text-base transition-colors shadow-sm cursor-pointer"
            >
              Resolver
            </button>
            <button
              onClick={handleExercise}
              className="h-12 px-6 rounded-xl bg-violet-600 hover:bg-violet-700 active:bg-violet-800 text-white font-semibold text-base transition-colors shadow-sm cursor-pointer"
            >
              Ejercicio: {NIF_EXERCISE.template}-{NIF_EXERCISE.letter}
            </button>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-6 p-4 rounded-xl bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 text-sm">
            {error}
          </div>
        )}

        {/* Solution Steps */}
        {result && (
          <div className="space-y-4 mb-6">
            {result.steps.map((step, i) => {
              const isLast = i === result.steps.length - 1;
              const isSuccess = isLast && result.found;
              const isFail = isLast && !result.found;
              return (
                <div
                  key={i}
                  className={`rounded-2xl border p-5 ${
                    isSuccess
                      ? 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-300 dark:border-emerald-700'
                      : isFail
                        ? 'bg-red-50 dark:bg-red-950/30 border-red-300 dark:border-red-700'
                        : 'bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800'
                  }`}
                  style={{
                    opacity: 0,
                    animation: `fadeSlideIn 0.4s ease-out ${i * 0.15}s forwards`,
                  }}
                >
                  <h3 className={`font-semibold mb-1 ${
                    isSuccess
                      ? 'text-emerald-800 dark:text-emerald-300'
                      : isFail
                        ? 'text-red-800 dark:text-red-300'
                        : 'text-zinc-900 dark:text-zinc-100'
                  }`}>
                    {step.title}
                  </h3>
                  <p className={`text-sm mb-2 ${
                    isSuccess
                      ? 'text-emerald-700 dark:text-emerald-400'
                      : isFail
                        ? 'text-red-700 dark:text-red-400'
                        : 'text-zinc-600 dark:text-zinc-400'
                  }`}>
                    {step.explanation}
                  </p>
                  <pre className={`font-mono text-sm whitespace-pre-wrap break-all p-3 rounded-lg ${
                    isSuccess
                      ? 'bg-emerald-100 dark:bg-emerald-900/40 text-emerald-900 dark:text-emerald-200'
                      : isFail
                        ? 'bg-red-100 dark:bg-red-900/40 text-red-900 dark:text-red-200'
                        : 'bg-zinc-50 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200'
                  }`}>
                    {step.math}
                  </pre>
                </div>
              );
            })}
          </div>
        )}

        {/* Inline keyframes */}
        <style>{`
          @keyframes fadeSlideIn {
            from {
              opacity: 0;
              transform: translateY(12px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
        `}</style>
      </div>
    </div>
  );
}
