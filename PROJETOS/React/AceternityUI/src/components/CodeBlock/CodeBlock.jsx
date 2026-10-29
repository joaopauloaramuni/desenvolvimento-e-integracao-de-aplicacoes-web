import { useEffect, useState } from "react";
import { TbCheck, TbCopy } from "react-icons/tb";
import "./CodeBlock.css";

/**
 * Bloco de código com botão "Copiar".
 */
const CodeBlock = ({ code, title }) => {
  const [copied, setCopied] = useState(false);

  // Volta o botão para "Copiar" depois de 2 segundos
  useEffect(() => {
    if (!copied) return undefined;
    const timer = setTimeout(() => setCopied(false), 2000);
    return () => clearTimeout(timer);
  }, [copied]);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
    } catch {
      setCopied(false);
    }
  };

  return (
    <div className="code-block">
      <div className="code-block-bar">
        <span>{title}</span>
        <button type="button" className="code-block-copy" onClick={copy}>
          {copied ? <TbCheck aria-hidden="true" /> : <TbCopy aria-hidden="true" />}
          {copied ? "Copiado" : "Copiar"}
        </button>
      </div>
      <pre>
        <code>{code}</code>
      </pre>
    </div>
  );
};

export default CodeBlock;
