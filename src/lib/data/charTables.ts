import { CharTable } from '../math/rsa';

function makeTable(name: string, id: string, pairs: [string, number][]): CharTable {
  const encode: Record<string, number> = {};
  const decode: Record<number, string> = {};
  for (const [ch, num] of pairs) {
    encode[ch] = num;
    decode[num] = ch;
  }
  return { name, id, encode, decode };
}

export const STANDARD_TABLE = makeTable(
  'Estándar (A=0...Esp=27)', 'standard',
  [
    ['A', 0], ['B', 1], ['C', 2], ['D', 3], ['E', 4], ['F', 5], ['G', 6], ['H', 7],
    ['I', 8], ['J', 9], ['K', 10], ['L', 11], ['M', 12], ['N', 13], ['Ñ', 14], ['O', 15],
    ['P', 16], ['Q', 17], ['R', 18], ['S', 19], ['T', 20], ['U', 21], ['V', 22], ['W', 23],
    ['X', 24], ['Y', 25], ['Z', 26], [' ', 27],
  ]
);

export const PROBLEM4_TABLE = makeTable(
  'Ejercicio 4 (A=1...Z=0)', 'problem4',
  [
    ['A', 1], ['B', 2], ['C', 3], ['D', 4], ['E', 5], ['F', 6], ['G', 7], ['H', 8],
    ['I', 9], ['J', 10], ['K', 11], ['L', 12], ['M', 13], ['N', 14], ['O', 15], ['P', 16],
    ['Q', 17], ['R', 18], ['S', 19], ['T', 20], ['U', 21], ['V', 22], ['W', 23], ['X', 24],
    ['Y', 25], ['Z', 0],
  ]
);

export const ALPHA_TABLE = makeTable(
  'Alfabética (A=0...V=21)', 'alpha',
  [
    ['A', 0], ['B', 1], ['C', 2], ['D', 3], ['E', 4], ['F', 5], ['G', 6], ['H', 7],
    ['I', 8], ['J', 9], ['K', 10], ['L', 11], ['M', 12], ['N', 13], ['O', 14], ['P', 15],
    ['Q', 16], ['R', 17], ['S', 18], ['T', 19], ['U', 20], ['V', 21], [' ', 22],
  ]
);

export const LIZ_TABLE = makeTable(
  'Tabla LIZ (A=0, sin G)', 'liz',
  [
    ['A', 0], ['B', 1], ['C', 2], ['D', 3], ['E', 4], ['F', 5], ['H', 6], ['I', 7],
    ['L', 8], ['M', 9], ['N', 10], ['O', 11], ['P', 12], ['R', 13], ['S', 14], ['T', 15],
    ['U', 16], ['V', 17], ['Y', 18], ['Z', 19],
  ]
);

function makeASCIITable(): CharTable {
  const encode: Record<string, number> = {};
  const decode: Record<number, string> = {};
  for (let i = 32; i <= 255; i++) {
    const ch = String.fromCharCode(i);
    encode[ch] = i;
    decode[i] = ch;
  }
  // Spanish special chars
  encode['¡'] = 161; decode[161] = '¡';
  encode['¿'] = 191; decode[191] = '¿';
  encode['Ñ'] = 165; decode[165] = 'Ñ';
  encode['ñ'] = 164; decode[164] = 'ñ';
  encode['á'] = 160; decode[160] = 'á';
  encode['é'] = 130; decode[130] = 'é';
  encode['í'] = 161; // Will use standard mapping
  encode['ó'] = 162; decode[162] = 'ó';
  encode['ú'] = 163; decode[163] = 'ú';

  return { name: 'ASCII Extendido', id: 'ascii', encode, decode };
}

export const ASCII_TABLE = makeASCIITable();

export const ALL_TABLES: CharTable[] = [STANDARD_TABLE, ALPHA_TABLE, PROBLEM4_TABLE, LIZ_TABLE, ASCII_TABLE];

export function getTableById(id: string): CharTable {
  return ALL_TABLES.find(t => t.id === id) ?? STANDARD_TABLE;
}
