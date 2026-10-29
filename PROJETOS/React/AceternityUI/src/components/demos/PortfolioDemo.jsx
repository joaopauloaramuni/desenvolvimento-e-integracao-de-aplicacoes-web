import { TbDownload } from "react-icons/tb";
import { Spotlight } from "@/components/ui/spotlight";
import { TypewriterEffect } from "@/components/ui/typewriter-effect";
import { TextGenerateEffect } from "@/components/ui/text-generate-effect";
import { Button as MovingBorderButton } from "@/components/ui/moving-border";
import { HoverEffect } from "@/components/ui/card-hover-effect";
import { InfiniteMovingCards } from "@/components/ui/infinite-moving-cards";
import { FloatingDock } from "@/components/ui/floating-dock";
import { projects, socialLinks, testimonials } from "@/data/portfolio";

const name = [
  { text: "Ana" },
  { text: "Souza", className: "text-puc-soft dark:text-puc-soft" },
];

const bio =
  "Desenvolvedora front-end em formação na PUC Minas. Gosto de React, de acessibilidade e de animação com propósito.";

export default function PortfolioDemo() {
  return (
    <div className="dark overflow-hidden rounded-2xl bg-puc-ink text-white">
      {/* 1. Apresentação: Spotlight + Typewriter + Text Generate + Moving Border */}
      <section className="relative flex min-h-[30rem] flex-col items-center justify-center overflow-hidden px-6 py-16">
        <div className="pointer-events-none absolute inset-0 [background-image:linear-gradient(to_right,rgba(255,255,255,0.06)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.06)_1px,transparent_1px)] [background-size:40px_40px]" />
        <Spotlight className="-top-40 left-0 md:-top-20 md:left-40" fill="white" />

        <p className="relative z-10 text-sm text-zinc-300">Olá, eu sou a</p>
        <TypewriterEffect words={name} className="relative z-10 mt-2" cursorClassName="bg-puc-soft" />
        <TextGenerateEffect
          words={bio}
          className="relative z-10 mx-auto max-w-xl text-center font-normal"
        />
        <MovingBorderButton
          borderRadius="1.75rem"
          containerClassName="relative z-10 mt-10 h-14 w-52"
          borderClassName="bg-[radial-gradient(#4fa8d8_40%,transparent_60%)]"
          className="gap-2 border-puc-mid/40 bg-puc-deep/80 font-semibold"
        >
          <TbDownload aria-hidden="true" />
          Baixar currículo
        </MovingBorderButton>
      </section>

      {/* 2. Projetos: Card Hover Effect */}
      <section className="px-2 py-10 md:px-6">
        <h2 className="px-4 text-2xl font-bold">Projetos</h2>
        <HoverEffect items={projects.slice(0, 3)} className="py-4" />
      </section>

      {/* 3. Depoimentos: Infinite Moving Cards */}
      <section className="py-10">
        <h2 className="px-6 text-2xl font-bold md:px-10">O que dizem sobre mim</h2>
        <InfiniteMovingCards items={testimonials} speed="slow" className="mt-4" />
      </section>

      {/* 4. Contato: Floating Dock */}
      <footer className="flex flex-col items-center gap-5 border-t border-white/10 py-10">
        <p className="text-sm text-zinc-300">Vamos conversar?</p>
        <FloatingDock items={socialLinks} desktopClassName="dark:bg-puc-deep" />
      </footer>
    </div>
  );
}
