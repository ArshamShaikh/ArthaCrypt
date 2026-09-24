import React, { useState } from 'react';
import { 
  BookOpen, 
  ShieldCheck, 
  Key, 
  ArrowRight, 
  Sparkles, 
  AlertOctagon, 
  Scroll,
  Layers,
  HelpCircle
} from 'lucide-react';

export const LearningCenter: React.FC = () => {
  const [activeSection, setActiveSection] = useState<
    'iks-context' | 'what-is-crypto' | 'why-classical-fails' | 'why-aes-secure' | 'symmetric-vs-asymmetric'
  >('iks-context');

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-stone-900/80 border border-stone-800 rounded-xl p-5 shadow-sm">
        <div className="flex items-center space-x-2">
          <span className="p-1.5 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20">
            <BookOpen className="w-5 h-5" />
          </span>
          <div>
            <h1 className="font-iks text-xl font-bold text-stone-100">
              Cryptography Learning Center
            </h1>
            <p className="text-xs text-stone-400">
              Key concepts bridging historical secret communications with modern computational cryptography.
            </p>
          </div>
        </div>

        {/* Section Navigation Tabs */}
        <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-stone-800/80 text-xs">
          {[
            { id: 'iks-context', label: '1. Historical Foundations', icon: <Scroll className="w-3.5 h-3.5" /> },
            { id: 'what-is-crypto', label: '2. Cryptography Basics', icon: <Key className="w-3.5 h-3.5" /> },
            { id: 'why-classical-fails', label: '3. Why Classical Ciphers Fail', icon: <AlertOctagon className="w-3.5 h-3.5" /> },
            { id: 'why-aes-secure', label: '4. Why AES is Secure', icon: <Layers className="w-3.5 h-3.5" /> },
            { id: 'symmetric-vs-asymmetric', label: '5. Symmetric vs Asymmetric', icon: <ShieldCheck className="w-3.5 h-3.5" /> },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveSection(tab.id as any)}
              className={`px-3 py-2 rounded-lg font-medium flex items-center space-x-1.5 transition-all border ${
                activeSection === tab.id
                  ? 'bg-amber-500/15 border-amber-500/50 text-amber-200 shadow-sm'
                  : 'bg-stone-950/60 border-stone-800 text-stone-400 hover:text-stone-200'
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Content Panels */}
      <div className="bg-stone-900/80 border border-stone-800 rounded-xl p-6 space-y-6">
        {/* 1. Arthaśāstra IKS Context */}
        {activeSection === 'iks-context' && (
          <div className="space-y-4">
            <div className="flex items-center space-x-2 text-amber-300">
              <Scroll className="w-5 h-5 text-amber-400" />
              <h2 className="font-iks text-lg font-bold">
                Historical Secret Communications (Gudhalekhya)
              </h2>
            </div>

            <p className="text-sm text-stone-300 leading-relaxed">
              Written by Chanakya (Kautilya), the <em>Arthaśāstra</em> is an ancient treatise on governance and intelligence networks. A key section details methods for secure transmission of royal edicts and confidential dispatches.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
              <div className="p-4 bg-stone-950 rounded-xl border border-stone-800 space-y-2">
                <span className="text-xs font-bold text-amber-300 block">Secret Writing (Gudhalekhya)</span>
                <p className="text-xs text-stone-400 leading-relaxed">
                  Coded letters and cipher dispatches sent to trusted agents. Only the designated recipient possessed the key to decode the instructions.
                </p>
              </div>

              <div className="p-4 bg-stone-950 rounded-xl border border-stone-800 space-y-2">
                <span className="text-xs font-bold text-amber-300 block">Seal Verification (Mudra)</span>
                <p className="text-xs text-stone-400 leading-relaxed">
                  Official dispatches were stamped with a tamper-evident clay or wax seal. Broken or altered seals signaled interception, similar to modern Message Authentication Codes (MACs).
                </p>
              </div>

              <div className="p-4 bg-stone-950 rounded-xl border border-stone-800 space-y-2">
                <span className="text-xs font-bold text-amber-300 block">Secret Cipher Arts (Mlecchita Vikalpa)</span>
                <p className="text-xs text-stone-400 leading-relaxed">
                  The art of secret communication codified among traditional disciplines, including pairing systems and alphabetic letter substitutions.
                </p>
              </div>
            </div>

            <div className="p-4 bg-amber-950/20 border border-amber-800/40 rounded-xl text-xs text-amber-200">
              <strong>Historical Context:</strong> Ancient Indian rule-based intelligence systems map directly to foundational algorithmic security concepts, demonstrating the historical evolution of secure communications.
            </div>
          </div>
        )}

        {/* 2. What is Cryptography */}
        {activeSection === 'what-is-crypto' && (
          <div className="space-y-4">
            <div className="flex items-center space-x-2 text-stone-100">
              <Key className="w-5 h-5 text-amber-400" />
              <h2 className="font-iks text-lg font-bold">The Cryptographic Triad: Principles & Objectives</h2>
            </div>

            <p className="text-sm text-stone-300 leading-relaxed">
              Cryptography is the science of protecting information by transforming it into an unreadable format for unauthorized third parties. Modern security rests on three primary pillars (the <strong>CIA Triad</strong>):
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-4 bg-stone-950 rounded-xl border border-stone-800 space-y-1.5">
                <h3 className="text-xs font-bold text-amber-300">Confidentiality</h3>
                <p className="text-xs text-stone-400">
                  Only the intended recipient can read the plaintext message. Achieved via encryption ciphers.
                </p>
              </div>
              <div className="p-4 bg-stone-950 rounded-xl border border-stone-800 space-y-1.5">
                <h3 className="text-xs font-bold text-emerald-400">Integrity</h3>
                <p className="text-xs text-stone-400">
                  The recipient can detect whether the message was modified in transit. Achieved via MACs and hashing.
                </p>
              </div>
              <div className="p-4 bg-stone-950 rounded-xl border border-stone-800 space-y-1.5">
                <h3 className="text-xs font-bold text-sky-400">Authenticity</h3>
                <p className="text-xs text-stone-400">
                  Proof that the sender is genuinely who they claim to be. Achieved via digital signatures and shared secrets.
                </p>
              </div>
            </div>

            {/* Visual Transformation Pipeline */}
            <div className="p-4 bg-stone-950 rounded-xl border border-stone-800 space-y-2">
              <span className="text-xs font-semibold text-stone-300 uppercase tracking-wider block">
                Symmetric Cipher Pipeline
              </span>
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-xs font-mono-code pt-2">
                <div className="p-2.5 bg-stone-900 border border-stone-800 rounded text-center w-full sm:w-auto">
                  <span className="text-stone-400 block text-[10px]">Plaintext (M)</span>
                  <span className="text-stone-100 font-bold">&quot;ATTACK AT DAWN&quot;</span>
                </div>
                <ArrowRight className="w-4 h-4 text-amber-400 hidden sm:block shrink-0" />
                <div className="p-2.5 bg-amber-950/40 border border-amber-800/60 rounded text-center w-full sm:w-auto">
                  <span className="text-amber-400 block text-[10px]">Encrypt with Key (K)</span>
                  <span className="text-amber-200">C = E_k(M)</span>
                </div>
                <ArrowRight className="w-4 h-4 text-amber-400 hidden sm:block shrink-0" />
                <div className="p-2.5 bg-stone-900 border border-stone-800 rounded text-center w-full sm:w-auto">
                  <span className="text-stone-400 block text-[10px]">Ciphertext (C)</span>
                  <span className="text-emerald-300 font-bold">X8f9A#...</span>
                </div>
                <ArrowRight className="w-4 h-4 text-amber-400 hidden sm:block shrink-0" />
                <div className="p-2.5 bg-stone-900 border border-stone-800 rounded text-center w-full sm:w-auto">
                  <span className="text-stone-400 block text-[10px]">Decrypt with Key (K)</span>
                  <span className="text-stone-100 font-bold">M = D_k(C)</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 3. Why Classical Ciphers Fail */}
        {activeSection === 'why-classical-fails' && (
          <div className="space-y-4">
            <div className="flex items-center space-x-2 text-red-400">
              <AlertOctagon className="w-5 h-5 text-red-400" />
              <h2 className="font-iks text-lg font-bold">
                Why Classical Ciphers Fail: The Statistical Flaw
              </h2>
            </div>

            <p className="text-sm text-stone-300 leading-relaxed">
              Every human language has a unique statistical &ldquo;fingerprint&rdquo;. Even when letters are replaced or shifted, classical ciphers suffer from fatal structural vulnerabilities:
            </p>

            <div className="space-y-3">
              <div className="p-4 bg-stone-950 rounded-xl border border-stone-800 space-y-1">
                <span className="text-xs font-bold text-amber-300 font-mono-code">1. Conservation of Frequencies</span>
                <p className="text-xs text-stone-400">
                  In a monoalphabetic cipher, if letter &apos;E&apos; appears 12% in English, its substitute cipher character will also appear exactly 12% of the time. Frequency analysis immediately unmasks the key without needing brute force.
                </p>
              </div>

              <div className="p-4 bg-stone-950 rounded-xl border border-stone-800 space-y-1">
                <span className="text-xs font-bold text-amber-300 font-mono-code">2. Zero Diffusion</span>
                <p className="text-xs text-stone-400">
                  In Caesar or Monoalphabetic ciphers, modifying one character of the input modifies only that exact character in the output. The remaining ciphertext is entirely identical.
                </p>
              </div>

              <div className="p-4 bg-stone-950 rounded-xl border border-stone-800 space-y-1">
                <span className="text-xs font-bold text-amber-300 font-mono-code">3. Trivial Keyspaces</span>
                <p className="text-xs text-stone-400">
                  Caesar cipher has only 25 valid keys. A human with pencil and paper can check all 25 shifts in 2 minutes; a computer does it in under 0.0001 seconds.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* 4. Why AES is Secure */}
        {activeSection === 'why-aes-secure' && (
          <div className="space-y-4">
            <div className="flex items-center space-x-2 text-emerald-400">
              <Layers className="w-5 h-5 text-emerald-400" />
              <h2 className="font-iks text-lg font-bold">
                Why Modern AES is Secure: Confusion, Diffusion & S-Boxes
              </h2>
            </div>

            <p className="text-sm text-stone-300 leading-relaxed">
              In 1949, mathematician Claude Shannon formalized the two essential criteria that make modern ciphers secure against cryptanalysis:
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-stone-950 rounded-xl border border-stone-800 space-y-2">
                <span className="text-xs font-bold text-emerald-400 font-mono-code">Confusion (S-Box Substitution)</span>
                <p className="text-xs text-stone-400 leading-relaxed">
                  Makes the relationship between the key and the ciphertext as complex and non-linear as possible. In AES, this is achieved through mathematical inversion in Galois Field $GF(2^8)$ inside the Substitution Box (S-Box).
                </p>
              </div>

              <div className="p-4 bg-stone-950 rounded-xl border border-stone-800 space-y-2">
                <span className="text-xs font-bold text-emerald-400 font-mono-code">Diffusion (Permutation & MixColumns)</span>
                <p className="text-xs text-stone-400 leading-relaxed">
                  Spreads the statistical influence of each plaintext bit over the entire ciphertext. In AES, the <em>ShiftRows</em> and <em>MixColumns</em> operations ensure that altering a single bit flips ~50% of the entire output block.
                </p>
              </div>
            </div>

            <div className="p-4 bg-emerald-950/20 border border-emerald-800/40 rounded-xl space-y-1.5 text-xs text-emerald-200">
              <span className="font-bold">Galois/Counter Mode (GCM) Advantage:</span>
              <p className="text-stone-300">
                Unlike simple ECB or CBC modes, AES-GCM provides <strong>Authenticated Encryption (AEAD)</strong>. It produces a 128-bit GHASH tag alongside the ciphertext. If an adversary tampers with even 1 bit in transit, decryption immediately aborts with an authentication failure!
              </p>
            </div>
          </div>
        )}

        {/* 5. Symmetric vs Asymmetric */}
        {activeSection === 'symmetric-vs-asymmetric' && (
          <div className="space-y-4">
            <div className="flex items-center space-x-2 text-sky-400">
              <ShieldCheck className="w-5 h-5 text-sky-400" />
              <h2 className="font-iks text-lg font-bold">Symmetric vs Asymmetric Cryptography</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
              <div className="p-4 bg-stone-950 rounded-xl border border-stone-800 space-y-2">
                <span className="text-xs font-bold text-amber-300 uppercase tracking-wider block">
                  Symmetric Encryption (Our Focus: Arthaśāstra / AES)
                </span>
                <ul className="text-xs text-stone-300 space-y-1.5 list-disc list-inside">
                  <li><strong>Single Shared Key:</strong> The same key encrypts and decrypts.</li>
                  <li><strong>Speed:</strong> Extremely fast (hardware-accelerated AES-NI processes gigabytes/sec).</li>
                  <li><strong>Primary Challenge:</strong> Key Distribution (how to exchange the key safely). In ancient times, addressed by trusted messengers.</li>
                </ul>
              </div>

              <div className="p-4 bg-stone-950 rounded-xl border border-stone-800 space-y-2">
                <span className="text-xs font-bold text-sky-300 uppercase tracking-wider block">
                  Asymmetric Encryption (RSA, ECC)
                </span>
                <ul className="text-xs text-stone-300 space-y-1.5 list-disc list-inside">
                  <li><strong>Key Pair:</strong> Public key for encryption, Private key for decryption.</li>
                  <li><strong>Speed:</strong> ~1000x slower computationally than symmetric AES.</li>
                  <li><strong>Modern Practice:</strong> Used in hybrid systems (TLS/SSL) to securely exchange an AES session key, after which AES handles the bulk data!</li>
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
