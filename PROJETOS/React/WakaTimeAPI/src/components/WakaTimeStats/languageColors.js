// Cor de cada linguagem, pelo nome que o WakaTime devolve.
// As cores seguem as do GitHub Linguist (as mesmas da barra de linguagens dos repositórios).
// Linguagem que não estiver aqui ganha uma cor gerada a partir do nome.

const LANGUAGE_COLORS = {
  Python: "#3572A5",
  JavaScript: "#f1e05a",
  TypeScript: "#3178c6",
  Java: "#b07219",
  Kotlin: "#A97BFF",
  C: "#555555",
  "C++": "#f34b7d",
  "C#": "#178600",
  Go: "#00ADD8",
  Rust: "#dea584",
  PHP: "#4F5D95",
  Ruby: "#701516",
  Swift: "#F05138",
  Dart: "#00B4AB",
  HTML: "#e34c26",
  CSS: "#663399",
  SCSS: "#c6538c",
  Sass: "#a53b70",
  Vue: "#41b883",
  "Vue.js": "#41b883",
  JSX: "#61dafb",
  TSX: "#3178c6",
  Markdown: "#083fa1",
  JSON: "#cbcb41",
  YAML: "#cb171e",
  XML: "#0060ac",
  SQL: "#e38c00",
  Bash: "#89e051",
  Shell: "#89e051",
  PowerShell: "#012456",
  Docker: "#384d54",
  Dockerfile: "#384d54",
  PlantUML: "#fbbd16",
  TeX: "#3D6117",
  LaTeX: "#3D6117",
  "Java Properties": "#2A6277",
  Properties: "#2A6277",
  Groovy: "#4298b8",
  Gradle: "#02303a",
  Text: "#94a3b8",
  Other: "#cbd5e1",
};

// Cor estável a partir do nome (a mesma linguagem sempre recebe a mesma cor)
function colorFromName(name) {
  let hash = 0;
  for (const char of name) hash = (hash * 31 + char.charCodeAt(0)) | 0;
  return `hsl(${Math.abs(hash) % 360}, 55%, 50%)`;
}

export const languageColor = (name) => LANGUAGE_COLORS[name] ?? colorFromName(name);
