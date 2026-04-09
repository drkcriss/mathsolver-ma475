'use client';

import { useState, useCallback } from 'react';
import Link from 'next/link';
import { rsaEncrypt, rsaDecrypt, RSAResult, CharTable } from '@/lib/math/rsa';
import { ALL_TABLES, getTableById } from '@/lib/data/charTables';
import CustomTableBuilder from '@/components/custom-table-builder';

export default function EncriptarPage() {
  const [p, setP] = useState('');
  const [q, setQ] = useState('');
  const [d, setD] = useState('');
  const [message, setMessage] = useState('');
  const [tableId, setTableId] = useState('standard');
  const [customTable, setCustomTable] = useState<CharTable | null>(null);
  const [result, setResult] = useState<RSAResult | null>(null);
  const [verification, setVerification] = useState<RSAResult | null>(null);
  const [showSteps, setShowSteps] = useState(false);
  const [showVerification, setShowVerification] = useState(false);
  const [error, setError] = useState('');

  const selectedTable = tableId === 'custom' && customTable ? customTable : getTableById(tableId);
  const handleCustomTableChange = useCallback((t: CharTable) => setCustomTable(t), []);

  function handleEncrypt() {
    setError('');
    setResult(null);
    setVerification(null);
    setShowVerification(false);

    const pNum = parseInt(p);
    const qNum = parseInt(q);
    const dNum = d.trim() ? parseInt(d) : undefined;

    if (isNaN(pNum) || isNaN(qNum)) {
      setError('p y q deben ser numeros enteros validos.');
      return;
    }
    if (!message.trim()) {
      setError('Ingresa un mensaje para encriptar.');
      return;
    }

    const table = tableId === 'custom' && customTable ? customTable : getTableById(tableId);
    const res = rsaEncrypt(message, { p: pNum, q: qNum, n: pNum * qNum, phi: 0, d: dNum ?? 0, e: 0 }, table);
    setResult(res);
    setShowSteps(true);
  }

  function handleVerify() {
    if (!result || result.errors.length > 0) return;
    const table = tableId === 'custom' && customTable ? customTable : getTableById(tableId);
    const ver = rsaDecrypt(result.outputNumbers, result.keys, table);
    setVerification(ver);
    setShowVerification(true);
  }

  const tableEntries = Object.entries(selectedTable.encode).sort((a, b) => a[1] - b[1]);

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
            Encriptar con RSA
          </h1>
          <p className="text-zinc-600 dark:text-zinc-400">
            Ingresa los parametros y el mensaje para cifrar con el algoritmo RSA.
          </p>
        </div>

        {/* Input Form */}
        <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 p-6 mb-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1.5">
                Primo p
              </label>
              <input
                type="number"
                value={p}
                onChange={(e) => setP(e.target.value)}
                placeholder="Ej: 7"
                className="w-full h-12 px-4 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1.5">
                Primo q
              </label>
              <input
                type="number"
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Ej: 13"
                className="w-full h-12 px-4 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1.5">
                d (opcional)
              </label>
              <input
                type="number"
                value={d}
                onChange={(e) => setD(e.target.value)}
                placeholder="Auto"
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

          {/* Character table display */}
          {tableId === 'custom' ? (
            <div className="mb-4">
              <CustomTableBuilder onChange={handleCustomTableChange} />
            </div>
          ) : (
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
          )}

          {/* Message */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1.5">
              Mensaje a encriptar
            </label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Escribe tu mensaje aqui..."
              rows={3}
              className="w-full px-4 py-3 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition resize-none"
            />
          </div>

          <button
            onClick={handleEncrypt}
            className="w-full sm:w-auto h-12 px-8 rounded-xl bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-semibold text-base transition-colors shadow-sm cursor-pointer"
          >
            Encriptar
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
            <p className="font-semibold text-red-700 dark:text-red-300 mb-1">Errores encontrados:</p>
            <ul className="list-disc list-inside text-sm text-red-600 dark:text-red-400 space-y-1">
              {result.errors.map((err, i) => (
                <li key={i}>{err}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Solution Steps */}
        {result && result.errors.length === 0 && showSteps && (
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

            {/* Verify button */}
            <div className="flex justify-center pt-2">
              <button
                onClick={handleVerify}
                className="h-12 px-8 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-semibold text-base transition-colors shadow-sm cursor-pointer"
              >
                Verificar (Desencriptar)
              </button>
            </div>
          </div>
        )}

        {/* Verification Result */}
        {showVerification && verification && verification.errors.length === 0 && (
          <div className="space-y-4 mb-6">
            <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-50">Verificacion (Desencriptacion)</h2>
            {verification.keySteps.slice(-2).map((step, i) => (
              <div
                key={i}
                className={`rounded-2xl border p-5 ${
                  i === 1
                    ? 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-300 dark:border-emerald-700'
                    : 'bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800'
                }`}
                style={{
                  opacity: 0,
                  animation: `fadeSlideIn 0.4s ease-out ${i * 0.15}s forwards`,
                }}
              >
                <h3 className={`font-semibold mb-1 ${i === 1 ? 'text-emerald-800 dark:text-emerald-300' : 'text-zinc-900 dark:text-zinc-100'}`}>
                  {step.title}
                </h3>
                <p className={`text-sm mb-2 ${i === 1 ? 'text-emerald-700 dark:text-emerald-400' : 'text-zinc-600 dark:text-zinc-400'}`}>
                  {step.explanation}
                </p>
                <pre className={`font-mono text-sm whitespace-pre-wrap break-all p-3 rounded-lg ${
                  i === 1
                    ? 'bg-emerald-100 dark:bg-emerald-900/40 text-emerald-900 dark:text-emerald-200'
                    : 'bg-zinc-50 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200'
                }`}>
                  {step.math}
                </pre>
              </div>
            ))}
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
