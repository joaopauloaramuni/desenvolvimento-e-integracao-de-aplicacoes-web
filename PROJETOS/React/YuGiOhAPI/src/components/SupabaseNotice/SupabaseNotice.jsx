import { Trans, useTranslation } from "react-i18next";
import { useFavoritos } from "../../hooks/useFavoritos";
import Icon from "../Icon/Icon";
import "./SupabaseNotice.css";

/**
 * Aviso exibido quando os favoritos não estão disponíveis:
 *  - "desativado": .env.local ausente ou com os valores de exemplo
 *  - "erro":       a conexão com o Supabase falhou (rede, projeto pausado, SQL não executado...)
 * Nos dois casos, as estrelas ficam desabilitadas e o resto do site funciona.
 */
const SupabaseNotice = () => {
  const { t } = useTranslation();
  const { status, erro, recarregar } = useFavoritos();

  if (status === "desativado") {
    return (
      <div className="notice notice--off" role="status">
        <Icon name="database" />
        <div>
          <strong>{t("notice.offTitle")}</strong>
          <p>
            <Trans i18nKey="notice.offText" components={{ code: <code /> }} />
          </p>
        </div>
      </div>
    );
  }

  if (status === "erro") {
    return (
      <div className="notice notice--error" role="alert">
        <Icon name="alert" />
        <div>
          <strong>{t("notice.errorTitle")}</strong>
          <p>
            <Trans i18nKey="notice.errorText" components={{ code: <code /> }} />
          </p>
          {erro && <p className="notice__detail">{t("notice.detail", { message: erro })}</p>}
        </div>
        <button type="button" className="button button--ghost" onClick={recarregar}>
          <Icon name="refresh" size={18} /> {t("common.retry")}
        </button>
      </div>
    );
  }

  return null;
};

export default SupabaseNotice;
