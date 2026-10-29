import { TbDownload, TbMessage } from "react-icons/tb";
import { Button as MovingBorderButton } from "@/components/ui/moving-border";

export default function MovingBorderDemo() {
  return (
    <section className="dark flex min-h-[18rem] flex-wrap items-center justify-center gap-8 rounded-2xl bg-puc-ink p-8">
      <MovingBorderButton
        borderRadius="1.75rem"
        borderClassName="bg-[radial-gradient(#4fa8d8_40%,transparent_60%)]"
        className="gap-2 border-puc-mid/40 bg-puc-deep/80 font-semibold"
      >
        <TbDownload aria-hidden="true" />
        Baixar currículo
      </MovingBorderButton>

      <MovingBorderButton
        borderRadius="0.75rem"
        duration={6000}
        containerClassName="h-14 w-48"
        borderClassName="bg-[radial-gradient(#4fa8d8_40%,transparent_60%)]"
        className="gap-2 border-puc-mid/40 bg-puc-deep/80 font-semibold"
      >
        <TbMessage aria-hidden="true" />
        Fale comigo
      </MovingBorderButton>
    </section>
  );
}
