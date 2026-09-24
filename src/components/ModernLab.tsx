import React, { useState } from 'react';
import { 
  encryptAES, 
  decryptAES, 
  testAvalancheEffect, 
  AESEncryptionOutput,
  AESDecryptionOutput 
} from '../utils/modernCrypto';
import { 
  Cpu, 
  ShieldCheck, 
  Zap, 
  Copy, 
  Check, 
  AlertCircle, 
  UploadCloud, 
  Lock, 
  KeyRound,
  Layers
} from 'lucide-react';

export const ModernLab: React.FC = () => {
  const [keyLength, setKeyLength] = useState<128 | 256>(128);
  const [passphrase, setPassphrase] = useState<string>('KautilyaSecurity@2026');
  const [plaintext, setPlaintext] = useState<string>(
    'ARTHASHASTRA SOVEREIGN REPOSITORY: All border emissaries must confirm authentication seals before disclosing military coordinates.'
  );
  const [encryptionOutput, setEncryptionOutput] = useState<AESEncryptionOutput | null>(null);
  const [isEncrypting, setIsEncrypting] = useState<boolean>(false);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  // Decryption section state
  const [decryptPayload, setDecryptPayload] = useState<string>('');
  const [decryptPassphrase, setDecryptPassphrase] = useState<string>('KautilyaSecurity@2026');
  const [decryptionResult, setDecryptionResult] = useState<AESDecryptionOutput | null>(null);

  // Avalanche effect test state
  const [avalancheData, setAvalancheData] = useState<{
    originalHex: string;
    modifiedHex: string;
    flippedBitsCount: number;
    totalBits: number;
    flippedPercentage: number;
  } | null>(null);
  const [isRunningAvalanche, setIsRunningAvalanche] = useState<boolean>(false);

  const handleEncrypt = async () => {
    if (!plaintext.trim()) return;
    setIsEncrypting(true);
    try {
      const result = await encryptAES(plaintext, passphrase, keyLength);
      setEncryptionOutput(result);
      setDecryptPayload(result.ciphertextBase64);
    } catch (err) {
      console.error(err);
    } finally {
      setIsEncrypting(false);
    }
  };

  const handleDecrypt = async () => {
    if (!decryptPayload.trim()) return;
    try {
      const result = await decryptAES(decryptPayload, decryptPassphrase, keyLength);
      setDecryptionResult(result);
    } catch (err) {
      console.error(err);
    }
  };

  const handleRunAvalanche = async () => {
    if (!plaintext.trim()) return;
    setIsRunningAvalanche(true);
    try {
      const data = await testAvalancheEffect(plaintext, passphrase);
      setAvalancheData(data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsRunningAvalanche(false);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const content = event.target?.result as string;
        setPlaintext(content.slice(0, 5000)); // limit preview size for responsiveness
      };
      reader.readAsText(file);
    }
  };

  const handleCopy = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-stone-900/80 border border-stone-800 rounded-xl p-5 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <span className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                <Cpu className="w-5 h-5" />
              </span>
              <h1 className="font-iks text-xl font-bold text-stone-100">
                Modern AES Encryption Lab
              </h1>
            </div>
            <p className="text-sm text-stone-400 max-w-3xl">
              Encrypt your data using AES-GCM — the gold standard encryption used worldwide in banking and secure messaging. Type your text, set a password, and test encryption and decryption.
            </p>
          </div>

          {/* Key Size Selector */}
          <div className="flex items-center space-x-1 p-1 bg-stone-950 rounded-lg border border-stone-800 self-start md:self-auto">
            <button
              onClick={() => setKeyLength(128)}
              className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
                keyLength === 128
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-stone-400 hover:text-stone-200'
              }`}
            >
              AES-128
            </button>
            <button
              onClick={() => setKeyLength(256)}
              className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
                keyLength === 256
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-stone-400 hover:text-stone-200'
              }`}
            >
              AES-256
            </button>
          </div>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Encryption Workbench */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-stone-900/80 border border-stone-800 rounded-xl p-5 space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold uppercase tracking-wider text-stone-300 flex items-center space-x-2">
                <Lock className="w-3.5 h-3.5 text-emerald-400" />
                <span>Plaintext Data to Encrypt</span>
              </label>
              <label className="text-[11px] text-stone-400 hover:text-emerald-300 flex items-center space-x-1 cursor-pointer">
                <UploadCloud className="w-3.5 h-3.5" />
                <span>Load File</span>
                <input type="file" onChange={handleFileUpload} accept=".txt,.json,.csv" className="hidden" />
              </label>
            </div>

            <textarea
              rows={4}
              value={plaintext}
              onChange={(e) => setPlaintext(e.target.value)}
              placeholder="Enter plaintext message or payload to encrypt..."
              className="w-full bg-stone-950 border border-stone-800 rounded-lg p-3 text-sm text-stone-100 placeholder-stone-600 focus:outline-none focus:border-emerald-500 font-mono-code leading-relaxed resize-y"
            />

            {/* Passphrase Configuration */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-stone-300 flex items-center space-x-1.5">
                <KeyRound className="w-3.5 h-3.5 text-amber-400" />
                <span>Secret Passphrase (derives {keyLength}-bit key via PBKDF2 with 100,000 SHA-256 rounds):</span>
              </label>
              <input
                type="text"
                value={passphrase}
                onChange={(e) => setPassphrase(e.target.value)}
                className="w-full bg-stone-950 border border-stone-800 rounded-lg p-2.5 text-xs text-amber-300 font-mono-code focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={handleEncrypt}
                disabled={isEncrypting || !plaintext.trim()}
                className="px-5 py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-medium text-xs flex items-center space-x-2 transition-all shadow-md shadow-emerald-950/40 cursor-pointer"
              >
                <Zap className="w-4 h-4" />
                <span>{isEncrypting ? 'Encrypting via WebCrypto...' : 'Execute AES-GCM Encryption'}</span>
              </button>
            </div>

            {/* Encryption Output Breakdown */}
            {encryptionOutput && (
              <div className="pt-4 border-t border-stone-800/80 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wider flex items-center space-x-1.5">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    <span>Authenticated AES-GCM Payload</span>
                  </span>
                  <span className="text-[11px] font-mono-code text-stone-400 bg-stone-950 px-2 py-0.5 rounded border border-stone-800">
                    Time: {encryptionOutput.executionTimeMs} ms
                  </span>
                </div>

                {/* Base64 Combined Payload */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-[11px] text-stone-400">
                    <span>Combined Export Payload (Base64 [Salt + IV + Ciphertext + Tag]):</span>
                    <button
                      onClick={() => handleCopy(encryptionOutput.ciphertextBase64, 'base64')}
                      className="text-emerald-400 hover:text-emerald-300 flex items-center space-x-1"
                    >
                      {copiedField === 'base64' ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                      <span>{copiedField === 'base64' ? 'Copied' : 'Copy Payload'}</span>
                    </button>
                  </div>
                  <div className="p-2.5 bg-stone-950 rounded-lg border border-stone-800 font-mono-code text-xs text-emerald-200 break-all select-all max-h-24 overflow-y-auto">
                    {encryptionOutput.ciphertextBase64}
                  </div>
                </div>

                {/* Sub-field cryptographic components */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] font-mono-code pt-1">
                  <div className="p-2 bg-stone-950 rounded border border-stone-800">
                    <span className="text-stone-500 block">Random IV / Nonce (96-bit Hex)</span>
                    <span className="text-stone-300 truncate block">{encryptionOutput.ivHex}</span>
                  </div>
                  <div className="p-2 bg-stone-950 rounded border border-stone-800">
                    <span className="text-stone-500 block">Authentication Tag (128-bit MAC Hex)</span>
                    <span className="text-amber-400 truncate block">{encryptionOutput.tagHex}</span>
                  </div>
                  <div className="p-2 bg-stone-950 rounded border border-stone-800 sm:col-span-2">
                    <span className="text-stone-500 block">Ciphertext Segment (Raw Hex)</span>
                    <span className="text-stone-300 break-all block">{encryptionOutput.ciphertextHex}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Decryption & Avalanche Effect */}
        <div className="lg:col-span-5 space-y-4">
          {/* Decryption Verification Card */}
          <div className="bg-stone-900/80 border border-stone-800 rounded-xl p-5 space-y-3">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-stone-300 flex items-center space-x-2">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Decryption & MAC Verification</span>
            </h2>

            <div className="space-y-1">
              <label className="text-[11px] text-stone-400">Encrypted Payload (Base64):</label>
              <textarea
                rows={2}
                value={decryptPayload}
                onChange={(e) => setDecryptPayload(e.target.value)}
                placeholder="Paste combined Base64 payload here..."
                className="w-full bg-stone-950 border border-stone-800 rounded-lg p-2 text-xs text-stone-200 font-mono-code focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[11px] text-stone-400">Passphrase:</label>
              <input
                type="text"
                value={decryptPassphrase}
                onChange={(e) => setDecryptPassphrase(e.target.value)}
                className="w-full bg-stone-950 border border-stone-800 rounded-lg p-2 text-xs text-amber-300 font-mono-code focus:outline-none focus:border-emerald-500"
              />
            </div>

            <button
              onClick={handleDecrypt}
              disabled={!decryptPayload.trim()}
              className="w-full py-2 rounded-lg bg-stone-800 hover:bg-stone-700 disabled:opacity-50 text-stone-200 text-xs font-medium border border-stone-700 transition-colors cursor-pointer"
            >
              Verify Tag & Decrypt Payload
            </button>

            {decryptionResult && (
              <div className={`p-3 rounded-lg border text-xs font-mono-code ${
                decryptionResult.success 
                  ? 'bg-emerald-950/30 border-emerald-800/60 text-emerald-200' 
                  : 'bg-red-950/30 border-red-800/60 text-red-300'
              }`}>
                {decryptionResult.success ? (
                  <div className="space-y-1">
                    <div className="flex items-center space-x-1.5 font-bold text-emerald-400">
                      <Check className="w-3.5 h-3.5" />
                      <span>Integrity Verified (Tag Matches)</span>
                    </div>
                    <div className="p-2 bg-stone-950 rounded border border-emerald-900/50 break-words text-stone-100">
                      {decryptionResult.plaintext}
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center space-x-1.5">
                    <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                    <span>{decryptionResult.error}</span>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Avalanche Effect Simulator Card */}
          <div className="bg-stone-900/80 border border-stone-800 rounded-xl p-5 space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-xs font-semibold uppercase tracking-wider text-amber-300 flex items-center space-x-2">
                <Layers className="w-3.5 h-3.5 text-amber-400" />
                <span>Avalanche Effect (Diffusion)</span>
              </h2>
              <button
                onClick={handleRunAvalanche}
                disabled={isRunningAvalanche || !plaintext.trim()}
                className="text-[11px] px-2.5 py-1 rounded bg-amber-600 hover:bg-amber-500 text-white font-medium transition-colors cursor-pointer"
              >
                {isRunningAvalanche ? 'Testing...' : 'Test 1-Bit Flip'}
              </button>
            </div>

            <p className="text-[11px] text-stone-400">
              In classical ciphers (Caesar/Monoalphabetic), changing 1 letter changes only 1 letter in the output. In AES, changing just <strong>1 single bit</strong> flips roughly <strong>50%</strong> of all ciphertext bits due to Shannon&apos;s Substitution-Permutation diffusion.
            </p>

            {avalancheData && (
              <div className="space-y-2 pt-2 text-xs font-mono-code">
                <div className="p-3 bg-stone-950 rounded-lg border border-stone-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-stone-400">Bit-flip Diffusion Rate:</span>
                    <span className="font-bold text-amber-300 text-sm">
                      {avalancheData.flippedPercentage}%
                    </span>
                  </div>
                  {/* Progress bar */}
                  <div className="w-full bg-stone-800 rounded-full h-2 overflow-hidden">
                    <div 
                      className="bg-gradient-to-r from-amber-500 to-emerald-500 h-2 transition-all duration-500"
                      style={{ width: `${Math.min(100, avalancheData.flippedPercentage * 2)}%` }}
                    />
                  </div>
                  <div className="text-[10px] text-stone-400 flex justify-between">
                    <span>{avalancheData.flippedBitsCount} bits changed</span>
                    <span>Out of {avalancheData.totalBits} total block bits</span>
                  </div>
                </div>

                <div className="p-2 bg-stone-950 rounded border border-stone-800 text-[10px] text-stone-400 space-y-1">
                  <div>
                    <span className="text-stone-500">Original Prefix: </span>
                    <span className="text-stone-200">{avalancheData.originalHex}...</span>
                  </div>
                  <div>
                    <span className="text-stone-500">1-Bit Altered: </span>
                    <span className="text-amber-300">{avalancheData.modifiedHex}...</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
