'use client';

import { useState, useEffect } from 'react';
import type { CharTable } from '@/lib/math/rsa';

const ALL_CHARS = [
  'A','B','C','D','E','F','G','H','I','J','K','L','M',
  'N','Ñ','O','P','Q','R','S','T','U','V','W','X','Y','Z',' ',
];

function buildTable(enabled: Set<string>): CharTable {
  const encode: Record<string, number> = {};
  const decode: Record<number, string> = {};
  let idx = 0;
  for (const ch of ALL_CHARS) {
    if (enabled.has(ch)) {
      encode[ch] = idx;
      decode[idx] = ch;
      idx++;
    }
  }
  return { name: 'Personalizada', id: 'custom', encode, decode };
}

interface Props {
  onChange: (table: CharTable) => void;
}

export default function CustomTableBuilder({ onChange }: Props) {
  const [enabled, setEnabled] = useState<Set<string>>(() => new Set(ALL_CHARS));

  useEffect(() => {
    onChange(buildTable(enabled));
  }, [enabled, onChange]);

  function toggle(ch: string) {
    setEnabled(prev => {
      const next = new Set(prev);
      if (next.has(ch)) next.delete(ch);
      else next.add(ch);
      return next;
    });
  }

  function selectAll() {
    setEnabled(new Set(ALL_CHARS));
  }

  function clearAll() {
    setEnabled(new Set());
  }

  // Compute current index for each enabled char
  let idx = 0;
  const indexMap = new Map<string, number>();
  for (const ch of ALL_CHARS) {
    if (enabled.has(ch)) {
      indexMap.set(ch, idx);
      idx++;
    }
  }

  return (
    <div className="p-3 bg-zinc-50 dark:bg-zinc-800 rounded-xl border border-zinc-200 dark:border-zinc-700">
      <div className="flex items-center justify-between mb-2">
        <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wide">
          Tabla personalizada ({enabled.size} caracteres)
        </p>
        <div className="flex gap-1.5">
          <button
            type="button"
            onClick={selectAll}
            className="text-[10px] px-2 py-0.5 rounded bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 font-medium hover:bg-blue-200 dark:hover:bg-blue-900/60 transition-colors"
          >
            Todos
          </button>
          <button
            type="button"
            onClick={clearAll}
            className="text-[10px] px-2 py-0.5 rounded bg-zinc-200 dark:bg-zinc-700 text-zinc-600 dark:text-zinc-400 font-medium hover:bg-zinc-300 dark:hover:bg-zinc-600 transition-colors"
          >
            Ninguno
          </button>
        </div>
      </div>
      <p className="text-[10px] text-zinc-400 dark:text-zinc-500 mb-2">
        Toca una letra para activar/desactivar. Los numeros se recalculan automaticamente.
      </p>
      <div className="flex flex-wrap gap-1">
        {ALL_CHARS.map((ch) => {
          const isOn = enabled.has(ch);
          const num = indexMap.get(ch);
          const label = ch === ' ' ? 'ESP' : ch;
          return (
            <button
              key={ch}
              type="button"
              onClick={() => toggle(ch)}
              className={`inline-flex items-center gap-0.5 px-2 py-1 rounded-md text-xs font-mono transition-all min-h-[32px] ${
                isOn
                  ? 'bg-blue-600 text-white border border-blue-500 shadow-sm'
                  : 'bg-zinc-200 dark:bg-zinc-700 text-zinc-400 dark:text-zinc-500 border border-zinc-300 dark:border-zinc-600 line-through'
              }`}
            >
              <span className="font-semibold">{label}</span>
              {isOn && (
                <>
                  <span className="opacity-60">=</span>
                  <span>{num}</span>
                </>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
