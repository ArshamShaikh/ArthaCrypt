// Brute Force Demonstration & Keyspace Analysis
import { decryptCaesar } from './classicalCrypto';
import { BruteForceCandidate } from '../types';

const COMMON_WORDS = new Set([
  'THE', 'BE', 'TO', 'OF', 'AND', 'A', 'IN', 'THAT', 'HAVE', 'I', 'IT', 'FOR', 'NOT',
  'ON', 'WITH', 'HE', 'AS', 'YOU', 'DO', 'AT', 'THIS', 'BUT', 'HIS', 'BY', 'FROM',
  'THEY', 'WE', 'SAY', 'HER', 'SHE', 'OR', 'AN', 'WILL', 'MY', 'ONE', 'ALL', 'WOULD',
  'THERE', 'THEIR', 'WHAT', 'SO', 'UP', 'OUT', 'IF', 'ABOUT', 'WHO', 'GET', 'WHICH',
  'GO', 'ME', 'SECRET', 'MESSAGE', 'ATTACK', 'DAWN', 'KING', 'KINGDOM', 'SPY', 'ENVOY',
  'ARMY', 'COUNSEL', 'FORT', 'TREASURY', 'SECURITY', 'CIPHER', 'GUARD', 'WAR', 'PEACE',
  'CHANAKYA', 'ARTHASHASTRA', 'KAUTILYA', 'EMPIRE'
]);

export function runCaesarBruteForce(ciphertext: string): BruteForceCandidate[] {
  const results: BruteForceCandidate[] = [];

  for (let shift = 1; shift < 26; shift++) {
    const candidate = decryptCaesar(ciphertext, shift);
    const words = candidate
      .toUpperCase()
      .replace(/[^A-Z\s]/g, ' ')
      .split(/\s+/)
      .filter((w) => w.length > 1);

    const matchedWords: string[] = [];
    let score = 0;

    for (const w of words) {
      if (COMMON_WORDS.has(w)) {
        matchedWords.push(w);
        score += w.length * 10;
      }
    }

    // Give bonus for common short words
    const upperCandidate = candidate.toUpperCase();
    if (upperCandidate.includes(' THE ')) score += 15;
    if (upperCandidate.includes(' AND ')) score += 12;
    if (upperCandidate.includes(' IS ')) score += 8;

    results.push({
      shift,
      decryptedText: candidate,
      score,
      matchedWords: Array.from(new Set(matchedWords)),
    });
  }

  // Sort by score descending so best candidate is first
  return results.sort((a, b) => b.score - a.score);
}

export interface KeyspaceComparisonItem {
  name: string;
  category: 'Classical' | 'Obsolete' | 'Modern Standard';
  keyspaceFormula: string;
  exactKeys: string;
  approxValue: number; // log10 approximation
  timeAtLaptop: string; // @ 1 Billion keys/sec (10^9)
  timeAtSupercomputer: string; // @ 1 Quadrillion keys/sec (10^15)
  securityRating: number; // 1 to 5
  status: 'Vulnerable' | 'Broken' | 'Quantum-Resistant' | 'Cryptographically Secure';
  details: string;
}

export const KEYSPACE_COMPARISONS: KeyspaceComparisonItem[] = [
  {
    name: 'Caesar Cipher',
    category: 'Classical',
    keyspaceFormula: '25 possible shifts',
    exactKeys: '25',
    approxValue: 1.4,
    timeAtLaptop: '< 0.00001 seconds',
    timeAtSupercomputer: 'Instantaneous (1 CPU cycle)',
    securityRating: 1,
    status: 'Vulnerable',
    details: 'Easily broken manually in under 2 minutes by checking 25 shifts.',
  },
  {
    name: 'Monoalphabetic Substitution',
    category: 'Classical',
    keyspaceFormula: '26! (Factorial)',
    exactKeys: '403,291,461,126,605,635,584,000,000 (~4.03 × 10²⁶)',
    approxValue: 26.6,
    timeAtLaptop: '12.8 Billion Years (via brute force)',
    timeAtSupercomputer: '12.8 Million Years (via brute force)',
    securityRating: 2,
    status: 'Vulnerable',
    details: 'While immune to pure brute force due to 26! keyspace, it is completely shattered in seconds via Frequency Analysis (Al-Kindi, 9th century).',
  },
  {
    name: 'DES (Data Encryption Standard)',
    category: 'Obsolete',
    keyspaceFormula: '2⁵⁶ bits',
    exactKeys: '72,057,594,037,927,936 (~7.2 × 10¹⁶)',
    approxValue: 16.8,
    timeAtLaptop: '~834 Days',
    timeAtSupercomputer: '~72 Seconds (EFF Deep Crack broke in 56 hours in 1998)',
    securityRating: 2,
    status: 'Broken',
    details: 'Adopted in 1977, proven insecure in late 1990s due to small 56-bit key size.',
  },
  {
    name: 'AES-128 (Advanced Encryption Standard)',
    category: 'Modern Standard',
    keyspaceFormula: '2¹²⁸ bits',
    exactKeys: '340,282,366,920,938,463,463,374,607,431,768,211,456 (~3.4 × 10³⁸)',
    approxValue: 38.5,
    timeAtLaptop: '1.08 × 10²² Years (~10 Billion Trillion Years)',
    timeAtSupercomputer: '1.08 × 10¹⁶ Years (Over 700,000 times the age of the Universe)',
    securityRating: 5,
    status: 'Cryptographically Secure',
    details: 'Global federal and banking standard. Even if all computers on Earth operated concurrently for billions of years, AES-128 remains unbreakable by brute force.',
  },
  {
    name: 'AES-256',
    category: 'Modern Standard',
    keyspaceFormula: '2²⁵⁶ bits',
    exactKeys: '1.1579 × 10⁷⁷ possible keys',
    approxValue: 77.0,
    timeAtLaptop: '3.67 × 10⁶⁰ Years',
    timeAtSupercomputer: '3.67 × 10⁵⁴ Years',
    securityRating: 5,
    status: 'Cryptographically Secure',
    details: 'Top-secret military grade. Also provides 128-bit security margin against quantum Grover algorithm attacks.',
  },
];
