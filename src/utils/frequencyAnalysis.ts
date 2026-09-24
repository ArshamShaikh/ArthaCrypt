// Frequency Analysis & Statistical Cryptanalysis Utilities
import { ALPHABET_UPPER, ALPHABET_LOWER } from './classicalCrypto';
import { LetterFrequency } from '../types';

export const ENGLISH_LETTER_FREQS: Record<string, number> = {
  E: 12.02,
  T: 9.10,
  A: 8.12,
  O: 7.68,
  I: 7.31,
  N: 6.95,
  S: 6.28,
  R: 6.02,
  H: 5.92,
  D: 4.32,
  L: 3.98,
  U: 2.88,
  C: 2.71,
  M: 2.61,
  F: 2.30,
  Y: 2.11,
  W: 2.09,
  G: 2.03,
  P: 1.82,
  B: 1.49,
  V: 1.11,
  K: 0.69,
  X: 0.17,
  Q: 0.11,
  J: 0.10,
  Z: 0.07,
};

export const ENGLISH_FREQ_RANK = [
  'E', 'T', 'A', 'O', 'I', 'N', 'S', 'R', 'H', 'D', 'L', 'U', 'C', 'M', 'F', 'Y', 'W', 'G', 'P', 'B', 'V', 'K', 'X', 'Q', 'J', 'Z'
];

// Compute observed frequencies of letters in text
export function calculateFrequencies(text: string): {
  letters: LetterFrequency[];
  totalLetters: number;
  chiSquare: number;
} {
  const counts: Record<string, number> = {};
  for (const char of ALPHABET_UPPER) {
    counts[char] = 0;
  }

  let totalLetters = 0;
  for (const char of text.toUpperCase()) {
    if (ALPHABET_UPPER.includes(char)) {
      counts[char]++;
      totalLetters++;
    }
  }

  let chiSquare = 0;
  const letters: LetterFrequency[] = ALPHABET_UPPER.split('').map((char) => {
    const count = counts[char];
    const frequency = totalLetters > 0 ? (count / totalLetters) * 100 : 0;
    const expectedFreq = ENGLISH_LETTER_FREQS[char] || 0;

    if (totalLetters > 0) {
      const expectedCount = (expectedFreq / 100) * totalLetters;
      if (expectedCount > 0) {
        chiSquare += Math.pow(count - expectedCount, 2) / expectedCount;
      }
    }

    return {
      letter: char,
      count,
      frequency: Number(frequency.toFixed(2)),
      expectedEnglishFreq: expectedFreq,
    };
  });

  return {
    letters,
    totalLetters,
    chiSquare: Number(chiSquare.toFixed(2)),
  };
}

// Apply an interactive substitution mapping to decode ciphertext in real-time
export function applySubstitution(
  text: string,
  userMap: Record<string, string> // e.g. { 'X': 'E', 'B': 'T' }
): string {
  return text
    .split('')
    .map((char) => {
      const upper = char.toUpperCase();
      if (userMap[upper]) {
        const mapped = userMap[upper];
        return char === upper ? mapped.toUpperCase() : mapped.toLowerCase();
      }
      // If not yet mapped, keep character or display in a muted form
      return char;
    })
    .join('');
}
