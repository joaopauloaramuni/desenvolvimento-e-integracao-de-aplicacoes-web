/**
 * O mesmo coração desenhado em 12 técnicas de tatuagem (SVG puro, sem imagens).
 * É a miniatura de cada estilo no seletor: a pessoa compara a técnica, não o tema.
 */

const INK = "#1b1622";
const PAPER = "#ffffff";

/* =========================================================
   GEOMETRIA DO CORAÇÃO (curva paramétrica clássica)
   ========================================================= */

export function heartPoint(t, escala = 1, cx = 50, cy = 47) {
  const x = 16 * Math.sin(t) ** 3;
  const y = 13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t);
  return [cx + escala * 2.15 * x, cy - escala * 2.15 * y];
}

export function heartPath(escala = 1, cx = 50, cy = 47, passos = 90, jitter = null) {
  const pontos = [];
  for (let i = 0; i <= passos; i++) {
    const [x, y] = heartPoint((i / passos) * Math.PI * 2, escala, cx, cy);
    const [dx, dy] = jitter ? jitter() : [0, 0];
    pontos.push(`${(x + dx).toFixed(2)} ${(y + dy).toFixed(2)}`);
  }
  return `M${pontos.join(" L")}Z`;
}

// Gerador pseudoaleatório com semente: o desenho sai igual em toda renderização
function aleatorio(semente) {
  let a = semente;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const HEART = heartPath();

function sparkle(x, y, s) {
  return `M${x} ${y - s} Q${x} ${y} ${x + s} ${y} Q${x} ${y} ${x} ${y + s} Q${x} ${y} ${x - s} ${y} Q${x} ${y} ${x} ${y - s}Z`;
}

/* Pontos do dotwork: mais densos na parte de baixo (degradê) */
const DOTS = (() => {
  const rand = aleatorio(7);
  const pontos = [];
  while (pontos.length < 520) {
    const t = rand() * Math.PI * 2;
    const r = Math.sqrt(rand()) * 0.94;
    const [x, y] = heartPoint(t, r);
    if (rand() < 0.12 + 0.88 * ((y - 21) / 62) ** 1.6) pontos.push([x, y, 0.45 + rand() * 0.45]);
  }
  return pontos;
})();

/* Vértices do coração low-poly (geométrico) */
const POLY = [0, 0.45, 1.0, 1.6, 2.2, 2.75, Math.PI, 3.53, 4.08, 4.68, 5.28, 5.83].map((t) => heartPoint(t));

/* Três contornos tremidos do sketch */
const SKETCH = [11, 23, 37].map((semente) => {
  const rand = aleatorio(semente);
  return heartPath(1 + (rand() - 0.5) * 0.06, 50 + (rand() - 0.5) * 2, 47 + (rand() - 0.5) * 2, 28, () => [
    (rand() - 0.5) * 2.2,
    (rand() - 0.5) * 2.2,
  ]);
});

/* Minimalista: uma linha só, que entra pela ponta, contorna o coração e sai */
const MINIMAL = (() => {
  const pontos = [];
  for (let i = 0; i <= 80; i++) {
    const [x, y] = heartPoint(Math.PI + (i / 80) * Math.PI * 2, 0.62);
    pontos.push(`${x.toFixed(2)} ${y.toFixed(2)}`);
  }
  return `M12 80 C26 78 40 76 ${pontos.join(" L")} C60 76 74 78 88 80`;
})();

/* =========================================================
   UM DESENHO POR ESTILO
   ========================================================= */

const ARTS = {
  fineline: (
    <g fill="none" stroke={INK} strokeLinecap="round" strokeLinejoin="round">
      <path d={HEART} strokeWidth="1.1" />
      <path d={heartPath(0.8)} strokeWidth="0.7" strokeDasharray="0.1 3.2" />
      <path d="M34 66 Q46 52 62 44" strokeWidth="0.9" />
      {[0.25, 0.45, 0.65].map((t) => {
        const x = 34 + (62 - 34) * t;
        const y = 66 + (44 - 66) * t - 4 * Math.sin(Math.PI * t);
        return (
          <g key={t} strokeWidth="0.8">
            <path d={`M${x} ${y} q-1 -5 3 -7 q1 5 -3 7Z`} />
            <path d={`M${x} ${y} q5 1 7 -2 q-5 -2 -7 2Z`} />
          </g>
        );
      })}
      <path d={sparkle(82, 18, 5)} strokeWidth="0.9" />
      <path d={sparkle(16, 76, 3)} strokeWidth="0.8" />
    </g>
  ),

  oldschool: (
    <g strokeLinejoin="round" strokeLinecap="round">
      <defs>
        <clipPath id="sa-os">
          <path d={HEART} />
        </clipPath>
      </defs>
      <path d={HEART} fill="#c8322b" />
      <g clipPath="url(#sa-os)" stroke={INK} strokeWidth="1.6" opacity="0.55" fill="none">
        {[64, 68.5, 73, 77.5].map((y) => (
          <path key={y} d={`M20 ${y} Q50 ${y + 6} 80 ${y}`} />
        ))}
      </g>
      <path d={HEART} fill="none" stroke={INK} strokeWidth="5" />
      <path d="M27 33 Q33 25 42 28" fill="none" stroke={PAPER} strokeWidth="3.6" />
      <circle cx="26" cy="41" r="1.9" fill={PAPER} />
      <path d={sparkle(84, 16, 8)} fill="#e8b33a" stroke={INK} strokeWidth="2.2" />
    </g>
  ),

  neotrad: (
    <g strokeLinejoin="round">
      <defs>
        <radialGradient id="sa-nt" cx="38%" cy="35%" r="75%">
          <stop offset="0" stopColor="#e2649a" />
          <stop offset="0.55" stopColor="#9b2c63" />
          <stop offset="1" stopColor="#4a1236" />
        </radialGradient>
      </defs>
      <path d="M50 86 C38 92 28 92 20 88 C30 84 40 84 50 86Z" fill="#2c7a73" stroke={INK} strokeWidth="2" />
      <path d="M50 86 C62 92 72 92 80 88 C70 84 60 84 50 86Z" fill="#2c7a73" stroke={INK} strokeWidth="2" />
      <path d={HEART} fill="url(#sa-nt)" stroke={INK} strokeWidth="3.4" />
      <path d={heartPath(0.72, 50, 49)} fill="none" stroke="#f6c46a" strokeWidth="1.3" />
      <path d="M30 32 Q35 26 42 28 Q36 30 33 36Z" fill={PAPER} opacity="0.9" />
      {Array.from({ length: 22 }, (_, i) => {
        const [x, y] = heartPoint((i / 22) * Math.PI * 2, 1.2);
        return <circle key={i} cx={x} cy={y} r={i % 2 ? 1 : 1.7} fill="#d9a441" stroke={INK} strokeWidth="0.6" />;
      })}
    </g>
  ),

  blackwork: (
    <g>
      <path d={HEART} fill={INK} />
      <path d={heartPath(0.82)} fill="none" stroke={PAPER} strokeWidth="0.9" strokeDasharray="3 2.2" />
      <circle cx="50" cy="51" r="12" fill={PAPER} />
      <circle cx="55" cy="48" r="10.5" fill={INK} />
      {[-12, -6, 0, 6, 12].map((dx, i) => (
        <circle key={dx} cx={50 + dx} cy={i % 2 ? 72 : 70} r={i === 2 ? 1.8 : 1.2} fill={PAPER} />
      ))}
      <path d="M30 30 L38 38 M70 30 L62 38" stroke={PAPER} strokeWidth="1.2" strokeLinecap="round" />
    </g>
  ),

  dotwork: (
    <g>
      <path d={HEART} fill="none" stroke={INK} strokeWidth="1" />
      <g fill={INK}>
        {DOTS.map(([x, y, r], i) => (
          <circle key={i} cx={x.toFixed(2)} cy={y.toFixed(2)} r={r.toFixed(2)} />
        ))}
      </g>
    </g>
  ),

  geometrico: (
    <g fill="none" stroke={INK} strokeLinejoin="round" strokeLinecap="round">
      <circle cx="50" cy="52" r="40" strokeWidth="0.7" strokeDasharray="0.1 2.6" />
      <polygon points={POLY.map(([x, y]) => `${x.toFixed(1)},${y.toFixed(1)}`).join(" ")} strokeWidth="1.6" />
      {POLY.map(([x, y], i) => (
        <line key={i} x1="50" y1="52" x2={x.toFixed(1)} y2={y.toFixed(1)} strokeWidth="0.8" />
      ))}
      <polygon points="50,34 64,60 36,60" strokeWidth="1.2" />
      <circle cx="50" cy="52" r="2" fill={INK} />
    </g>
  ),

  aquarela: (
    <g>
      <defs>
        <filter id="sa-aq" x="-30%" y="-30%" width="160%" height="160%">
          <feTurbulence type="fractalNoise" baseFrequency="0.06" numOctaves="2" seed="3" />
          <feDisplacementMap in="SourceGraphic" scale="9" />
          <feGaussianBlur stdDeviation="2.6" />
        </filter>
      </defs>
      <g filter="url(#sa-aq)" opacity="0.85">
        <ellipse cx="40" cy="44" rx="20" ry="17" fill="#2bb3a3" opacity="0.7" />
        <ellipse cx="60" cy="40" rx="18" ry="15" fill="#7a5cd6" opacity="0.65" />
        <ellipse cx="52" cy="64" rx="17" ry="13" fill="#e2557e" opacity="0.6" />
      </g>
      <g fill="#7a5cd6" opacity="0.7">
        <circle cx="80" cy="70" r="1.6" />
        <circle cx="84" cy="64" r="0.9" />
        <circle cx="18" cy="26" r="1.2" />
        <circle cx="74" cy="84" r="1" fill="#2bb3a3" />
      </g>
      <path d={heartPath(1, 52, 45)} fill="none" stroke={INK} strokeWidth="1.2" strokeLinejoin="round" />
    </g>
  ),

  japones: (
    <g>
      <defs>
        <clipPath id="sa-jp">
          <path d={HEART} />
        </clipPath>
      </defs>
      <g clipPath="url(#sa-jp)">
        <rect width="100" height="100" fill="#f1e7d3" />
        {Array.from({ length: 9 }, (_, linha) =>
          Array.from({ length: 10 }, (_, col) => {
            const x = col * 11 + (linha % 2 ? 5.5 : 0);
            const y = 30 + linha * 6.5;
            return (
              <g key={`${linha}-${col}`}>
                <circle cx={x} cy={y} r="6" fill="#244a78" stroke={PAPER} strokeWidth="0.9" />
                <circle cx={x} cy={y} r="3.6" fill="none" stroke={PAPER} strokeWidth="0.8" />
                <circle cx={x} cy={y} r="1.4" fill="none" stroke={PAPER} strokeWidth="0.7" />
              </g>
            );
          })
        )}
        <circle cx="34" cy="31" r="7" fill="#c8322b" />
      </g>
      <path d={HEART} fill="none" stroke={INK} strokeWidth="3.6" strokeLinejoin="round" />
    </g>
  ),

  realismo: (
    <g>
      <defs>
        <radialGradient id="sa-re" cx="38%" cy="34%" r="72%">
          <stop offset="0" stopColor="#c9c9cc" />
          <stop offset="0.35" stopColor="#7b7a80" />
          <stop offset="0.8" stopColor="#2c2a31" />
          <stop offset="1" stopColor="#151318" />
        </radialGradient>
        <filter id="sa-re-blur">
          <feGaussianBlur stdDeviation="2" />
        </filter>
      </defs>
      <path d={HEART} fill="url(#sa-re)" />
      <ellipse cx="34" cy="34" rx="7" ry="4" fill={PAPER} opacity="0.75" filter="url(#sa-re-blur)" transform="rotate(-30 34 34)" />
      <ellipse cx="62" cy="70" rx="12" ry="4" fill="#000" opacity="0.35" filter="url(#sa-re-blur)" transform="rotate(-35 62 70)" />
    </g>
  ),

  minimalista: (
    <path
      d={MINIMAL}
      fill="none"
      stroke={INK}
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  ),

  sketch: (
    <g fill="none" stroke={INK} strokeLinecap="round" strokeLinejoin="round">
      <defs>
        <clipPath id="sa-sk">
          <path d={HEART} />
        </clipPath>
      </defs>
      {SKETCH.map((d, i) => (
        <path key={i} d={d} strokeWidth={i === 0 ? 1.1 : 0.7} opacity={i === 0 ? 0.95 : 0.6} />
      ))}
      <g clipPath="url(#sa-sk)" strokeWidth="0.6" opacity="0.7">
        {Array.from({ length: 12 }, (_, i) => (
          <line key={i} x1={44 + i * 4} y1="90" x2={78 + i * 4} y2="44" />
        ))}
      </g>
      <path d="M14 22 L24 20 M16 26 L22 25" strokeWidth="0.6" opacity="0.6" />
    </g>
  ),

  ornamental: (
    <g stroke={INK} fill="none" strokeLinecap="round">
      {Array.from({ length: 34 }, (_, i) => {
        const [x, y] = heartPoint((i / 34) * Math.PI * 2, 1.12);
        return <circle key={i} cx={x} cy={y} r="2.3" strokeWidth="0.8" fill={PAPER} />;
      })}
      <path d={HEART} strokeWidth="1.6" fill={PAPER} />
      <path d={heartPath(0.62, 50, 48)} strokeWidth="1.1" />
      {Array.from({ length: 18 }, (_, i) => {
        const [x, y] = heartPoint((i / 18) * Math.PI * 2, 0.82);
        return <circle key={i} cx={x} cy={y} r="0.9" fill={INK} stroke="none" />;
      })}
      <path d="M50 40 L55 48 L50 56 L45 48Z" strokeWidth="1.1" fill={INK} />
      <path d="M40 48 C36 44 36 40 40 39 M60 48 C64 44 64 40 60 39" strokeWidth="0.9" />
      <path d="M50 58 L50 64" strokeWidth="0.9" />
    </g>
  ),
};

/** <StyleArt id="dotwork" /> */
function StyleArt({ id, className = "" }) {
  return (
    <svg viewBox="0 0 100 100" className={className} aria-hidden="true" focusable="false">
      {ARTS[id] ?? null}
    </svg>
  );
}

export default StyleArt;
