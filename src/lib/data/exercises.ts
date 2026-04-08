export interface CongruenceExercise {
  id: string;
  label: string;
  a: number;
  b: number;
  n: number;
  offset?: number;
  description: string;
}

export interface RSAExercise {
  id: string;
  label: string;
  type: 'encrypt' | 'decrypt';
  message: string;
  p: number;
  q: number;
  d?: number;
  tableId: string;
  description: string;
}

export const CONGRUENCE_EXERCISES: CongruenceExercise[] = [
  { id: 'c1a', label: '1a', a: 9, b: 8, n: 11, description: '9x ≡ 8 mod 11' },
  { id: 'c1b', label: '1b', a: 321, b: 123, n: 7, description: '321x ≡ 123 mod 7' },
  { id: 'c1c', label: '1c', a: 18, b: 12, n: 15, description: '18x ≡ 12 mod 15' },
  { id: 'c1d', label: '1d', a: 221, b: 333, n: 11, description: '221x ≡ 333 mod 11' },
  { id: 'c1e', label: '1e', a: 30, b: 311, n: 21, offset: 230, description: '230 + 30x ≡ 311 mod 21' },
  { id: 'c1f', label: '1f', a: 88, b: 324, n: 18, offset: 200, description: '200 + 88x ≡ 324 mod 18' },
];

export const RSA_EXERCISES: RSAExercise[] = [
  { id: 'r3a', label: '3a', type: 'encrypt', message: 'CORONAVIRUS', p: 2, q: 23, tableId: 'standard', description: 'Encriptar CORONAVIRUS (p=2, q=23)' },
  { id: 'r3b', label: '3b', type: 'encrypt', message: 'ARRIBA ALIANZA', p: 3, q: 17, tableId: 'standard', description: 'Encriptar ARRIBA ALIANZA (p=3, q=17)' },
  { id: 'r3c', label: '3c', type: 'encrypt', message: 'SINO DESCIENDE', p: 7, q: 13, tableId: 'standard', description: 'Encriptar SINO DESCIENDE (p=7, q=13)' },
  { id: 'r3d', label: '3d', type: 'encrypt', message: 'TE AMO PERU', p: 5, q: 11, tableId: 'standard', description: 'Encriptar TE AMO PERU (p=5, q=11)' },
  { id: 'r3e', label: '3e', type: 'encrypt', message: 'QUEDATE EN CASA', p: 3, q: 17, tableId: 'standard', description: 'Encriptar QUEDATE EN CASA (p=3, q=17)' },
  { id: 'r3f', label: '3f', type: 'encrypt', message: 'PASION POR COMPUTACIONAL', p: 2, q: 19, tableId: 'standard', description: 'Encriptar PASION POR COMPUTACIONAL (p=2, q=19)' },
  { id: 'r4', label: '4', type: 'decrypt', message: 'LOL', p: 2, q: 13, d: 5, tableId: 'problem4', description: 'Desencriptar LOL, clave privada (26, 5)' },
  { id: 'r5a', label: '5a', type: 'encrypt', message: '¡Cuidado con el COVID 19!', p: 11, q: 31, d: 41, tableId: 'ascii', description: 'Encriptar con ASCII (p=11, q=31, d=41)' },
  { id: 'r5b', label: '5b', type: 'encrypt', message: 'Mi correo es discreto2020@gmail.com', p: 13, q: 29, d: 47, tableId: 'ascii', description: 'Encriptar con ASCII (p=13, q=29, d=47)' },
  { id: 'r5c', label: '5c', type: 'encrypt', message: '¿Por qué te amo tanto?', p: 17, q: 23, d: 53, tableId: 'ascii', description: 'Encriptar con ASCII (p=17, q=23, d=53)' },
  { id: 'r5d', label: '5d', type: 'encrypt', message: '¡Quédate en casa!', p: 5, q: 19, d: 31, tableId: 'ascii', description: 'Encriptar con ASCII (p=5, q=19, d=31)' },
];

export const NIF_EXERCISE = {
  template: '753xx357',
  letter: 'R',
  description: '¿Cuál es el dígito borrado en el NIF 753xx357-R?',
};
