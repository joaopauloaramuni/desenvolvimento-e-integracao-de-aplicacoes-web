import { useCallback, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { periodoDaUrl, periodoParaUrl } from "../utils/periodo";

/** O período do filtro, guardado na URL (?periodo=mes&mes=2026-11). */
export default function usePeriodo() {
  const [params, setParams] = useSearchParams();
  const periodo = useMemo(() => periodoDaUrl(params), [params]);

  const setPeriodo = useCallback(
    (novo) => setParams(periodoParaUrl({ ...periodo, ...novo }), { replace: true }),
    [periodo, setParams]
  );

  return [periodo, setPeriodo];
}
