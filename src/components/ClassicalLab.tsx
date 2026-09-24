import React, { useState } from 'react';
import { 
  ClassicalAlgorithm, 
  ClassicalResult, 
  TabType 
} from '../types';
import { 
  encryptCaesar, 
  decryptCaesar, 
  generateRandomMonoKey, 
  validateMonoKey, 
  encryptMonoalphabetic, 
  decryptMonoalphabetic, 
  encryptVigenere, 
  decryptVigenere,
  ALPHABET_UPPER 
} from '../utils/classicalCrypto';
import { 
  Shield, 
  Copy, 
  Check, 
  ArrowRightLeft, 
  RefreshCw, 
  History, 
  Trash2, 
  BarChart3, 
  Unlock, 
  Info,
  Scroll
} from 'lucide-react';

interface ClassicalLabProps {
  onSendToFrequency: (text: string) => void;
  onSendToBruteForce: (text: string) => void;
  setActiveTab: (tab: TabType) => void;
}

const PRESET_MESSAGES = [
  {
    title: "Secret Envoy Dispatch",
    text: "DEPUTE THE SECRET AGENTS DISGUISED AS MERCHANTS TO INSPECT THE FORTRESS AT DAWN",
    desc: "Covert reconnaissance instructions."
  },
  {
    title: "Military Defense Edict",
    text: "THE FOUR FOLD ARMY OF ELEPHANTS CHARIOTS CAVALRY AND INFANTRY MUST GUARD THE BORDER",
    desc: "Coded troop mobilization message."
  },
  {
    title: "Short Test Phrase",
    text: "COUNSEL AND WISDOM GUARD THE STATE",
    desc: "Compact sentence ideal for inspecting individual letter shifts."
  }
];

export const ClassicalLab: React.FC<ClassicalLabProps> = ({
  onSendToFrequency,
  onSendToBruteForce,
  setActiveTab,
}) => {
  const [algorithm, setAlgorithm] = useState<ClassicalAlgorithm>('caesar');
  const [mode, setMode] = useState<'encrypt' | 'decrypt'>('encrypt');
  const [input, setInput] = useState<string>(PRESET_MESSAGES[0].text);
  const [caesarShift, setCaesarShift] = useState<number>(3);
  const [monoKey, setMonoKey] = useState<string>('QWERTYUIOPASDFGHJKLZXCVBNM');
  const [vigenereKey, setVigenereKey] = useState<string>('KAUTILYA');
  const [copied, setCopied] = useState<boolean>(false);
  const [history, setHistory] = useState<ClassicalResult[]>(() => {
    const saved = localStorage.getItem('arthacrypt_classical_history');
    return saved ? JSON.parse(saved) : [];
  });

  // Calculate output dynamically
  let output = '';
  let keyDescription = '';

  if (algorithm === 'caesar') {
    output = mode === 'encrypt' ? encryptCaesar(input, caesarShift) : decryptCaesar(input, caesarShift);
    keyDescription = `Shift k = ${caesarShift}`;
  } else if (algorithm === 'monoalphabetic') {
    const isValid = validateMonoKey(monoKey);
    if (isValid) {
      output = mode === 'encrypt' ? encryptMonoalphabetic(input, monoKey) : decryptMonoalphabetic(input, monoKey);
      keyDescription = `Sub-Alphabet Key: ${monoKey}`;
    } else {
      output = 'Error: Substitution key must contain all 26 unique English alphabet letters.';
      keyDescription = 'Invalid Key';
    }
  } else if (algorithm === 'vigenere') {
    output = mode === 'encrypt' ? encryptVigenere(input, vigenereKey) : decryptVigenere(input, vigenereKey);
    keyDescription = `Keyword: ${vigenereKey.toUpperCase()}`;
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSaveToHistory = () => {
    if (!output || output.startsWith('Error')) return;
    const newEntry: ClassicalResult = {
      algorithm,
      mode,
      input,
      output,
      keyDetails: keyDescription,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
    };
    const updated = [newEntry, ...history.slice(0, 19)];
    setHistory(updated);
    localStorage.setItem('arthacrypt_classical_history', JSON.stringify(updated));
  };

  const handleClearHistory = () => {
    setHistory([]);
    localStorage.removeItem('arthacrypt_classical_history');
  };

  return (
    <div className="space-y-6">
      {/* Top Banner / Academic Context */}
      <div className="bg-stone-900/80 border border-stone-800 rounded-xl p-5 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <span className="p-1.5 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20">
                <Scroll className="w-5 h-5" />
              </span>
              <h1 className="font-iks text-xl font-bold text-stone-100">
                Classical Encryption Lab
              </h1>
            </div>
            <p className="text-sm text-stone-400 max-w-3xl">
              Experiment with historical substitution ciphers. Choose an algorithm below, type any message, and adjust the key to see how letters get scrambled and restored in real time.
            </p>
          </div>

          {/* Mode Toggle (Encrypt vs Decrypt) */}
          <div className="flex items-center p-1 bg-stone-950 rounded-lg border border-stone-800 self-start md:self-auto">
            <button
              onClick={() => setMode('encrypt')}
              className={`px-4 py-1.5 rounded-md text-xs font-semibold transition-all ${
                mode === 'encrypt'
                  ? 'bg-amber-600 text-white shadow-sm'
                  : 'text-stone-400 hover:text-stone-200'
              }`}
            >
              Encrypt
            </button>
            <button
              onClick={() => setMode('decrypt')}
              className={`px-4 py-1.5 rounded-md text-xs font-semibold transition-all ${
                mode === 'decrypt'
                  ? 'bg-amber-600 text-white shadow-sm'
                  : 'text-stone-400 hover:text-stone-200'
              }`}
            >
              Decrypt
            </button>
          </div>
        </div>

        {/* Algorithm Tabs */}
        <div className="flex flex-wrap gap-2 mt-5 pt-4 border-t border-stone-800/80">
          <button
            onClick={() => setAlgorithm('caesar')}
            className={`px-3 py-2 rounded-lg text-xs font-medium transition-all flex items-center space-x-2 border ${
              algorithm === 'caesar'
                ? 'bg-amber-500/15 border-amber-500/50 text-amber-200 shadow-sm'
                : 'bg-stone-950/60 border-stone-800 text-stone-400 hover:text-stone-200'
            }`}
          >
            <Shield className="w-3.5 h-3.5 text-amber-400" />
            <span>Caesar Cipher</span>
            <span className="text-[10px] text-stone-500">(Shift k)</span>
          </button>

          <button
            onClick={() => setAlgorithm('monoalphabetic')}
            className={`px-3 py-2 rounded-lg text-xs font-medium transition-all flex items-center space-x-2 border ${
              algorithm === 'monoalphabetic'
                ? 'bg-amber-500/15 border-amber-500/50 text-amber-200 shadow-sm'
                : 'bg-stone-950/60 border-stone-800 text-stone-400 hover:text-stone-200'
            }`}
          >
            <ArrowRightLeft className="w-3.5 h-3.5 text-amber-400" />
            <span>Monoalphabetic Substitution</span>
            <span className="text-[10px] text-stone-500">(26 Letters)</span>
          </button>

          <button
            onClick={() => setAlgorithm('vigenere')}
            className={`px-3 py-2 rounded-lg text-xs font-medium transition-all flex items-center space-x-2 border ${
              algorithm === 'vigenere'
                ? 'bg-amber-500/15 border-amber-500/50 text-amber-200 shadow-sm'
                : 'bg-stone-950/60 border-stone-800 text-stone-400 hover:text-stone-200'
            }`}
          >
            <RefreshCw className="w-3.5 h-3.5 text-amber-400" />
            <span>Vigenère Cipher</span>
            <span className="text-[10px] text-stone-500">(Keyword)</span>
          </button>
        </div>
      </div>

      {/* Main Two-Column Workbench */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Input & Key Configuration */}
        <div className="lg:col-span-6 space-y-4">
          <div className="bg-stone-900/80 border border-stone-800 rounded-xl p-5 space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold uppercase tracking-wider text-stone-300">
                {mode === 'encrypt' ? 'Plaintext Message' : 'Ciphertext Message'}
              </label>
              <span className="text-[11px] text-stone-500 font-mono-code">{input.length} characters</span>
            </div>

            <textarea
              rows={4}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Enter message to process..."
              className="w-full bg-stone-950 border border-stone-800 rounded-lg p-3 text-sm text-stone-100 placeholder-stone-600 focus:outline-none focus:border-amber-500 font-mono-code leading-relaxed resize-y"
            />

            {/* Presets */}
            <div className="space-y-1.5">
              <span className="text-[11px] font-medium text-stone-400">Historical & Classical Presets:</span>
              <div className="flex flex-wrap gap-2">
                {PRESET_MESSAGES.map((preset, idx) => (
                  <button
                    key={idx}
                    onClick={() => setInput(preset.text)}
                    className="text-[11px] px-2.5 py-1 rounded bg-stone-950 hover:bg-stone-800 text-stone-300 border border-stone-800 transition-colors text-left"
                    title={preset.desc}
                  >
                    {preset.title}
                  </button>
                ))}
              </div>
            </div>

            {/* Algorithm-Specific Key Controls */}
            <div className="pt-3 border-t border-stone-800/80 space-y-3">
              {algorithm === 'caesar' && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-medium text-amber-300 flex items-center space-x-1.5">
                      <span>Shift Parameter (k):</span>
                      <span className="font-mono-code font-bold text-sm bg-amber-950/80 text-amber-300 px-2 py-0.5 rounded border border-amber-800/60">
                        {caesarShift}
                      </span>
                    </label>
                    <span className="text-[11px] text-stone-500">Key Space: 25 keys</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="25"
                    value={caesarShift}
                    onChange={(e) => setCaesarShift(Number(e.target.value))}
                    className="w-full accent-amber-500 cursor-pointer"
                  />
                  {/* Visual Alphabet Shift Strip */}
                  <div className="mt-2 p-2 bg-stone-950 rounded-lg border border-stone-800/80 overflow-x-auto">
                    <div className="text-[10px] text-stone-500 mb-1 flex justify-between">
                      <span>Plaintext Alphabet (A-Z)</span>
                      <span>Shifted Alphabet (+{caesarShift})</span>
                    </div>
                    <div className="flex text-[10px] font-mono-code text-stone-400 space-x-1">
                      {ALPHABET_UPPER.slice(0, 13).split('').map((char, i) => (
                        <span key={i} className="px-1 py-0.5 bg-stone-900 rounded border border-stone-800">
                          {char}→{ALPHABET_UPPER[(i + caesarShift) % 26]}
                        </span>
                      ))}
                      <span className="text-stone-600">...</span>
                    </div>
                  </div>
                </div>
              )}

              {algorithm === 'monoalphabetic' && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-medium text-amber-300">
                      26-Letter Substitution Key Permutation:
                    </label>
                    <button
                      onClick={() => setMonoKey(generateRandomMonoKey())}
                      className="text-[11px] px-2 py-1 rounded bg-stone-800 hover:bg-stone-700 text-amber-300 flex items-center space-x-1 border border-stone-700 transition-colors"
                    >
                      <RefreshCw className="w-3 h-3" />
                      <span>Randomize Alphabet</span>
                    </button>
                  </div>
                  <input
                    type="text"
                    value={monoKey}
                    maxLength={26}
                    onChange={(e) => setMonoKey(e.target.value.toUpperCase())}
                    className="w-full bg-stone-950 border border-stone-800 rounded-lg p-2.5 text-xs text-amber-200 font-mono-code tracking-widest focus:outline-none focus:border-amber-500"
                  />
                  {!validateMonoKey(monoKey) && (
                    <p className="text-[11px] text-red-400">
                      Key must be exactly 26 distinct alphabetic characters without duplicates.
                    </p>
                  )}
                  <div className="flex gap-2">
                    <button
                      onClick={() => setMonoKey('QWERTYUIOPASDFGHJKLZXCVBNM')}
                      className="text-[10px] text-stone-400 hover:text-stone-200 underline"
                    >
                      Set QWERTY Key
                    </button>
                    <span className="text-stone-600">•</span>
                    <button
                      onClick={() => setMonoKey('ZYXWVUTSRQPONMLKJIHGFEDCBA')}
                      className="text-[10px] text-stone-400 hover:text-stone-200 underline"
                    >
                      Set Atbash Reversed Key
                    </button>
                  </div>
                </div>
              )}

              {algorithm === 'vigenere' && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-medium text-amber-300">
                      Secret Repeating Keyword:
                    </label>
                    <span className="text-[11px] text-stone-500">Polyalphabetic Stream</span>
                  </div>
                  <input
                    type="text"
                    value={vigenereKey}
                    onChange={(e) => setVigenereKey(e.target.value.toUpperCase().replace(/[^A-Z]/g, ''))}
                    placeholder="e.g. KAUTILYA"
                    className="w-full bg-stone-950 border border-stone-800 rounded-lg p-2.5 text-sm text-stone-100 font-mono-code uppercase tracking-wider focus:outline-none focus:border-amber-500"
                  />
                  <p className="text-[11px] text-stone-400">
                    Each letter in the keyword determines a distinct Caesar shift cycle for successive characters.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Output & Action Pipeline */}
        <div className="lg:col-span-6 space-y-4">
          <div className="bg-stone-900/80 border border-stone-800 rounded-xl p-5 space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold uppercase tracking-wider text-amber-400">
                {mode === 'encrypt' ? 'Encrypted Output' : 'Decrypted Output'}
              </label>
              <div className="flex items-center space-x-2">
                <button
                  onClick={handleSaveToHistory}
                  className="text-xs px-2.5 py-1 rounded bg-stone-800 hover:bg-stone-700 text-stone-200 flex items-center space-x-1 border border-stone-700 transition-colors"
                >
                  <History className="w-3 h-3 text-amber-400" />
                  <span>Log Result</span>
                </button>
                <button
                  onClick={handleCopy}
                  className="text-xs px-2.5 py-1 rounded bg-amber-600 hover:bg-amber-500 text-white flex items-center space-x-1 transition-colors"
                >
                  {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                  <span>{copied ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
            </div>

            <div className="w-full min-h-[110px] bg-stone-950 border border-stone-800 rounded-lg p-3 text-sm text-amber-100 font-mono-code leading-relaxed break-all select-all">
              {output || <span className="text-stone-600 italic">No output generated yet...</span>}
            </div>

            {/* Cryptanalysis Bridge Buttons (Sends output to other tabs!) */}
            <div className="p-3.5 bg-amber-950/20 border border-amber-800/40 rounded-lg space-y-2">
              <div className="flex items-center space-x-1.5 text-xs text-amber-300 font-medium">
                <Info className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span>Simulate Cryptanalytic Attacks On This Ciphertext:</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                <button
                  onClick={() => {
                    onSendToFrequency(output);
                    setActiveTab('frequency');
                  }}
                  className="px-3 py-2 rounded-md bg-stone-900 hover:bg-stone-800 text-xs text-amber-200 border border-stone-700 flex items-center justify-center space-x-1.5 transition-colors"
                >
                  <BarChart3 className="w-3.5 h-3.5 text-amber-400" />
                  <span>Test in Frequency Analyzer</span>
                </button>
                <button
                  onClick={() => {
                    onSendToBruteForce(output);
                    setActiveTab('bruteforce');
                  }}
                  className="px-3 py-2 rounded-md bg-stone-900 hover:bg-stone-800 text-xs text-amber-200 border border-stone-700 flex items-center justify-center space-x-1.5 transition-colors"
                >
                  <Unlock className="w-3.5 h-3.5 text-amber-400" />
                  <span>Test in Brute Force Cracker</span>
                </button>
              </div>
            </div>

            {/* Technical Metadata Pill */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-2 text-[11px] font-mono-code text-stone-400">
              <div className="p-2 bg-stone-950 rounded border border-stone-800">
                <span className="text-stone-500 block">Algorithm</span>
                <span className="capitalize text-stone-200">{algorithm}</span>
              </div>
              <div className="p-2 bg-stone-950 rounded border border-stone-800">
                <span className="text-stone-500 block">Current Key</span>
                <span className="text-amber-300 truncate block">{keyDescription}</span>
              </div>
              <div className="p-2 bg-stone-950 rounded border border-stone-800 col-span-2 sm:col-span-1">
                <span className="text-stone-500 block">Output Length</span>
                <span className="text-stone-200">{output.length} characters</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* History Log Section */}
      {history.length > 0 && (
        <div className="bg-stone-900/80 border border-stone-800 rounded-xl p-5 space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-stone-300 flex items-center space-x-2">
              <History className="w-3.5 h-3.5 text-amber-400" />
              <span>Experiment Session History ({history.length})</span>
            </h2>
            <button
              onClick={handleClearHistory}
              className="text-[11px] text-stone-500 hover:text-red-400 flex items-center space-x-1 transition-colors"
            >
              <Trash2 className="w-3 h-3" />
              <span>Clear History</span>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono-code border-collapse">
              <thead>
                <tr className="border-b border-stone-800 text-stone-500 text-[11px]">
                  <th className="py-2 px-3">Time</th>
                  <th className="py-2 px-3">Algorithm</th>
                  <th className="py-2 px-3">Mode</th>
                  <th className="py-2 px-3">Key Details</th>
                  <th className="py-2 px-3">Input</th>
                  <th className="py-2 px-3">Output</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-800/60 text-stone-300">
                {history.map((item, idx) => (
                  <tr key={idx} className="hover:bg-stone-950/40 transition-colors">
                    <td className="py-2 px-3 text-stone-500">{item.timestamp}</td>
                    <td className="py-2 px-3 uppercase text-amber-300">{item.algorithm}</td>
                    <td className="py-2 px-3 capitalize">{item.mode}</td>
                    <td className="py-2 px-3 text-stone-400 truncate max-w-[140px]">{item.keyDetails}</td>
                    <td className="py-2 px-3 truncate max-w-[180px]">{item.input}</td>
                    <td className="py-2 px-3 truncate max-w-[200px] text-amber-200">{item.output}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
