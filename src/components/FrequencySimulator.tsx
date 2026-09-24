import React, { useState, useMemo } from 'react';
import { calculateFrequencies, applySubstitution, ENGLISH_FREQ_RANK } from '../utils/frequencyAnalysis';
import { encryptMonoalphabetic, encryptCaesar, ALPHABET_UPPER } from '../utils/classicalCrypto';
import { 
  BarChart3, 
  Wand2, 
  RotateCcw, 
  Sparkles, 
  ShieldAlert, 
  CheckCircle2,
  HelpCircle
} from 'lucide-react';

interface FrequencySimulatorProps {
  ciphertext: string;
  setCiphertext: (text: string) => void;
}

const SAMPLE_CIPHERTEXT = encryptMonoalphabetic(
  "THE SECRET ENVOY OF CHANAKYA DELIVERED THE DIPLOMATIC ROYAL EDICT TO THE COMMANDER OF THE ELEPHANT CORPS BEFORE THE BORDER WAS CLOSED AT DUSK",
  "QWERTYUIOPASDFGHJKLZXCVBNM"
);

export const FrequencySimulator: React.FC<FrequencySimulatorProps> = ({
  ciphertext,
  setCiphertext,
}) => {
  const [activeText, setActiveText] = useState<string>(ciphertext || SAMPLE_CIPHERTEXT);
  const [userMapping, setUserMapping] = useState<Record<string, string>>({});
  const [selectedCipherChar, setSelectedCipherChar] = useState<string | null>(null);

  // Sync if prop changed externally
  React.useEffect(() => {
    if (ciphertext) {
      setActiveText(ciphertext);
    }
  }, [ciphertext]);

  // Compute frequencies
  const { letters, totalLetters, chiSquare } = useMemo(() => {
    return calculateFrequencies(activeText);
  }, [activeText]);

  // Sorted by observed frequency descending
  const sortedObserved = useMemo(() => {
    return [...letters].sort((a, b) => b.count - a.count);
  }, [letters]);

  // Decoded text with user guesses applied
  const decodedText = useMemo(() => {
    return applySubstitution(activeText, userMapping);
  }, [activeText, userMapping]);

  // Auto-fill top guesses based on frequency order
  const handleAutoSuggestMapping = () => {
    const newMap: Record<string, string> = {};
    const activeSorted = sortedObserved.filter(item => item.count > 0);
    activeSorted.forEach((item, idx) => {
      if (idx < ENGLISH_FREQ_RANK.length) {
        newMap[item.letter] = ENGLISH_FREQ_RANK[idx];
      }
    });
    setUserMapping(newMap);
  };

  const handleSetLetterGuess = (cipherChar: string, plainChar: string) => {
    if (!plainChar) {
      const updated = { ...userMapping };
      delete updated[cipherChar];
      setUserMapping(updated);
    } else {
      setUserMapping({
        ...userMapping,
        [cipherChar]: plainChar.toUpperCase(),
      });
    }
  };

  const handleResetMapping = () => {
    setUserMapping({});
  };

  const mappedCount = Object.keys(userMapping).length;

  return (
    <div className="space-y-6">
      {/* Header Context */}
      <div className="bg-stone-900/80 border border-stone-800 rounded-xl p-5 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <span className="p-1.5 rounded-lg bg-sky-500/10 text-sky-400 border border-sky-500/20">
                <BarChart3 className="w-5 h-5" />
              </span>
              <h1 className="font-iks text-xl font-bold text-stone-100">
                Frequency Analysis Lab
              </h1>
            </div>
            <p className="text-sm text-stone-400 max-w-3xl">
              Break substitution ciphers by counting letter occurrences. In English, letters like <strong>E</strong>, <strong>T</strong>, and <strong>A</strong> appear most often. By matching frequent cipher letters to standard frequencies, secret messages can be solved without the key.
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => {
                const sample = encryptMonoalphabetic(
                  "KAUTILYA ADVISES THAT THE SECURITY OF THE TREASURY DEPENDS ON VIGILANCE OF THE INTELLIGENCE GUARDS",
                  "QWERTYUIOPASDFGHJKLZXCVBNM"
                );
                setActiveText(sample);
                setCiphertext(sample);
                setUserMapping({});
              }}
              className="text-xs px-3 py-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-200 border border-stone-700 transition-colors"
            >
              Load Sample Dispatch
            </button>
            <button
              onClick={() => {
                const sample = encryptCaesar(
                  "THE ATTACK WILL COMMENCE WHEN THE MORNING SUN REACHES THE TOP OF THE EASTERN FORTRESS TOWER",
                  4
                );
                setActiveText(sample);
                setCiphertext(sample);
                setUserMapping({});
              }}
              className="text-xs px-3 py-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-200 border border-stone-700 transition-colors"
            >
              Load Caesar Sample
            </button>
          </div>
        </div>
      </div>

      {/* Ciphertext Input & Decryption Live Workbench */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Side: Intercepted Text & Frequency Comparison Chart */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-stone-900/80 border border-stone-800 rounded-xl p-5 space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold uppercase tracking-wider text-stone-300 flex items-center space-x-2">
                <ShieldAlert className="w-3.5 h-3.5 text-amber-400" />
                <span>Intercepted Ciphertext to Analyze</span>
              </label>
              <div className="text-[11px] font-mono-code text-stone-400">
                Letters: <span className="text-amber-300 font-bold">{totalLetters}</span> • Chi-Sq: <span className="text-sky-300 font-bold">{chiSquare}</span>
              </div>
            </div>

            <textarea
              rows={4}
              value={activeText}
              onChange={(e) => {
                setActiveText(e.target.value);
                setCiphertext(e.target.value);
              }}
              placeholder="Paste encrypted text here..."
              className="w-full bg-stone-950 border border-stone-800 rounded-lg p-3 text-sm text-stone-100 font-mono-code focus:outline-none focus:border-sky-500 uppercase leading-relaxed resize-y"
            />

            {/* Frequency Chart (Top 13 letters vs English) */}
            <div className="pt-3 border-t border-stone-800 space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-stone-300">Letter Frequency Distribution Comparison</span>
                <div className="flex items-center space-x-3 text-[11px]">
                  <span className="flex items-center space-x-1 text-sky-400">
                    <span className="w-2.5 h-2.5 bg-sky-500 rounded-sm inline-block" />
                    <span>Observed in Cipher</span>
                  </span>
                  <span className="flex items-center space-x-1 text-stone-400">
                    <span className="w-2.5 h-2.5 bg-stone-700 rounded-sm inline-block" />
                    <span>Standard English</span>
                  </span>
                </div>
              </div>

              {/* Bar Chart Bars */}
              <div className="space-y-1.5 max-h-64 overflow-y-auto pr-2 font-mono-code">
                {sortedObserved.slice(0, 10).map((item) => (
                  <div key={item.letter} className="text-xs">
                    <div className="flex justify-between text-[11px] mb-0.5 text-stone-400">
                      <span className="font-bold text-amber-300">
                        Cipher letter &apos;{item.letter}&apos; ({item.count} hits / {item.frequency}%)
                      </span>
                      <span className="text-stone-500">
                        Expected English: {item.expectedEnglishFreq}%
                      </span>
                    </div>
                    {/* Double Bar */}
                    <div className="grid grid-cols-2 gap-1.5">
                      <div className="w-full bg-stone-950 rounded h-3 overflow-hidden border border-stone-800">
                        <div
                          className="bg-sky-500 h-3 rounded transition-all duration-300"
                          style={{ width: `${Math.min(100, item.frequency * 6)}%` }}
                        />
                      </div>
                      <div className="w-full bg-stone-950 rounded h-3 overflow-hidden border border-stone-800">
                        <div
                          className="bg-stone-700 h-3 rounded transition-all duration-300"
                          style={{ width: `${Math.min(100, item.expectedEnglishFreq * 6)}%` }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Interactive Decryption Workbench */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-stone-900/80 border border-stone-800 rounded-xl p-5 space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold uppercase tracking-wider text-emerald-400 flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4" />
                <span>Live Decryption Workbench ({mappedCount}/26 Letters Mapped)</span>
              </label>
              <div className="flex items-center space-x-1.5">
                <button
                  onClick={handleAutoSuggestMapping}
                  className="text-[11px] px-2.5 py-1 rounded bg-sky-900/50 hover:bg-sky-800 text-sky-200 border border-sky-700 flex items-center space-x-1 transition-colors cursor-pointer"
                  title="Aligns observed frequency rank directly with English ETAOIN"
                >
                  <Wand2 className="w-3 h-3" />
                  <span>Auto-Align Frequencies</span>
                </button>
                <button
                  onClick={handleResetMapping}
                  className="text-[11px] p-1 rounded bg-stone-800 hover:bg-stone-700 text-stone-400 transition-colors"
                  title="Reset Guesses"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Interactive Letter Guess Buttons */}
            <div className="space-y-2">
              <span className="text-[11px] text-stone-400 block">
                Assign Plaintext Letter Guesses to Cipher Characters:
              </span>
              <div className="flex flex-wrap gap-1.5 max-h-36 overflow-y-auto p-2 bg-stone-950 rounded-lg border border-stone-800">
                {sortedObserved.filter(item => item.count > 0).map((item) => {
                  const hasMapping = !!userMapping[item.letter];
                  return (
                    <div
                      key={item.letter}
                      className={`flex items-center px-2 py-1 rounded border text-xs font-mono-code transition-colors ${
                        hasMapping
                          ? 'bg-emerald-950/50 border-emerald-700/60 text-emerald-200'
                          : 'bg-stone-900 border-stone-800 text-stone-300'
                      }`}
                    >
                      <span className="font-bold text-amber-300 mr-1">{item.letter}</span>
                      <span className="text-stone-500 mr-1">→</span>
                      <input
                        type="text"
                        maxLength={1}
                        value={userMapping[item.letter] || ''}
                        onChange={(e) => handleSetLetterGuess(item.letter, e.target.value)}
                        className="w-5 h-5 text-center bg-stone-950 border border-stone-700 rounded text-xs text-white uppercase focus:outline-none focus:border-emerald-500 font-bold"
                        placeholder="?"
                      />
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Real-time Decoded Output Preview */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-stone-300">Live Plaintext Reconstruction:</span>
                <span className="text-[11px] text-emerald-400 font-mono-code">
                  {mappedCount > 0 ? 'Watching cipher resolve...' : 'Awaiting letter mappings'}
                </span>
              </div>
              <div className="w-full min-h-[140px] max-h-56 overflow-y-auto bg-stone-950 border border-stone-800 rounded-lg p-3 text-sm font-mono-code leading-relaxed">
                {decodedText.split('').map((char, i) => {
                  const isUpper = ALPHABET_UPPER.includes(char.toUpperCase());
                  const isMapped = isUpper && !!userMapping[char.toUpperCase()];
                  return (
                    <span
                      key={i}
                      className={
                        isMapped
                          ? 'text-emerald-400 font-bold bg-emerald-950/40 px-0.5 rounded'
                          : isUpper
                          ? 'text-stone-600'
                          : 'text-stone-400'
                      }
                    >
                      {char}
                    </span>
                  );
                })}
              </div>
            </div>

            {/* Cryptanalysis Takeaway Note */}
            <div className="p-3 bg-stone-950/70 rounded-lg border border-stone-800 text-[11px] text-stone-400 space-y-1">
              <div className="flex items-center space-x-1.5 text-amber-300 font-medium">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Examiner Note on IKS Significance:</span>
              </div>
              <p>
                In the <em>Arthaśāstra</em> (Book 1, Ch. 12), Kautilya mandated rotating covert messengers and altering codebooks frequently because prolonged static substitution inevitably leaks linguistic patterns to foreign spies (<em>Bheda</em>).
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
