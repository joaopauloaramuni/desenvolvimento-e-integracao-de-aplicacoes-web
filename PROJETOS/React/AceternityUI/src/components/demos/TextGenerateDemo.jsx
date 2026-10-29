import { TextGenerateEffect } from "@/components/ui/text-generate-effect";

const words =
  "Sou estudante de Engenharia de Software na PUC Minas e gosto de transformar ideias em interfaces que as pessoas têm vontade de usar.";

export default function TextGenerateDemo() {
  return (
    <section className="dark flex min-h-[20rem] items-center rounded-2xl bg-puc-ink p-8 md:p-12">
      <TextGenerateEffect words={words} />
    </section>
  );
}
