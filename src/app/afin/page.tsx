'use client';

import { useState, useCallback } from 'react';
import Link from 'next/link';
import { affineEncrypt, affineDecrypt, AffineResult } from '@/lib/math/affine';
import { ALL_TABLES, getTableById } from '@/lib/data/charTables';
import { CharTable } from '@/lib/math/rsa';
import CustomTableBuilder from '@/components/custom-table-builder';

type Mode = 'encrypt' | 'decrypt';

export default function AffinePage() {
  const [mode, setMode] = useState<Mode>('encrypt');
  const [a, setA] = useState('');
  const [b, setB] = useState('');
  const [message, setMessage] = useState('');
  const [cipherInput, setCipherInput] = useState('');
  const [tableId, setTableId] = useState('standard');
  const [customTable, setCustomTable] = useState<CharTable | null>(null);
  const [result, setResult] = useState<AffineResult | null>(null);
  const [error, setError] = useState('');

  const selectedTable = tableId === 'custom' && customTable ? customTable : getTableById(tableId);
  const tableEntries = Object.entries(selectedTable.encode).sort((x, y) => x[1] - y[1]);
  const handleCustomTableChange = useCallback((t: CharTable) => setCustomTable(t), []);

  function handleSubmit() {
    setError('');
    setResult(null);

    const aNum = parseInt(a);
    const bNum = parseInt(b);
    if (isNaN(aNum) || isNaN(bNum)) {
      setError('a y b deben ser numeros enteros.');
      return;
    }

    const table = tableId === 'custom' && customTable ? customTable : getTableById(tableId);

    if (mode === 'encrypt') {
      if (!message.trim()) {
        setError('Ingresa un mensaje para encriptar.');
        return;
      }
      const res = affineEncrypt(message, aNum, bNum, table);
      setResult(res);
    } else {
      if (!cipherInput.trim()) {
        setError('Ingresa los valores cifrados separados por coma.');
        return;
      }
      const vals = cipherInput.split(',').map(s => parseInt(s.trim())).filter(v => !isNaN(v));
      if (vals.length === 0) {
        setError('No se pudieron interpretar los valores.');
        return;
      }
      const res = affineDecrypt(vals, aNum, bNum, table);
      setResult(res);
    }
  }

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
      <style>{`
        @keyframes fadeSlideIn {
          from { opacity: 0; transform: translateY(12px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
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
            Cifrado Afin
          </h1>
          <p className="text-zinc-600 dark:text-zinc-400">
            C = (a·M + b) mod n — Encripta y desencripta con cifrado afin.
          </p>
        </div>

        <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 p-6 mb-6">
          {/* Mode toggle */}
          <div className="mb-4">
            <div className="flex rounded-xl bg-zinc-100 dark:bg-zinc-800 p-1">
              <button
                type="button"
                onClick={() => setMode('encrypt')}
                className={`flex-1 rounded-lg py-2.5 px-3 text-sm font-medium transition-all min-h-[40px] ${
                  mode === 'encrypt'
                    ? 'bg-white text-zinc-900 shadow-sm dark:bg-zinc-700 dark:text-zinc-50'
                    : 'text-zinc-500 hover:text-zinc-700 dark:text-zinc-400'
                }`}
              >
                Encriptar
              </button>
              <button
                type="button"
                onClick={() => setMode('decrypt')}
                className={`flex-1 rounded-lg py-2.5 px-3 text-sm font-medium transition-all min-h-[40px] ${
                  mode === 'decrypt'
                    ? 'bg-white text-zinc-900 shadow-sm dark:bg-zinc-700 dark:text-zinc-50'
                    : 'text-zinc-500 hover:text-zinc-700 dark:text-zinc-400'
                }`}
              >
                Desencriptar
              </button>
            </div>
          </div>

          {/* Parameters */}
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1.5">
                a (multiplicador)
              </label>
              <input
                type="number"
                value={a}
                onChange={(e) => setA(e.target.value)}
                placeholder="Ej: 2"
                className="w-full h-12 px-4 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1.5">
                b (desplazamiento)
              </label>
              <input
                type="number"
                value={b}
                onChange={(e) => setB(e.target.value)}
                placeholder="Ej: 23"
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
              <option value="custom">Personalizada (editable)</option>
            </select>
          </div>

          {/* Table display */}
          {tableId === 'custom' ? (
            <div className="mb-4">
              <CustomTableBuilder onChange={handleCustomTableChange} />
            </div>
          ) : (
            <div className="mb-4 p-3 bg-zinc-50 dark:bg-zinc-800 rounded-xl border border-zinc-200 dark:border-zinc-700">
              <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400 mb-2 uppercase tracking-wide">
                Mapeo de caracteres (n = {tableEntries.length})
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
          )}

          {/* Message input */}
          {mode === 'encrypt' ? (
            <div className="mb-4">
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1.5">
                Mensaje a encriptar
              </label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Ej: CORONAVIRUS"
                rows={2}
                className="w-full px-4 py-3 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition resize-none"
              />
            </div>
          ) : (
            <div className="mb-4">
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1.5">
                Valores cifrados (separados por coma)
              </label>
              <textarea
                value={cipherInput}
                onChange={(e) => setCipherInput(e.target.value)}
                placeholder="Ej: 27, 25, 3, 25, 21, 23, 11, 11, 3, 9, 5"
                rows={2}
                className="w-full px-4 py-3 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 text-base font-mono focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition resize-none"
              />
            </div>
          )}

          <button
            onClick={handleSubmit}
            className="w-full sm:w-auto h-12 px-8 rounded-xl bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-semibold text-base transition-colors shadow-sm cursor-pointer"
          >
            {mode === 'encrypt' ? 'Encriptar' : 'Desencriptar'}
          </button>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-6 p-4 rounded-xl bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 text-sm">
            {error}
          </div>
        )}

        {/* Result errors */}
        {result && result.errors.length > 0 && (
          <div className="mb-6 p-4 rounded-xl bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-800">
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
            {result.steps.map((step, i) => {
              const isLast = i === result.steps.length - 1;
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
                  <p className={`text-sm mb-2 whitespace-pre-line ${isLast ? 'text-emerald-700 dark:text-emerald-400' : 'text-zinc-600 dark:text-zinc-400'}`}>
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
      </div>
    </div>
  );
}
