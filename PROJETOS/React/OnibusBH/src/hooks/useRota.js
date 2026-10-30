import { useEffect, useState } from "react";

// Rotas da página (no "#" da URL, para funcionar em qualquer hospedagem estática):
//   #/                                   → início
//   #/linha/<arquivo>                    → uma linha
//   #/linha/<arquivo>/<sentido>/<ponto>  → uma linha, já com sentido e ponto escolhidos

function ler() {
  const partes = window.location.hash.replace(/^#\/?/, "").split("/").map(decodeURIComponent);
  if (partes[0] === "linha" && partes[1]) {
    return { pagina: "linha", arquivo: partes[1], sentido: partes[2] || null, ponto: partes[3] || null };
  }
  return { pagina: "inicio" };
}

export function irPara(...partes) {
  window.location.hash = partes.length ? `/${partes.filter(Boolean).map(encodeURIComponent).join("/")}` : "/";
}

export default function useRota() {
  const [rota, setRota] = useState(ler);
  useEffect(() => {
    const aoMudar = () => {
      setRota(ler());
      window.scrollTo({ top: 0, behavior: "instant" });
    };
    window.addEventListener("hashchange", aoMudar);
    return () => window.removeEventListener("hashchange", aoMudar);
  }, []);
  return rota;
}
