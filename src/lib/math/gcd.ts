export function gcd(a: number, b: number): number {
  a = Math.abs(a);
  b = Math.abs(b);
  while (b !== 0) {
    [a, b] = [b, a % b];
  }
  return a;
}

export interface ExtendedGCDResult {
  gcd: number;
  x: number;
  y: number;
}

export function extendedGCD(a: number, b: number): ExtendedGCDResult {
  if (b === 0) return { gcd: a, x: 1, y: 0 };
  const result = extendedGCD(b, a % b);
  return {
    gcd: result.gcd,
    x: result.y,
    y: result.x - Math.floor(a / b) * result.y,
  };
}

export interface EuclidStep {
  a: number;
  b: number;
  q: number;
  r: number;
}

export function extendedGCDWithSteps(a: number, b: number): {
  gcd: number;
  x: number;
  y: number;
  steps: EuclidStep[];
} {
  const steps: EuclidStep[] = [];
  let aa = Math.abs(a);
  let bb = Math.abs(b);

  while (bb !== 0) {
    const q = Math.floor(aa / bb);
    const r = aa % bb;
    steps.push({ a: aa, b: bb, q, r });
    [aa, bb] = [bb, r];
  }

  const result = extendedGCD(Math.abs(a), Math.abs(b));
  let x = result.x;
  let y = result.y;
  if (a < 0) x = -x;
  if (b < 0) y = -y;

  return { gcd: result.gcd, x, y, steps };
}

export function modInverse(a: number, m: number): number | null {
  const result = extendedGCD(((a % m) + m) % m, m);
  if (result.gcd !== 1) return null;
  return ((result.x % m) + m) % m;
}

export function isPrime(n: number): boolean {
  if (n < 2) return false;
  if (n < 4) return true;
  if (n % 2 === 0 || n % 3 === 0) return false;
  for (let i = 5; i * i <= n; i += 6) {
    if (n % i === 0 || n % (i + 2) === 0) return false;
  }
  return true;
}
