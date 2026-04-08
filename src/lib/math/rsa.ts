import { gcd, isPrime, modInverse } from './gcd';
import { modPow, mod } from './modpow';
import { SolutionStep } from './congruence';

export interface CharTable {
  name: string;
  id: string;
  encode: Record<string, number>;
  decode: Record<number, string>;
}

export interface RSAKeys {
  p: number;
  q: number;
  n: number;
  phi: number;
  d: number;
  e: number;
}

export interface RSACharResult {
  char: string;
  numeric: number;
  result: number;
  resultChar: string;
  computation: string;
}

export interface RSAResult {
  keys: RSAKeys;
  keySteps: SolutionStep[];
  charResults: RSACharResult[];
  outputText: string;
  outputNumbers: number[];
  errors: string[];
}

export function findSmallestD(phi: number): number {
  for (let d = 2; d < phi; d++) {
    if (gcd(d, phi) === 1) return d;
  }
  return -1;
}

export function generateKeys(p: number, q: number, dInput?: number): { keys: RSAKeys; steps: SolutionStep[]; errors: string[] } {
  const steps: SolutionStep[] = [];
  const errors: string[] = [];

  if (!isPrime(p)) errors.push(`p = ${p} no es primo`);
  if (!isPrime(q)) errors.push(`q = ${q} no es primo`);
  if (p === q) errors.push('p y q deben ser distintos');
  if (errors.length > 0) return { keys: { p, q, n: 0, phi: 0, d: 0, e: 0 }, steps, errors };

  const n = p * q;
  const phi = (p - 1) * (q - 1);

  steps.push({
    title: 'Paso 1: Elegir primos p y q',
    explanation: `Se eligen dos números primos distintos.`,
    math: `p = ${p}, q = ${q}`,
  });

  steps.push({
    title: 'Paso 2: Calcular n = p × q',
    explanation: `El módulo n es el producto de los dos primos.`,
    math: `n = ${p} × ${q} = ${n}`,
  });

  steps.push({
    title: 'Paso 3: Calcular φ(n) = (p-1)(q-1)',
    explanation: `La función de Euler nos da la cantidad de números coprimos con n menores que n.`,
    math: `φ(${n}) = (${p}-1)(${q}-1) = ${p - 1} × ${q - 1} = ${phi}`,
  });

  let d: number;
  if (dInput !== undefined && dInput > 0) {
    d = dInput;
    if (gcd(d, phi) !== 1) {
      errors.push(`d = ${d} no es coprimo con φ(n) = ${phi}. MCD(${d}, ${phi}) = ${gcd(d, phi)}`);
      return { keys: { p, q, n, phi, d, e: 0 }, steps, errors };
    }
  } else {
    d = findSmallestD(phi);
  }

  steps.push({
    title: 'Paso 4: Elegir d (clave privada)',
    explanation: `Elegimos d < φ(n) tal que MCD(d, φ(n)) = 1.`,
    math: `d = ${d}, MCD(${d}, ${phi}) = ${gcd(d, phi)} = 1 ✓\nClave privada: (${n}, ${d})`,
  });

  const e = modInverse(d, phi);
  if (e === null) {
    errors.push(`No se pudo encontrar el inverso de d = ${d} módulo φ(n) = ${phi}`);
    return { keys: { p, q, n, phi, d, e: 0 }, steps, errors };
  }

  steps.push({
    title: 'Paso 5: Calcular e (clave pública)',
    explanation: `Resolvemos e·d ≡ 1 mod φ(n).`,
    math: `${d}·e ≡ 1 mod ${phi}\ne = ${e}\nVerificación: ${d} × ${e} = ${d * e} ≡ ${mod(d * e, phi)} mod ${phi} ✓\nClave pública: (${n}, ${e})`,
  });

  return { keys: { p, q, n, phi, d, e }, steps, errors };
}

export function rsaEncrypt(message: string, keys: RSAKeys, table: CharTable): RSAResult {
  const { keys: k, steps: keySteps, errors } = generateKeys(keys.p, keys.q, keys.d);
  if (errors.length > 0) return { keys: k, keySteps, charResults: [], outputText: '', outputNumbers: [], errors };

  const charResults: RSACharResult[] = [];
  const outputNumbers: number[] = [];
  const outputChars: string[] = [];

  const encStep: SolutionStep = {
    title: 'Paso 6: Proceso de encriptación',
    explanation: `Para cada carácter M del mensaje, calculamos C ≡ M^e mod n = M^${k.e} mod ${k.n}`,
    math: '',
  };

  const lines: string[] = [];

  for (const char of message) {
    const tableChar = char === 'Ñ' || char === 'ñ' ? 'Ñ' : char.toUpperCase();
    const numeric = table.encode[char] ?? table.encode[tableChar] ?? table.encode[char.toUpperCase()];

    if (numeric === undefined) {
      errors.push(`Carácter '${char}' no encontrado en la tabla`);
      continue;
    }

    const encrypted = modPow(numeric, k.e, k.n);
    const resultChar = table.decode[encrypted] ?? '?';

    charResults.push({ char, numeric, result: encrypted, resultChar, computation: `${numeric}^${k.e} mod ${k.n} = ${encrypted}` });
    outputNumbers.push(encrypted);
    outputChars.push(resultChar);

    lines.push(`${char} = ${numeric}  →  C ≡ ${numeric}^${k.e} mod ${k.n} = ${encrypted}  →  ${resultChar}`);
  }

  encStep.math = lines.join('\n');
  keySteps.push(encStep);

  const outputText = outputChars.join('');

  keySteps.push({
    title: 'Resultado final',
    explanation: `El mensaje "${message}" encriptado es:`,
    math: `Números: ${outputNumbers.join(', ')}\nTexto: ${outputText}`,
  });

  return { keys: k, keySteps, charResults, outputText, outputNumbers, errors };
}

export function rsaDecrypt(cipherValues: number[], keys: RSAKeys, table: CharTable): RSAResult {
  const { keys: k, steps: keySteps, errors } = generateKeys(keys.p, keys.q, keys.d);
  if (errors.length > 0) return { keys: k, keySteps, charResults: [], outputText: '', outputNumbers: [], errors };

  const charResults: RSACharResult[] = [];
  const outputChars: string[] = [];

  const decStep: SolutionStep = {
    title: 'Paso 6: Proceso de desencriptación',
    explanation: `Para cada valor cifrado C, calculamos M ≡ C^d mod n = C^${k.d} mod ${k.n}`,
    math: '',
  };

  const lines: string[] = [];

  for (const c of cipherValues) {
    const decrypted = modPow(c, k.d, k.n);
    const resultChar = table.decode[decrypted] ?? '?';

    charResults.push({
      char: table.decode[c] ?? String(c),
      numeric: c,
      result: decrypted,
      resultChar,
      computation: `${c}^${k.d} mod ${k.n} = ${decrypted}`,
    });
    outputChars.push(resultChar);

    lines.push(`C = ${c}  →  M ≡ ${c}^${k.d} mod ${k.n} = ${decrypted}  →  ${resultChar}`);
  }

  decStep.math = lines.join('\n');
  keySteps.push(decStep);

  const outputText = outputChars.join('');

  keySteps.push({
    title: 'Resultado final',
    explanation: 'El mensaje desencriptado es:',
    math: outputText,
  });

  return { keys: k, keySteps, charResults, outputText, outputNumbers: cipherValues, errors };
}
