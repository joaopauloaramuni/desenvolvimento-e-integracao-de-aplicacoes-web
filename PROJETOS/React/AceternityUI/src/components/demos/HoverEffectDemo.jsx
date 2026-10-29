import { HoverEffect } from "@/components/ui/card-hover-effect";
import { projects } from "@/data/portfolio";

export default function HoverEffectDemo() {
  return (
    <section className="dark rounded-2xl bg-puc-ink px-2 md:px-4">
      <HoverEffect items={projects} className="py-6" />
    </section>
  );
}
