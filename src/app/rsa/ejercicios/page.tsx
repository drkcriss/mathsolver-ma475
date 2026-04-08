'use client';

import { useState, useCallback } from 'react';
import Link from 'next/link';
import { RSA_EXERCISES, RSAExercise } from '@/lib/data/exercises';
import { rsaEncrypt, rsaDecrypt, RSAResult } from '@/lib/math/rsa';
import { getTableById } from '@/lib/data/charTables';

function ExerciseCard({ exercise }: { exercise: RSAExercise }) {
  const [result, setResult] = useState<RSAResult | null>(null);
  const [expanded, setExpanded] = useState(false);

  const solve = useCallback(() => {
    if (expanded) {
      setExpanded(false);
      return;
    }

    const table = getTableById(exercise.tableId);
    const keys = {
      p: exercise.p,
      q: exercise.q,
      n: exercise.p * exercise.q,
      phi: 0,
      d: exercise.d ?? 0,
      e: 0,
    };

    let res: RSAResult;
    if (exercise.type === 'encrypt') {
      res = rsaEncrypt(exercise.message, keys, table);
    } else {
      // For decrypt exercises, convert message to cipher values using the table
      const cipherValues: number[] = [];
      for (const ch of exercise.message) {
        const tableChar = ch.toUpperCase();
        const num = table.encode[ch] ?? table.encode[tableChar];
        if (num !== undefined) cipherValues.push(num);
      }
      res = rsaDecrypt(cipherValues, keys, table);
    }

    setResult(res);
    setExpanded(true);
  }, [exercise, expanded]);

  return (
    <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 overflow-hidden transition-all">
      <div className="p-5">
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-sm font-bold text-zinc-500 dark:text-zinc-400">
                Ej. {exercise.label}
              </span>
              <span
                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                  exercise.type === 'encrypt'
                    ? 'bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300'
                    : 'bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300'
                }`}
              >
                {exercise.type === 'encrypt' ? 'Encriptar' : 'Desencriptar'}
              </span>
            </div>
            <p className="text-zinc-800 dark:text-zinc-200 text-sm leading-relaxed">
              {exercise.description}
            </p>
            <div className="flex flex-wrap gap-2 mt-2">
              <span className="text-xs font-mono bg-zinc-100 dark:bg-zinc-800 px-2 py-0.5 rounded text-zinc-600 dark:text-zinc-400">
                p={exercise.p}
              </span>
              <span className="text-xs font-mono bg-zinc-100 dark:bg-zinc-800 px-2 py-0.5 rounded text-zinc-600 dark:text-zinc-400">
                q={exercise.q}
              </span>
              {exercise.d && (
                <span className="text-xs font-mono bg-zinc-100 dark:bg-zinc-800 px-2 py-0.5 rounded text-zinc-600 dark:text-zinc-400">
                  d={exercise.d}
                </span>
              )}
              <span className="text-xs font-mono bg-zinc-100 dark:bg-zinc-800 px-2 py-0.5 rounded text-zinc-600 dark:text-zinc-400">
                tabla={exercise.tableId}
              </span>
            </div>
          </div>
          <button
            onClick={solve}
            className={`shrink-0 h-11 px-5 rounded-xl font-semibold text-sm transition-colors cursor-pointer ${
              expanded
                ? 'bg-zinc-200 dark:bg-zinc-700 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-300 dark:hover:bg-zinc-600'
                : 'bg-violet-600 hover:bg-violet-700 active:bg-violet-800 text-white shadow-sm'
            }`}
          >
            {expanded ? 'Ocultar' : 'Resolver'}
          </button>
        </div>
      </div>

      {/* Expanded solution */}
      {expanded && result && (
        <div className="border-t border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950/50 p-5">
          {result.errors.length > 0 && (
            <div className="mb-4 p-3 rounded-xl bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-800">
              <p className="font-semibold text-red-700 dark:text-red-300 text-sm mb-1">Errores:</p>
              <ul className="list-disc list-inside text-xs text-red-600 dark:text-red-400 space-y-0.5">
                {result.errors.map((err, i) => (
                  <li key={i}>{err}</li>
                ))}
              </ul>
            </div>
          )}

          {result.errors.length === 0 && (
            <div className="space-y-3">
              {result.keySteps.map((step, i) => {
                const isLast = i === result.keySteps.length - 1;
                return (
                  <div
                    key={i}
                    className={`rounded-xl border p-4 ${
                      isLast
                        ? 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-300 dark:border-emerald-700'
                        : 'bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800'
                    }`}
                    style={{
                      opacity: 0,
                      animation: `fadeSlideIn 0.35s ease-out ${i * 0.1}s forwards`,
                    }}
                  >
                    <h4 className={`text-sm font-semibold mb-0.5 ${isLast ? 'text-emerald-800 dark:text-emerald-300' : 'text-zinc-900 dark:text-zinc-100'}`}>
                      {step.title}
                    </h4>
                    <p className={`text-xs mb-1.5 ${isLast ? 'text-emerald-700 dark:text-emerald-400' : 'text-zinc-500 dark:text-zinc-400'}`}>
                      {step.explanation}
                    </p>
                    <pre className={`font-mono text-xs whitespace-pre-wrap break-all p-2.5 rounded-lg ${
                      isLast
                        ? 'bg-emerald-100 dark:bg-emerald-900/40 text-emerald-900 dark:text-emerald-200'
                        : 'bg-zinc-50 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200'
                    }`}>
                      {step.math}
                    </pre>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function EjerciciosPage() {
  const encryptExercises = RSA_EXERCISES.filter((e) => e.type === 'encrypt');
  const decryptExercises = RSA_EXERCISES.filter((e) => e.type === 'decrypt');

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
      <div className="max-w-4xl mx-auto px-4 py-8 sm:py-12">
        <Link
          href="/rsa"
          className="inline-flex items-center gap-1.5 text-sm text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100 transition-colors mb-8"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
          </svg>
          Volver a RSA
        </Link>

        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-zinc-900 dark:text-zinc-50 mb-2">
            Ejercicios RSA
          </h1>
          <p className="text-zinc-600 dark:text-zinc-400">
            Ejercicios predefinidos de encriptacion y desencriptacion. Haz clic en &quot;Resolver&quot; para ver la solucion paso a paso.
          </p>
        </div>

        {/* Encryption exercises */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100 mb-4 flex items-center gap-2">
            <span className="inline-flex w-6 h-6 items-center justify-center rounded-md bg-blue-100 dark:bg-blue-900/40">
              <svg className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" />
              </svg>
            </span>
            Encriptacion ({encryptExercises.length})
          </h2>
          <div className="space-y-4">
            {encryptExercises.map((ex) => (
              <ExerciseCard key={ex.id} exercise={ex} />
            ))}
          </div>
        </div>

        {/* Decryption exercises */}
        {decryptExercises.length > 0 && (
          <div className="mb-8">
            <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100 mb-4 flex items-center gap-2">
              <span className="inline-flex w-6 h-6 items-center justify-center rounded-md bg-emerald-100 dark:bg-emerald-900/40">
                <svg className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 10.5V6.75a4.5 4.5 0 1 1 9 0v3.75M3.75 21.75h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H3.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" />
                </svg>
              </span>
              Desencriptacion ({decryptExercises.length})
            </h2>
            <div className="space-y-4">
              {decryptExercises.map((ex) => (
                <ExerciseCard key={ex.id} exercise={ex} />
              ))}
            </div>
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
