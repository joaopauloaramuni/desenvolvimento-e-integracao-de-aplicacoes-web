import { LuCircleCheck, LuCircleAlert, LuTriangleAlert } from "react-icons/lu";
import { supabaseConfigurado } from "../../config/supabaseClient";
import "./Aviso.css";

const ICONES = { erro: LuCircleAlert, aviso: LuTriangleAlert, sucesso: LuCircleCheck };

/** Mensagem de erro, aviso ou sucesso. */
function Aviso({ tipo = "erro", children, acao = null }) {
  const Icone = ICONES[tipo];
  return (
    <div className={`aviso aviso--${tipo}`} role={tipo === "erro" ? "alert" : "status"}>
      <Icone aria-hidden="true" />
      <div className="aviso__texto">{children}</div>
      {acao}
    </div>
  );
}

/** O aviso de "Supabase não configurado", que aparece em todas as páginas. */
export function AvisoSupabase() {
  if (supabaseConfigurado) return null;
  return (
    <Aviso tipo="aviso">
      Supabase não configurado: preencha <code>VITE_SUPABASE_URL</code> e{" "}
      <code>VITE_SUPABASE_PUBLISHABLE_KEY</code> no <code>.env.local</code>, rode o{" "}
      <code>supabase_buraco.sql</code> no SQL Editor e reinicie o <code>npm run dev</code> (veja o README).
    </Aviso>
  );
}

export default Aviso;
