export type TabType = 
  | 'classical'
  | 'modern'
  | 'frequency'
  | 'bruteforce'
  | 'comparison'
  | 'learning'
  | 'quiz'
  | 'report';

export type ClassicalAlgorithm = 'caesar' | 'monoalphabetic' | 'vigenere';

export interface ClassicalResult {
  algorithm: ClassicalAlgorithm;
  mode: 'encrypt' | 'decrypt';
  input: string;
  output: string;
  keyDetails: string;
  timestamp: string;
}

export interface ModernResult {
  mode: 'encrypt' | 'decrypt';
  algorithm: 'AES-128-GCM' | 'AES-256-GCM';
  input: string;
  output: string;
  ivHex: string;
  keyPassphrase: string;
  executionTimeMs: number;
  timestamp: string;
}

export interface LetterFrequency {
  letter: string;
  count: number;
  frequency: number; // percentage
  expectedEnglishFreq: number; // percentage
}

export interface BruteForceCandidate {
  shift: number;
  decryptedText: string;
  score: number;
  matchedWords: string[];
}

export interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  iksContext: string;
}

export interface TestCase {
  id: number;
  title: string;
  algorithm: string;
  input: string;
  key: string;
  expectedOutput: string;
  purpose: string;
  category: 'Equivalence' | 'Boundary' | 'Security' | 'Linguistic';
}

export interface ConceptualMapping {
  iksTerm: string;
  sanskritScript: string;
  sourceText: string;
  modernCsConcept: string;
  computationalMechanism: string;
  significance: string;
}
