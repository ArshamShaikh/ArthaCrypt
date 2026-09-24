// Classical Cryptography Algorithms & Utilities

export const ALPHABET_UPPER = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
export const ALPHABET_LOWER = 'abcdefghijklmnopqrstuvwxyz';

// 1. Caesar Cipher
export function encryptCaesar(text: string, shift: number): string {
  const normalizedShift = ((shift % 26) + 26) % 26;
  return text
    .split('')
    .map((char) => {
      const upperIdx = ALPHABET_UPPER.indexOf(char);
      if (upperIdx !== -1) {
        return ALPHABET_UPPER[(upperIdx + normalizedShift) % 26];
      }
      const lowerIdx = ALPHABET_LOWER.indexOf(char);
      if (lowerIdx !== -1) {
        return ALPHABET_LOWER[(lowerIdx + normalizedShift) % 26];
      }
      return char;
    })
    .join('');
}

export function decryptCaesar(text: string, shift: number): string {
  return encryptCaesar(text, -shift);
}

// 2. Monoalphabetic Substitution Cipher
export function generateRandomMonoKey(): string {
  const letters = ALPHABET_UPPER.split('');
  for (let i = letters.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [letters[i], letters[j]] = [letters[j], letters[i]];
  }
  return letters.join('');
}

export function validateMonoKey(key: string): boolean {
  if (key.length !== 26) return false;
  const upper = key.toUpperCase();
  const set = new Set(upper);
  if (set.size !== 26) return false;
  for (let i = 0; i < 26; i++) {
    if (!ALPHABET_UPPER.includes(upper[i])) return false;
  }
  return true;
}

export function encryptMonoalphabetic(text: string, keyAlphabet: string): string {
  const normalizedKey = keyAlphabet.toUpperCase();
  return text
    .split('')
    .map((char) => {
      const upperIdx = ALPHABET_UPPER.indexOf(char);
      if (upperIdx !== -1) {
        return normalizedKey[upperIdx];
      }
      const lowerIdx = ALPHABET_LOWER.indexOf(char);
      if (lowerIdx !== -1) {
        return normalizedKey[lowerIdx].toLowerCase();
      }
      return char;
    })
    .join('');
}

export function decryptMonoalphabetic(text: string, keyAlphabet: string): string {
  const normalizedKey = keyAlphabet.toUpperCase();
  return text
    .split('')
    .map((char) => {
      const upperIdx = normalizedKey.indexOf(char);
      if (upperIdx !== -1) {
        return ALPHABET_UPPER[upperIdx];
      }
      const lowerIdx = normalizedKey.indexOf(char.toUpperCase());
      if (lowerIdx !== -1 && char === char.toLowerCase()) {
        return ALPHABET_LOWER[lowerIdx];
      }
      return char;
    })
    .join('');
}

// 3. Vigenère Cipher
export function encryptVigenere(text: string, keyword: string): string {
  const cleanKey = keyword.toUpperCase().replace(/[^A-Z]/g, '') || 'KEY';
  let keyIdx = 0;

  return text
    .split('')
    .map((char) => {
      const upperIdx = ALPHABET_UPPER.indexOf(char);
      const isUpper = upperIdx !== -1;
      const isLower = ALPHABET_LOWER.indexOf(char) !== -1;

      if (!isUpper && !isLower) return char;

      const baseIdx = isUpper ? upperIdx : ALPHABET_LOWER.indexOf(char);
      const shift = ALPHABET_UPPER.indexOf(cleanKey[keyIdx % cleanKey.length]);
      keyIdx++;

      const newIdx = (baseIdx + shift) % 26;
      return isUpper ? ALPHABET_UPPER[newIdx] : ALPHABET_LOWER[newIdx];
    })
    .join('');
}

export function decryptVigenere(text: string, keyword: string): string {
  const cleanKey = keyword.toUpperCase().replace(/[^A-Z]/g, '') || 'KEY';
  let keyIdx = 0;

  return text
    .split('')
    .map((char) => {
      const upperIdx = ALPHABET_UPPER.indexOf(char);
      const isUpper = upperIdx !== -1;
      const isLower = ALPHABET_LOWER.indexOf(char) !== -1;

      if (!isUpper && !isLower) return char;

      const baseIdx = isUpper ? upperIdx : ALPHABET_LOWER.indexOf(char);
      const shift = ALPHABET_UPPER.indexOf(cleanKey[keyIdx % cleanKey.length]);
      keyIdx++;

      const newIdx = (baseIdx - shift + 26) % 26;
      return isUpper ? ALPHABET_UPPER[newIdx] : ALPHABET_LOWER[newIdx];
    })
    .join('');
}
