import "./ComponentPicker.css";

/**
 * Botões para escolher o componente (mesmo visual do EffectPicker do ReactBits).
 */
const ComponentPicker = ({ items, value, onChange }) => (
  <div className="component-picker" role="radiogroup" aria-label="Escolha o componente">
    {items.map(({ id, label, icon: Icon }) => {
      const active = id === value;

      return (
        <button
          key={id}
          type="button"
          role="radio"
          aria-checked={active}
          className={`component-pill${active ? " is-active" : ""}`}
          onClick={() => onChange(id)}
        >
          <Icon aria-hidden="true" />
          {label}
        </button>
      );
    })}
  </div>
);

export default ComponentPicker;
