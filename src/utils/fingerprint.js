export const ZWS = "\u200B";
export const ZWNJ = "\u200C";

export const FINGERPRINT_BITS = 16;

export function hexToBits(hex, length) {

  const bits = [];

  for (const ch of hex) {

    const value = parseInt(ch, 16);

    for (let i = 3; i >= 0; i--) {

      bits.push((value >> i) & 1);

      if (bits.length >= length)
        return bits;

    }

  }

  return bits;

}

export function bitsToHex(bits) {

  let hex = "";

  for (let i = 0; i < bits.length; i += 4) {

    hex += parseInt(bits.slice(i, i + 4).join(""), 2).toString(16);

  }

  return hex;

}