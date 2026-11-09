// Esquemas táticos. Cada vaga tem a posição e as coordenadas no campo em %:
// x = 0 (lado esquerdo) a 100 (lado direito); y = 0 (gol adversário) a 100 (nosso gol).

const GOL = { pos: "GOL", x: 50, y: 89 };
const LINHA_4 = [
  { pos: "LE", x: 14, y: 68 },
  { pos: "ZAG", x: 37, y: 73 },
  { pos: "ZAG", x: 63, y: 73 },
  { pos: "LD", x: 86, y: 68 },
];
const LINHA_3 = [
  { pos: "ZAG", x: 25, y: 72 },
  { pos: "ZAG", x: 50, y: 75 },
  { pos: "ZAG", x: 75, y: 72 },
];

export const FORMACOES = [
  {
    id: "4-4-2",
    vagas: [GOL, ...LINHA_4,
      { pos: "ME", x: 14, y: 43 }, { pos: "MC", x: 38, y: 49 }, { pos: "MC", x: 62, y: 49 }, { pos: "MD", x: 86, y: 43 },
      { pos: "ATA", x: 37, y: 17 }, { pos: "ATA", x: 63, y: 17 }],
  },
  {
    id: "4-3-3",
    vagas: [GOL, ...LINHA_4,
      { pos: "MC", x: 28, y: 47 }, { pos: "VOL", x: 50, y: 54 }, { pos: "MC", x: 72, y: 47 },
      { pos: "PE", x: 16, y: 21 }, { pos: "ATA", x: 50, y: 14 }, { pos: "PD", x: 84, y: 21 }],
  },
  {
    id: "4-2-3-1",
    vagas: [GOL, ...LINHA_4,
      { pos: "VOL", x: 37, y: 54 }, { pos: "VOL", x: 63, y: 54 },
      { pos: "PE", x: 16, y: 32 }, { pos: "MEI", x: 50, y: 34 }, { pos: "PD", x: 84, y: 32 },
      { pos: "ATA", x: 50, y: 12 }],
  },
  {
    id: "4-3-1-2",
    vagas: [GOL, ...LINHA_4,
      { pos: "MC", x: 27, y: 51 }, { pos: "VOL", x: 50, y: 56 }, { pos: "MC", x: 73, y: 51 },
      { pos: "MEI", x: 50, y: 33 },
      { pos: "ATA", x: 36, y: 14 }, { pos: "ATA", x: 64, y: 14 }],
  },
  {
    id: "4-1-4-1",
    vagas: [GOL, ...LINHA_4,
      { pos: "VOL", x: 50, y: 56 },
      { pos: "ME", x: 14, y: 36 }, { pos: "MC", x: 37, y: 39 }, { pos: "MC", x: 63, y: 39 }, { pos: "MD", x: 86, y: 36 },
      { pos: "ATA", x: 50, y: 12 }],
  },
  {
    id: "3-5-2",
    vagas: [GOL, ...LINHA_3,
      { pos: "ALE", x: 11, y: 44 }, { pos: "MC", x: 32, y: 44 }, { pos: "VOL", x: 50, y: 54 }, { pos: "MC", x: 68, y: 44 }, { pos: "ALD", x: 89, y: 44 },
      { pos: "ATA", x: 37, y: 16 }, { pos: "ATA", x: 63, y: 16 }],
  },
  {
    id: "3-4-3",
    vagas: [GOL, ...LINHA_3,
      { pos: "ALE", x: 12, y: 46 }, { pos: "MC", x: 37, y: 49 }, { pos: "MC", x: 63, y: 49 }, { pos: "ALD", x: 88, y: 46 },
      { pos: "PE", x: 18, y: 19 }, { pos: "ATA", x: 50, y: 13 }, { pos: "PD", x: 82, y: 19 }],
  },
  {
    id: "5-3-2",
    vagas: [GOL,
      { pos: "ALE", x: 10, y: 60 }, { pos: "ZAG", x: 30, y: 72 }, { pos: "ZAG", x: 50, y: 75 }, { pos: "ZAG", x: 70, y: 72 }, { pos: "ALD", x: 90, y: 60 },
      { pos: "MC", x: 28, y: 44 }, { pos: "VOL", x: 50, y: 50 }, { pos: "MC", x: 72, y: 44 },
      { pos: "ATA", x: 37, y: 16 }, { pos: "ATA", x: 63, y: 16 }],
  },
];

export const FORMACAO_PADRAO = "4-3-3";

export const getFormacao = (id) => FORMACOES.find((f) => f.id === id) ?? FORMACOES[0];
