import { useEffect, useState } from "react";

// Navegação simples pelo hash da URL, sem biblioteca de rotas:
//   #tutoriais            -> página de tutoriais
//   #tutoriais-dominios   -> página de tutoriais, já no tutorial de domínios
//   qualquer outro hash   -> vitrine de portfólios
// Funciona na Vercel sem nenhuma configuração extra (o hash nunca vai ao servidor).

const lerRota = () => (window.location.hash.startsWith("#tutoriais") ? "tutoriais" : "vitrine");

export default function useRota() {
  const [rota, setRota] = useState(lerRota);

  useEffect(() => {
    const aoMudar = () => {
      setRota(lerRota());
      const alvo = document.getElementById(window.location.hash.slice(1));
      if (alvo) alvo.scrollIntoView();
      else window.scrollTo(0, 0);
    };
    window.addEventListener("hashchange", aoMudar);
    return () => window.removeEventListener("hashchange", aoMudar);
  }, []);

  // Ao abrir a página direto num tutorial (link compartilhado), rola até ele
  useEffect(() => {
    const alvo = document.getElementById(window.location.hash.slice(1));
    if (alvo) alvo.scrollIntoView();
  }, [rota]);

  return rota;
}
