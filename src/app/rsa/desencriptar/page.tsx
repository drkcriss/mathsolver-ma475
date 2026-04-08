'use client';

import { useState } from 'react';
import Link from 'next/link';
import { rsaDecrypt, RSAResult, RSAKeys } from '@/lib/math/rsa';
import { ALL_TABLES, getTableById } from '@/lib/data/charTables';
import { isPrime } from '@/lib/math/gcd';

function factorN(n: number): { p: number; q: number } | null {
  if (n < 4) return null;
  for (let i = 2; i <= Math.sqrt(n); i++) {
    if (n % i === 0) {
      const j = n / i;
      if (isPrime(i) && isPrime(j) && i !== j) {
        return { p: i, q: j };
      }
    }
  }
  return null;
}

export default function DesencriptarPage() {
  const [n, setN] = useState('');
  const [d, setD] = useState('');
  const [cipherNumbers, setCipherNumbers] = useState('');
  const [cipherText, setCipherText] = useState('');
  const [inputMode, setInputMode] = useState<'numbers' | 'text'>('numbers');
  const [tableId, setTableId] = useState('standard');
  const [result, setResult] = useState<RSAResult | null>(null);
  const [factoredInfo, setFactoredInfo] = useState('');
  const [error, setError] = useState('');

  const selectedTable = getTableById(tableId);
  const tableEntries = Object.entries(selectedTable.encode).sort((a, b) => a[1] - b[1]);

  function handleDecrypt() {
    setError('');
    setResult(null);
    setFactoredInfo('');

    const nNum = parseInt(n);
    const dNum = parseInt(d);

    if (isNaN(nNum) || isNaN(dNum)) {
      setError('n y d deben ser numeros enteros validos.');
      return;
    }

    const table = getTableById(tableId);

    // Parse cipher values
    let cipherValues: number[];
    if (inputMode === 'numbers') {
      if (!cipherNumbers.trim()) {
        setError('Ingresa los valores cifrados separados por coma.');
        return;
      }
      cipherValues = cipherNumbers
        .split(',')
        .map((s) => parseInt(s.trim()))
        .filter((v) => !isNaN(v));
      if (cipherValues.length === 0) {
        setError('No se pudieron interpretar los valores cifrados.');
        return;
      }
    } else {
      if (!cipherText.trim()) {
        setError('Ingresa el texto cifrado.');
        return;
      }
      cipherValues = [];
      for (const ch of cipherText) {
        const tableChar = ch === 'n' || ch === 'N' ? 'N' : ch.toUpperCase();
        const num = table.encode[ch] ?? table.encode[tableChar] ?? table.encode[ch.toUpperCase()];
        if (num !== undefined) {
          cipherValues.push(num);
        } else {
          setError(`Caracter '${ch}' no encontrado en la tabla.`);
          return;
        }
      }
    }

    // Factor n to find p and q
    const factors = factorN(nNum);
    if (!factors) {
      setError(`No se pudo factorizar n = ${nNum} como producto de dos primos distintos.`);
      return;
    }

    setFactoredInfo(`n = ${nNum} = ${factors.p} x ${factors.q} (p = ${factors.p}, q = ${factors.q})`);

    const keys: RSAKeys = {
      p: factors.p,
      q: factors.q,
      n: nNum,
      phi: (factors.p - 1) * (factors.q - 1),
      d: dNum,
      e: 0,
    };

    const res = rsaDecrypt(cipherValues, keys, table);
    setResult(res);
  }

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
            Desencriptar con RSA
          </h1>
          <p className="text-zinc-600 dark:text-zinc-400">
            Ingresa la clave privada (n, d) y los valores cifrados para descifrar el mensaje.
          </p>
        </div>

        {/* Input Form */}
        <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 p-6 mb-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1.5">
                n (modulo)
              </label>
              <input
                type="number"
                value={n}
                onChange={(e) => setN(e.target.value)}
                placeholder="Ej: 91"
                className="w-full h-12 px-4 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1.5">
                d (clave privada)
              </label>
              <input
                type="number"
                value={d}
                onChange={(e) => setD(e.target.value)}
                placeholder="Ej: 5"
                className="w-full h-12 px-4 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              />
            </div>
          </div>

          {/* Table selector */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1.5">
              Tabla de caracteres
            </label>
            <select
              value={tableId}
              onChange={(e) => setTableId(e.target.value)}
              className="w-full h-12 px-4 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
            >
              {ALL_TABLES.map((t) => (
                <option key={t.id} value={t.id}>{t.name}</option>
              ))}
            </select>
          </div>

          {/* Character table display */}
          <div className="mb-4 p-3 bg-zinc-50 dark:bg-zinc-800 rounded-xl border border-zinc-200 dark:border-zinc-700">
            <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400 mb-2 uppercase tracking-wide">
              Mapeo de caracteres
            </p>
            <div className="flex flex-wrap gap-1">
              {tableEntries.map(([ch, num]) => (
                <span
                  key={ch}
                  className="inline-flex items-center gap-0.5 px-2 py-1 rounded-md bg-white dark:bg-zinc-700 border border-zinc-200 dark:border-zinc-600 text-xs font-mono"
                >
                  <span className="text-blue-600 dark:text-blue-400 font-semibold">{ch === ' ' ? 'ESP' : ch}</span>
                  <span className="text-zinc-400">=</span>
                  <span className="text-zinc-700 dark:text-zinc-300">{num}</span>
                </span>
              ))}
            </div>
          </div>

          {/* Input mode toggle */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
              Modo de entrada
            </label>
            <div className="flex gap-2">
              <button
                onClick={() => setInputMode('numbers')}
                className={`h-10 px-4 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
                  inputMode === 'numbers'
                    ? 'bg-blue-600 text-white'
                    : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700'
                }`}
              >
                Numeros (separados por coma)
              </button>
              <button
                onClick={() => setInputMode('text')}
                className={`h-10 px-4 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
                  inputMode === 'text'
                    ? 'bg-blue-600 text-white'
                    : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700'
                }`}
              >
                Texto cifrado
              </button>
            </div>
          </div>

          {/* Cipher input */}
          {inputMode === 'numbers' ? (
            <div className="mb-4">
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1.5">
                Valores cifrados (separados por coma)
              </label>
              <textarea
                value={cipherNumbers}
                onChange={(e) => setCipherNumbers(e.target.value)}
                placeholder="Ej: 12, 45, 7, 23"
                rows={2}
                className="w-full px-4 py-3 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 text-base font-mono focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition resize-none"
              />
            </div>
          ) : (
            <div className="mb-4">
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1.5">
                Texto cifrado (se convierte a numeros usando la tabla)
              </label>
              <textarea
                value={cipherText}
                onChange={(e) => setCipherText(e.target.value)}
                placeholder="Ej: HOLA"
                rows={2}
                className="w-full px-4 py-3 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition resize-none"
              />
            </div>
          )}

          <button
            onClick={handleDecrypt}
            className="w-full sm:w-auto h-12 px-8 rounded-xl bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-semibold text-base transition-colors shadow-sm cursor-pointer"
          >
            Desencriptar
          </button>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-6 p-4 rounded-xl bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 text-sm">
            {error}
          </div>
        )}

        {/* Factorization info */}
        {factoredInfo && (
          <div className="mb-4 p-4 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-300 text-sm font-mono">
            Factorizacion: {factoredInfo}
          </div>
        )}

        {/* Result errors */}
        {result && result.errors.length > 0 && (
          <div className="mb-6 p-4 rounded-xl bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-800">
            <p className="font-semibold text-red-700 dark:text-red-300 mb-1">Errores encontrados:</p>
            <ul className="list-disc list-inside text-sm text-red-600 dark:text-red-400 space-y-1">
              {result.errors.map((err, i) => (
                <li key={i}>{err}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Solution Steps */}
        {result && result.errors.length === 0 && (
          <div className="space-y-4 mb-6">
            {result.keySteps.map((step, i) => {
              const isLast = i === result.keySteps.length - 1;
              return (
                <div
                  key={i}
                  className={`rounded-2xl border p-5 ${
                    isLast
                      ? 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-300 dark:border-emerald-700'
                      : 'bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800'
                  }`}
                  style={{
                    opacity: 0,
                    animation: `fadeSlideIn 0.4s ease-out ${i * 0.12}s forwards`,
                  }}
                >
                  <h3 className={`font-semibold mb-1 ${isLast ? 'text-emerald-800 dark:text-emerald-300' : 'text-zinc-900 dark:text-zinc-100'}`}>
                    {step.title}
                  </h3>
                  <p className={`text-sm mb-2 ${isLast ? 'text-emerald-700 dark:text-emerald-400' : 'text-zinc-600 dark:text-zinc-400'}`}>
                    {step.explanation}
                  </p>
                  <pre className={`font-mono text-sm whitespace-pre-wrap break-all p-3 rounded-lg ${
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
