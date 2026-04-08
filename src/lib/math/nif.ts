import { SolutionStep } from './congruence';

const NIF_LETTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

export interface NIFResult {
  found: boolean;
  digits: string;
  fullDNI: string;
  letter: string;
  remainder: number;
  steps: SolutionStep[];
}

export function solveNIF(template: string, expectedLetter: string): NIFResult {
  const steps: SolutionStep[] = [];
  const letterIdx = NIF_LETTERS.indexOf(expectedLetter.toUpperCase());

  steps.push({
    title: 'Paso 1: Identificar el resto correspondiente a la letra',
    explanation: `La letra ${expectedLetter} corresponde al resto ${letterIdx} en la tabla NIF (módulo 26).`,
    math: `Tabla: ${NIF_LETTERS.split('').map((l, i) => `${l}=${i}`).join(', ')}\n${expectedLetter} → resto = ${letterIdx}`,
  });

  steps.push({
    title: 'Paso 2: Plantear la congruencia',
    explanation: `El número DNI ${template} debe satisfacer: DNI ≡ ${letterIdx} mod 26`,
    math: `${template} ≡ ${letterIdx} mod 26`,
  });

  const xPos = template.indexOf('x');
  const solutions: string[] = [];

  for (let d1 = 0; d1 <= 9; d1++) {
    for (let d2 = 0; d2 <= 9; d2++) {
      const filled = template.replace('xx', `${d1}${d2}`).replace('x', `${d1}`);
      const num = parseInt(filled, 10);
      if (num % 26 === letterIdx) {
        solutions.push(`${d1}${d2}`);
      }
    }
  }

  if (solutions.length > 0) {
    const digits = solutions[0];
    const fullDNI = template.replace('xx', digits);
    const num = parseInt(fullDNI, 10);

    steps.push({
      title: 'Paso 3: Buscar los dígitos faltantes',
      explanation: `Probamos todas las combinaciones de dos dígitos (00 a 99) y verificamos cuáles satisfacen la congruencia.`,
      math: solutions.map(s => {
        const dn = template.replace('xx', s);
        return `${dn} mod 26 = ${parseInt(dn, 10) % 26} ${parseInt(dn, 10) % 26 === letterIdx ? '✓' : ''}`;
      }).join('\n'),
    });

    steps.push({
      title: 'Resultado final',
      explanation: `Los dígitos faltantes son ${digits}.`,
      math: `NIF: ${fullDNI}-${expectedLetter}\nVerificación: ${num} mod 26 = ${num % 26} = ${letterIdx} → ${expectedLetter} ✓`,
    });

    return { found: true, digits, fullDNI, letter: expectedLetter, remainder: letterIdx, steps };
  }

  steps.push({
    title: 'Sin solución',
    explanation: 'No se encontró ninguna combinación de dígitos que satisfaga la condición.',
    math: 'No hay solución',
  });

  return { found: false, digits: '', fullDNI: '', letter: expectedLetter, remainder: letterIdx, steps };
}
