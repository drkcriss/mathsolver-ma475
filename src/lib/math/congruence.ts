import { gcd, extendedGCD, extendedGCDWithSteps } from './gcd';
import { mod } from './modpow';

export interface SolutionStep {
  title: string;
  explanation: string;
  math: string;
}

export interface CongruenceInput {
  a: number;
  b: number;
  n: number;
  offset?: number;
}

export interface CongruenceResult {
  hasSolution: boolean;
  reason: string;
  d: number;
  numSolutions: number;
  solutions: number[];
  generalForm: string;
  steps: SolutionStep[];
  method: 'bruteforce' | 'inverse' | 'euclid';
}

function normalize(input: CongruenceInput): { a: number; b: number; n: number; preSteps: SolutionStep[] } {
  const preSteps: SolutionStep[] = [];
  let { a, b, n, offset } = input;

  if (offset !== undefined && offset !== 0) {
    preSteps.push({
      title: 'Paso previo: Transformar la ecuación',
      explanation: `Tenemos ${offset} + ${a}x ≡ ${b} mod ${n}. Restamos ${offset} de ambos lados.`,
      math: `${a}x ≡ ${b} - ${offset} mod ${n}  →  ${a}x ≡ ${mod(b - offset, n)} mod ${n}`,
    });
    b = mod(b - offset, n);
  }

  a = mod(a, n);
  b = mod(b, n);

  if (a !== input.a || b !== input.b) {
    preSteps.push({
      title: 'Reducir coeficientes módulo n',
      explanation: `Reducimos a y b módulo ${n}.`,
      math: `${a}x ≡ ${b} mod ${n}`,
    });
  }

  return { a, b, n, preSteps };
}

export function solveBruteForce(input: CongruenceInput): CongruenceResult {
  const { a, b, n, preSteps } = normalize(input);
  const steps: SolutionStep[] = [...preSteps];
  const d = gcd(a, n);

  steps.push({
    title: 'Paso 1: Verificar existencia de solución',
    explanation: `Calculamos MCD(${a}, ${n}) = ${d}. ¿${d} divide a ${b}?`,
    math: `MCD(${a}, ${n}) = ${d}${b % d === 0 ? ` y ${d} | ${b} → Sí hay solución` : ` y ${d} ∤ ${b} → No hay solución`}`,
  });

  if (b % d !== 0) {
    return { hasSolution: false, reason: `MCD(${a}, ${n}) = ${d} no divide a ${b}`, d, numSolutions: 0, solutions: [], generalForm: 'No hay solución', steps, method: 'bruteforce' };
  }

  steps.push({
    title: 'Paso 2: Probar todos los valores x = 0, 1, ..., n-1',
    explanation: `Evaluamos ${a}·x mod ${n} para cada x y verificamos si es igual a ${b}.`,
    math: `Buscamos x tal que ${a}x ≡ ${b} mod ${n}`,
  });

  const solutions: number[] = [];
  const trials: string[] = [];
  for (let x = 0; x < n; x++) {
    const val = mod(a * x, n);
    const match = val === b;
    trials.push(`x=${x}: ${a}·${x} = ${a * x} ≡ ${val} mod ${n}${match ? ' ✓' : ''}`);
    if (match) solutions.push(x);
  }

  steps.push({
    title: 'Paso 3: Resultados de la búsqueda',
    explanation: trials.join('\n'),
    math: `Soluciones encontradas: x ∈ {${solutions.join(', ')}}`,
  });

  const x0 = solutions[0];
  const period = n / d;
  const generalForm = solutions.length === 1
    ? `x = ${x0} + ${n}k, k ∈ ℤ`
    : `x = ${x0} + ${period}k, k ∈ ℤ  (${d} soluciones en [0, ${n - 1}])`;

  steps.push({
    title: 'Resultado final',
    explanation: `Se encontraron ${solutions.length} solución(es) en [0, ${n - 1}].`,
    math: `Solución general: ${generalForm}`,
  });

  return { hasSolution: true, reason: `MCD(${a}, ${n}) = ${d} divide a ${b}`, d, numSolutions: solutions.length, solutions, generalForm, steps, method: 'bruteforce' };
}

export function solveMultiplicativeInverse(input: CongruenceInput): CongruenceResult {
  const { a, b, n, preSteps } = normalize(input);
  const steps: SolutionStep[] = [...preSteps];
  const d = gcd(a, n);

  steps.push({
    title: 'Paso 1: Calcular MCD(a, n)',
    explanation: `MCD(${a}, ${n}) = ${d}`,
    math: `d = MCD(${a}, ${n}) = ${d}`,
  });

  if (b % d !== 0) {
    steps.push({ title: 'Sin solución', explanation: `${d} no divide a ${b}, por lo tanto no existe solución.`, math: `${d} ∤ ${b} → No hay solución` });
    return { hasSolution: false, reason: `MCD(${a}, ${n}) = ${d} no divide a ${b}`, d, numSolutions: 0, solutions: [], generalForm: 'No hay solución', steps, method: 'inverse' };
  }

  const a1 = a / d;
  const b1 = b / d;
  const n1 = n / d;

  if (d > 1) {
    steps.push({
      title: 'Paso 2: Simplificar la ecuación',
      explanation: `Dividimos toda la ecuación entre d = ${d}.`,
      math: `${a}x ≡ ${b} mod ${n}  →  ${a1}x ≡ ${b1} mod ${n1}`,
    });
  }

  steps.push({
    title: d > 1 ? 'Paso 3: Encontrar el inverso multiplicativo' : 'Paso 2: Encontrar el inverso multiplicativo',
    explanation: `Buscamos un número m tal que ${a1}·m ≡ 1 mod ${n1}.`,
    math: `${a1}·m ≡ 1 mod ${n1}`,
  });

  let inv = -1;
  const invTrials: string[] = [];
  for (let m = 1; m < n1; m++) {
    const val = mod(a1 * m, n1);
    invTrials.push(`${a1}·${m} = ${a1 * m} ≡ ${val} mod ${n1}${val === 1 ? ' ✓' : ''}`);
    if (val === 1 && inv === -1) inv = m;
  }

  steps.push({
    title: d > 1 ? 'Paso 4: Búsqueda del inverso' : 'Paso 3: Búsqueda del inverso',
    explanation: invTrials.join('\n'),
    math: `Inverso de ${a1} mod ${n1} = ${inv}`,
  });

  const x0 = mod(inv * b1, n1);

  steps.push({
    title: d > 1 ? 'Paso 5: Multiplicar ambos lados por el inverso' : 'Paso 4: Multiplicar ambos lados por el inverso',
    explanation: `Multiplicamos: x ≡ ${inv}·${b1} mod ${n1}`,
    math: `x ≡ ${inv} × ${b1} mod ${n1} ≡ ${inv * b1} mod ${n1} ≡ ${x0} mod ${n1}`,
  });

  const solutions: number[] = [];
  for (let k = 0; k < d; k++) {
    solutions.push(mod(x0 + k * n1, n));
  }
  solutions.sort((a, b) => a - b);

  const generalForm = d === 1
    ? `x = ${x0} + ${n}k, k ∈ ℤ`
    : `x = ${x0} + ${n1}k, k ∈ ℤ  →  Soluciones en [0,${n - 1}]: {${solutions.join(', ')}}`;

  steps.push({
    title: 'Resultado final',
    explanation: d > 1 ? `Como d = ${d}, hay ${d} soluciones en [0, ${n - 1}].` : `La solución particular es x₀ = ${x0}.`,
    math: `Solución general: ${generalForm}`,
  });

  return { hasSolution: true, reason: `MCD(${a}, ${n}) = ${d} divide a ${b}`, d, numSolutions: solutions.length, solutions, generalForm, steps, method: 'inverse' };
}

export function solveExtendedEuclid(input: CongruenceInput): CongruenceResult {
  const { a, b, n, preSteps } = normalize(input);
  const steps: SolutionStep[] = [...preSteps];
  const d = gcd(a, n);

  steps.push({
    title: 'Paso 1: Calcular MCD(a, n)',
    explanation: `MCD(${a}, ${n}) = ${d}`,
    math: `d = MCD(${a}, ${n}) = ${d}`,
  });

  if (b % d !== 0) {
    steps.push({ title: 'Sin solución', explanation: `${d} no divide a ${b}.`, math: `${d} ∤ ${b} → No hay solución` });
    return { hasSolution: false, reason: `${d} no divide a ${b}`, d, numSolutions: 0, solutions: [], generalForm: 'No hay solución', steps, method: 'euclid' };
  }

  const a1 = a / d;
  const b1 = b / d;
  const n1 = n / d;

  if (d > 1) {
    steps.push({
      title: 'Paso 2: Simplificar',
      explanation: `Dividimos entre d = ${d}.`,
      math: `${a1}x ≡ ${b1} mod ${n1}`,
    });
  }

  const euclidResult = extendedGCDWithSteps(a1, n1);

  steps.push({
    title: d > 1 ? 'Paso 3: Algoritmo de Euclides Extendido' : 'Paso 2: Algoritmo de Euclides Extendido',
    explanation: `Aplicamos el algoritmo para encontrar x, y tales que ${a1}·x + ${n1}·y = 1.`,
    math: euclidResult.steps.map(s => `${s.a} = ${s.q} × ${s.b} + ${s.r}`).join('\n'),
  });

  const inv = mod(euclidResult.x, n1);

  steps.push({
    title: d > 1 ? 'Paso 4: Obtener el inverso' : 'Paso 3: Obtener el inverso',
    explanation: `Del algoritmo extendido: ${a1}·(${euclidResult.x}) + ${n1}·(${euclidResult.y}) = 1. El inverso de ${a1} mod ${n1} es ${inv}.`,
    math: `${a1}⁻¹ mod ${n1} = ${inv}`,
  });

  const x0 = mod(inv * b1, n1);
  const solutions: number[] = [];
  for (let k = 0; k < d; k++) {
    solutions.push(mod(x0 + k * n1, n));
  }
  solutions.sort((a, b) => a - b);

  const generalForm = d === 1
    ? `x = ${x0} + ${n}k, k ∈ ℤ`
    : `x = ${x0} + ${n1}k, k ∈ ℤ  →  Soluciones en [0,${n - 1}]: {${solutions.join(', ')}}`;

  steps.push({
    title: 'Resultado final',
    explanation: `x ≡ ${inv} × ${b1} mod ${n1} ≡ ${x0} mod ${n1}`,
    math: `Solución general: ${generalForm}`,
  });

  return { hasSolution: true, reason: `MCD(${a}, ${n}) = ${d} divide a ${b}`, d, numSolutions: solutions.length, solutions, generalForm, steps, method: 'euclid' };
}
