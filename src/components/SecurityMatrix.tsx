import React, { useState } from 'react';
import { 
  Shield, 
  Check, 
  X, 
  AlertTriangle, 
  Info,
  SlidersHorizontal,
  Lock,
  Star
} from 'lucide-react';

interface AlgorithmRow {
  name: string;
  category: 'Classical' | 'Legacy Modern' | 'Current Standard';
  keySize: string;
  attackDifficulty: 'Trivial' | 'Medium' | 'Practically Infeasible' | 'Quantum-Tolerant';
  securityRating: number;
  ciphertextOnly: 'Vulnerable' | 'Resistant';
  knownPlaintext: 'Instant Break' | 'Resistant';
  frequencyAttack: 'Broken in seconds' | 'Flattened' | 'Immune';
  tamperIntegrity: 'None' | 'Requires external HMAC' | 'Built-in (AEAD GCM Tag)';
  summary: string;
}

const COMPARISON_ROWS: AlgorithmRow[] = [
  {
    name: 'Caesar Cipher',
    category: 'Classical',
    keySize: '25 shifts (log₂ 25 ≈ 4.6 bits)',
    attackDifficulty: 'Trivial',
    securityRating: 1,
    ciphertextOnly: 'Vulnerable',
    knownPlaintext: 'Instant Break',
    frequencyAttack: 'Broken in seconds',
    tamperIntegrity: 'None',
    summary: '25 keys exhausted in milliseconds; zero mathematical security in modern times.'
  },
  {
    name: 'Monoalphabetic Substitution',
    category: 'Classical',
    keySize: '26! ≈ 4.03 × 10²⁶ (88.4 bits)',
    attackDifficulty: 'Medium',
    securityRating: 2,
    ciphertextOnly: 'Vulnerable',
    knownPlaintext: 'Instant Break',
    frequencyAttack: 'Broken in seconds',
    tamperIntegrity: 'None',
    summary: 'Immune to brute force due to 26! size, but shattered instantly by letter frequency cryptanalysis.'
  },
  {
    name: 'Vigenère Cipher',
    category: 'Classical',
    keySize: '26ᴸ (L = keyword length)',
    attackDifficulty: 'Medium',
    securityRating: 3,
    ciphertextOnly: 'Vulnerable',
    knownPlaintext: 'Instant Break',
    frequencyAttack: 'Flattened',
    tamperIntegrity: 'None',
    summary: 'Historically considered "le chiffre indéchiffrable" (unbreakable) until Babbage & Kasiski developed period-finding.'
  },
  {
    name: 'DES (Data Encryption Standard)',
    category: 'Legacy Modern',
    keySize: '56 bits',
    attackDifficulty: 'Trivial',
    securityRating: 2,
    ciphertextOnly: 'Vulnerable',
    knownPlaintext: 'Instant Break',
    frequencyAttack: 'Immune',
    tamperIntegrity: 'Requires external HMAC',
    summary: 'Insecure since late 1990s due to small 56-bit key size easily cracked by distributed hardware clusters.'
  },
  {
    name: 'AES-128-GCM',
    category: 'Current Standard',
    keySize: '128 bits',
    attackDifficulty: 'Practically Infeasible',
    securityRating: 5,
    ciphertextOnly: 'Resistant',
    knownPlaintext: 'Resistant',
    frequencyAttack: 'Immune',
    tamperIntegrity: 'Built-in (AEAD GCM Tag)',
    summary: 'Current global gold standard for banking, military, and web transport (TLS 1.3). Authenticated encryption prevents tampering.'
  },
  {
    name: 'AES-256-GCM',
    category: 'Current Standard',
    keySize: '256 bits',
    attackDifficulty: 'Quantum-Tolerant',
    securityRating: 5,
    ciphertextOnly: 'Resistant',
    knownPlaintext: 'Resistant',
    frequencyAttack: 'Immune',
    tamperIntegrity: 'Built-in (AEAD GCM Tag)',
    summary: 'Top-secret grade. Grover\'s quantum algorithm cuts key bits in half, leaving 128-bit quantum security margin.'
  }
];

export const SecurityMatrix: React.FC = () => {
  const [filterCategory, setFilterCategory] = useState<string>('All');
  const [selectedAlgo, setSelectedAlgo] = useState<AlgorithmRow | null>(COMPARISON_ROWS[4]);

  const filtered = filterCategory === 'All' 
    ? COMPARISON_ROWS 
    : COMPARISON_ROWS.filter(r => r.category === filterCategory);

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-stone-900/80 border border-stone-800 rounded-xl p-5 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <span className="p-1.5 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20">
                <SlidersHorizontal className="w-5 h-5" />
              </span>
              <h1 className="font-iks text-xl font-bold text-stone-100">
                Security Comparison Matrix
              </h1>
            </div>
            <p className="text-sm text-stone-400 max-w-3xl">
              Compare encryption methods across history: see how classical ciphers compare against modern AES in key size, attack resistance, and security level.
            </p>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center p-1 bg-stone-950 rounded-lg border border-stone-800 self-start md:self-auto text-xs">
            {['All', 'Classical', 'Current Standard'].map((cat) => (
              <button
                key={cat}
                onClick={() => setFilterCategory(cat)}
                className={`px-3 py-1.5 rounded-md font-medium transition-all ${
                  filterCategory === cat
                    ? 'bg-amber-600 text-white shadow-sm'
                    : 'text-stone-400 hover:text-stone-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Interactive Table */}
      <div className="bg-stone-900/80 border border-stone-800 rounded-xl p-5 space-y-4">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono-code border-collapse">
            <thead>
              <tr className="border-b border-stone-800 text-stone-500 text-[11px]">
                <th className="py-3 px-3">Algorithm</th>
                <th className="py-3 px-3">Category</th>
                <th className="py-3 px-3">Key Size</th>
                <th className="py-3 px-3">Attack Difficulty</th>
                <th className="py-3 px-3">Frequency Cryptanalysis</th>
                <th className="py-3 px-3">Tamper Verification</th>
                <th className="py-3 px-3">Security Rating</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-800/60 text-stone-300">
              {filtered.map((row, idx) => {
                const isSelected = selectedAlgo?.name === row.name;
                return (
                  <tr
                    key={idx}
                    onClick={() => setSelectedAlgo(row)}
                    className={`cursor-pointer transition-colors ${
                      isSelected ? 'bg-amber-950/30' : 'hover:bg-stone-950/40'
                    }`}
                  >
                    <td className="py-3 px-3 font-bold text-stone-100 flex items-center space-x-2">
                      <Lock className="w-3 h-3 text-amber-400" />
                      <span>{row.name}</span>
                    </td>
                    <td className="py-3 px-3 text-stone-400">{row.category}</td>
                    <td className="py-3 px-3 text-amber-300">{row.keySize}</td>
                    <td className="py-3 px-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        row.attackDifficulty === 'Practically Infeasible' || row.attackDifficulty === 'Quantum-Tolerant'
                          ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                          : row.attackDifficulty === 'Trivial'
                          ? 'bg-red-950 text-red-300 border border-red-800'
                          : 'bg-amber-950 text-amber-300 border border-amber-800'
                      }`}>
                        {row.attackDifficulty}
                      </span>
                    </td>
                    <td className="py-3 px-3">
                      <span className={row.frequencyAttack === 'Immune' ? 'text-emerald-400' : 'text-red-400'}>
                        {row.frequencyAttack}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-stone-400">{row.tamperIntegrity}</td>
                    <td className="py-3 px-3">
                      <div className="flex items-center text-amber-400">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            className={`w-3 h-3 ${i < row.securityRating ? 'fill-amber-400' : 'text-stone-700'}`}
                          />
                        ))}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Deep-Dive Inspection on Selected Algorithm */}
      {selectedAlgo && (
        <div className="bg-stone-900/80 border border-stone-800 rounded-xl p-5 space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-amber-300 flex items-center space-x-2">
              <Info className="w-4 h-4 text-amber-400" />
              <span>Cryptanalytic Profile: {selectedAlgo.name}</span>
            </h2>
            <span className="text-[11px] font-mono-code text-stone-500">
              {selectedAlgo.category}
            </span>
          </div>

          <p className="text-xs text-stone-300 leading-relaxed font-mono-code">
            {selectedAlgo.summary}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-xs font-mono-code">
            <div className="p-3 bg-stone-950 rounded-lg border border-stone-800 space-y-1">
              <span className="text-stone-500 block text-[10px]">Ciphertext-Only Attack</span>
              <div className="flex items-center space-x-1.5">
                {selectedAlgo.ciphertextOnly === 'Resistant' ? (
                  <Check className="w-4 h-4 text-emerald-400" />
                ) : (
                  <X className="w-4 h-4 text-red-400" />
                )}
                <span className={selectedAlgo.ciphertextOnly === 'Resistant' ? 'text-emerald-300' : 'text-red-300'}>
                  {selectedAlgo.ciphertextOnly}
                </span>
              </div>
            </div>

            <div className="p-3 bg-stone-950 rounded-lg border border-stone-800 space-y-1">
              <span className="text-stone-500 block text-[10px]">Known-Plaintext Attack</span>
              <div className="flex items-center space-x-1.5">
                {selectedAlgo.knownPlaintext === 'Resistant' ? (
                  <Check className="w-4 h-4 text-emerald-400" />
                ) : (
                  <AlertTriangle className="w-4 h-4 text-red-400" />
                )}
                <span className={selectedAlgo.knownPlaintext === 'Resistant' ? 'text-emerald-300' : 'text-red-300'}>
                  {selectedAlgo.knownPlaintext}
                </span>
              </div>
            </div>

            <div className="p-3 bg-stone-950 rounded-lg border border-stone-800 space-y-1">
              <span className="text-stone-500 block text-[10px]">Tampering & Integrity Check</span>
              <span className="text-stone-200 block truncate">{selectedAlgo.tamperIntegrity}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
