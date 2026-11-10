import { Trans, useTranslation } from "react-i18next";
import { FRISO } from "../../config/appConfig";
import "./Footer.css";

const link = (href) => <a href={href} target="_blank" rel="noreferrer" />;

const Footer = () => {
  const { t } = useTranslation();
  return (
    <footer className="footer">
      <div className="frieze footer__frieze" aria-hidden="true">
        {FRISO}
      </div>
      <p>
        <Trans
          i18nKey="footer.credits"
          components={{
            api: link("https://ygoprodeck.com/api-guide/"),
            supabase: link("https://supabase.com/"),
            bits: link("https://reactbits.dev/animations/splash-cursor"),
          }}
        />
      </p>
      <p className="footer__legal">{t("footer.legal")}</p>
    </footer>
  );
};

export default Footer;
