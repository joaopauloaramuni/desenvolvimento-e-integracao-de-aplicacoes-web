import "./EmptyState.css";

/** Tela vazia com o próximo passo (um link ou botão em "action"). */
const EmptyState = ({ title, children, action }) => (
  <div className="empty">
    <h2>{title}</h2>
    {children && <p>{children}</p>}
    {action}
  </div>
);

export default EmptyState;
