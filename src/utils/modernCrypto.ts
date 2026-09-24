// Modern Cryptography (AES-GCM) Utilities using Web Crypto API

export interface AESEncryptionOutput {
  ciphertextHex: string;
  ciphertextBase64: string;
  ivHex: string;
  saltHex: string;
  tagHex: string;
  executionTimeMs: number;
}

export interface AESDecryptionOutput {
  plaintext: string;
  executionTimeMs: number;
  success: boolean;
  error?: string;
}

// Convert bytes to hex string
export function bytesToHex(bytes: Uint8Array): string {
  return Array.from(bytes)
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

// Convert hex string to Uint8Array
export function hexToBytes(hex: string): Uint8Array {
  const cleanHex = hex.replace(/[^0-9a-fA-F]/g, '');
  const bytes = new Uint8Array(cleanHex.length / 2);
  for (let i = 0; i < cleanHex.length; i += 2) {
    bytes[i / 2] = parseInt(cleanHex.substring(i, i + 2), 16);
  }
  return bytes;
}

// Convert bytes to Base64
export function bytesToBase64(bytes: Uint8Array): string {
  let binary = '';
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return window.btoa(binary);
}

// Derive AES-GCM key from passphrase using PBKDF2
async function deriveKey(passphrase: string, salt: Uint8Array, keyLength: 128 | 256): Promise<CryptoKey> {
  const enc = new TextEncoder();
  const keyMaterial = await window.crypto.subtle.importKey(
    'raw',
    enc.encode(passphrase),
    { name: 'PBKDF2' },
    false,
    ['deriveKey']
  );

  return window.crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt,
      iterations: 100000,
      hash: 'SHA-256',
    },
    keyMaterial,
    { name: 'AES-GCM', length: keyLength },
    false,
    ['encrypt', 'decrypt']
  );
}

// Encrypt plaintext using AES-GCM
export async function encryptAES(
  plaintext: string,
  passphrase: string,
  keyLength: 128 | 256 = 128
): Promise<AESEncryptionOutput> {
  const startTime = performance.now();
  const enc = new TextEncoder();
  const encodedPlaintext = enc.encode(plaintext);

  // 12 bytes IV recommended for AES-GCM
  const iv = window.crypto.getRandomValues(new Uint8Array(12));
  // 16 bytes salt for PBKDF2
  const salt = window.crypto.getRandomValues(new Uint8Array(16));

  const cryptoKey = await deriveKey(passphrase, salt, keyLength);

  const encryptedBuffer = await window.crypto.subtle.encrypt(
    {
      name: 'AES-GCM',
      iv,
      tagLength: 128,
    },
    cryptoKey,
    encodedPlaintext
  );

  const encryptedBytes = new Uint8Array(encryptedBuffer);
  // In Web Crypto AES-GCM, the 16-byte authentication tag is appended to the ciphertext
  const tagBytes = encryptedBytes.slice(-16);
  const cipherBytesOnly = encryptedBytes.slice(0, -16);

  // Combined payload for storage/transmission: [16 bytes salt] + [12 bytes IV] + [ciphertext + tag]
  const fullPayload = new Uint8Array(salt.length + iv.length + encryptedBytes.length);
  fullPayload.set(salt, 0);
  fullPayload.set(iv, salt.length);
  fullPayload.set(encryptedBytes, salt.length + iv.length);

  const endTime = performance.now();

  return {
    ciphertextHex: bytesToHex(cipherBytesOnly),
    ciphertextBase64: bytesToBase64(fullPayload),
    ivHex: bytesToHex(iv),
    saltHex: bytesToHex(salt),
    tagHex: bytesToHex(tagBytes),
    executionTimeMs: Math.max(0.01, Number((endTime - startTime).toFixed(3))),
  };
}

// Decrypt Base64 payload using AES-GCM
export async function decryptAES(
  base64Payload: string,
  passphrase: string,
  keyLength: 128 | 256 = 128
): Promise<AESDecryptionOutput> {
  const startTime = performance.now();
  try {
    const binary = window.atob(base64Payload.trim());
    const fullPayload = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
      fullPayload[i] = binary.charCodeAt(i);
    }

    if (fullPayload.length < 16 + 12 + 16) {
      return {
        plaintext: '',
        executionTimeMs: 0,
        success: false,
        error: 'Payload is too short to contain valid Salt, IV, and Tag.',
      };
    }

    const salt = fullPayload.slice(0, 16);
    const iv = fullPayload.slice(16, 28);
    const encryptedBytes = fullPayload.slice(28);

    const cryptoKey = await deriveKey(passphrase, salt, keyLength);

    const decryptedBuffer = await window.crypto.subtle.decrypt(
      {
        name: 'AES-GCM',
        iv,
        tagLength: 128,
      },
      cryptoKey,
      encryptedBytes
    );

    const dec = new TextDecoder();
    const plaintext = dec.decode(decryptedBuffer);
    const endTime = performance.now();

    return {
      plaintext,
      executionTimeMs: Math.max(0.01, Number((endTime - startTime).toFixed(3))),
      success: true,
    };
  } catch (err: unknown) {
    const endTime = performance.now();
    return {
      plaintext: '',
      executionTimeMs: Math.max(0.01, Number((endTime - startTime).toFixed(3))),
      success: false,
      error: 'Decryption failed: Authentication tag mismatch or invalid passphrase.',
    };
  }
}

// Calculate Avalanche Effect: Flip 1 single character/bit in plaintext and measure flipped bits in ciphertext
export async function testAvalancheEffect(originalText: string, passphrase: string): Promise<{
  originalHex: string;
  modifiedHex: string;
  flippedBitsCount: number;
  totalBits: number;
  flippedPercentage: number;
}> {
  const enc = new TextEncoder();
  const textBytes = enc.encode(originalText);
  if (textBytes.length === 0) {
    return { originalHex: '', modifiedHex: '', flippedBitsCount: 0, totalBits: 0, flippedPercentage: 0 };
  }

  // Create a modified text where 1 single bit is flipped in the first byte
  const modifiedBytes = new Uint8Array(textBytes);
  modifiedBytes[0] ^= 1; // flip lowest bit
  const dec = new TextDecoder();
  const modifiedText = dec.decode(modifiedBytes);

  // Use a fixed IV and Salt so changes are solely attributable to the plaintext bit flip
  const fixedIv = new Uint8Array(12).fill(7);
  const fixedSalt = new Uint8Array(16).fill(11);
  const cryptoKey = await deriveKey(passphrase, fixedSalt, 128);

  const cipher1Buffer = await window.crypto.subtle.encrypt(
    { name: 'AES-GCM', iv: fixedIv, tagLength: 128 },
    cryptoKey,
    enc.encode(originalText)
  );
  const cipher2Buffer = await window.crypto.subtle.encrypt(
    { name: 'AES-GCM', iv: fixedIv, tagLength: 128 },
    cryptoKey,
    enc.encode(modifiedText)
  );

  const c1 = new Uint8Array(cipher1Buffer);
  const c2 = new Uint8Array(cipher2Buffer);

  const minLen = Math.min(c1.length, c2.length);
  let diffBits = 0;
  for (let i = 0; i < minLen; i++) {
    let xorVal = c1[i] ^ c2[i];
    while (xorVal > 0) {
      if (xorVal & 1) diffBits++;
      xorVal >>= 1;
    }
  }

  const totalBits = minLen * 8;
  const flippedPercentage = totalBits > 0 ? (diffBits / totalBits) * 100 : 0;

  return {
    originalHex: bytesToHex(c1.slice(0, 16)),
    modifiedHex: bytesToHex(c2.slice(0, 16)),
    flippedBitsCount: diffBits,
    totalBits,
    flippedPercentage: Number(flippedPercentage.toFixed(2)),
  };
}
