import { gcd, modInverse } from './gcd';
import { mod } from './modpow';
import { SolutionStep } from './congruence';

export interface CharTable {
  name: string;
  id: string;
  encode: Record<string, number>;
  decode: Record<number, string>;
}

export interface AffineResult {
  steps: SolutionStep[];
  charResults: { char: string; numeric: number; result: number; resultChar: string }[];
  outputText: string;
  outputNumbers: number[];
  errors: string[];
}

export function affineEncrypt(message: string, a: number, b: number, table: CharTable): AffineResult {
  const steps: SolutionStep[] = [];
  const errors: string[] = [];
  const tableSize = Object.keys(table.encode).length;

  steps.push({
    title: 'Paso 1: Identificar parametros',
    explanation: `Cifrado afin: C = (a·M + b) mod n, donde n es el tamaño del alfabeto.`,
    math: `a = ${a}, b = ${b}, n = ${tableSize}\nFormula: C = (${a}·M + ${b}) mod ${tableSize}`,
  });

  const d = gcd(a, tableSize);
  if (d !== 1) {
    steps.push({
      title: 'Advertencia',
      explanation: `MCD(a, n) = MCD(${a}, ${tableSize}) = ${d} ≠ 1. El cifrado no es invertible (no se podra desencriptar de forma unica).`,
      math: `MCD(${a}, ${tableSize}) = ${d}`,
    });
  } else {
    steps.push({
      title: 'Paso 2: Verificar invertibilidad',
      explanation: `MCD(a, n) = MCD(${a}, ${tableSize}) = 1 ✓. El cifrado es invertible.`,
      math: `MCD(${a}, ${tableSize}) = 1`,
    });
  }

  const charResults: { char: string; numeric: number; result: number; resultChar: string }[] = [];
  const outputNumbers: number[] = [];
  const outputChars: string[] = [];
  const lines: string[] = [];

  for (const char of message) {
    const tableChar = char === 'Ñ' || char === 'ñ' ? 'Ñ' : char.toUpperCase();
    const numeric = table.encode[char] ?? table.encode[tableChar] ?? table.encode[char.toUpperCase()];

    if (numeric === undefined) {
      errors.push(`Caracter '${char}' no encontrado en la tabla`);
      continue;
    }

    const product = a * numeric + b;
    const encrypted = mod(product, tableSize);
    const resultChar = table.decode[encrypted] ?? `[${encrypted}]`;

    charResults.push({ char, numeric, result: encrypted, resultChar });
    outputNumbers.push(encrypted);
    outputChars.push(resultChar);

    lines.push(`${char} = ${numeric}  →  C = ${a}·${numeric} + ${b} = ${product} mod ${tableSize} = ${encrypted}  →  ${resultChar}`);
  }

  steps.push({
    title: d !== 1 ? 'Paso 3: Proceso de encriptacion' : 'Paso 3: Proceso de encriptacion',
    explanation: `Para cada caracter M, calculamos C = (${a}·M + ${b}) mod ${tableSize}`,
    math: lines.join('\n'),
  });

  const outputText = outputChars.join('');

  steps.push({
    title: 'Resultado final',
    explanation: `El mensaje "${message}" encriptado es:`,
    math: `Numeros: ${outputNumbers.join(', ')}\nTexto: ${outputText}`,
  });

  return { steps, charResults, outputText, outputNumbers, errors };
}

export function affineDecrypt(cipherValues: number[], a: number, b: number, table: CharTable): AffineResult {
  const steps: SolutionStep[] = [];
  const errors: string[] = [];
  const tableSize = Object.keys(table.encode).length;

  steps.push({
    title: 'Paso 1: Identificar parametros',
    explanation: `Descifrado afin: M = a⁻¹·(C - b) mod n`,
    math: `a = ${a}, b = ${b}, n = ${tableSize}`,
  });

  const d = gcd(a, tableSize);
  if (d !== 1) {
    errors.push(`MCD(${a}, ${tableSize}) = ${d} ≠ 1. No se puede desencriptar: el cifrado no es invertible.`);
    return { steps, charResults: [], outputText: '', outputNumbers: [], errors };
  }

  const aInv = modInverse(a, tableSize);
  if (aInv === null) {
    errors.push(`No se pudo encontrar el inverso de a = ${a} mod ${tableSize}`);
    return { steps, charResults: [], outputText: '', outputNumbers: [], errors };
  }

  steps.push({
    title: 'Paso 2: Calcular inverso de a',
    explanation: `Buscamos a⁻¹ tal que a·a⁻¹ ≡ 1 mod ${tableSize}.`,
    math: `${a}⁻¹ mod ${tableSize} = ${aInv}\nVerificacion: ${a} × ${aInv} = ${a * aInv} ≡ ${mod(a * aInv, tableSize)} mod ${tableSize} ✓\nFormula: M = ${aInv}·(C - ${b}) mod ${tableSize}`,
  });

  const charResults: { char: string; numeric: number; result: number; resultChar: string }[] = [];
  const outputChars: string[] = [];
  const lines: string[] = [];

  for (const c of cipherValues) {
    const diff = c - b;
    const decrypted = mod(aInv * diff, tableSize);
    const resultChar = table.decode[decrypted] ?? `[${decrypted}]`;
    const cipherChar = table.decode[c] ?? `[${c}]`;

    charResults.push({ char: cipherChar, numeric: c, result: decrypted, resultChar });
    outputChars.push(resultChar);

    lines.push(`C = ${c} (${cipherChar})  →  M = ${aInv}·(${c} - ${b}) mod ${tableSize} = ${aInv}·${mod(diff, tableSize)} mod ${tableSize} = ${decrypted}  →  ${resultChar}`);
  }

  steps.push({
    title: 'Paso 3: Proceso de desencriptacion',
    explanation: `Para cada valor cifrado C, calculamos M = ${aInv}·(C - ${b}) mod ${tableSize}`,
    math: lines.join('\n'),
  });

  const outputText = outputChars.join('');

  steps.push({
    title: 'Resultado final',
    explanation: 'El mensaje desencriptado es:',
    math: outputText,
  });

  return { steps, charResults, outputText, outputNumbers: cipherValues, errors };
}
