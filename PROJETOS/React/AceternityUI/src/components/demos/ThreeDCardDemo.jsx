import { TbBrandGithub, TbPokeball } from "react-icons/tb";
import { CardBody, CardContainer, CardItem } from "@/components/ui/3d-card";

export default function ThreeDCardDemo() {
  return (
    <section className="dark rounded-2xl bg-puc-ink">
      <CardContainer containerClassName="py-14">
        <CardBody className="group/card relative h-auto w-[18rem] rounded-xl border border-white/15 bg-puc-deep p-6 sm:w-[26rem]">
          <CardItem translateZ={50} className="text-xl font-bold text-white">
            Pokédex em React
          </CardItem>

          <CardItem as="p" translateZ={60} className="mt-2 max-w-sm text-sm text-zinc-300">
            Os 151 Pokémon da primeira geração, com busca, filtros e favoritos salvos no
            Supabase.
          </CardItem>

          <CardItem translateZ={100} className="mt-4 w-full">
            <div className="flex h-56 w-full items-center justify-center rounded-xl bg-[radial-gradient(circle_at_30%_20%,#4fa8d8,#005380_55%,#001f30)] group-hover/card:shadow-xl group-hover/card:shadow-puc-soft/20">
              <TbPokeball className="h-24 w-24 text-white/90" aria-hidden="true" />
            </div>
          </CardItem>

          <div className="mt-8 flex items-center justify-between">
            <CardItem translateZ={20} className="text-xs text-puc-soft">
              React + Vite + Supabase
            </CardItem>
            <CardItem
              translateZ={20}
              as="a"
              href="https://github.com/joaopauloaramuni/desenvolvimento-e-integracao-de-aplicacoes-web/tree/main/PROJETOS/React/Pokedex"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 rounded-xl bg-white px-4 py-2 text-xs font-bold text-puc-deep"
            >
              <TbBrandGithub aria-hidden="true" />
              Ver código
            </CardItem>
          </div>
        </CardBody>
      </CardContainer>
    </section>
  );
}
