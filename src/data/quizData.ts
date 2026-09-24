import { QuizQuestion } from '../types';

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 1,
    question: "In Kautilya's Arthaśāstra, what term is used to describe the practice of secret, coded, or disguised written communication?",
    options: [
      "Gudhalekhya (Secret Writing)",
      "Vakyapradipa (Grammar Treatise)",
      "Meru-Prastara (Combinatorics)",
      "Samavaya (Aggregation)"
    ],
    correctAnswer: 0,
    explanation: "Book 2, Chapter 10 of the Arthaśāstra explicitly details 'Gūḍhalekhya' (secret writing) and royal cipher edicts transmitted through trusted envoys.",
    iksContext: "Arthaśāstra Adhyakṣapracāra"
  },
  {
    id: 2,
    question: "Why does the Monoalphabetic Substitution Cipher fail against modern cryptanalysis, despite having a massive keyspace of 26! (~4 × 10²⁶)?",
    options: [
      "Because the keys are too short to remember",
      "Because it conserves the underlying letter frequency distribution of the natural language",
      "Because computers can brute-force 26! in under 1 second",
      "Because the alphabet wrap-around introduces mathematical collisions"
    ],
    correctAnswer: 1,
    explanation: "Monoalphabetic ciphers preserve 1-to-1 letter mappings. If 'E' is the most common letter in English (12%), its cipher substitute will also appear 12% of the time, enabling instant statistical cryptanalysis.",
    iksContext: "Failure of Classical Systems"
  },
  {
    id: 3,
    question: "What ancient Sanskrit text lists 'Mlecchita Vikalpa' (the art of secret and cipher writing) as one of the essential 64 traditional arts (Catuḥṣaṣṭi Kalāḥ)?",
    options: [
      "Caraka Saṁhitā",
      "Kāmasūtra of Vātsyāyana",
      "Chandaḥśāstra of Piṅgala",
      "Nyāya Sūtra"
    ],
    correctAnswer: 1,
    explanation: "The Kāmasūtra of Vātsyāyana (c. 3rd century CE) enumerates Mlecchita Vikalpa as Art #45, covering secret cipher codes and letter substitutions like Akṣaramuṣṭikā.",
    iksContext: "Indian Classical Arts Tradition"
  },
  {
    id: 4,
    question: "Which mathematical property introduced by Claude Shannon describes how changing a single bit in the plaintext alters roughly 50% of the ciphertext bits in modern AES?",
    options: [
      "Permutation Invariance",
      "Diffusion (The Avalanche Effect)",
      "Confusion via simple shift",
      "Homophonic padding"
    ],
    correctAnswer: 1,
    explanation: "Diffusion spreads the statistical structure of individual plaintext characters across the entire ciphertext. In AES, this is visualized as the 'Avalanche Effect'.",
    iksContext: "Modern Cryptographic Theory"
  },
  {
    id: 5,
    question: "What is the total number of non-trivial shifts possible in a standard English Caesar Cipher?",
    options: [
      "25 possible keys (excluding key 0)",
      "256 possible keys",
      "26! possible keys",
      "2¹²⁸ possible keys"
    ],
    correctAnswer: 0,
    explanation: "The English alphabet has 26 letters. Since shift 0 (or 26) leaves the message unchanged, there are only 25 possible functional keys, rendering brute force trivial.",
    iksContext: "Keyspace Analysis"
  },
  {
    id: 6,
    question: "How does the Vigenère Cipher attempt to mitigate basic frequency analysis attacks?",
    options: [
      "By using RSA modular exponentiation",
      "By using a polyalphabetic repeating keyword so a single plaintext letter maps to multiple different ciphertext letters",
      "By physically destroying the intercepted message",
      "By hashing the message with SHA-256"
    ],
    correctAnswer: 1,
    explanation: "Vigenère is polyalphabetic: if the keyword is 'KEY', an 'E' matching 'K' shifts differently than an 'E' matching 'Y', flattening the single-letter frequency distribution curve.",
    iksContext: "Polyalphabetic Encryption"
  },
  {
    id: 7,
    question: "Why does AES-128 withstand all known brute-force attacks across modern supercomputing clusters?",
    options: [
      "The US government legally forbids computers from running attack scripts",
      "The keyspace is 2¹²⁸ (~3.4 × 10³⁸), requiring more than 10²² years to check even at quadrillions of tests per second",
      "AES ciphers mutate their own key every 5 seconds during transit",
      "AES uses physical quantum entanglement that collapses when observed"
    ],
    correctAnswer: 1,
    explanation: "2¹²⁸ is an astronomically vast number. Even a supercomputer testing 10¹⁵ keys/sec would require hundreds of thousands of times the age of the Universe to search half the keyspace.",
    iksContext: "Computational Security"
  },
  {
    id: 8,
    question: "In the context of the Arthaśāstra, what was the role of the 'Mūdrā' (royal seal) affixed to diplomatic dispatches?",
    options: [
      "To serve as decoration for the recipient",
      "To provide physical Message Authentication & Integrity Verification (precursor to modern MACs)",
      "To store the secret Caesar shift number",
      "To calculate tax percentages automatically"
    ],
    correctAnswer: 1,
    explanation: "Mūdrā acted as a tamper-evident seal. If broken or altered, the recipient knew the dispatch had been intercepted or forged in transit—directly mirroring cryptographic MACs.",
    iksContext: "Message Integrity & Authentication"
  },
  {
    id: 9,
    question: "What is Kerckhoffs's Principle in modern cryptography, and how does it relate to classical cipher systems?",
    options: [
      "A cryptosystem must be secure even if everything about the algorithm is public, as long as the key remains secret",
      "The encryption algorithm itself must always be kept secret from everyone",
      "Only symmetric ciphers can be mathematically verified",
      "Keys must be transmitted in plain sight through public messengers"
    ],
    correctAnswer: 0,
    explanation: "Classical systems relied heavily on secrecy of the method (obscurity). Modern cryptography mandates Kerckhoffs's Principle: the algorithm is open, but the mathematical key protects the data.",
    iksContext: "Security Architecture"
  },
  {
    id: 10,
    question: "What is the primary operational mode of AES implemented in this platform for authenticated encryption?",
    options: [
      "ECB (Electronic Codebook Mode)",
      "GCM (Galois/Counter Mode with 128-bit authentication tag)",
      "Caesar Stream Mode",
      "ROT13 Mode"
    ],
    correctAnswer: 1,
    explanation: "AES-GCM combines counter-mode confidentiality with Galois-field MAC authentication, protecting both confidentiality and integrity simultaneously.",
    iksContext: "Modern Standard Implementation"
  }
];
