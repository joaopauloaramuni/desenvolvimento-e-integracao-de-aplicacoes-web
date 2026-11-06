// md5.js
// MD5 em JavaScript puro (RFC 1321), sem dependências.
//
// Por que precisamos dele? O crosspoint-sync usa o mesmo login do KOReader:
// o cabeçalho x-auth-key é o MD5 (hex, minúsculo) da senha. O Web Crypto do
// navegador (crypto.subtle) não oferece MD5, então ele é calculado aqui.
//
// ⚠️ MD5 NÃO é seguro para guardar senhas. Ele só existe aqui porque é o
// formato que o protocolo KOSync exige. O servidor guarda um PBKDF2 desse valor.

const S = [
  7, 12, 17, 22, 7, 12, 17, 22, 7, 12, 17, 22, 7, 12, 17, 22,
  5, 9, 14, 20, 5, 9, 14, 20, 5, 9, 14, 20, 5, 9, 14, 20,
  4, 11, 16, 23, 4, 11, 16, 23, 4, 11, 16, 23, 4, 11, 16, 23,
  6, 10, 15, 21, 6, 10, 15, 21, 6, 10, 15, 21, 6, 10, 15, 21,
];

// K[i] = floor(|sen(i + 1)| * 2^32)
const K = Array.from({ length: 64 }, (_, i) => Math.floor(Math.abs(Math.sin(i + 1)) * 2 ** 32) >>> 0);

const rotl = (x, c) => (x << c) | (x >>> (32 - c));

export default function md5(texto) {
  const bytes = new TextEncoder().encode(texto);

  // Preenchimento: 0x80, zeros, e o tamanho em bits (64 bits, little-endian)
  const tamanho = (((bytes.length + 8) >>> 6) + 1) * 64;
  const msg = new Uint8Array(tamanho);
  msg.set(bytes);
  msg[bytes.length] = 0x80;
  const bits = bytes.length * 8;
  const view = new DataView(msg.buffer);
  view.setUint32(tamanho - 8, bits >>> 0, true);
  view.setUint32(tamanho - 4, Math.floor(bits / 2 ** 32), true);

  let a0 = 0x67452301;
  let b0 = 0xefcdab89;
  let c0 = 0x98badcfe;
  let d0 = 0x10325476;

  for (let bloco = 0; bloco < tamanho; bloco += 64) {
    const M = Array.from({ length: 16 }, (_, i) => view.getUint32(bloco + i * 4, true));
    let [A, B, C, D] = [a0, b0, c0, d0];

    for (let i = 0; i < 64; i++) {
      let F;
      let g;
      if (i < 16) {
        F = (B & C) | (~B & D);
        g = i;
      } else if (i < 32) {
        F = (D & B) | (~D & C);
        g = (5 * i + 1) % 16;
      } else if (i < 48) {
        F = B ^ C ^ D;
        g = (3 * i + 5) % 16;
      } else {
        F = C ^ (B | ~D);
        g = (7 * i) % 16;
      }
      F = (F + A + K[i] + M[g]) | 0;
      A = D;
      D = C;
      C = B;
      B = (B + rotl(F, S[i])) | 0;
    }

    a0 = (a0 + A) | 0;
    b0 = (b0 + B) | 0;
    c0 = (c0 + C) | 0;
    d0 = (d0 + D) | 0;
  }

  // Resultado em hex, little-endian
  const out = new DataView(new ArrayBuffer(16));
  [a0, b0, c0, d0].forEach((v, i) => out.setUint32(i * 4, v >>> 0, true));
  return Array.from(new Uint8Array(out.buffer), (b) => b.toString(16).padStart(2, "0")).join("");
}
