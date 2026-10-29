import { TypewriterEffect } from "@/components/ui/typewriter-effect";

const words = [
  { text: "Eu" },
  { text: "crio" },
  { text: "sites" },
  { text: "com" },
  { text: "React.", className: "text-puc-soft dark:text-puc-soft" },
];

export default function TypewriterDemo() {
  return (
    <section className="dark flex min-h-[20rem] flex-col items-center justify-center gap-6 rounded-2xl bg-puc-ink p-8">
      <p className="text-sm text-zinc-300 md:text-base">Seu próximo projeto começa aqui</p>
      <TypewriterEffect words={words} cursorClassName="bg-puc-soft" />
    </section>
  );
}
