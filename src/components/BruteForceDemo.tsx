import React, { useState, useEffect } from 'react';
import { runCaesarBruteForce, KEYSPACE_COMPARISONS } from '../utils/bruteForce';
import { encryptCaesar } from '../utils/classicalCrypto';
import { BruteForceCandidate } from '../types';
import { 
  Unlock, 
  Play, 
  Pause, 
  RotateCcw, 
  CheckCircle2, 
  ShieldAlert, 
  Cpu, 
  Clock, 
  Layers,
  Sparkles
} from 'lucide-react';

interface BruteForceDemoProps {
  initialCiphertext: string;
}

const DEFAULT_CIPHER = encryptCaesar("THE SECRET AGENTS WILL ASSEMBLE AT THE WESTERN FORT GATES", 7);

export const BruteForceDemo: React.FC<BruteForceDemoProps> = ({ initialCiphertext }) => {
  const [ciphertext, setCiphertext] = useState<string>(initialCiphertext || DEFAULT_CIPHER);
  const [allCandidates, setAllCandidates] = useState<BruteForceCandidate[]>([]);
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [attackSpeed, setAttackSpeed] = useState<number>(150); // ms per step
  const [discoveredShift, setDiscoveredShift] = useState<number | null>(null);

  // Compute all 25 shifts whenever ciphertext updates
  useEffect(() => {
    if (!ciphertext.trim()) return;
    const candidates = runCaesarBruteForce(ciphertext);
    // Sort in natural shift order 1..25 for sequential animation
    const sequential = [...candidates].sort((a, b) => a.shift - b.shift);
    setAllCandidates(sequential);
    setCurrentStepIndex(0);
    setIsPlaying(false);

    // Find the best scoring one
    if (candidates.length > 0 && candidates[0].score > 0) {
      setDiscoveredShift(candidates[0].shift);
    } else {
      setDiscoveredShift(null);
    }
  }, [ciphertext]);

  // Handle Play/Pause animation timer
  useEffect(() => {
    let timer: NodeJS.Timeout | null = null;
    if (isPlaying) {
      timer = setInterval(() => {
        setCurrentStepIndex((prev) => {
          if (prev >= allCandidates.length - 1) {
            setIsPlaying(false);
            return prev;
          }
          return prev + 1;
        });
      }, attackSpeed);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isPlaying, allCandidates.length, attackSpeed]);

  const activeCandidate = allCandidates[currentStepIndex];

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-stone-900/80 border border-stone-800 rounded-xl p-5 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <span className="p-1.5 rounded-lg bg-red-500/10 text-red-400 border border-red-500/20">
                <Unlock className="w-5 h-5" />
              </span>
              <h1 className="font-iks text-xl font-bold text-stone-100">
                Brute Force Attack Lab
              </h1>
            </div>
            <p className="text-sm text-stone-400 max-w-3xl">
              See how quickly a computer can test every possible key. Because a Caesar cipher only has 25 possible shifts, it can be cracked instantly. In contrast, modern AES has 2¹²⁸ combinations and cannot be cracked.
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => {
                const text = encryptCaesar("ATTACK THE ENEMY STRONGHOLD AT DAWN BEFORE GUARDS AWAKEN", 13);
                setCiphertext(text);
              }}
              className="text-xs px-3 py-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-200 border border-stone-700 transition-colors"
            >
              Load Shift-13 Sample
            </button>
          </div>
        </div>
      </div>

      {/* Interactive Caesar Brute Force Animation Box */}
      <div className="bg-stone-900/80 border border-stone-800 rounded-xl p-5 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center space-x-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-amber-300">
              Live Caesar Exhaustion Runner (Shifts 1 to 25)
            </span>
            <span className="text-xs text-stone-500 font-mono-code">
              Step {currentStepIndex + 1} of 25
            </span>
          </div>

          {/* Player Controls */}
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="px-3 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-500 text-white text-xs font-medium flex items-center space-x-1.5 transition-colors cursor-pointer"
            >
              {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
              <span>{isPlaying ? 'Pause Attack' : 'Start Auto-Attack'}</span>
            </button>
            <button
              onClick={() => {
                setCurrentStepIndex(0);
                setIsPlaying(false);
              }}
              className="p-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-400 hover:text-stone-200 border border-stone-700 transition-colors"
              title="Reset"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
            <div className="flex items-center space-x-1.5 text-xs text-stone-400 pl-2">
              <span>Speed:</span>
              <select
                value={attackSpeed}
                onChange={(e) => setAttackSpeed(Number(e.target.value))}
                className="bg-stone-950 border border-stone-800 rounded px-2 py-1 text-stone-200 text-xs"
              >
                <option value={300}>Slow (300ms)</option>
                <option value={150}>Normal (150ms)</option>
                <option value={50}>Fast (50ms)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Input Ciphertext */}
        <div className="space-y-1">
          <label className="text-[11px] text-stone-400">Ciphertext under attack:</label>
          <input
            type="text"
            value={ciphertext}
            onChange={(e) => setCiphertext(e.target.value.toUpperCase())}
            className="w-full bg-stone-950 border border-stone-800 rounded-lg p-2.5 text-xs text-amber-200 font-mono-code focus:outline-none focus:border-amber-500"
          />
        </div>

        {/* Active Candidate Display */}
        {activeCandidate && (
          <div className={`p-4 rounded-xl border transition-all ${
            discoveredShift === activeCandidate.shift
              ? 'bg-emerald-950/30 border-emerald-500/60 shadow-lg shadow-emerald-950/40'
              : 'bg-stone-950 border-stone-800'
          }`}>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2 pb-2 border-b border-stone-800/80">
              <div className="flex items-center space-x-2">
                <span className="font-mono-code font-bold text-sm bg-stone-900 text-amber-300 px-2 py-0.5 rounded border border-stone-800">
                  Testing Shift {activeCandidate.shift}
                </span>
                {discoveredShift === activeCandidate.shift ? (
                  <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center space-x-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Plaintext Match Discovered!</span>
                  </span>
                ) : (
                  <span className="text-[11px] text-stone-500">Unlikely Match</span>
                )}
              </div>

              <div className="flex items-center space-x-3 text-xs font-mono-code">
                <span className="text-stone-400">
                  Dictionary Matches: <strong className="text-amber-300">{activeCandidate.matchedWords.length}</strong>
                </span>
                <span className="text-stone-400">
                  Heuristic Score: <strong className="text-emerald-400">{activeCandidate.score}</strong>
                </span>
              </div>
            </div>

            <div className="font-mono-code text-sm text-stone-200 break-words py-1">
              {activeCandidate.decryptedText}
            </div>

            {activeCandidate.matchedWords.length > 0 && (
              <div className="mt-2 flex items-center space-x-1.5 text-[11px] text-stone-400 font-mono-code">
                <span>Recognized words:</span>
                {activeCandidate.matchedWords.map((w, idx) => (
                  <span key={idx} className="px-1.5 py-0.5 bg-emerald-900/40 text-emerald-300 rounded border border-emerald-700/50">
                    {w}
                  </span>
                ))}
              </div>
            )}
          </div>
        )}

        {/* 25-Shift Grid Overview */}
        <div className="space-y-1.5 pt-2">
          <span className="text-[11px] text-stone-400">Direct Shift Selection:</span>
          <div className="grid grid-cols-5 sm:grid-cols-9 md:grid-cols-13 gap-1.5 font-mono-code text-xs">
            {allCandidates.map((cand, idx) => (
              <button
                key={cand.shift}
                onClick={() => {
                  setCurrentStepIndex(idx);
                  setIsPlaying(false);
                }}
                className={`py-1 rounded text-center border transition-all ${
                  idx === currentStepIndex
                    ? 'bg-amber-500 text-stone-950 font-bold border-amber-400 scale-105 shadow'
                    : cand.shift === discoveredShift
                    ? 'bg-emerald-950 text-emerald-300 border-emerald-600'
                    : 'bg-stone-950 text-stone-400 border-stone-800 hover:bg-stone-900'
                }`}
              >
                k={cand.shift}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Keyspace Comparison: Classical vs Modern AES */}
      <div className="bg-stone-900/80 border border-stone-800 rounded-xl p-5 space-y-4">
        <div className="flex items-center space-x-2">
          <span className="p-1.5 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20">
            <Cpu className="w-5 h-5" />
          </span>
          <div>
            <h2 className="font-iks text-lg font-bold text-stone-100">
              Keyspace & Time-To-Crack Comparison (Classical vs Modern)
            </h2>
            <p className="text-xs text-stone-400">
              Why today&apos;s symmetric encryption algorithms are mathematically insurmountable to brute force.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-2">
          {KEYSPACE_COMPARISONS.map((item, idx) => (
            <div
              key={idx}
              className={`p-4 rounded-xl border flex flex-col justify-between space-y-3 ${
                item.securityRating === 5
                  ? 'bg-emerald-950/20 border-emerald-700/40'
                  : item.status === 'Broken'
                  ? 'bg-red-950/20 border-red-700/40'
                  : 'bg-stone-950 border-stone-800'
              }`}
            >
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-stone-200">{item.name}</span>
                  <span className={`text-[10px] px-1.5 py-0.5 rounded font-mono-code font-semibold ${
                    item.securityRating === 5
                      ? 'bg-emerald-500/20 text-emerald-300'
                      : item.status === 'Broken'
                      ? 'bg-red-500/20 text-red-300'
                      : 'bg-amber-500/20 text-amber-300'
                  }`}>
                    {item.status}
                  </span>
                </div>

                <div className="text-[11px] font-mono-code text-stone-400">
                  Keyspace: <strong className="text-amber-300">{item.keyspaceFormula}</strong>
                </div>

                <div className="text-[10px] text-stone-500 font-mono-code break-all">
                  Exact Keys: {item.exactKeys}
                </div>
              </div>

              <div className="space-y-2 pt-2 border-t border-stone-800/80 text-[11px] font-mono-code">
                <div className="flex items-center justify-between">
                  <span className="text-stone-500 flex items-center space-x-1">
                    <Clock className="w-3 h-3" />
                    <span>Laptop (10⁹ keys/s):</span>
                  </span>
                  <span className="font-bold text-stone-300">{item.timeAtLaptop}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-stone-500 flex items-center space-x-1">
                    <Cpu className="w-3 h-3" />
                    <span>Supercomputer:</span>
                  </span>
                  <span className="font-bold text-amber-300">{item.timeAtSupercomputer}</span>
                </div>
              </div>

              <p className="text-[11px] text-stone-400 leading-relaxed">
                {item.details}
              </p>
            </div>
          ))}
        </div>

        {/* Real-World Perspective Infographic */}
        <div className="p-4 bg-amber-950/20 border border-amber-800/40 rounded-xl space-y-2">
          <div className="flex items-center space-x-2 text-amber-300 font-semibold text-xs">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>How Incomprehensibly Big is the AES-128 Keyspace ($2^{128}$)?</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-stone-300 pt-1">
            <div className="p-2.5 bg-stone-950/80 rounded border border-stone-800">
              <span className="text-stone-500 block text-[10px]">Total Seconds in Universe (~13.8B yrs):</span>
              <strong className="text-amber-300 font-mono-code">~4.35 × 10¹⁷ seconds</strong>
            </div>
            <div className="p-2.5 bg-stone-950/80 rounded border border-stone-800">
              <span className="text-stone-500 block text-[10px]">Estimated Atoms in Observable Universe:</span>
              <strong className="text-amber-300 font-mono-code">~10⁸⁰ atoms</strong>
            </div>
            <div className="p-2.5 bg-stone-950/80 rounded border border-stone-800">
              <span className="text-stone-500 block text-[10px]">AES-128 Possible Keys:</span>
              <strong className="text-emerald-400 font-mono-code">3.4 × 10³⁸ keys</strong>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
