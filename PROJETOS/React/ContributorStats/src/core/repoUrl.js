// Interpretação de URLs / identificadores de repositórios do GitHub.
import { InvalidRepoURLError } from "./exceptions";

// Nomes válidos de usuário/organização e de repositório no GitHub
const NAME_RE = /^[A-Za-z0-9_.-]+$/;

/**
 * Extrai { owner, repo } de diversos formatos aceitos:
 *
 * - https://github.com/owner/repo
 * - https://github.com/owner/repo.git ou .../tree/main/pasta
 * - github.com/owner/repo
 * - git@github.com:owner/repo.git
 * - owner/repo
 *
 * Lança InvalidRepoURLError se não for possível interpretar.
 */
export function parseRepoUrl(repoUrl) {
  let text = String(repoUrl ?? "").trim();
  if (!text) throw new InvalidRepoURLError("Informe a URL do repositório.");

  let path;
  if (text.startsWith("git@")) {
    // Formato SSH: git@github.com:owner/repo.git
    const index = text.indexOf(":");
    path = index >= 0 ? text.slice(index + 1) : "";
  } else {
    if (!text.includes("://") && text.toLowerCase().startsWith("github.com")) {
      text = `https://${text}`;
    }
    const match = text.match(/^([a-z][a-z0-9+.-]*):\/\/([^/?#]*)([^?#]*)/i);
    if (match && match[2]) {
      const host = match[2].toLowerCase();
      if (host !== "github.com" && host !== "www.github.com") {
        throw new InvalidRepoURLError(`O host '${match[2]}' não é github.com.`);
      }
      path = match[3];
    } else {
      path = text; // formato curto owner/repo
    }
  }

  const parts = path.split("/").filter(Boolean);
  if (parts.length < 2) {
    throw new InvalidRepoURLError(
      "URL inválida. Use o formato https://github.com/<dono>/<repositório>."
    );
  }

  const owner = parts[0];
  let repo = parts[1];
  if (repo.endsWith(".git")) repo = repo.slice(0, -4);

  if (!(NAME_RE.test(owner) && NAME_RE.test(repo))) {
    throw new InvalidRepoURLError(`Nome de repositório inválido: ${owner}/${repo}`);
  }

  return { owner, repo };
}
