export function modPow(base: number, exp: number, modulus: number): number {
  if (modulus === 1) return 0;
  let result = 1n;
  let b = BigInt(((base % modulus) + modulus) % modulus);
  let e = BigInt(exp);
  const m = BigInt(modulus);
  while (e > 0n) {
    if (e % 2n === 1n) {
      result = (result * b) % m;
    }
    e = e / 2n;
    b = (b * b) % m;
  }
  return Number(result);
}

export function mod(a: number, n: number): number {
  return ((a % n) + n) % n;
}
