import { Spotlight } from "@/components/ui/spotlight";

export default function SpotlightDemo() {
  return (
    <section className="dark relative flex h-[26rem] w-full overflow-hidden rounded-2xl bg-puc-ink antialiased md:items-center md:justify-center">
      {/* Grade quadriculada no fundo */}
      <div className="pointer-events-none absolute inset-0 [background-image:linear-gradient(to_right,rgba(255,255,255,0.06)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.06)_1px,transparent_1px)] [background-size:40px_40px]" />

      <Spotlight className="-top-40 left-0 md:-top-20 md:left-60" fill="white" />

      <div className="relative z-10 mx-auto w-full max-w-3xl p-6 pt-20 md:pt-0">
        <h1 className="bg-gradient-to-b from-white to-puc-soft bg-clip-text text-center text-4xl font-bold text-transparent md:text-5xl">
          Ana Souza
          <br />
          Desenvolvedora front-end
        </h1>
        <p className="mx-auto mt-5 max-w-lg text-center text-base text-zinc-300">
          Estudante de Engenharia de Software na PUC Minas. Crio interfaces em React com
          foco em acessibilidade e animação.
        </p>
      </div>
    </section>
  );
}
