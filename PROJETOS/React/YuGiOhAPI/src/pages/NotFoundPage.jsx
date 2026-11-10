import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import EmptyState from "../components/EmptyState/EmptyState";

const NotFoundPage = () => {
  const { t } = useTranslation();
  return (
    <div className="page">
      <EmptyState
        title={t("notFound.title")}
        action={
          <Link to="/" className="button button--primary">
            {t("notFound.back")}
          </Link>
        }
      >
        {t("notFound.text")}
      </EmptyState>
    </div>
  );
};

export default NotFoundPage;
